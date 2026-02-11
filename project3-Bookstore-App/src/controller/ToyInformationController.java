package controller;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.stage.Stage;
import model.Cart;
import model.Toy;

public class ToyInformationController {
    private Toy currentToy;

    @FXML
    private Label toyName;
    @FXML
    private Label toyPrice;
    @FXML
    private Label toyBrand;
    @FXML
    private Label toyAge;

    @FXML
    private ImageView toyImage;

    @FXML
    private Label quantityLabel;

    public void setData(Toy toy) {
        this.currentToy = toy;
        updateQuantityLabel();
        toyName.setText(currentToy.getName());
        toyPrice.setText(String.format("$%.2f", currentToy.getSellingPrice()));
        toyBrand.setText(currentToy.getBrand());
        toyAge.setText(currentToy.getSuitableAges());
        Image image = new Image(getClass().getResourceAsStream(currentToy.getImageSrc()));
        toyImage.setImage(image);
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
        cart.addProduct(currentToy, quantity);
        closeWindow();
    }

    // Handle Back
    @FXML
    private void handleBack(MouseEvent event) {
        closeWindow();
    }

    private void closeWindow() {
        Stage stage = (Stage) toyImage.getScene().getWindow();
        stage.close();
    }
}
