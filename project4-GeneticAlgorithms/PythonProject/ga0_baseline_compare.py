import numpy as np
import time
from comm_p1_heuristic import make_random_system, find_maxmin_sinr

# =====================================================
# FIXED SYSTEM (COMMON FOR ALL GA VARIANTS)
# =====================================================
np.random.seed(1)

M = 3          # APs
U = 2          # users
Q = 1          # sensing streams
S = U + Q

P_AP = 1.0
noise_u = 0.1

# GA parameters (KEEP FIXED FOR COMPARISON)
POP_SIZE = 40
N_GEN = 120
PC = 0.9
PM = 0.12
ELITE = 2

# Fixed penalties (GA0 baseline)
LAMBDA_SINR = 80.0
LAMBDA_PWR = 50.0

# Monte Carlo runs
N_RUNS = 10

# =====================================================
# CHANNELS & FIXED BEAMS
# =====================================================
h, fbar_comm = make_random_system(M=M, U=U, seed=1)

rng = np.random.default_rng(2)
fbar_sens = rng.standard_normal((M, Q)) + 1j * rng.standard_normal((M, Q))
fbar_sens /= np.linalg.norm(fbar_sens, axis=1, keepdims=True)

f_bar = np.concatenate([fbar_comm, fbar_sens], axis=1)

# =====================================================
# COMMUNICATION BASELINE (P1)
# =====================================================
gamma_star, _, _ = find_maxmin_sinr(h, fbar_comm, P_AP, noise_u)
gamma = float(gamma_star)

print("Gamma (from P1) =", gamma)

# =====================================================
# METRIC FUNCTIONS
# =====================================================
def compute_sinr(p):
    sinr = np.zeros(U)
    for u in range(U):
        sig = 0.0
        interf = 0.0
        for m in range(M):
            sig += p[m, u] * abs(np.conj(h[u, m]) * f_bar[m, u])**2
            for s in range(S):
                if s != u:
                    interf += p[m, s] * abs(np.conj(h[u, m]) * f_bar[m, s])**2
        sinr[u] = sig / (interf + noise_u)
    return sinr

def sensing_snr(p):
    return float(np.sum(p[:, U:]))

def repair(p):
    p = np.maximum(p, 0.0)
    for m in range(M):
        s = np.sum(p[m])
        if s > P_AP:
            p[m] *= P_AP / s
    return p

# =====================================================
# FITNESS FUNCTION (GA0)
# =====================================================
def fitness_ga0(p):
    sinr = compute_sinr(p)
    penalty_sinr = np.sum(np.maximum(0.0, gamma - sinr)**2)
    penalty_pwr = np.sum(np.maximum(0.0, np.sum(p, axis=1) - P_AP)**2)
    return sensing_snr(p) - LAMBDA_SINR * penalty_sinr - LAMBDA_PWR * penalty_pwr

# =====================================================
# GA OPERATORS (BASELINE)
# =====================================================
def init_population():
    pop = []
    for _ in range(POP_SIZE):
        p = np.random.rand(M, S)
        for m in range(M):
            p[m] = p[m] / np.sum(p[m]) * P_AP
        pop.append(p)
    return pop

def tournament_selection(pop, fits, k=3):
    idx = np.random.choice(len(pop), k, replace=False)
    return pop[idx[np.argmax([fits[i] for i in idx])]]

def crossover(p1, p2):
    if np.random.rand() < PC:
        alpha = np.random.rand()
        return alpha * p1 + (1 - alpha) * p2
    return p1.copy()

def mutation(p):
    if np.random.rand() < PM:
        m = np.random.randint(M)
        s = np.random.randint(S)
        p[m, s] += 0.08 * np.random.randn()
    return p

# =====================================================
# RUN ONE GA0
# =====================================================
def run_ga0():
    pop = init_population()
    fits = [fitness_ga0(ind) for ind in pop]
    trace = []

    t0 = time.time()

    for _ in range(N_GEN):
        elite_idx = np.argsort(fits)[-ELITE:]
        new_pop = [pop[i].copy() for i in elite_idx]

        while len(new_pop) < POP_SIZE:
            p1 = tournament_selection(pop, fits)
            p2 = tournament_selection(pop, fits)
            child = crossover(p1, p2)
            child = mutation(child)
            child = repair(child)
            new_pop.append(child)

        pop = new_pop
        fits = [fitness_ga0(ind) for ind in pop]
        trace.append(np.max(fits))

    runtime = time.time() - t0
    best = pop[int(np.argmax(fits))]
    sinr = compute_sinr(best)

    return {
        "best_snr": sensing_snr(best),
        "min_sinr": np.min(sinr),
        "violation": np.any(sinr < gamma),
        "best_fitness": np.max(fits),
        "runtime": runtime,
        "trace": trace
    }

# =====================================================
# MONTE CARLO EVALUATION (GA0)
# =====================================================
if __name__ == "__main__":
    results = []

    for run in range(N_RUNS):
        print(f"GA0 run {run+1}/{N_RUNS}")
        results.append(run_ga0())

    snr_vals = [r["best_snr"] for r in results]
    min_sinr_vals = [r["min_sinr"] for r in results]
    violation_rate = np.mean([r["violation"] for r in results])
    runtimes = [r["runtime"] for r in results]

    print("\n===== GA0 SUMMARY (Baseline for Comparison) =====")
    print(f"Sensing SNR: mean = {np.mean(snr_vals):.4f}, std = {np.std(snr_vals):.4f}")
    print(f"Min SINR:    mean = {np.mean(min_sinr_vals):.4f}")
    print(f"SINR violation rate = {violation_rate*100:.1f}%")
    print(f"Runtime: mean = {np.mean(runtimes):.3f} s")
