import matplotlib
matplotlib.use("Agg")  # non-interactive backend (no Tk needed)

import numpy as np
import matplotlib.pyplot as plt

# =====================================================
# SYSTEM SETUP
# =====================================================
np.random.seed(1)

M, U, Q = 3, 2, 1
S = U + Q
P_AP = 1.0
noise_u = 0.1

POP_SIZE = 40
N_GEN = 120
PC = 0.9
PM = 0.12
ELITE = 2

LAMBDA_SINR = 80.0
N_RUNS = 10  # tăng để đường trung bình mượt hơn

# =====================================================
# CHANNELS & BASELINE
# =====================================================
def make_random_system(seed=1):
    rng = np.random.default_rng(seed)
    h = rng.standard_normal((U, M)) + 1j * rng.standard_normal((U, M))
    fbar = rng.standard_normal((M, U)) + 1j * rng.standard_normal((M, U))
    fbar /= np.linalg.norm(fbar, axis=1, keepdims=True)
    return h, fbar

h, fbar_comm = make_random_system(1)

rng = np.random.default_rng(2)
fbar_sens = rng.standard_normal((M, Q)) + 1j * rng.standard_normal((M, Q))
fbar_sens /= np.linalg.norm(fbar_sens, axis=1, keepdims=True)
f_bar = np.concatenate([fbar_comm, fbar_sens], axis=1)

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
    # sensing streams are last Q columns
    return float(np.sum(p[:, U:]))

# Nếu bạn muốn lấy đúng gamma từ P1, hãy thay giá trị gamma bên dưới bằng gamma bạn đang dùng
# (ví dụ gamma = 0.3544674723 hoặc gamma = 0.56640625 theo file khác của bạn)
gamma = 0.35446747231755743

# =====================================================
# GA UTILS
# =====================================================
def repair_power(p):
    p = np.maximum(p, 0.0)
    for m in range(M):
        s = np.sum(p[m])
        if s > P_AP:
            p[m] *= P_AP / s
    return p

def repair_feasible(p):
    # feasibility helper: cut sensing if SINR violated
    p = repair_power(p)
    if np.any(compute_sinr(p) < gamma):
        p[:, U:] *= 0.5
    return repair_power(p)

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
# FITNESS (phù hợp với các GA bạn đã chạy)
# =====================================================
def fitness_ga0(p):
    sinr = compute_sinr(p)
    return sensing_snr(p) - LAMBDA_SINR * np.sum(np.maximum(0.0, gamma - sinr) ** 2)

def fitness_ga1(p, penalty):
    sinr = compute_sinr(p)
    return sensing_snr(p) - penalty * np.sum(np.maximum(0.0, gamma - sinr) ** 2)

def fitness_ga2(p):
    # Feasibility-first: infeasible always dominated
    sinr = compute_sinr(p)
    if np.any(sinr < gamma):
        return -1e6 - np.sum(np.maximum(0.0, gamma - sinr)) * 1e3
    return sensing_snr(p)

def fitness_ga3(p):
    # Feasible elitism fitness (lexicographic)
    sinr = compute_sinr(p)
    if np.any(sinr < gamma):
        return -1e6 - np.sum(np.maximum(0.0, gamma - sinr)) * 1e3
    return sensing_snr(p)

# =====================================================
# RUN GA WITH TRACE
# =====================================================
def run_ga(ga):
    pop = init_population()
    trace = np.zeros(N_GEN, dtype=float)

    for gen in range(N_GEN):
        if ga == "GA0":
            fits = [fitness_ga0(ind) for ind in pop]
        elif ga == "GA1":
            viol = np.mean([np.any(compute_sinr(ind) < gamma) for ind in pop])
            penalty = LAMBDA_SINR * (1 + 5 * viol)
            fits = [fitness_ga1(ind, penalty) for ind in pop]
        elif ga == "GA2":
            fits = [fitness_ga2(ind) for ind in pop]
        else:
            fits = [fitness_ga3(ind) for ind in pop]

        trace[gen] = float(np.max(fits))

        elite_idx = np.argsort(fits)[-ELITE:]
        new_pop = [pop[i].copy() for i in elite_idx]

        while len(new_pop) < POP_SIZE:
            p1 = tournament(pop, fits)
            p2 = tournament(pop, fits)
            child = mutation(crossover(p1, p2))

            if ga in ["GA2", "GA3"]:
                child = repair_feasible(child)
            else:
                child = repair_power(child)

            new_pop.append(child)

        pop = new_pop

    return trace

def avg_trace(ga):
    traces = [run_ga(ga) for _ in range(N_RUNS)]
    return np.mean(np.vstack(traces), axis=0)

# =====================================================
# PLOT
# =====================================================
if __name__ == "__main__":
    # --- 1) Raw plot (để đối chiếu, có thể bị kéo xuống bởi -1e6) ---
    plt.figure(figsize=(9, 5))
    for ga in ["GA0", "GA1", "GA2", "GA3"]:
        t = avg_trace(ga)
        plt.plot(t, label=ga)
    plt.xlabel("Generation")
    plt.ylabel("Best fitness (raw)")
    plt.title("GA Convergence Comparison (Raw)")
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.savefig("ga_convergence_raw.png", dpi=300, bbox_inches="tight")
    plt.close()
    print("Saved ga_convergence_raw.png")

    # --- 2) Feasible-only plot (paper-ready) ---
    plt.figure(figsize=(9, 5))
    for ga in ["GA0", "GA1", "GA2", "GA3"]:
        t = avg_trace(ga)

        # KEY: hide infeasible/penalty region so it doesn't dominate y-axis
        # Với setup này: fitness < 0 thường là do penalty nặng / infeasible
        t_plot = np.where(t < 0, np.nan, t)

        plt.plot(t_plot, label=ga)

    plt.xlabel("Generation")
    plt.ylabel("Best fitness (feasible-only)")
    plt.title("GA Convergence Comparison (Feasible-only)")
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.savefig("ga_convergence_feasible_only.png", dpi=300, bbox_inches="tight")
    plt.close()
    print("Saved ga_convergence_feasible_only.png")

