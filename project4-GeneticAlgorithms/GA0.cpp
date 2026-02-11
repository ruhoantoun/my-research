#include <bits/stdc++.h>
using namespace std;

// ===================== THAM SỐ BÀI TOÁN =====================
const int DIM       = 10;     // số chiều n
const double A_RAST = 10.0;
const double X_MIN  = -5.12;
const double X_MAX  =  5.12;

// Tham số GA
const int POP_SIZE  = 100;
const int MAX_GEN   = 500;
const double PC     = 0.8;    // xác suất lai
const double PM     = 0.01;   // xác suất đột biến trên mỗi bit
const int BITS      = 16;     // số bit / 1 biến
const double EPS    = 1e-3;   // ngưỡng hội tụ

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
    return 1.0 / (1.0 + fx);       // minimize f → maximize fitness
}

// ===================== CÁ THỂ NHỊ PHÂN =====================
struct IndividualBin {
    vector<int> bits;  // chiều dài = DIM * BITS
    double fx;
    double fit;
};

long long evalCount = 0;

// Giải mã 1 biến
double decodeGene(const vector<int> &bits, int varIndex) {
    int start = varIndex * BITS;
    unsigned int value = 0;
    for (int i = 0; i < BITS; ++i) {
        value = (value << 1) | (bits[start + i] & 1);
    }
    double maxVal = (1u << BITS) - 1;
    double xi = X_MIN + (X_MAX - X_MIN) * (double)value / maxVal;
    return xi;
}

// Giải mã full vector
vector<double> decodeVector(const vector<int> &bits) {
    vector<double> x(DIM);
    for (int i = 0; i < DIM; ++i)
        x[i] = decodeGene(bits, i);
    return x;
}

void evaluate(IndividualBin &ind) {
    vector<double> x = decodeVector(ind.bits);
    ind.fx  = rastrigin(x);
    ind.fit = fitnessFromF(ind.fx);
    evalCount++;
}

// Khởi tạo quần thể
vector<IndividualBin> initPop() {
    vector<IndividualBin> pop(POP_SIZE);
    for (int i = 0; i < POP_SIZE; ++i) {
        pop[i].bits.resize(DIM * BITS);
        for (int j = 0; j < DIM * BITS; ++j)
            pop[i].bits[j] = randInt(0, 1);
        evaluate(pop[i]);
    }
    return pop;
}

// Roulette selection
int rouletteSelect(const vector<IndividualBin> &pop) {
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

// Crossover one-point
void crossover(const IndividualBin &p1, const IndividualBin &p2,
               IndividualBin &c1, IndividualBin &c2) {
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

// Đột biến bit-flip
void mutate(IndividualBin &ind) {
    int L = DIM * BITS;
    for (int i = 0; i < L; ++i)
        if (randDouble(0.0, 1.0) < PM)
            ind.bits[i] = 1 - ind.bits[i];
}

int findBestIndex(const vector<IndividualBin> &pop) {
    int bestIdx = 0;
    for (int i = 1; i < (int)pop.size(); ++i)
        if (pop[i].fx < pop[bestIdx].fx) bestIdx = i;
    return bestIdx;
}

// ===================== MAIN – GA0 =====================
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    ofstream logFile("ga0_log.txt");
    if (!logFile) {
        cerr << "Khong mo duoc file ga0_log.txt\n";
        return 1;
    }

    auto pop = initPop();
    int bestIdx = findBestIndex(pop);
    IndividualBin best = pop[bestIdx];

    for (int gen = 0; gen < MAX_GEN; ++gen) {
        vector<IndividualBin> newPop(POP_SIZE);

        for (int i = 0; i < POP_SIZE; i += 2) {
            int p1 = rouletteSelect(pop);
            int p2 = rouletteSelect(pop);

            IndividualBin c1, c2;
            crossover(pop[p1], pop[p2], c1, c2);
            mutate(c1);
            mutate(c2);
            evaluate(c1);
            evaluate(c2);

            newPop[i] = c1;
            if (i + 1 < POP_SIZE) newPop[i+1] = c2;
        }

        pop = newPop;
        int curBest = findBestIndex(pop);
        if (pop[curBest].fx < best.fx) best = pop[curBest];

        // log: generation vs best f(x)
        logFile << gen << " " << best.fx << "\n";

        if (best.fx < EPS) break;
    }

    logFile.close();

    vector<double> bestX = decodeVector(best.bits);

    cout << "GA0 - Binary GA baseline\n";
    cout << "Best f(x) = " << best.fx << "\n";
    cout << "Best fitness = " << best.fit << "\n";
    cout << "Best x = ";
    for (double v : bestX) cout << v << " ";
    cout << "\nEvaluations = " << evalCount << "\n";
    cout << "Log saved to ga0_log.txt\n";
    return 0;
}
