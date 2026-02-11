import numpy as np
import time

# =====================================================
# SYSTEM SETUP (FIXED FOR ALL GA)
# =====================================================
np.random.seed(1)

M = 3
U = 2
Q = 1
S = U + Q

P_AP = 1.0
noise_u = 0.1

POP_SIZE = 40
N_GEN = 120
PC = 0.9
PM = 0.12
ELITE = 2

LAMBDA_SINR = 80.0
LAMBDA_PWR = 50.0

N_RUNS = 10

# =====================================================
# COMMUNICATION BASELINE (P1)
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
# CHANNELS
# =====================================================
h, fbar_comm = make_random_system(seed=1)

rng = np.random.default_rng(2)
fbar_sens = rng.standard_normal((M, Q)) + 1j * rng.standard_normal((M, Q))
fbar_sens /= np.linalg.norm(fbar_sens, axis=1, keepdims=True)

f_bar = np.concatenate([fbar_comm, fbar_sens], axis=1)

gamma = find_gamma_star(h, fbar_comm)
print("gamma from P1 =", gamma)

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
    p = repair_power(p)
    sinr = compute_sinr(p)
    if np.all(sinr >= gamma):
        return p
    p[:, U:] *= 0.5
    return repair_power(p)

# =====================================================
# FITNESS FUNCTIONS
# =====================================================
def fitness_ga0(p):
    sinr = compute_sinr(p)
    return sensing_snr(p) \
        - LAMBDA_SINR * np.sum(np.maximum(0, gamma - sinr)**2)

def fitness_ga1(p, penalty):
    sinr = compute_sinr(p)
    return sensing_snr(p) \
        - penalty * np.sum(np.maximum(0, gamma - sinr)**2)

def fitness_ga2(p):
    sinr = compute_sinr(p)
    if np.any(sinr < gamma):
        return -1e6
    return sensing_snr(p)

def fitness_ga3(p):
    sinr = compute_sinr(p)
    if np.any(sinr < gamma):
        return -1e6 - np.sum(np.maximum(0, gamma - sinr)) * 1e3
    return sensing_snr(p)

# =====================================================
# GA CORE
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
# RUN GA
# =====================================================
def run_ga(ga_type):
    pop = init_population()
    t0 = time.time()

    for gen in range(N_GEN):
        if ga_type == "GA0":
            fits = [fitness_ga0(ind) for ind in pop]
        elif ga_type == "GA1":
            viol = np.mean([np.any(compute_sinr(ind) < gamma) for ind in pop])
            penalty = LAMBDA_SINR * (1 + 5 * viol)
            fits = [fitness_ga1(ind, penalty) for ind in pop]
        elif ga_type == "GA2":
            fits = [fitness_ga2(ind) for ind in pop]
        else:
            fits = [fitness_ga3(ind) for ind in pop]

        elite_idx = np.argsort(fits)[-ELITE:]
        new_pop = [pop[i].copy() for i in elite_idx]

        while len(new_pop) < POP_SIZE:
            p1 = tournament(pop, fits)
            p2 = tournament(pop, fits)
            child = mutation(crossover(p1, p2))
            if ga_type in ["GA2", "GA3"]:
                child = repair_feasible(child)
            else:
                child = repair_power(child)
            new_pop.append(child)

        pop = new_pop

    runtime = time.time() - t0
    best = pop[np.argmax(fits)]
    sinr = compute_sinr(best)

    return {
        "snr": sensing_snr(best),
        "min_sinr": np.min(sinr),
        "violation": np.any(sinr < gamma),
        "runtime": runtime
    }

# =====================================================
# MONTE CARLO COMPARISON
# =====================================================
def evaluate(ga):
    res = []
    for i in range(N_RUNS):
        print(f"{ga} run {i+1}/{N_RUNS}")
        res.append(run_ga(ga))
    return res

def summarize(name, res):
    print(f"\n=== SUMMARY ({name}) ===")
    print("Mean sensing SNR:", np.mean([r["snr"] for r in res]))
    print("Std sensing SNR:", np.std([r["snr"] for r in res]))
    print("Min SINR mean:", np.mean([r["min_sinr"] for r in res]))
    print("SINR violation rate:", np.mean([r["violation"] for r in res]))

# =====================================================
# MAIN
# =====================================================
if __name__ == "__main__":
    for ga in ["GA0", "GA1", "GA2", "GA3"]:
        results = evaluate(ga)
        summarize(ga, results)
