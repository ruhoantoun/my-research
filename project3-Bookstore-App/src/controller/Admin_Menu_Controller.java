package controller;

import java.net.URL;

import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.ArrayList;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.ResourceBundle;
import java.util.function.Function;

import javax.swing.Action;

import javafx.scene.control.*;
import dao.BookDAO;

import dao.EmployeeDAO;
import dao.OrderDAO;
import dao.ToyDAO;
import dao.StationeryDAO;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.chart.BarChart;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import model.Book;
import model.Employee;
import model.Order;
import model.OtherCost;
import model.Stationery;
import model.Toy;

public class Admin_Menu_Controller implements Initializable {

    @FXML
    private HBox admin_box;

    @FXML
    private HBox attendances_box;

    @FXML
    private HBox dashboard_bar;

    @FXML
    private Button dashboard_button;

    @FXML
    private HBox dispactch_box;

    @FXML
    private Button e_add;

    @FXML
    private Button e_remove;

    @FXML
    private HBox employee_bar;

    @FXML
    private HBox employee_box;

    @FXML
    private Button employee_button;

    @FXML
    private VBox employee_page;

    @FXML
    private TableView<Employee> employee_table;

    @FXML
    private HBox joining_box;

    @FXML
    private HBox menu_bar;

    @FXML
    private Button menu_button;

    @FXML
    private VBox menu_page;

    @FXML
    private Pane menu_pane;

    @FXML
    private HBox odrer_box;

    @FXML
    private HBox order_bar;

    @FXML
    private Button order_button;

    @FXML
    private VBox order_page;

    @FXML
    private VBox dashboard_page;

    @FXML
    private HBox pending_box;

    @FXML
    private Pane search_bar;

    @FXML
    private Pane search_bar1;

    @FXML
    private Pane search_bar11;

    @FXML
    private TextField serach_field;

    @FXML
    private TextField serach_field1;

    @FXML
    private TextField serach_field11;

    @FXML
    private HBox sign_out;

    @FXML
    private Button sign_out_button;

    @FXML
    private HBox storage_bar;

    @FXML
    private Button storage_button;

    @FXML
    private TableColumn<Employee, Integer> id_col;

    @FXML
    private TableColumn<Employee, String> name_col;

    @FXML
    private TableColumn<Employee, String> dob_col;

    @FXML
    private TableColumn<Employee, String> address_col;

    @FXML
    private TableColumn<Employee, Double> salary_col;

    @FXML
    private Label totalEmployee_label;

    @FXML
    private Label take_dobLabel;

    @FXML
    private Label take_emailLabel;

    @FXML
    private Label take_nameLabel;

    @FXML
    private Label take_phoneLabel;

    @FXML
    private ImageView profile_image;

    @FXML
    private VBox storage_page;

    @FXML
    private TableColumn<Book, Integer> bookId_storage_col;

    @FXML
    private TableColumn<Book, String> bookIsbn_storage_col;

    @FXML
    private TableColumn<Book, String> bookName_storage_col;

    @FXML
    private TableColumn<Book, String> bookAuthor_storage_col;

    @FXML
    private TableColumn<Book, String> bookPublisher_storage_col;

    @FXML
    private TableColumn<Book, Double> bookPurchasePrice_storage_col;

    @FXML
    private TableColumn<Book, Double> bookSellingPrice_storage_col;

    @FXML
    private TableColumn<Book, Integer> bookQuantity_storage_col;

    @FXML
    private TableView<Book> books_table_storage;

    @FXML
    private TableView<Stationery> stationaries_table_storage;

    @FXML
    private TableView<Toy> toys_table_storage;

    @FXML
    private Button books_table_button;

    @FXML
    private Button stationaries_table_button;

    @FXML
    private Button toys_table_button;

    @FXML
    private TableColumn<Stationery, String> stationeryBrand_storage_col;

    @FXML
    private TableColumn<Stationery, Integer> stationeryId_storage_col;

    @FXML
    private TableColumn<Stationery, String> stationeryName_storage_col;

    @FXML
    private TableColumn<Stationery, Double> stationeryPruchasePrice_storage_col;

    @FXML
    private TableColumn<Stationery, Integer> stationeryQuantity_storage_col;

    @FXML
    private TableColumn<Stationery, Double> stationerySeliingPrice_storage_col;

    @FXML
    private TableColumn<Stationery, String> stationeryType_storage_col;

    @FXML
    private TableColumn<Toy, String> toyBrand_storage_col;

    @FXML
    private TableColumn<Toy, Integer> toyId_storage_col;

    @FXML
    private TableColumn<Toy, String> toyName_storage_col;
    @FXML
    private TableColumn<Toy, String> toyType_storage_col;

    @FXML
    private TableColumn<Toy, Double> toyPurchasePrice_storage_col;

    @FXML
    private TableColumn<Toy, Integer> toyQuantity_storage_col;

    @FXML
    private TableColumn<Toy, Double> toySellingPrice_storage_col;

    @FXML
    private TableColumn<Toy, String> toySuitableAge_storage_col;

    @FXML
    private Label totalEmployee_label_menu;

    @FXML
    private ComboBox<String> add_storage_button;

    @FXML
    private VBox toys_add_storage;

    @FXML
    private VBox books_add_storage;

    @FXML
    private VBox stationery_add_storage;

    @FXML
    private StackPane storage_add;

    @FXML
    private Button stationary_close_button;

    @FXML
    private Button book_close_button;

    @FXML
    private Button toy_close_button;

    @FXML
    private HBox function_under_storage;

    @FXML
    private VBox storage_table_view;

    @FXML
    private VBox setting_page;

    private Image image;

    @FXML
    private Label totalRevenueLabel;
    @FXML
    private Label totalProfitLabel;

    // OTHER COST
    public List<OtherCost> buildCosts() {
        return new ArrayList<>(List.of(
                new OtherCost("Điện", 320),
                new OtherCost("Nước", 350),
                new OtherCost("Thuê mặt bằng", 800),
                new OtherCost("Lương nhân viên", getTotalSalary())));
    }

    public double getTotalSalary() {
        double total = 0;
        List<Employee> employees = EmployeeDAO.getPaymentDataList();

        for (Employee emp : employees) {
            if ("UNPAID".equalsIgnoreCase(emp.getSalaryStatus())) {
                total += emp.getSalary();
            }
        }

        return total;
    }

    @FXML
    private Region bar10;
    @FXML
    private Region bar20;
    @FXML
    private Region bar30;
    @FXML
    private Region bar40;
    @FXML
    private Label cost1;
    @FXML
    private Label cost2;
    @FXML
    private Label cost3;
    @FXML
    private Label cost4;

    @FXML
    private Label total_otherCostLabel;
    @FXML
    private Label totalCost_BigLabel;

    private String formatCurrency(double amount) {
        Locale vietnam = Locale.forLanguageTag("vi-VN");
        NumberFormat nf = NumberFormat.getInstance(vietnam);
        return nf.format(amount) + " $";
    }

    // Add others as needed

    public void showOtherCosts(List<OtherCost> costs) {
        // Tổng chi phí
        double total = costs.stream().mapToDouble(OtherCost::getAmount).sum();

        // Gán vào label
        total_otherCostLabel.setText(total + " $");
        totalCost_BigLabel.setText(total + " $");

        // Đặt chiều rộng tối đa cho bar (bạn điều chỉnh nếu cần)
        double maxWidth = 200;

        // Danh sách các Region tương ứng
        List<Region> bars = List.of(bar10, bar20, bar30, bar40);

        // Cập nhật từng thanh
        for (int i = 0; i < bars.size() && i < costs.size(); i++) {
            double amount = costs.get(i).getAmount();
            double percent = amount / total;

            Region bar = bars.get(i);
            bar.setPrefWidth(maxWidth * percent);
            // bar.setStyle("-fx-background-color: linear-gradient(to right, #0057ff,
            // #00aaff);"
            // + "-fx-background-radius: 20px;");
        }

        List<Label> costLabels = List.of(cost1, cost2, cost3, cost4);

        for (int i = 0; i < costLabels.size(); i++) {
            if (i < costs.size()) {
                OtherCost cost = costs.get(i);
                costLabels.get(i).setText(cost.getType() + ": " + formatCurrency(cost.getAmount()));
            } else {
                costLabels.get(i).setText(""); // Xóa nếu không đủ dữ liệu
            }
        }
    }

    @FXML
    private Button setting_button;

    // SHOW MENU PAGE
    public void showMenuPage(ActionEvent event) {

        if (event.getSource() == dashboard_button) {

            order_page.setVisible(false);
            dashboard_page.setVisible(true);
            employee_page.setVisible(false);
            storage_page.setVisible(false);
            setting_page.setVisible(false);
        } else if (event.getSource() == order_button) {

            order_page.setVisible(true);
            dashboard_page.setVisible(false);
            employee_page.setVisible(false);
            storage_page.setVisible(false);
            setting_page.setVisible(false);
        } else if (event.getSource() == employee_button) {

            order_page.setVisible(false);
            dashboard_page.setVisible(false);
            employee_page.setVisible(true);
            storage_page.setVisible(false);
            setting_page.setVisible(false);
        } else if (event.getSource() == storage_button) {

            order_page.setVisible(false);
            dashboard_page.setVisible(false);
            employee_page.setVisible(false);
            storage_page.setVisible(true);
            setting_page.setVisible(false);
        } else if (event.getSource() == dashboard_button) {

            order_page.setVisible(false);
            dashboard_page.setVisible(true);
            employee_page.setVisible(false);
            storage_page.setVisible(false);
            setting_page.setVisible(false);
        } else if (event.getSource() == setting_button) {

            order_page.setVisible(false);
            dashboard_page.setVisible(false);
            employee_page.setVisible(false);
            storage_page.setVisible(false);
            setting_page.setVisible(true);
        }
    }

    private ObservableList<Employee> listEmployees;

    @FXML
    public void showEmployee() {

        listEmployees = EmployeeDAO.getEmployeeDataList();

        id_col.setCellValueFactory(new PropertyValueFactory<>("id"));
        name_col.setCellValueFactory(new PropertyValueFactory<>("name"));
        dob_col.setCellValueFactory(new PropertyValueFactory<>("dob"));
        address_col.setCellValueFactory(new PropertyValueFactory<>("address"));
        salary_col.setCellValueFactory(new PropertyValueFactory<>("salary"));
        employee_table.setItems(listEmployees);

        totalEmployee_label.setText("" + listEmployees.size());
        // totalEmployee_label_menu.setText(""+listEmployees.size());
    }

    @FXML
    private TableColumn<Employee, String> salary_pay_col;
    @FXML
    private TableColumn<Employee, String> name_pay_col;
    @FXML
    private TableColumn<Employee, Integer> id_pay_col;
    @FXML
    private TableView<Employee> employee_table1;
    @FXML
    private Label total_paymentLabel;

    @FXML
    public void showPayment() {

        listEmployees = EmployeeDAO.getPaymentDataList();

        id_pay_col.setCellValueFactory(new PropertyValueFactory<>("id"));
        name_pay_col.setCellValueFactory(new PropertyValueFactory<>("name"));
        salary_pay_col.setCellValueFactory(new PropertyValueFactory<>("salary"));

        employee_table1.setItems(listEmployees);
        double total = 0;
        for (Employee emp : listEmployees) {
            if ("UNPAID".equalsIgnoreCase(emp.getSalaryStatus())) {
                total += emp.getSalary();
            }
        }

        total_paymentLabel.setText(total + " VND");

        // totalEmployee_label_menu.setText(""+listEmployees.size());
    }

    public void selectEmployee() {

        Employee employeeData = employee_table.getSelectionModel().getSelectedItem();
        int num = employee_table.getSelectionModel().getSelectedIndex();

        if ((num - 1) < -1) {
            return;
        }
        take_nameLabel.setText(employeeData.getName());
        take_dobLabel.setText(employeeData.getDob());
        take_phoneLabel.setText(employeeData.getPhone());
        take_emailLabel.setText(employeeData.getEmail());

        String uri = "file:" + employeeData.getImage();

        image = new Image(uri, 150, 197, false, true);
        profile_image.setImage(image);

    }

    public Label getTake_nameLabel() {
        return take_nameLabel;
    }

    @FXML
    public void removeEmployee(ActionEvent event) {
        if (event.getSource() == e_remove) {
            try {
                // Gọi DAO chỉ xử lý SQL
                boolean removed = EmployeeDAO.removeEmployee(this);

                // Hiển thị thông báo tương ứng
                Alert alert;
                if (removed) {
                    alert = new Alert(Alert.AlertType.INFORMATION);
                    alert.setTitle("Thông báo");
                    alert.setHeaderText(null);
                    alert.setContentText("Đã xóa nhân viên thành công.");
                    alert.showAndWait();

                    showEmployee(); // Làm mới bảng nếu cần
                    showPayment();
                } else {
                    alert = new Alert(Alert.AlertType.WARNING);
                    alert.setTitle("Thông báo");
                    alert.setHeaderText(null);
                    alert.setContentText("Không tìm thấy nhân viên với tên đã nhập.");
                    alert.showAndWait();
                }
            } catch (IllegalArgumentException e) {
                // Trường hợp label chưa chọn hoặc null
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Lỗi");
                alert.setHeaderText(null);
                alert.setContentText(e.getMessage());
                alert.showAndWait();
            } catch (Exception e) {
                e.printStackTrace();
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Lỗi hệ thống");
                alert.setHeaderText(null);
                alert.setContentText("Đã xảy ra lỗi không mong muốn.");
                alert.showAndWait();
            }
        }
    }

    // SHOW ADD EMPLOYEE PAGE
    @FXML
    private VBox employee_add_page;

    @FXML
    private VBox employee_table_page;

    @FXML
    private Button confirm_add_employee_btn;

    @FXML
    private Button close_addwindow_employee_btn;

    public void showAddEmployeePage(ActionEvent event) {
        if (event.getSource() == e_add) {
            employee_table_page.setVisible(false);
            employee_add_page.setVisible(true);
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

    public TextField getAdd_employee_id() {
        return add_employee_id;
    }

    public TextField getAdd_employee_name() {
        return add_employee_name;
    }

    public TextField getAdd_employee_dob() {
        return add_employee_dob;
    }

    public TextField getAdd_employee_address() {
        return add_employee_address;
    }

    public TextField getAdd_employee_salary() {
        return add_employee_salary;
    }

    public TextField getAdd_employee_number() {
        return add_employee_number;
    }

    public TextField getAdd_employee_email() {
        return add_employee_email;
    }

    public int getSelectedEmployeeId() {
        Employee selectedEmployee = employee_table.getSelectionModel().getSelectedItem();

        if (selectedEmployee == null) {
            throw new IllegalArgumentException("Vui lòng chọn một nhân viên từ bảng.");
        }

        return selectedEmployee.getId();
    }

    public void addNewEmployee(ActionEvent event) {
        if (event.getSource() == confirm_add_employee_btn) {
            try {
                boolean success = EmployeeDAO.addEmployee(this);

                Alert alert;
                if (success) {
                    alert = new Alert(Alert.AlertType.INFORMATION);
                    alert.setTitle("Thông báo từ quản trị viên");
                    alert.setHeaderText(null);
                    alert.setContentText("Đã thêm nhân viên mới thành công!");
                    alert.showAndWait();

                    clearEmployeeData(); // Xóa form
                    showEmployee(); // Refresh bảng
                    showPayment(); // Refresh bảng thanh toán
                } else {
                    alert = new Alert(Alert.AlertType.WARNING);
                    alert.setTitle("Thông báo từ quản trị viên");
                    alert.setHeaderText(null);
                    alert.setContentText("Không thêm được nhân viên.");
                    alert.showAndWait();
                }

            } catch (IllegalArgumentException e) {
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Dữ liệu nhập không hợp lệ.");
                alert.setHeaderText(null);
                alert.setContentText(e.getMessage());
                alert.showAndWait();

            } catch (Exception e) {
                e.printStackTrace();
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Lỗi hệ thống.");
                alert.setHeaderText(null);
                alert.setContentText("Đã xảy ra lỗi không mong muốn khi thêm nhân viên.");
                alert.showAndWait();
            }
        }
        showPayment();
        showOtherCosts(buildCosts());
    }

    public void clearEmployeeData() {

        add_employee_name.clear();
        add_employee_dob.clear();
        add_employee_address.clear();
        add_employee_salary.clear();
        add_employee_number.clear();
        add_employee_email.clear();
        profile_image.setImage(null);
    }

    @FXML
    private Button employee_pay_button;

    @FXML
    private VBox employees_payment_table_page;

    public void showPaymentPage(ActionEvent event) {
        if (event.getSource() == employee_pay_button) {

            employee_table_page.setVisible(false);
            employees_payment_table_page.setVisible(true);
        }
    }

    @FXML
    private Button employee_back_button;

    public void backToEmployeePage(ActionEvent event) {
        if (event.getSource() == employee_back_button) {
            employees_payment_table_page.setVisible(false);
            employee_table_page.setVisible(true);
        }
    }

    @FXML
    private Button payment_button_employee;

    public void paySalary(ActionEvent event) {
        showPayment();
        if (event.getSource() == payment_button_employee) {

            EmployeeDAO.markAllEmployeesAsPaid();

            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle("Thông báo");
            alert.setHeaderText(null);
            alert.setContentText("Tất cả nhân viên đã được trả lương.");
            alert.showAndWait();

            showPayment();
            showOtherCosts(buildCosts());

        }
    }

    // SHOW STORAGE PAGE
    public void showStoragePage(ActionEvent event) {
        if (event.getSource() == books_table_button) {
            books_table_storage.setVisible(true);
            toys_table_storage.setVisible(false);
            stationaries_table_storage.setVisible(false);
        } else if (event.getSource() == toys_table_button) {
            books_table_storage.setVisible(false);
            toys_table_storage.setVisible(true);
            stationaries_table_storage.setVisible(false);
        } else if (event.getSource() == stationaries_table_button) {
            books_table_storage.setVisible(false);
            toys_table_storage.setVisible(false);
            stationaries_table_storage.setVisible(true);
        }
    }

    // SHOW BOOK TABLE

    private ObservableList<Book> listBooks;

    public void showBook() {
        listBooks = BookDAO.bookDataList();

        bookId_storage_col.setCellValueFactory(new PropertyValueFactory<>("id"));
        bookIsbn_storage_col.setCellValueFactory(new PropertyValueFactory<>("isbn"));
        bookName_storage_col.setCellValueFactory(new PropertyValueFactory<>("name"));
        bookAuthor_storage_col.setCellValueFactory(new PropertyValueFactory<>("author"));
        bookPublisher_storage_col.setCellValueFactory(new PropertyValueFactory<>("publisher"));
        bookPurchasePrice_storage_col.setCellValueFactory(new PropertyValueFactory<>("purchasePrice"));
        bookSellingPrice_storage_col.setCellValueFactory(new PropertyValueFactory<>("sellingPrice"));
        bookQuantity_storage_col.setCellValueFactory(new PropertyValueFactory<>("quantity"));
        books_table_storage.setItems(listBooks);
        // totalBook_label.setText("" + listBooks.size());
    }

    // ADD BOOK
    @FXML
    private TextField add_book_id;
    @FXML
    private TextField add_book_name;
    @FXML
    private TextField add_book_quantity;
    @FXML
    private TextField add_book_purchase_price;
    @FXML
    private TextField add_book_selling_price;
    @FXML
    private TextField add_book_author;
    @FXML
    private TextField add_book_publisher;
    @FXML
    private TextField add_book_isbn;
    @FXML
    private TextField add_book_genre;
    @FXML
    private Button add_book_button;

    private void clearBookFields() {
        add_book_id.clear();
        add_book_name.clear();
        add_book_quantity.clear();
        add_book_purchase_price.clear();
        add_book_selling_price.clear();
        add_book_publisher.clear();
        add_book_author.clear();
        add_book_isbn.clear();
        add_book_genre.clear();
    }

    public TextField getAdd_book_id() {
        return add_book_id;
    }

    public TextField getAdd_book_name() {
        return add_book_name;
    }

    public TextField getAdd_book_quantity() {
        return add_book_quantity;
    }

    public TextField getAdd_book_purchase_price() {
        return add_book_purchase_price;
    }

    public TextField getAdd_book_selling_price() {
        return add_book_selling_price;
    }

    public TextField getAdd_book_publisher() {
        return add_book_publisher;
    }

    public TextField getAdd_book_author() {
        return add_book_author;
    }

    public TextField getAdd_book_isbn() {
        return add_book_isbn;
    }

    public TextField getAdd_book_genre() {
        return add_book_genre;
    }

    @FXML
    public void addNewBook(ActionEvent event) {
        if (event.getSource() == add_book_button) {
            try {
                // Gọi DAO để thêm sách, nếu lỗi input sẽ ném ra
                boolean success = BookDAO.addNewBook(this);

                Alert alert;
                if (success) {
                    alert = new Alert(Alert.AlertType.INFORMATION);
                    alert.setTitle("Thông báo từ quản trị viên");
                    alert.setHeaderText(null);
                    alert.setContentText("Đã thêm sách mới thành công!");
                    alert.showAndWait();

                    clearBookFields(); // Xóa form
                    loadBookData(); // Refresh bảng
                } else {
                    alert = new Alert(Alert.AlertType.WARNING);
                    alert.setTitle("Thông báo từ quản trị viên");
                    alert.setHeaderText(null);
                    alert.setContentText("Không thêm được sách.");
                    alert.showAndWait();
                }

            } catch (IllegalArgumentException e) {
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Dữ liệu nhập không hợp lệ");
                alert.setHeaderText(null);
                alert.setContentText(e.getMessage());
                alert.showAndWait();

            } catch (Exception e) {
                e.printStackTrace();
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Lỗi hệ thống");
                alert.setHeaderText(null);
                alert.setContentText("Đã xảy ra lỗi không mong muốn khi thêm sách.");
                alert.showAndWait();
            }
        }
    }

    public void loadBookData() {
        // clear bảng
        books_table_storage.getItems().clear();
        showBook();

    }

    private void handleRemoveWithQuantity(
            String itemType,
            String itemName,
            int currentQty,
            Function<Integer, Boolean> deleteFunction,
            Runnable reloadFunction) {
        TextInputDialog dialog = new TextInputDialog();
        dialog.setTitle("Xoá " + itemType);
        dialog.setHeaderText("Tên: " + itemName + "\nSố lượng hiện có: " + currentQty);
        dialog.setContentText("Nhập số lượng muốn xoá:");

        Optional<String> result = dialog.showAndWait();

        result.ifPresent(input -> {
            try {
                int qtyToRemove = Integer.parseInt(input);

                if (qtyToRemove <= 0) {
                    showError("Vui lòng nhập số lượng > 0.");
                    return;
                }

                if (qtyToRemove > currentQty) {
                    showError("Số lượng xoá lớn hơn số lượng hiện có.");
                    return;
                }

                if (confirmDelete("Bạn có chắc muốn xoá " + qtyToRemove + " " + itemType + " này?")) {
                    boolean success = deleteFunction.apply(qtyToRemove);
                    if (success) {
                        showInfo("Xoá " + itemType + " thành công.");
                        reloadFunction.run();
                    } else {
                        showError("Xoá " + itemType + " thất bại.");
                    }
                }

            } catch (NumberFormatException e) {
                showError("Vui lòng nhập số hợp lệ.");
            }
        });
    }

    public void removeSelectedItem() {
        if (books_table_storage.isVisible() && books_table_storage.getSelectionModel().getSelectedItem() != null) {
            Book selectedBook = books_table_storage.getSelectionModel().getSelectedItem();
            handleRemoveWithQuantity(
                    "sách",
                    selectedBook.getName(),
                    selectedBook.getQuantity(),
                    qty -> BookDAO.deleteBookById(selectedBook.getId(), qty),
                    this::loadBookData);

        } else if (toys_table_storage.isVisible() && toys_table_storage.getSelectionModel().getSelectedItem() != null) {
            Toy selectedToy = toys_table_storage.getSelectionModel().getSelectedItem();
            handleRemoveWithQuantity(
                    "đồ chơi",
                    selectedToy.getName(),
                    selectedToy.getQuantity(),
                    qty -> ToyDAO.deleteToyById(selectedToy.getId(), qty),
                    this::loadToyData);

        } else if (stationaries_table_storage.isVisible()
                && stationaries_table_storage.getSelectionModel().getSelectedItem() != null) {
            Stationery selectedStationery = stationaries_table_storage.getSelectionModel().getSelectedItem();
            handleRemoveWithQuantity(
                    "văn phòng phẩm",
                    selectedStationery.getName(),
                    selectedStationery.getQuantity(),
                    qty -> StationeryDAO.deleteStationeryById(selectedStationery.getId(), qty),
                    this::loadStationeryData);

        } else {
            showError("Vui lòng chọn mục cần xoá.");
        }
    }

    private boolean confirmDelete(String message) {
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle("Xác nhận xoá");
        alert.setHeaderText(null);
        alert.setContentText(message);

        Optional<ButtonType> result = alert.showAndWait();
        return result.isPresent() && result.get() == ButtonType.OK;
    }

    private void showInfo(String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Thông báo");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private void showError(String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Lỗi");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    // SHOW TOY TABLE

    private ObservableList<Toy> listToys;

    public void showToy() {
        listToys = ToyDAO.toyDataList();

        toyId_storage_col.setCellValueFactory(new PropertyValueFactory<>("id"));
        toyName_storage_col.setCellValueFactory(new PropertyValueFactory<>("name"));
        toyQuantity_storage_col.setCellValueFactory(new PropertyValueFactory<>("quantity"));
        toyType_storage_col.setCellValueFactory(new PropertyValueFactory<>("toyType"));
        toyPurchasePrice_storage_col.setCellValueFactory(new PropertyValueFactory<>("purchasePrice"));
        toySellingPrice_storage_col.setCellValueFactory(new PropertyValueFactory<>("sellingPrice"));
        toyBrand_storage_col.setCellValueFactory(new PropertyValueFactory<>("brand"));
        toySuitableAge_storage_col.setCellValueFactory(new PropertyValueFactory<>("suitableAges"));
        // Nếu có toyType:
        // toyType_storage_col.setCellValueFactory(new
        // PropertyValueFactory<>("toyType"));

        toys_table_storage.setItems(listToys);
    }

    public void loadToyData() {
        toys_table_storage.getItems().clear();
        showToy();
    }

    // ADD TOY
    @FXML
    private TextField add_toy_id;
    @FXML
    private TextField add_toy_name;
    @FXML
    private TextField add_toy_quantity;
    @FXML
    private TextField add_toy_purchase_price;
    @FXML
    private TextField add_toy_selling_price;
    @FXML
    private TextField add_toy_brand;
    @FXML
    private TextField add_toy_suitable_age;
    @FXML
    private TextField add_toy_type;
    @FXML
    private TextField add_toy_image;
    @FXML
    private Button add_toy_button;

    public void clearToyData() {

        add_toy_id.clear();
        add_toy_name.clear();
        add_toy_quantity.clear();
        add_toy_purchase_price.clear();
        add_toy_selling_price.clear();
        add_toy_brand.clear();
        add_toy_suitable_age.clear();
        add_toy_type.clear();
    }

    public TextField getAdd_toy_id() {
        return add_toy_id;
    }

    public TextField getAdd_toy_name() {
        return add_toy_name;
    }

    public TextField getAdd_toy_quantity() {
        return add_toy_quantity;
    }

    public TextField getAdd_toy_purchase_price() {
        return add_toy_purchase_price;
    }

    public TextField getAdd_toy_selling_price() {
        return add_toy_selling_price;
    }

    public TextField getAdd_toy_brand() {
        return add_toy_brand;
    }

    public TextField getAdd_toy_suitable_age() {
        return add_toy_suitable_age;
    }

    public TextField getAdd_toy_type() {
        return add_toy_type;
    }

    @FXML
    public void addNewToy(ActionEvent event) {
        if (event.getSource() == add_toy_button) { // Đảm bảo `toy_add_button` đúng tên biến nút
            try {
                // boolean success = ToyDAO.addToy(this);

                Alert alert = new Alert(Alert.AlertType.INFORMATION);
                alert.setTitle("Thông báo từ quản trị viên");
                alert.setHeaderText(null);
                alert.setContentText("Thêm đồ chơi thành công!");
                alert.showAndWait();

                clearToyData(); // reset form
                showToy(); // cập nhật bảng

            } catch (IllegalArgumentException e) {
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Lỗi dữ liệu");
                alert.setHeaderText(null);
                alert.setContentText(e.getMessage());
                alert.showAndWait();

            } catch (Exception e) {
                e.printStackTrace();
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Lỗi hệ thống");
                alert.setHeaderText(null);
                alert.setContentText("Đã xảy ra lỗi trong quá trình thêm đồ chơi.");
                alert.showAndWait();
            }
        }
    }

    // ADD STATIONERY
    @FXML
    private TextField add_stationery_id;
    @FXML
    private TextField add_stationery_name;
    @FXML
    private TextField add_stationery_quantity;
    @FXML
    private TextField add_stationery_purchase_price;
    @FXML
    private TextField add_stationery_selling_price;
    @FXML
    private TextField add_stationery_brand;
    @FXML
    private TextField add_stationery_type;
    @FXML
    private Button add_stationary_button;

    private void clearStationeryFields() {
        add_stationery_id.clear();
        add_stationery_name.clear();
        add_stationery_quantity.clear();
        add_stationery_purchase_price.clear();
        add_stationery_selling_price.clear();
        add_stationery_brand.clear();
        add_stationery_type.clear();
    }

    public TextField getAdd_stationery_id() {
        return add_stationery_id;
    }

    public TextField getAdd_stationery_name() {
        return add_stationery_name;
    }

    public TextField getAdd_stationery_quantity() {
        return add_stationery_quantity;
    }

    public TextField getAdd_stationery_purchase_price() {
        return add_stationery_purchase_price;
    }

    public TextField getAdd_stationery_selling_price() {
        return add_stationery_selling_price;
    }

    public TextField getAdd_stationery_brand() {
        return add_stationery_brand;
    }

    public TextField getAdd_stationery_type() {
        return add_stationery_type;
    }

    @FXML
    public void addNewStationery(ActionEvent event) {
        if (event.getSource() == add_stationary_button) { // Đảm bảo đúng tên biến button
            try {
                // boolean success = StationeryDAO.addStationery(this);

                Alert alert = new Alert(Alert.AlertType.INFORMATION);
                alert.setTitle("Thông báo");
                alert.setHeaderText(null);
                alert.setContentText("Thêm văn phòng phẩm thành công!");
                alert.showAndWait();

                clearStationeryFields(); // reset form
                showStationery(); // load lại bảng

            } catch (IllegalArgumentException e) {
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Lỗi dữ liệu");
                alert.setHeaderText(null);
                alert.setContentText(e.getMessage());
                alert.showAndWait();

            } catch (Exception e) {
                e.printStackTrace();
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Lỗi hệ thống");
                alert.setHeaderText(null);
                alert.setContentText("Đã xảy ra lỗi khi thêm văn phòng phẩm.");
                alert.showAndWait();
            }
        }
    }

    // SHOW STATIONERY TABLE
    private ObservableList<Stationery> listStationeries;

    public void showStationery() {
        listStationeries = StationeryDAO.stationeryDataList();

        stationeryId_storage_col.setCellValueFactory(new PropertyValueFactory<>("id"));
        stationeryName_storage_col.setCellValueFactory(new PropertyValueFactory<>("name"));
        stationeryQuantity_storage_col.setCellValueFactory(new PropertyValueFactory<>("quantity"));
        stationeryPruchasePrice_storage_col.setCellValueFactory(new PropertyValueFactory<>("purchasePrice"));
        stationerySeliingPrice_storage_col.setCellValueFactory(new PropertyValueFactory<>("sellingPrice"));
        stationeryBrand_storage_col.setCellValueFactory(new PropertyValueFactory<>("brand"));
        stationeryType_storage_col.setCellValueFactory(new PropertyValueFactory<>("stationeryType"));

        stationaries_table_storage.setItems(listStationeries);
    }

    public void loadStationeryData() {
        stationaries_table_storage.getItems().clear();
        showStationery();
    }

    private String comboBox[] = { "Book", "Stationery", "Toy" };

    public void TypeItem() {
        List<String> combo = new ArrayList<>();

        for (String data : comboBox) {
            combo.add(data);
        }

        ObservableList list = FXCollections.observableArrayList(combo);
        add_storage_button.setItems(list);
        add_storage_button.setPromptText("Add...");
    }

    // Open Add Window
    public void addStorage() {
        if (add_storage_button.getValue().equals("Book")) {
            books_add_storage.setVisible(true);
            stationery_add_storage.setVisible(false);
            toys_add_storage.setVisible(false);

            storage_table_view.setVisible(false);
            storage_add.setVisible(true);
            function_under_storage.setVisible(false);

        } else if (add_storage_button.getValue().equals("Stationery")) {
            books_add_storage.setVisible(false);
            stationery_add_storage.setVisible(true);
            toys_add_storage.setVisible(false);

            storage_table_view.setVisible(false);
            storage_add.setVisible(true);
            function_under_storage.setVisible(false);

        } else if (add_storage_button.getValue().equals("Toy")) {
            books_add_storage.setVisible(false);
            stationery_add_storage.setVisible(false);
            toys_add_storage.setVisible(true);

            storage_table_view.setVisible(false);
            storage_add.setVisible(true);
            function_under_storage.setVisible(false);
        }
    }

    public void closeAddWindow(ActionEvent event) {
        if (event.getSource() == stationary_close_button) {

            books_table_storage.setVisible(false);
            toys_table_storage.setVisible(false);
            stationaries_table_storage.setVisible(true);
            storage_add.setVisible(false);
            function_under_storage.setVisible(true);
            storage_table_view.setVisible(true);

        } else if (event.getSource() == book_close_button) {

            books_table_storage.setVisible(true);
            toys_table_storage.setVisible(false);
            stationaries_table_storage.setVisible(false);
            storage_add.setVisible(false);
            function_under_storage.setVisible(true);
            storage_table_view.setVisible(true);

        } else if (event.getSource() == toy_close_button) {

            books_table_storage.setVisible(false);
            toys_table_storage.setVisible(true);
            stationaries_table_storage.setVisible(false);
            storage_add.setVisible(false);
            function_under_storage.setVisible(true);
            storage_table_view.setVisible(true);

        } else if (event.getSource() == close_addwindow_employee_btn) {
            employee_table_page.setVisible(true);
            employee_add_page.setVisible(false);
        }
        add_storage_button.setValue(null);

    }

    // LOGOUT
    @FXML
    public void logout(ActionEvent event) {
        try {
            if (event.getSource() == sign_out_button) {
                // TO SWAP FROM DASHBOARD TO LOGIN FORM
                Parent root = FXMLLoader.load(getClass().getResource("/view/fxml/Login_1.1.fxml"));

                Stage stage = new Stage();
                Scene scene = new Scene(root);

                stage.initStyle(StageStyle.TRANSPARENT);

                stage.setScene(scene);
                stage.show();

                sign_out_button.getScene().getWindow().hide();

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // @override
    @Override
    public void initialize(URL location, ResourceBundle resources) {
        // TODO Auto-generated method stub

        showEmployee();

        showBook();

        showToy();

        showStationery();

        TypeItem();

        showPayment();

        showOtherCosts(buildCosts());

        showOrder();

        totalOrderLabel.setText(String.valueOf(OrderDAO.getTotalOrder()));
        totalOrderPendingLabel.setText(String.valueOf(OrderDAO.getTotalOrderPending()));
        totalOrderDispatchedLabel.setText(String.valueOf(OrderDAO.getTotalOrderDispatched()));
        double revenue = OrderDAO.getTotalRevenue();
        double cost = Double.parseDouble(totalCost_BigLabel.getText().replace("$", "").trim());
        double profit = revenue - cost;

        totalRevenueLabel.setText(String.format("%.2f $", revenue));
        totalProfitLabel.setText(String.format("%.2f $", profit));

        Platform.runLater(this::showRevenueChart); // Gắn CSS cho BarChart
        revenueChart.getStylesheets().add(getClass().getResource("/view/css/chart-style.css").toExternalForm());
    }

    // SHOW ORDER TABLE

    @FXML
    private TableView<Order> orderTable;
    @FXML
    private TableColumn<Order, Integer> orderId_col;
    @FXML
    private TableColumn<Order, String> customerName_col;
    @FXML
    private TableColumn<Order, String> orderDate_col;
    @FXML
    private TableColumn<Order, Double> totalAmount_col;
    @FXML
    private TableColumn<Order, String> paymentMethod_col;
    @FXML
    private TableColumn<Order, String> address_col2;
    @FXML
    private TableColumn<Order, String> order_status_col;
    @FXML
    private Label totalOrderLabel;
    @FXML
    private Label totalOrderPendingLabel;
    @FXML
    private Label totalOrderDispatchedLabel;

    ObservableList<Order> listOrders = FXCollections.observableArrayList();

    public void showOrder() {
        List<Order> orders = OrderDAO.getAllOrders();
        orderId_col.setCellValueFactory(new PropertyValueFactory<>("orderId"));
        customerName_col.setCellValueFactory(new PropertyValueFactory<>("customerName"));
        orderDate_col.setCellValueFactory(new PropertyValueFactory<>("orderDate"));
        totalAmount_col.setCellValueFactory(new PropertyValueFactory<>("totalAmount"));
        paymentMethod_col.setCellValueFactory(new PropertyValueFactory<>("paymentMethod"));
        address_col2.setCellValueFactory(new PropertyValueFactory<>("shippingAddress"));
        order_status_col.setCellValueFactory(new PropertyValueFactory<>("status"));
        listOrders = FXCollections.observableArrayList(orders);
        orderTable.setItems(listOrders);
    }

    // REVENUE CHART
    @FXML
    private BarChart<String, Number> revenueChart;

    @FXML
    private CategoryAxis dateAxis;

    @FXML
    private NumberAxis revenueAxis;

    private void showRevenueChart() {
        revenueChart.getData().clear();
        List<Map<String, Object>> revenueData = OrderDAO.getRevenueByDate();
        System.out.println("Revenue data: " + revenueData);
        XYChart.Series<String, Number> series = new XYChart.Series<>();
        series.setName("Revenue");
        series.getData().add(new XYChart.Data<>("2025-05-28", 128.11));
        revenueChart.getData().add(series);
    }

}
