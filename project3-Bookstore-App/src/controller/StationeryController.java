package controller;

import java.io.IOException;
import java.net.URL;
import java.sql.SQLException;
import java.util.ResourceBundle;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Stage;
import model.Stationery;

public class StationeryController {
    private Stationery currentStationery;
    @FXML
    private VBox stationeryBox;

    @FXML
    private Label stationeryBrand;

    @FXML
    private ImageView stationeryImage;

    @FXML
    private Label stationeryName;

    @FXML
    private Label stationeryPrice;

    public void setData(Stationery stationery) {
        this.currentStationery = stationery;
        Image image = new Image(getClass().getResourceAsStream(stationery.getImageSrc()));
        stationeryImage.setImage(image);
        stationeryBrand.setText(stationery.getBrand());
        stationeryName.setText(stationery.getName());
        stationeryPrice.setText(String.format("$%.2f", stationery.getSellingPrice()));

        currentStationery = stationery;
        currentStationery.setImageSrc(stationery.getImageSrc());
        currentStationery.setName(stationery.getName());
        currentStationery.setBrand(stationery.getBrand());
        currentStationery.setSellingPrice(stationery.getSellingPrice());
        currentStationery.setStationeryType(stationery.getStationeryType());
    }

    public void showInfo(MouseEvent event) throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/view/fxml/Stationery_Information.fxml"));
        Parent root = loader.load();

        StationeryInformationController infoController = loader.getController();
        infoController.setData(currentStationery);

        Stage popupStage = new Stage();
        popupStage.setTitle("Stationery Information");
        popupStage.setScene(new Scene(root));
        popupStage.initModality(Modality.APPLICATION_MODAL);
        popupStage.showAndWait();
    }
}
