package controller;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import utils.PopUpNoti;

public class Login_13_Controller {
    private Stage stage;
    private Scene scene;
    private Parent root;

    @FXML
    private TextField usernameField;
    @FXML
    private PasswordField passwordField;

    @FXML
    private void handleLoginBtnAction() {
        try {
            String username = usernameField.getText();
            String password = passwordField.getText();

            boolean isValidUser = dao.ManagerDAO.checkLogin(username, password);

            if (isValidUser) {
                // Load the customer menu scene
                FXMLLoader loader = new FXMLLoader(getClass().getResource("/view/fxml/Admin_Menu.fxml"));
                root = loader.load();

                // Get the current stage and set the new scene
                stage = (Stage) usernameField.getScene().getWindow();
                scene = new Scene(root);
                stage.setScene(scene);
                stage.show();
                stage.centerOnScreen();
            } else {
                PopUpNoti.showAlert("Invalid username or password. Please try again.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
