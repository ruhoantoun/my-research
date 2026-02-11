package model;

public class Stationery extends Product {
    private String brand;
    private String stationeryType;

    // Constructor mặc định
    public Stationery() {
        super();
    }

    // Constructor đầy đủ
    public Stationery(int id, String name, int quantity, double purchasePrice, double sellingPrice,
            String brand, String stationeryType) {
        super(id, name, quantity, purchasePrice, sellingPrice);
        this.brand = brand;
        this.stationeryType = stationeryType;
    }

    // Getter và Setter cho brand
    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    // Getter và Setter cho stationeryType
    public String getStationeryType() {
        return stationeryType;
    }

    public void setStationeryType(String stationeryType) {
        this.stationeryType = stationeryType;
    }

    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Brand: " + brand);
        System.out.println("Stationery Type: " + stationeryType);
    }
}
