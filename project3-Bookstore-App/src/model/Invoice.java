package model;

import java.util.Map;

public class Invoice {
    private Cart cart;

    public Invoice(Cart cart) {
        this.cart = cart;
    }

    // public void generateInvoice() {
    // System.out.println("===== INVOICE =====");
    // System.out.println("Customer: " + cart.getCustomer().getName());
    // System.out.println("Phone: " + cart.getCustomer().getPhoneNumber());
    // System.out.println("Address: " + cart.getCustomer().getAddress());
    // System.out.println("--------------------");

    // double total = 0.0;
    // for (Map.Entry<Product, Integer> entry : cart.getItems().entrySet()) {
    // Product product = entry.getKey();
    // int quantity = entry.getValue();
    // double subtotal = product.getSellingPrice() * quantity;
    // total += subtotal;
    // System.out.println(product.getName() + " x " + quantity + " = " + subtotal);
    // }

    // System.out.println("--------------------");
    // System.out.println("Total: " + total);
    // System.out.println("====================");
    // }
}
