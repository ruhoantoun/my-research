#include <bits/stdc++.h>
using namespace std;

// ===================== THAM SỐ BÀI TOÁN =====================
const int DIM       = 10;
const double A_RAST = 10.0;
const double X_MIN  = -5.12;
const double X_MAX  =  5.12;

// Tham số GA
const int POP_SIZE  = 100;
const int MAX_GEN   = 500;
const double PC     = 0.8;
const double PM     = 0.05;      // xác suất đột biến / gene
const double MUT_SIGMA_REL = 0.1;
const double EPS    = 1e-6;

mt19937_64 rng(chrono::high_resolution_clock::now().time_since_epoch().count());
const double PI = acos(-1.0);

double randDouble(double l, double r) {
    uniform_real_distribution<double> dist(l, r);
    return dist(rng);
}
int randInt(int l, int r) {
    uniform_int_distribution<int> dist(l, r);
    return dist(rng);
}

// ===================== RASTRIGIN & FITNESS =====================
double rastrigin(const vector<double> &x) {
    double sum = A_RAST * DIM;
    for (int i = 0; i < DIM; ++i)
        sum += x[i]*x[i] - A_RAST * cos(2.0*PI*x[i]);
    return sum;
}
double fitnessFromF(double fx) {
    return 1.0 / (1.0 + fx);
}

// ===================== CÁ THỂ SỐ THỰC =====================
struct Individual {
    vector<double> x;
    double fx;
    double fit;
};

long long evalCount = 0;

void evaluate(Individual &ind) {
    ind.fx  = rastrigin(ind.x);
    ind.fit = fitnessFromF(ind.fx);
    evalCount++;
}

vector<Individual> initPop() {
    vector<Individual> pop(POP_SIZE);
    for (int i = 0; i < POP_SIZE; ++i) {
        pop[i].x.resize(DIM);
        for (int j = 0; j < DIM; ++j)
            pop[i].x[j] = randDouble(X_MIN, X_MAX);
        evaluate(pop[i]);
    }
    return pop;
}

// Roulette selection
int rouletteSelect(const vector<Individual> &pop) {
    double sumFit = 0.0;
    for (auto &ind : pop) sumFit += ind.fit;
    double r = randDouble(0.0, sumFit);
    double c = 0.0;
    for (int i = 0; i < (int)pop.size(); ++i) {
        c += pop[i].fit;
        if (c >= r) return i;
    }
    return (int)pop.size() - 1;
}

// Arithmetic crossover
void crossover(const Individual &p1, const Individual &p2,
               Individual &c1, Individual &c2) {
    c1 = p1;
    c2 = p2;
    if (randDouble(0.0, 1.0) < PC) {
        double alpha = randDouble(0.0, 1.0);
        for (int i = 0; i < DIM; ++i) {
            c1.x[i] = alpha * p1.x[i] + (1 - alpha)*p2.x[i];
            c2.x[i] = alpha * p2.x[i] + (1 - alpha)*p1.x[i];
            c1.x[i] = max(X_MIN, min(X_MAX, c1.x[i]));
            c2.x[i] = max(X_MIN, min(X_MAX, c2.x[i]));
        }
    }
}

// Gaussian mutation
void mutate(Individual &ind) {
    normal_distribution<double> gauss(0.0, MUT_SIGMA_REL * (X_MAX - X_MIN));
    for (int i = 0; i < DIM; ++i) {
        if (randDouble(0.0, 1.0) < PM) {
            ind.x[i] += gauss(rng);
            ind.x[i] = max(X_MIN, min(X_MAX, ind.x[i]));
        }
    }
}

int findBestIndex(const vector<Individual> &pop) {
    int bestIdx = 0;
    for (int i = 1; i < (int)pop.size(); ++i)
        if (pop[i].fx < pop[bestIdx].fx) bestIdx = i;
    return bestIdx;
}

// ===================== MAIN – GA1 =====================
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    ofstream logFile("ga1_log.txt");
    if (!logFile) {
        cerr << "Khong mo duoc file ga1_log.txt\n";
        return 1;
    }

    auto pop = initPop();
    int bestIdx = findBestIndex(pop);
    Individual best = pop[bestIdx];

    for (int gen = 0; gen < MAX_GEN; ++gen) {
        vector<Individual> newPop;
        newPop.reserve(POP_SIZE);

        // elitism – giữ best
        int eliteIdx = findBestIndex(pop);
        newPop.push_back(pop[eliteIdx]);

        while ((int)newPop.size() < POP_SIZE) {
            int p1 = rouletteSelect(pop);
            int p2 = rouletteSelect(pop);
            Individual c1, c2;
            crossover(pop[p1], pop[p2], c1, c2);
            mutate(c1);
            mutate(c2);
            evaluate(c1);
            evaluate(c2);
            newPop.push_back(c1);
            if ((int)newPop.size() < POP_SIZE)
                newPop.push_back(c2);
        }

        pop = newPop;
        int curBest = findBestIndex(pop);
        if (pop[curBest].fx < best.fx) best = pop[curBest];

        // log: generation vs best f(x)
        logFile << gen << " " << best.fx << "\n";

        if (best.fx < EPS) break;
    }

    logFile.close();

    cout << "GA1 - Real-coded Elitist GA\n";
    cout << "Best f(x) = " << best.fx << "\n";
    cout << "Best fitness = " << best.fit << "\n";
    cout << "Best x = ";
    for (double v : best.x) cout << v << " ";
    cout << "\nEvaluations = " << evalCount << "\n";
    cout << "Log saved to ga1_log.txt\n";
    return 0;
}
