package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.Customer;

public class CustomerDAO {
    public static boolean checkLogin(String username, String password) {
        String sql = "SELECT * FROM customer WHERE username = ? AND password = ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, username);
            pstmt.setString(2, password);
            ResultSet rs = pstmt.executeQuery();
            return rs.next(); // If a record is found, login is successful
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // In case of an error, return false
        }
    }

    public static boolean checkUsernameExists(String username) {
        String sql = "SELECT * FROM customer WHERE username = ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, username);
            ResultSet rs = pstmt.executeQuery();
            return rs.next(); // If a record is found, username exists
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // In case of an error, return false
        }
    }

    public static boolean registerCustomer(String username, String password, String name) {
        String sql = "INSERT INTO customer (username, password, name) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, username);
            pstmt.setString(2, password);
            pstmt.setString(3, name);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0; // If rows are affected, registration is successful
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // In case of an error, return false
        }
    }

    public static Customer getCustomerByUsername(String username) {
        String sql = "SELECT * FROM customer WHERE username = ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, username);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Customer customer = new Customer();
                customer.setId(rs.getInt("id"));
                customer.setUsername(rs.getString("username"));
                customer.setPassword(rs.getString("password"));
                customer.setName(rs.getString("name"));
                customer.setPhoneNumber(rs.getString("phonenumber"));
                customer.setAddress(rs.getString("address"));
                customer.setDateOfBirth(rs.getString("DOB"));
                return customer;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static boolean updateCustomer(Customer customer) {
        String sql = "UPDATE customer SET name = ?, DOB = ?, phonenumber = ?, address = ? WHERE username = ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, customer.getName());
            pstmt.setString(2, customer.getDateOfBirth());
            pstmt.setString(3, customer.getPhoneNumber());
            pstmt.setString(4, customer.getAddress());
            pstmt.setString(5, customer.getUsername());
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean updatePassword(String username, String newPassword) {
        String sql = "UPDATE customer SET password = ? WHERE username = ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, newPassword);
            pstmt.setString(2, username);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

}
