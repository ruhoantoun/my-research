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
import model.Stationery;

public class StationeryDAO {
    public static List<Stationery> getAllStationery() {
        List<Stationery> stationeryList = new ArrayList<>();
        String query = "SELECT * FROM stationery";
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                Stationery stationery = new Stationery();
                stationery.setId(rs.getInt("id"));
                stationery.setName(rs.getString("name"));
                stationery.setBrand(rs.getString("brand"));
                stationery.setImageSrc(rs.getString("ImageSrc"));
                stationery.setSellingPrice(rs.getDouble("sellingPrice"));
                stationery.setStationeryType(rs.getString("stationeryType"));
                stationeryList.add(stationery);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return stationeryList;
    }

    // FOR ADMINNNN !!!
    public static ObservableList<Stationery> stationeryDataList() {
        ObservableList<Stationery> listStationeries = FXCollections.observableArrayList();
        String sql = "SELECT * FROM stationery";

        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet result = stmt.executeQuery(sql)) {

            Stationery item;
            while (result.next()) {
                item = new Stationery(
                        result.getInt("id"),
                        result.getString("name"),
                        result.getInt("quantity"),
                        result.getDouble("purchasePrice"),
                        result.getDouble("sellingPrice"),
                        result.getString("brand"),
                        result.getString("stationeryType"));
                listStationeries.add(item);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listStationeries;
    }

    public static boolean addStationery(Admin_Menu_Controller controller) {
        String sql = "INSERT INTO stationery (id, name, quantity, purchasePrice, sellingPrice, brand, stationeryType) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?)";

        // Lấy dữ liệu từ controller
        String idText = controller.getAdd_stationery_id().getText();
        String name = controller.getAdd_stationery_name().getText();
        String quantityText = controller.getAdd_stationery_quantity().getText();
        String purchasePriceText = controller.getAdd_stationery_purchase_price().getText();
        String sellingPriceText = controller.getAdd_stationery_selling_price().getText();
        String brand = controller.getAdd_stationery_brand().getText();
        String type = controller.getAdd_stationery_type().getText();

        // Kiểm tra dữ liệu rỗng
        if (idText.isEmpty() || name.isEmpty() || quantityText.isEmpty()
                || purchasePriceText.isEmpty() || sellingPriceText.isEmpty()
                || brand.isEmpty() || type.isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập đầy đủ thông tin văn phòng phẩm.");
        }

        // Ép kiểu và kiểm tra định dạng
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

        // Thực hiện ghi vào DB
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.setString(2, name);
            stmt.setInt(3, quantity);
            stmt.setDouble(4, purchasePrice);
            stmt.setDouble(5, sellingPrice);
            stmt.setString(6, brand);
            stmt.setString(7, type);

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi cơ sở dữ liệu khi thêm văn phòng phẩm.");
        }
    }

    public static boolean deleteStationeryById(int id, int quantityToRemove) {
        String selectSql = "SELECT quantity FROM stationery WHERE id = ?";
        String updateSql = "UPDATE stationery SET quantity = ? WHERE id = ?";
        String deleteSql = "DELETE FROM stationery WHERE id = ?";

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
                throw new IllegalArgumentException("Không tìm thấy văn phòng phẩm với ID này.");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi xoá văn phòng phẩm.");
        }
    }

}
