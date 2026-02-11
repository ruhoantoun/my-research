#include <bits/stdc++.h>
using namespace std;

// ===================== THAM SỐ BÀI TOÁN =====================
const int DIM       = 10;
const double A_RAST = 10.0;
const double X_MIN  = -5.12;
const double X_MAX  =  5.12;

// Tham số GA
const int POP_SIZE  = 100;
const int MAX_GEN   = 500;       // dùng để quy ước pseudo-generation
const double PC     = 0.8;
const double PM     = 0.01;
const int BITS      = 16;
const double EPS    = 1e-6;

// ===================== RANDOM =====================
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

// ===================== CÁ THỂ NHỊ PHÂN =====================
struct Individual {
    vector<int> bits;
    double fx;
    double fit;
};

long long evalCount = 0;

double decodeGene(const vector<int> &bits, int varIndex) {
    int start = varIndex * BITS;
    unsigned int value = 0;
    for (int i = 0; i < BITS; ++i)
        value = (value << 1) | (bits[start + i] & 1);
    double maxVal = (1u << BITS) - 1;
    double xi = X_MIN + (X_MAX - X_MIN) * (double)value / maxVal;
    return xi;
}
vector<double> decodeVector(const vector<int> &bits) {
    vector<double> x(DIM);
    for (int i = 0; i < DIM; ++i)
        x[i] = decodeGene(bits, i);
    return x;
}

void evaluate(Individual &ind) {
    vector<double> x = decodeVector(ind.bits);
    ind.fx  = rastrigin(x);
    ind.fit = fitnessFromF(ind.fx);
    evalCount++;
}

// Khởi tạo quần thể
vector<Individual> initPop() {
    vector<Individual> pop(POP_SIZE);
    for (int i = 0; i < POP_SIZE; ++i) {
        pop[i].bits.resize(DIM * BITS);
        for (int j = 0; j < DIM * BITS; ++j)
            pop[i].bits[j] = randInt(0, 1);
        evaluate(pop[i]);
    }
    return pop;
}

// Tournament selection
int tournamentSelect(const vector<Individual> &pop, int k = 3) {
    int best = randInt(0, POP_SIZE - 1);
    for (int i = 1; i < k; ++i) {
        int idx = randInt(0, POP_SIZE - 1);
        if (pop[idx].fit > pop[best].fit) best = idx;
    }
    return best;
}

// Crossover
void crossover(const Individual &p1, const Individual &p2,
               Individual &c1, Individual &c2) {
    int L = DIM * BITS;
    c1 = p1;
    c2 = p2;
    if (randDouble(0.0, 1.0) < PC) {
        int point = randInt(1, L - 1);
        for (int i = point; i < L; ++i) {
            c1.bits[i] = p2.bits[i];
            c2.bits[i] = p1.bits[i];
        }
    }
}

// Mutation
void mutate(Individual &ind) {
    int L = DIM * BITS;
    for (int i = 0; i < L; ++i)
        if (randDouble(0.0, 1.0) < PM)
            ind.bits[i] = 1 - ind.bits[i];
}

int findBestIndex(const vector<Individual> &pop) {
    int bestIdx = 0;
    for (int i = 1; i < (int)pop.size(); ++i)
        if (pop[i].fx < pop[bestIdx].fx) bestIdx = i;
    return bestIdx;
}
int findWorstIndex(const vector<Individual> &pop) {
    int worstIdx = 0;
    for (int i = 1; i < (int)pop.size(); ++i)
        if (pop[i].fx > pop[worstIdx].fx) worstIdx = i;
    return worstIdx;
}

// ===================== MAIN – GA2 STEADY-STATE =====================
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    ofstream logFile("ga2_log.txt");
    if (!logFile) {
        cerr << "Khong mo duoc file ga2_log.txt\n";
        return 1;
    }

    auto pop = initPop();
    int bestIdx = findBestIndex(pop);
    Individual best = pop[bestIdx];

    int totalSteps = POP_SIZE * MAX_GEN; // pseudo MAX_GEN thế hệ

    for (int step = 0; step < totalSteps; ++step) {
        // chọn bố mẹ
        int p1 = tournamentSelect(pop);
        int p2 = tournamentSelect(pop);

        Individual c1, c2;
        crossover(pop[p1], pop[p2], c1, c2);
        mutate(c1);
        mutate(c2);
        evaluate(c1);
        evaluate(c2);

        // thay thế cá thể kém
        for (const Individual &child : {c1, c2}) {
            int worst = findWorstIndex(pop);
            if (child.fx < pop[worst].fx)
                pop[worst] = child;
        }

        // cập nhật best
        int curBest = findBestIndex(pop);
        if (pop[curBest].fx < best.fx)
            best = pop[curBest];

        // mỗi POP_SIZE bước → coi như 1 "generation"
        if (step % POP_SIZE == 0) {
            int gen = step / POP_SIZE;
            logFile << gen << " " << best.fx << "\n";
        }

        if (best.fx < EPS) {
            // vẫn tiếp tục nếu muốn đủ số bước, hoặc break
            // break;
        }
    }

    logFile.close();

    vector<double> bestX = decodeVector(best.bits);

    cout << "GA2 - Steady-State Binary GA\n";
    cout << "Best f(x) = " << best.fx << "\n";
    cout << "Best fitness = " << best.fit << "\n";
    cout << "Best x = ";
    for (double v : bestX) cout << v << " ";
    cout << "\nEvaluations = " << evalCount << "\n";
    cout << "Log saved to ga2_log.txt\n";
    return 0;
}
