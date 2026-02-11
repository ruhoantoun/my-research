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
import model.Book;

public class BookDAO {
    public static List<Book> getBestSeller() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM book WHERE section = 'Best Seller'";
        // Execute the SQL query and retrieve the results
        // For each result, create a Book object and add it to the books list
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setName(rs.getString("name"));
                book.setAuthor(rs.getString("author"));
                book.setImageSrc(rs.getString("ImageSrc"));
                book.setSellingPrice(rs.getDouble("sellingPrice"));
                book.setIsbn(rs.getString("isbn"));
                book.setPublisher(rs.getString("publisher"));
                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    public static List<Book> getRecommendedForYou() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM book WHERE section = 'Recommended For You'";
        // Execute the SQL query and retrieve the results
        // For each result, create a Book object and add it to the books list
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setName(rs.getString("name"));
                book.setAuthor(rs.getString("author"));
                book.setImageSrc(rs.getString("ImageSrc"));
                book.setSellingPrice(rs.getDouble("sellingPrice"));
                book.setIsbn(rs.getString("isbn"));
                book.setPublisher(rs.getString("publisher"));
                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    public static List<Book> getSelfHelp() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM book WHERE genre = 'Self-help'";
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setName(rs.getString("name"));
                book.setAuthor(rs.getString("author"));
                book.setImageSrc(rs.getString("ImageSrc"));
                book.setSellingPrice(rs.getDouble("sellingPrice"));
                book.setIsbn(rs.getString("isbn"));
                book.setPublisher(rs.getString("publisher"));
                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    public static List<Book> getHorror() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM book WHERE genre = 'Horror'";
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setName(rs.getString("name"));
                book.setAuthor(rs.getString("author"));
                book.setImageSrc(rs.getString("ImageSrc"));
                book.setSellingPrice(rs.getDouble("sellingPrice"));
                book.setIsbn(rs.getString("isbn"));
                book.setPublisher(rs.getString("publisher"));
                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    public static List<Book> getAdventure() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM book WHERE genre = 'Adventure'";
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setName(rs.getString("name"));
                book.setAuthor(rs.getString("author"));
                book.setImageSrc(rs.getString("ImageSrc"));
                book.setSellingPrice(rs.getDouble("sellingPrice"));
                book.setIsbn(rs.getString("isbn"));
                book.setPublisher(rs.getString("publisher"));
                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    public static List<Book> getNovel() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM book WHERE genre = 'Novel'";
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setName(rs.getString("name"));
                book.setAuthor(rs.getString("author"));
                book.setImageSrc(rs.getString("ImageSrc"));
                book.setSellingPrice(rs.getDouble("sellingPrice"));
                book.setIsbn(rs.getString("isbn"));
                book.setPublisher(rs.getString("publisher"));
                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    public static List<Book> getFairyTale() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM book WHERE genre = 'Fairy Tale'";
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setName(rs.getString("name"));
                book.setAuthor(rs.getString("author"));
                book.setImageSrc(rs.getString("ImageSrc"));
                book.setSellingPrice(rs.getDouble("sellingPrice"));
                book.setIsbn(rs.getString("isbn"));
                book.setPublisher(rs.getString("publisher"));
                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    public static List<Book> getComic() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM book WHERE genre = 'Comic'";
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setName(rs.getString("name"));
                book.setAuthor(rs.getString("author"));
                book.setImageSrc(rs.getString("ImageSrc"));
                book.setSellingPrice(rs.getDouble("sellingPrice"));
                book.setIsbn(rs.getString("isbn"));
                book.setPublisher(rs.getString("publisher"));
                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    public static List<Book> getRomance() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM book WHERE genre = 'Romance'";
        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setName(rs.getString("name"));
                book.setAuthor(rs.getString("author"));
                book.setImageSrc(rs.getString("ImageSrc"));
                book.setSellingPrice(rs.getDouble("sellingPrice"));
                book.setIsbn(rs.getString("isbn"));
                book.setPublisher(rs.getString("publisher"));
                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    // FOR ADMINNNN !!!
    public static ObservableList<Book> bookDataList() {

        ObservableList<Book> listBooks = FXCollections.observableArrayList();
        String sql = "SELECT * FROM book";

        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet result = stmt.executeQuery(sql)) {

            Book book;

            while (result.next()) {
                book = new Book(
                        result.getInt("id"),
                        result.getString("name"),
                        result.getInt("quantity"),
                        result.getDouble("purchasePrice"),
                        result.getDouble("sellingPrice"),
                        result.getString("author"),
                        result.getString("publisher"),
                        result.getString("isbn"));
                listBooks.add(book);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listBooks;
    }

    public static boolean addNewBook(Admin_Menu_Controller controller) {
        String isbn = controller.getAdd_book_isbn().getText();

        if (isbn.isEmpty()) {
            throw new IllegalArgumentException("ISBN không được để trống.");
        }

        // Lấy dữ liệu khác
        String name = controller.getAdd_book_name().getText();
        String quantity = controller.getAdd_book_quantity().getText();
        String purchasePrice = controller.getAdd_book_purchase_price().getText();
        String sellingPrice = controller.getAdd_book_selling_price().getText();
        String publisher = controller.getAdd_book_publisher().getText();
        String author = controller.getAdd_book_author().getText();
        String genre = controller.getAdd_book_genre().getText();

        if (name.isEmpty() || quantity.isEmpty() || purchasePrice.isEmpty() || sellingPrice.isEmpty()
                || publisher.isEmpty() || author.isEmpty() || genre.isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập đầy đủ thông tin sách.");
        }

        int qty;
        double priceBuy, priceSell;
        try {
            qty = Integer.parseInt(quantity);
            priceBuy = Double.parseDouble(purchasePrice);
            priceSell = Double.parseDouble(sellingPrice);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Quantity, Purchase Price và Selling Price phải là số hợp lệ.");
        }

        try (Connection conn = DBConnection.getConnection()) {
            // Kiểm tra sách đã tồn tại chưa dựa vào isbn
            String checkSql = "SELECT quantity FROM book WHERE isbn = ?";
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                checkStmt.setString(1, isbn);
                ResultSet rs = checkStmt.executeQuery();

                if (rs.next()) {
                    // Sách đã tồn tại => cập nhật số lượng
                    int currentQty = rs.getInt("quantity");
                    int newQty = currentQty + qty;

                    String updateSql = "UPDATE book SET quantity = ? WHERE isbn = ?";
                    try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                        updateStmt.setInt(1, newQty);
                        updateStmt.setString(2, isbn);
                        return updateStmt.executeUpdate() > 0;
                    }
                } else {
                    // Sách chưa tồn tại => insert mới
                    String insertSql = "INSERT INTO book (name, quantity, purchasePrice, sellingPrice, publisher, author, isbn, genre) "
                            +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                        insertStmt.setString(1, name);
                        insertStmt.setInt(2, qty);
                        insertStmt.setDouble(3, priceBuy);
                        insertStmt.setDouble(4, priceSell);
                        insertStmt.setString(5, publisher);
                        insertStmt.setString(6, author);
                        insertStmt.setString(7, isbn);
                        insertStmt.setString(8, genre);
                        return insertStmt.executeUpdate() > 0;
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi cơ sở dữ liệu khi thêm/cập nhật sách.");
        }
    }

    public static boolean deleteBookById(int id, int qtyToRemove) {
        if (id <= 0 || qtyToRemove <= 0) {
            throw new IllegalArgumentException("ID hoặc số lượng xoá không hợp lệ.");
        }

        String checkSql = "SELECT quantity FROM book WHERE id = ?";
        String updateSql = "UPDATE book SET quantity = quantity - ? WHERE id = ?";
        String deleteSql = "DELETE FROM book WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
                PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {

            checkStmt.setInt(1, id);
            ResultSet rs = checkStmt.executeQuery();

            if (rs.next()) {
                int currentQty = rs.getInt("quantity");

                if (qtyToRemove < currentQty) {
                    // Giảm số lượng
                    try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                        updateStmt.setInt(1, qtyToRemove);
                        updateStmt.setInt(2, id);
                        return updateStmt.executeUpdate() > 0;
                    }
                } else if (qtyToRemove == currentQty) {
                    // Xoá hẳn
                    try (PreparedStatement deleteStmt = conn.prepareStatement(deleteSql)) {
                        deleteStmt.setInt(1, id);
                        return deleteStmt.executeUpdate() > 0;
                    }
                } else {
                    throw new IllegalArgumentException("Số lượng cần xoá lớn hơn số lượng hiện có.");
                }
            } else {
                throw new IllegalArgumentException("Không tìm thấy sách với ID này.");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi cơ sở dữ liệu khi xoá hoặc cập nhật sách.");
        }
    }

}
