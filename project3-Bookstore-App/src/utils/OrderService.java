package utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import dao.OrderDAO;
import model.Book;
import model.Cart;
import model.Customer;
import model.Order;
import model.OrderItem;
import model.Product;
import model.Stationery;
import model.Toy;

public class OrderService {

    /**
     * Tạo đơn hàng từ giỏ hàng
     * 
     * @param customer        Khách hàng đặt hàng
     * @param cart            Giỏ hàng
     * @param paymentMethod   Phương thức thanh toán
     * @param shippingAddress Địa chỉ giao hàng
     * @return true nếu tạo đơn hàng thành công, false nếu thất bại
     */
    public static boolean createOrderFromCart(Customer customer, Cart cart, String paymentMethod,
            String shippingAddress) {
        try {
            // 1. Kiểm tra giỏ hàng không được trống
            if (cart.getItems().isEmpty()) {
                return false;
            }

            // 2. Tạo đối tượng Order
            Order order = new Order();
            order.setCustomerId(customer.getId());
            order.setTotalAmount(cart.getTotalCostWithShipping());
            order.setPaymentMethod(paymentMethod);
            order.setShippingAddress(shippingAddress);
            order.setStatus("Pending"); // Trạng thái ban đầu

            // 3. Tạo đơn hàng trong database và lấy orderId
            int orderId = OrderDAO.createOrder(order);
            if (orderId == -1) {
                return false;
            }

            // 4. Tạo danh sách OrderItem từ giỏ hàng
            List<OrderItem> orderItems = new ArrayList<>();
            for (Map.Entry<Product, Integer> entry : cart.getItems().entrySet()) {
                Product product = entry.getKey();
                int quantity = entry.getValue();

                OrderItem item = new OrderItem();
                item.setOrderId(orderId);
                item.setQuantity(quantity);
                item.setPriceAtOrder(product.getSellingPrice());

                // Xác định loại sản phẩm
                if (product instanceof Book) {
                    Book book = (Book) product;
                    item.setProductId(book.getId());
                    item.setProductType("BOOK");
                } else if (product instanceof Toy) {
                    Toy toy = (Toy) product;
                    item.setProductId(toy.getId());
                    item.setProductType("TOY");
                } else if (product instanceof Stationery) {
                    Stationery stationery = (Stationery) product;
                    item.setProductId(stationery.getId());
                    item.setProductType("STATIONERY");
                }

                orderItems.add(item);
            }

            // 5. Lưu chi tiết đơn hàng
            boolean success = OrderDAO.addOrderItems(orderId, orderItems);
            if (success) {
                // 6. Xóa giỏ hàng sau khi đặt hàng thành công
                cart.getItems().clear();
                return true;
            }

            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Lấy danh sách đơn hàng của khách hàng
     * 
     * @param customerId ID của khách hàng
     * @return Danh sách đơn hàng
     */
    public static List<Order> getOrdersByCustomerId(int customerId) {
        // TODO: Implement phương thức này
        return new ArrayList<>();
    }

    /**
     * Cập nhật trạng thái đơn hàng
     * 
     * @param orderId ID đơn hàng
     * @param status  Trạng thái mới
     * @return true nếu cập nhật thành công
     */
    public static boolean updateOrderStatus(int orderId, String status) {
        // TODO: Implement phương thức này
        return false;
    }
}
