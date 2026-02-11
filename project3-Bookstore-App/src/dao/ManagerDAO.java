package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ManagerDAO {
    public static boolean checkLogin(String username, String password) {
        String sql = "SELECT * FROM manager WHERE username = ? AND password = ?";
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
}
