package model;

public class Toy extends Product {
    private String brand;
    private String suitableAges;
    private String toyType;

    // Constructor mặc định
    public Toy() {
        super();
    }

    // Constructor đầy đủ
    public Toy(int id, String name, int quantity, double purchasePrice, double sellingPrice,
            String brand, String suitableAges, String toyType) {
        super(id, name, quantity, purchasePrice, sellingPrice);
        this.brand = brand;
        this.suitableAges = suitableAges;
        this.toyType = toyType;
    }

    // Getter và Setter cho brand
    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    // Getter và Setter cho suitableAges
    public String getSuitableAges() {
        return suitableAges;
    }

    public void setSuitableAges(String suitableAges) {
        this.suitableAges = suitableAges;
    }

    // Getter và Setter cho toyType
    public String getToyType() {
        return toyType;
    }

    public void setToyType(String toyType) {
        this.toyType = toyType;
    }

    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Brand: " + brand);
        System.out.println("Suitable Ages: " + suitableAges);
        System.out.println("Toy Type: " + toyType);
    }
}
