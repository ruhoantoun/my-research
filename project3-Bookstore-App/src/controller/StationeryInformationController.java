package controller;

import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.stage.Stage;
import model.Stationery;
import model.Cart;

public class StationeryInformationController {

    @FXML
    private ImageView stationeryImage;

    @FXML
    private Label stationeryName;

    @FXML
    private Label stationeryType;

    @FXML
    private Label stationeryBrand;

    @FXML
    private Label stationeryPrice;

    @FXML
    private Label quantityLabel;

    private Stationery currentStationery;

    public void setData(Stationery stationery) {
        this.currentStationery = stationery;
        updateQuantityLabel();
        stationeryImage.setImage(new Image(stationery.getImageSrc()));
        stationeryName.setText(stationery.getName());
        stationeryType.setText(stationery.getStationeryType());
        stationeryBrand.setText(stationery.getBrand());
        stationeryPrice.setText(String.format("$%.2f", stationery.getSellingPrice()));
    }

    // Handle Quantity
    private int quantity = 1;

    private void updateQuantityLabel() {
        quantityLabel.setText(String.format("%02d", quantity));
    }

    @FXML
    private void handleIncreaseButton(MouseEvent event) {
        quantity++;
        updateQuantityLabel();
    }

    @FXML
    private void handleDecreaseButton(MouseEvent event) {
        if (quantity > 1) {
            quantity--;
            updateQuantityLabel();
        }
    }

    // Handle Add to Cart
    @FXML
    private void handleAddToCart(MouseEvent event) {
        Cart cart = Cart.getInstance();
        cart.addProduct(currentStationery, quantity);
        closeWindow();
    }

    // Handle Back
    @FXML
    private void handleBack(MouseEvent event) {
        closeWindow();
    }

    private void closeWindow() {
        Stage stage = (Stage) stationeryImage.getScene().getWindow();
        stage.close();
    }
}
