import numpy as np

def make_random_system(M=3, U=2, seed=1):
    rng = np.random.default_rng(seed)
    h = rng.standard_normal((U, M)) + 1j * rng.standard_normal((U, M))  # channels UxM

    fbar = rng.standard_normal((M, U)) + 1j * rng.standard_normal((M, U))
    fbar = fbar / (np.linalg.norm(fbar, axis=1, keepdims=True) + 1e-12)
    return h, fbar

def compute_sinr_comm(h, fbar, p, noise_u):
    """
    h: (U,M) complex channel
    fbar: (M,U) fixed beam directions for users
    p: (M,U) power allocation per AP per user (>=0)
    """
    U, M = h.shape
    sinr = np.zeros(U, dtype=float)

    # Effective received complex amplitude from AP m to user u for user k stream:
    # a_{u,m,k} = h[u,m]^* * fbar[m,k]
    # Power contribution: p[m,k] * |a|^2
    for u in range(U):
        sig = 0.0
        interf = 0.0
        for m in range(M):
            sig += p[m, u] * np.abs(np.conj(h[u, m]) * fbar[m, u])**2
            for k in range(U):
                if k != u:
                    interf += p[m, k] * np.abs(np.conj(h[u, m]) * fbar[m, k])**2
        sinr[u] = sig / (interf + noise_u)
    return sinr

def repair_per_ap_power(p, P_ap):
    """Scale down per AP if sum power exceeds budget."""
    M, U = p.shape
    for m in range(M):
        s = np.sum(p[m, :])
        if s > P_ap:
            p[m, :] *= (P_ap / (s + 1e-12))
    return p

def feasibility_check_gamma(h, fbar, gamma, P_ap, noise_u,
                            max_iter=200, tol=1e-3):
    """
    Heuristic feasibility check:
    - start with some p
    - iteratively scale each user's power to meet gamma (if possible)
    - enforce per-AP power constraints by repair
    """
    U, M = h.shape

    # init p: uniform split per AP
    p = np.full((M, U), P_ap / U, dtype=float)

    for _ in range(max_iter):
        sinr = compute_sinr_comm(h, fbar, p, noise_u)

        # if already feasible
        if np.min(sinr) >= gamma - tol:
            return True, p, sinr

        # Scale each user's power across all APs based on SINR deficit
        # alpha_u > 1 increases user u power; alpha_u < 1 decreases.
        alpha = np.ones(U, dtype=float)
        for u in range(U):
            if sinr[u] > 1e-12:
                alpha[u] = gamma / sinr[u]
            else:
                alpha[u] = 10.0  # push up if degenerate

        # apply scaling
        p = p * alpha.reshape(1, -1)

        # enforce non-negativity and per-AP budgets
        p = np.maximum(p, 0.0)
        p = repair_per_ap_power(p, P_ap)

    # final check
    sinr = compute_sinr_comm(h, fbar, p, noise_u)
    feasible = (np.min(sinr) >= gamma - tol)
    return feasible, p, sinr

def find_maxmin_sinr(h, fbar, P_ap, noise_u,
                     eps=1e-3, max_bisect=40):
    """
    Bisection on gamma:
    - find upper bound by doubling until infeasible
    - bisection to get gamma*
    Returns gamma_star, p_star, sinr_star
    """
    # Step 1: find bracket [lo, hi]
    lo = 0.0
    hi = 1.0
    feasible_hi = True
    p_best = None
    sinr_best = None

    for _ in range(30):  # avoid infinite loop
        feasible_hi, p_tmp, sinr_tmp = feasibility_check_gamma(h, fbar, hi, P_ap, noise_u)
        if feasible_hi:
            lo = hi
            p_best, sinr_best = p_tmp, sinr_tmp
            hi *= 2.0
        else:
            break

    # Step 2: bisection
    for _ in range(max_bisect):
        mid = 0.5 * (lo + hi)
        feasible, p_tmp, sinr_tmp = feasibility_check_gamma(h, fbar, mid, P_ap, noise_u)
        if feasible:
            lo = mid
            p_best, sinr_best = p_tmp, sinr_tmp
        else:
            hi = mid
        if (hi - lo) <= eps:
            break

    gamma_star = lo
    return gamma_star, p_best, sinr_best

if __name__ == "__main__":
    # Example run
    M, U = 3, 2
    P_ap = 1.0
    noise_u = 0.1

    h, fbar = make_random_system(M=M, U=U, seed=1)
    gamma_star, p_star, sinr_star = find_maxmin_sinr(h, fbar, P_ap, noise_u)

    print("=== COMM BASELINE (heuristic) ===")
    print("gamma_star =", gamma_star)
    print("per-AP power allocation p[m,u]:\n", p_star)
    print("SINR achieved:", sinr_star)
