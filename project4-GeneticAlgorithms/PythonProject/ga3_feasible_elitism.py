import numpy as np
import time

# =====================================================
# SYSTEM SETUP
# =====================================================
np.random.seed(1)

M = 3          # APs
U = 2          # Users
Q = 1          # Sensing streams
S = U + Q

P_AP = 1.0
noise_u = 0.1

POP_SIZE = 40
N_GEN = 120
PC = 0.9
PM = 0.12
ELITE = 2

LAMBDA_PWR = 50.0
N_RUNS = 10

# =====================================================
# COMMUNICATION BASELINE (P1 – heuristic)
# =====================================================
def make_random_system(seed=1):
    rng = np.random.default_rng(seed)
    h = rng.standard_normal((U, M)) + 1j * rng.standard_normal((U, M))
    fbar = rng.standard_normal((M, U)) + 1j * rng.standard_normal((M, U))
    fbar /= np.linalg.norm(fbar, axis=1, keepdims=True)
    return h, fbar

def compute_sinr_comm(h, fbar, p):
    sinr = np.zeros(U)
    for u in range(U):
        sig, interf = 0.0, 0.0
        for m in range(M):
            sig += p[m, u] * abs(np.conj(h[u, m]) * fbar[m, u])**2
            for k in range(U):
                if k != u:
                    interf += p[m, k] * abs(np.conj(h[u, m]) * fbar[m, k])**2
        sinr[u] = sig / (interf + noise_u)
    return sinr

def find_gamma_star(h, fbar):
    p = np.full((M, U), P_AP / U)
    sinr = compute_sinr_comm(h, fbar, p)
    return float(np.min(sinr))

# =====================================================
# CHANNELS & FIXED BEAMS
# =====================================================
h, fbar_comm = make_random_system(seed=1)

rng = np.random.default_rng(2)
fbar_sens = rng.standard_normal((M, Q)) + 1j * rng.standard_normal((M, Q))
fbar_sens /= np.linalg.norm(fbar_sens, axis=1, keepdims=True)

# stack beams: [comm | sensing]
f_bar = np.concatenate([fbar_comm, fbar_sens], axis=1)

gamma = find_gamma_star(h, fbar_comm)
print("Gamma (from P1) =", gamma)

# =====================================================
# METRICS
# =====================================================
def compute_sinr(p):
    sinr = np.zeros(U)
    for u in range(U):
        sig, interf = 0.0, 0.0
        for m in range(M):
            sig += p[m, u] * abs(np.conj(h[u, m]) * f_bar[m, u])**2
            for s in range(S):
                if s != u:
                    interf += p[m, s] * abs(np.conj(h[u, m]) * f_bar[m, s])**2
        sinr[u] = sig / (interf + noise_u)
    return sinr

def sensing_snr(p):
    return float(np.sum(p[:, U:]))

def repair_power(p):
    p = np.maximum(p, 0.0)
    for m in range(M):
        s = np.sum(p[m])
        if s > P_AP:
            p[m] *= P_AP / s
    return p

def repair_feasible(p):
    # reduce sensing first, keep comm
    p = repair_power(p)
    sinr = compute_sinr(p)
    if np.all(sinr >= gamma):
        return p

    # aggressively cut sensing
    p[:, U:] *= 0.5
    return repair_power(p)

# =====================================================
# FITNESS — GA3 (LEXICOGRAPHIC, FEASIBLE-ELITISM)
# =====================================================
def fitness_ga3(p):
    sinr = compute_sinr(p)

    # infeasible solutions are strictly dominated
    if np.any(sinr < gamma):
        return -1e6 - np.sum(np.maximum(0.0, gamma - sinr)) * 1e3

    # feasible region: maximize sensing
    power_penalty = np.sum(np.maximum(0.0, np.sum(p, axis=1) - P_AP)**2)
    return sensing_snr(p) - LAMBDA_PWR * power_penalty

# =====================================================
# GA OPERATORS
# =====================================================
def init_population():
    pop = []
    for _ in range(POP_SIZE):
        p = np.random.rand(M, S)
        for m in range(M):
            p[m] = p[m] / np.sum(p[m]) * P_AP
        pop.append(p)
    return pop

def tournament(pop, fits, k=3):
    idx = np.random.choice(len(pop), k, replace=False)
    return pop[idx[np.argmax([fits[i] for i in idx])]]

def crossover(a, b):
    if np.random.rand() < PC:
        alpha = np.random.rand()
        return alpha * a + (1 - alpha) * b
    return a.copy()

def mutation(p):
    if np.random.rand() < PM:
        p[np.random.randint(M), np.random.randint(S)] += 0.08 * np.random.randn()
    return p

# =====================================================
# RUN ONE GA3
# =====================================================
def run_ga3():
    pop = init_population()
    fits = [fitness_ga3(ind) for ind in pop]
    trace = []

    t0 = time.time()

    for gen in range(N_GEN):
        fits = [fitness_ga3(ind) for ind in pop]

        # ---------- Feasible elitism ----------
        feasible_idx = [i for i in range(len(pop))
                        if np.all(compute_sinr(pop[i]) >= gamma)]

        if len(feasible_idx) >= ELITE:
            elite_idx = sorted(feasible_idx,
                                key=lambda i: fits[i],
                                reverse=True)[:ELITE]
        else:
            elite_idx = np.argsort(fits)[-ELITE:]

        new_pop = [pop[i].copy() for i in elite_idx]

        # ---------- offspring ----------
        while len(new_pop) < POP_SIZE:
            p1 = tournament(pop, fits)
            p2 = tournament(pop, fits)
            child = crossover(p1, p2)
            child = mutation(child)
            child = repair_feasible(child)
            new_pop.append(child)

        pop = new_pop
        trace.append(np.max(fits))

    runtime = time.time() - t0
    best = pop[np.argmax(fits)]
    sinr = compute_sinr(best)

    return {
        "snr": sensing_snr(best),
        "min_sinr": np.min(sinr),
        "violation": np.any(sinr < gamma),
        "runtime": runtime,
        "trace": trace
    }

# =====================================================
# MONTE CARLO EVALUATION — GA3
# =====================================================
if __name__ == "__main__":
    results = []

    for run in range(N_RUNS):
        print(f"GA3 run {run+1}/{N_RUNS}")
        results.append(run_ga3())

    snr_vals = [r["snr"] for r in results]
    min_sinr_vals = [r["min_sinr"] for r in results]
    violation_rate = np.mean([r["violation"] for r in results])
    runtimes = [r["runtime"] for r in results]

    print("\n===== GA3 SUMMARY (Feasible Elitism) =====")
    print(f"Sensing SNR: mean = {np.mean(snr_vals):.4f}, std = {np.std(snr_vals):.4f}")
    print(f"Min SINR:    mean = {np.mean(min_sinr_vals):.4f}")
    print(f"SINR violation rate = {violation_rate*100:.1f}%")
    print(f"Runtime: mean = {np.mean(runtimes):.3f} s")
