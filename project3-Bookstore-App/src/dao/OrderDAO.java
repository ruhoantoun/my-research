package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import model.Book;
import model.Order;
import model.OrderItem;
import model.Product;
import model.Stationery;
import model.Toy;

public class OrderDAO {
    public static int createOrder(Order order) {
        String sql = "INSERT INTO orders (customer_id, order_date, total_amount, payment_method, shipping_address, status) VALUES (?, NOW(), ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setInt(1, order.getCustomerId());
            pstmt.setDouble(2, order.getTotalAmount());
            pstmt.setString(3, order.getPaymentMethod());
            pstmt.setString(4, order.getShippingAddress());
            pstmt.setString(5, order.getStatus());
            int affectedRows = pstmt.executeUpdate();
            if (affectedRows == 0)
                return -1;
            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1); // order_id vừa tạo
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    public static boolean addOrderItems(int orderId, List<OrderItem> items) {
        String sql = "INSERT INTO order_items (order_id, product_id, product_type, quantity, price_at_order) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            for (OrderItem item : items) {
                pstmt.setInt(1, orderId);
                pstmt.setInt(2, item.getProductId());
                pstmt.setString(3, item.getProductType());
                pstmt.setInt(4, item.getQuantity());
                pstmt.setDouble(5, item.getPriceAtOrder());
                pstmt.addBatch();
            }
            pstmt.executeBatch();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static List<Order> getAllOrders() {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT o.*, c.name AS customer_name " +
                "FROM orders o " +
                "JOIN customer c ON o.customer_id = c.id";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                Order order = new Order();
                order.setOrderId(rs.getInt("order_id"));
                order.setCustomerId(rs.getInt("customer_id"));
                order.setOrderDate(rs.getString("order_date"));
                order.setTotalAmount(rs.getDouble("total_amount"));
                order.setPaymentMethod(rs.getString("payment_method"));
                order.setShippingAddress(rs.getString("shipping_address"));
                order.setStatus(rs.getString("status"));
                order.setCustomerName(rs.getString("customer_name"));
                orders.add(order);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }

    public static int getTotalOrder() {
        String sql = "SELECT COUNT(*) FROM orders";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public static int getTotalOrderPending() {
        String sql = "SELECT COUNT(*) FROM orders WHERE status = 'Pending'";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public static int getTotalOrderDispatched() {
        String sql = "SELECT COUNT(*) FROM orders WHERE status = 'Dispatched'";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public static double getTotalRevenue() {
        String sql = "SELECT SUM(total_amount) FROM orders";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getDouble(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public static List<Map<String, Object>> getRevenueByDate() {
        String sql = "SELECT DATE(order_date) AS day, SUM(total_amount) AS revenue " +
                "FROM orders " +
                "GROUP BY DATE(order_date)";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            List<Map<String, Object>> revenueData = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> revenue = new HashMap<>();
                revenue.put("day", rs.getString("day"));
                revenue.put("revenue", rs.getDouble("revenue"));
                revenueData.add(revenue);
            }
            return revenueData;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }
}
