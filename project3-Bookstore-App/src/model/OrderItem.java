package model;

public class OrderItem {
    private int orderId;
    private int productId;
    private int quantity;
    private String productType;
    private double priceAtOrder;

    public OrderItem(int orderId, int productId, int quantity, String productType) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.productType = productType;
    }

    public OrderItem() {
        this.orderId = 0;
        this.productId = 0;
        this.quantity = 0;
        this.productType = "";
    }

    public int getOrderId() {
        return orderId;
    }

    public int getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getProductType() {
        return productType;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public double getPriceAtOrder() {
        return priceAtOrder;
    }

    public void setPriceAtOrder(double priceAtOrder) {
        this.priceAtOrder = priceAtOrder;
    }
}
