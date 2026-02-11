package model;

import java.util.HashMap;
import java.util.Map;
import interfaces.ICart;

public class Cart implements ICart {
    private Customer customer;
    private static Cart instance;
    private Map<Product, Integer> items = new HashMap<>();

    public static final double SHIPPING_FEE = 10.00;

    private Cart() {
    }

    public static Cart getInstance() {
        if (instance == null) {
            instance = new Cart();
        }
        return instance;
    }

    @Override
    public void addProduct(Product product, int quantity) {
        items.put(product, items.getOrDefault(product, 0) + quantity);
    }

    @Override
    public Map<Product, Integer> getItems() {
        return items;
    }

    @Override
    public void remove(Product product) {
        items.remove(product);
    }

    @Override
    public double getTotalCost() {
        double total = 0;
        for (Map.Entry<Product, Integer> entry : items.entrySet()) {
            Product product = entry.getKey();
            int quantity = entry.getValue();
            total += product.getSellingPrice() * quantity;
        }
        return total;
    }

    @Override
    public double getTotalCostWithShipping() {
        return getTotalCost() + SHIPPING_FEE;
    }

    @Override
    public double getShippingFee() {
        return SHIPPING_FEE;
    }

    @Override
    public void updateQuantity(Product product, int quantity) {
        if (quantity <= 0) {
            remove(product);
        } else {
            items.put(product, quantity);
        }
    }

    @Override
    public void clear() {
        items.clear();
    }

    @Override
    public boolean isEmpty() {
        return items.isEmpty();
    }

    @Override
    public int getTotalItems() {
        return items.values().stream().mapToInt(Integer::intValue).sum();
    }
}
