package model;

import java.util.ArrayList;
import java.util.List;

public class Store {
    private List<Product> products;

    // Constructor
    public Store() {
        products = new ArrayList<>();
    }

    // Thêm sản phẩm
    public void addProduct(Product product) {
        products.add(product);
    }

    // Xóa sản phẩm theo id
    public boolean removeProductById(int id) {
        return products.removeIf(product -> product.getId() == id);
    }

    // Tìm sản phẩm theo id
    public Product findProductById(int id) {
        for (Product product : products) {
            if (product.getId() == id) {
                return product;
            }
        }
        return null;
    }

    // Hiển thị tất cả sản phẩm
    public void displayAllProducts() {
        for (Product product : products) {
            product.displayInfo();
            System.out.println("-------------------------");
        }
    }

    // Getter cho danh sách sản phẩm (nếu cần)
    public List<Product> getProducts() {
        return products;
    }
}
