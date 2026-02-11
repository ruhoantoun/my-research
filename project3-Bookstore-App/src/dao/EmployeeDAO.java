package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
// import java.util.Optional;

import controller.Admin_Menu_Controller;
import controller.getData;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
// import javafx.scene.control.Alert;
// import javafx.scene.control.ButtonType;
// import javafx.scene.control.Label;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.image.ImageView;
import model.Employee;

public class EmployeeDAO {

    //FOR ADMINNNN !!!
    public static ObservableList<Employee>getEmployeeDataList() {

        ObservableList<Employee> listEmployees = FXCollections.observableArrayList();

        String sql = "SELECT * FROM employee";

        //connect = Database.connectDB();

        try (Connection conn = DBConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet result = stmt.executeQuery(sql)) {

            Employee anEmployee;

            while (result.next()) {
                anEmployee = new Employee(
                result.getInt("id"),
                result.getString("name"),
                result.getString("dob"),
                result.getString("address"),
                result.getDouble("salary"),
                result.getString("image"),
                result.getString("phone"),
                result.getString("email"),
                result.getString("status")  // đọc cột status từ DB
                );

                listEmployees.add(anEmployee);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listEmployees;
    }

    public static ObservableList<Employee> getPaymentDataList() {
    ObservableList<Employee> listEmployees = FXCollections.observableArrayList();

    String sql = "SELECT * FROM employee WHERE status = 'UNPAID'";

    try (Connection conn = DBConnection.getConnection();
         Statement stmt = conn.createStatement();
         ResultSet result = stmt.executeQuery(sql)) {

        Employee anEmployee;

        while (result.next()) {
            anEmployee = new Employee(
                result.getInt("id"),
                result.getString("name"),
                result.getString("dob"),
                result.getString("address"),
                result.getDouble("salary"),
                result.getString("image"),
                result.getString("phone"),
                result.getString("email"),
                result.getString("status")  // đọc cột status từ DB
            );

            listEmployees.add(anEmployee);
        }
    } catch (Exception e) {
        e.printStackTrace();
    }

    return listEmployees;
}


    

   
    @FXML
    private static TableView<Employee> employee_table;

      public static void loadEmployeeData() {
    // clear bảng
    employee_table.getItems().clear();
    Admin_Menu_Controller controller = new Admin_Menu_Controller();
    controller.showEmployee();
    }


public static boolean removeEmployee(Admin_Menu_Controller controller) {
    String sql = "DELETE FROM employee WHERE id = ?";

    try (Connection conn = DBConnection.getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {

        // Giả sử controller có phương thức lấy ID là getSelectedEmployeeId()
        int selectedId = controller.getSelectedEmployeeId();

        if (selectedId <= 0) {
            throw new IllegalArgumentException("Please select a valid employee to remove.");
        }

        stmt.setInt(1, selectedId);
        int affectedRows = stmt.executeUpdate();

        return affectedRows > 0;

    } catch (SQLException e) {
        e.printStackTrace();
        throw new RuntimeException("Failed to remove employee from the database.");
    }
}


    @FXML
    private TextField add_employee_name;
    @FXML
    private TextField add_employee_dob;
    @FXML
    private TextField add_employee_address;
    @FXML
    private TextField add_employee_salary;
    @FXML
    private TextField add_employee_number;
    @FXML
    private TextField add_employee_email;
    @FXML
    private TextField add_employee_image;
    @FXML
    private TextField add_employee_id;
    @FXML
    private ImageView profile_image;


    public void clearEmployeeData() {
       
        add_employee_name.clear();
        add_employee_dob.clear();
        add_employee_address.clear();
        add_employee_salary.clear();
        add_employee_number.clear();
        add_employee_email.clear();
        profile_image.setImage(null);
    }

    public static boolean addEmployee(Admin_Menu_Controller controller) {
    String sql = "INSERT INTO employee (id, name, dob, address, salary, image, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    // Lấy dữ liệu từ controller
    String idText = controller.getAdd_employee_id().getText();
    String name = controller.getAdd_employee_name().getText();
    String dobText = controller.getAdd_employee_dob().getText();
    String address = controller.getAdd_employee_address().getText();
    String salaryText = controller.getAdd_employee_salary().getText();
    String phone = controller.getAdd_employee_number().getText();
    String email = controller.getAdd_employee_email().getText();
    String imagePath = getData.path;

    // Kiểm tra rỗng
    if (idText.isEmpty() || name.isEmpty() || dobText.isEmpty() || address.isEmpty()
            || salaryText.isEmpty() || phone.isEmpty() || email.isEmpty()) {
        throw new IllegalArgumentException("Please complete all employee details.");
    }

    // Kiểm tra ngày sinh
    java.sql.Date dob;
    try {
        dob = java.sql.Date.valueOf(dobText);
    } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException("Invalid date format. Use yyyy-MM-dd (e.g., 2000-05-19).");
    }

    // Kiểm tra số điện thoại
    if (!phone.matches("\\d+")) {
        throw new IllegalArgumentException("Phone number must contain digits only.");
    }

    // Kiểm tra lương
    double salary;
    int id;
    try {
        salary = Double.parseDouble(salaryText);
        id = Integer.parseInt(idText);
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Salary and ID must be valid numbers.");
    }

    // Thêm vào DB
    try (Connection conn = DBConnection.getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {

        stmt.setInt(1, id);
        stmt.setString(2, name);
        stmt.setDate(3, dob);
        stmt.setString(4, address);
        stmt.setDouble(5, salary);
        stmt.setString(6, imagePath);
        stmt.setString(7, phone);
        stmt.setString(8, email);

        return stmt.executeUpdate() > 0;

    } catch (SQLException e) {
        e.printStackTrace();
        throw new RuntimeException("Database error while inserting employee.");
    }
}


    //PAYMENT
    public static void markAllEmployeesAsPaid() {
    String sql = "UPDATE employee SET status = 'PAID' WHERE status = 'UNPAID'";

    try (Connection conn = DBConnection.getConnection();
         PreparedStatement pstmt = conn.prepareStatement(sql)) {

        int rowsUpdated = pstmt.executeUpdate();
        System.out.println("Đã cập nhật " + rowsUpdated + " nhân viên sang trạng thái 'ĐÃ TRẢ LƯƠNG'.");

    } catch (SQLException e) {
        e.printStackTrace();
    }
}



}
