package controller;

import javafx.stage.Stage;
import java.io.IOException;
import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;

public class Login_11_Controller {
    private Stage stage;
    private Scene scene;
    private Parent root;

    public void loginCustomer(ActionEvent event) throws IOException {
        // Session.userRole = "customer";
        FXMLLoader loader = new FXMLLoader(getClass().getResource("../view/fxml/Login_1.2.fxml"));
        root = loader.load();

        stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        scene = new Scene(root);
        stage.setScene(scene);
        stage.show();
    }

    public void loginAdmin(ActionEvent event) throws IOException {
        // Session.userRole = "admin";
        FXMLLoader loader = new FXMLLoader(getClass().getResource("../view/fxml/Login_1.3.fxml"));
        root = loader.load();

        stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        scene = new Scene(root);
        stage.setScene(scene);
        stage.show();
    }

}
