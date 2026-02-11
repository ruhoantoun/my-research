package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import controller.Admin_Menu_Controller;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import model.Toy;

public class ToyDAO {

    // FOR ADMINNNN !!!
    public static ObservableList<Toy> toyDataList() {
        ObservableList<Toy> listToys = FXCollections.observableArrayList();
        String sql = "SELECT * FROM toy";

        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet result = stmt.executeQuery(sql)) {

            Toy toy;
            while (result.next()) {
                toy = new Toy(
                        result.getInt("id"),
                        result.getString("name"),
                        result.getInt("quantity"),
                        result.getDouble("purchasePrice"),
                        result.getDouble("sellingPrice"),
                        result.getString("brand"),
                        result.getString("suitableAges"),
                        result.getString("toyType"));
                listToys.add(toy);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listToys;
    }

    public static boolean addToy(Admin_Menu_Controller controller) {
        String sql = "INSERT INTO toys (id, name, quantity, purchasePrice, sellingPrice, brand, suitableAges, toyType) "
                +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        // Lấy dữ liệu từ controller
        String idText = controller.getAdd_toy_id().getText();
        String name = controller.getAdd_toy_name().getText();
        String quantityText = controller.getAdd_toy_quantity().getText();
        String purchasePriceText = controller.getAdd_toy_purchase_price().getText();
        String sellingPriceText = controller.getAdd_toy_selling_price().getText();
        String brand = controller.getAdd_toy_brand().getText();
        String suitableAges = controller.getAdd_toy_suitable_age().getText();
        String toyType = controller.getAdd_toy_type().getText();

        // Kiểm tra dữ liệu rỗng
        if (idText.isEmpty() || name.isEmpty() || quantityText.isEmpty() ||
                purchasePriceText.isEmpty() || sellingPriceText.isEmpty() ||
                brand.isEmpty() || suitableAges.isEmpty() || toyType.isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập đầy đủ thông tin đồ chơi.");
        }

        // Chuyển đổi kiểu dữ liệu
        int id, quantity;
        double purchasePrice, sellingPrice;
        try {
            id = Integer.parseInt(idText);
            quantity = Integer.parseInt(quantityText);
            purchasePrice = Double.parseDouble(purchasePriceText);
            sellingPrice = Double.parseDouble(sellingPriceText);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("ID, số lượng, giá nhập và giá bán phải là số hợp lệ.");
        }

        // Ghi vào DB
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.setString(2, name);
            stmt.setInt(3, quantity);
            stmt.setDouble(4, purchasePrice);
            stmt.setDouble(5, sellingPrice);
            stmt.setString(6, brand);
            stmt.setString(7, suitableAges);
            stmt.setString(8, toyType);

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi hệ thống trong quá trình thêm đồ chơi.");
        }
    }

    public static boolean deleteToyById(int id, int quantityToRemove) {
        String selectSql = "SELECT quantity FROM toy WHERE id = ?";
        String updateSql = "UPDATE toy SET quantity = ? WHERE id = ?";
        String deleteSql = "DELETE FROM toy WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
                PreparedStatement selectStmt = conn.prepareStatement(selectSql)) {

            selectStmt.setInt(1, id);
            ResultSet rs = selectStmt.executeQuery();

            if (rs.next()) {
                int currentQty = rs.getInt("quantity");

                if (quantityToRemove > currentQty) {
                    throw new IllegalArgumentException("Số lượng xoá lớn hơn số lượng hiện có.");
                }

                if (quantityToRemove == currentQty) {
                    try (PreparedStatement deleteStmt = conn.prepareStatement(deleteSql)) {
                        deleteStmt.setInt(1, id);
                        return deleteStmt.executeUpdate() > 0;
                    }
                } else {
                    int newQty = currentQty - quantityToRemove;
                    try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                        updateStmt.setInt(1, newQty);
                        updateStmt.setInt(2, id);
                        return updateStmt.executeUpdate() > 0;
                    }
                }
            } else {
                throw new IllegalArgumentException("Không tìm thấy đồ chơi với ID này.");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi xoá đồ chơi.");
        }
    }

    public static List<Toy> getAllToy() {
        List<Toy> toys = new ArrayList<>();
        String query = "SELECT * FROM toy";
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                Toy toy = new Toy();
                toy.setId(rs.getInt("id"));
                toy.setName(rs.getString("name"));
                toy.setBrand(rs.getString("brand"));
                toy.setImageSrc(rs.getString("ImageSrc"));
                toy.setSellingPrice(rs.getDouble("sellingPrice"));
                toy.setSuitableAges(rs.getString("suitableAges"));
                toy.setToyType(rs.getString("toyType"));
                toys.add(toy);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return toys;
    }
}
