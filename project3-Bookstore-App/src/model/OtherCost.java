package model;

public class OtherCost {
    private String type;
    private double amount;

    public OtherCost(String type, double amount) {
        this.type = type;
        this.amount = amount;
    }

    public String getType() { return type; }
    public double getAmount() { return amount; }
}
