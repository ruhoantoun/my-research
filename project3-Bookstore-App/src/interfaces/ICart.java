package interfaces;

import model.Product;
import java.util.Map;

public interface ICart {
    // Thêm sản phẩm vào giỏ hàng
    void addProduct(Product product, int quantity);

    // Lấy danh sách sản phẩm trong giỏ hàng
    Map<Product, Integer> getItems();

    // Xóa sản phẩm khỏi giỏ hàng
    void remove(Product product);

    // Tính tổng tiền hàng
    double getTotalCost();

    // Tính tổng tiền hàng bao gồm phí vận chuyển
    double getTotalCostWithShipping();

    // Lấy phí vận chuyển
    double getShippingFee();

    // Cập nhật số lượng sản phẩm
    void updateQuantity(Product product, int quantity);

    // Xóa toàn bộ giỏ hàng
    void clear();

    // Kiểm tra giỏ hàng có trống không
    boolean isEmpty();

    // Lấy tổng số sản phẩm trong giỏ hàng
    int getTotalItems();
}