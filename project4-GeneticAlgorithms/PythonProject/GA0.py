import numpy as np

# ======================================================
# System parameters (toy setup – bạn có thể chỉnh)
# ======================================================
np.random.seed(1)

M = 3        # number of APs
U = 2        # number of users
Q = 1        # number of sensing streams
S = U + Q    # total streams per AP

P_AP = 1.0           # power budget per AP
gamma = 2.0          # SINR threshold
noise_u = 0.1        # noise power

# GA parameters (GA0)
POP_SIZE = 30
N_GEN = 100
PC = 0.9              # crossover prob
PM = 0.1              # mutation prob
ELITE = 2
LAMBDA_SINR = 10.0
LAMBDA_PWR = 10.0

# ======================================================
# Fixed beam directions (normalized)
# ======================================================
f_bar = np.random.randn(M, S) + 1j * np.random.randn(M, S)
f_bar = f_bar / np.linalg.norm(f_bar, axis=1, keepdims=True)

# Channels (toy Rayleigh)
h = np.random.randn(U, M) + 1j * np.random.randn(U, M)

# ======================================================
# Metric computations
# ======================================================
def compute_sinr(p):
    """Compute SINR for each user"""
    sinr = np.zeros(U)
    for u in range(U):
        signal = 0.0
        interf = 0.0
        for m in range(M):
            signal += p[m, u] * np.abs(np.conj(h[u, m]) * f_bar[m, u])**2
            for s in range(S):
                if s != u:
                    interf += p[m, s] * np.abs(np.conj(h[u, m]) * f_bar[m, s])**2
        sinr[u] = signal / (interf + noise_u)
    return sinr


def compute_snr_sensing(p):
    """Toy sensing SNR: sum sensing power"""
    return np.sum(p[:, U:])   # sensing streams only


# ======================================================
# Fitness function
# ======================================================
def fitness(p):
    sinr = compute_sinr(p)
    snr_s = compute_snr_sensing(p)

    penalty_sinr = np.sum(np.maximum(0, gamma - sinr)**2)
    penalty_pwr = np.sum(np.maximum(0, np.sum(p, axis=1) - P_AP)**2)

    return snr_s - LAMBDA_SINR * penalty_sinr - LAMBDA_PWR * penalty_pwr


# ======================================================
# GA operators
# ======================================================
def init_population():
    pop = []
    for _ in range(POP_SIZE):
        p = np.random.rand(M, S)
        # normalize per AP
        for m in range(M):
            p[m, :] = p[m, :] / np.sum(p[m, :]) * P_AP
        pop.append(p)
    return pop


def tournament_selection(pop, fit, k=3):
    idx = np.random.choice(len(pop), k)
    best = idx[np.argmax([fit[i] for i in idx])]
    return pop[best]


def crossover(p1, p2):
    if np.random.rand() < PC:
        alpha = np.random.rand()
        return alpha * p1 + (1 - alpha) * p2
    return p1.copy()


def mutation(p):
    if np.random.rand() < PM:
        m = np.random.randint(M)
        s = np.random.randint(S)
        p[m, s] += 0.1 * np.random.randn()
    return np.maximum(p, 0)


def repair(p):
    for m in range(M):
        if np.sum(p[m, :]) > P_AP:
            p[m, :] = p[m, :] / np.sum(p[m, :]) * P_AP
    return p


# ======================================================
# Main GA loop (GA0)
# ======================================================
population = init_population()
fitness_values = [fitness(ind) for ind in population]

best_fitness_trace = []

for gen in range(N_GEN):
    # elitism
    elite_idx = np.argsort(fitness_values)[-ELITE:]
    new_pop = [population[i].copy() for i in elite_idx]

    # generate offspring
    while len(new_pop) < POP_SIZE:
        p1 = tournament_selection(population, fitness_values)
        p2 = tournament_selection(population, fitness_values)
        child = crossover(p1, p2)
        child = mutation(child)
        child = repair(child)
        new_pop.append(child)

    population = new_pop
    fitness_values = [fitness(ind) for ind in population]

    best_fitness_trace.append(np.max(fitness_values))

    if gen % 10 == 0:
        print(f"Gen {gen:3d} | Best fitness = {np.max(fitness_values):.3f}")

# ======================================================
# Final result
# ======================================================
best_idx = np.argmax(fitness_values)
best_p = population[best_idx]

print("\n=== GA0 RESULT ===")
print("Best power allocation:")
print(best_p)
print("SINR:", compute_sinr(best_p))
print("Sensing SNR:", compute_snr_sensing(best_p))
