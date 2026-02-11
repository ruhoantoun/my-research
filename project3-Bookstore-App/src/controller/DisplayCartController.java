package controller;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import model.Cart;
import model.Product;

public class DisplayCartController {
    @FXML
    private ImageView productImage;

    @FXML
    private Label productName;

    @FXML
    private Label productPrice;

    @FXML
    private Label productQuantity;

    @FXML
    private Label productSumCost;

    private Product product;
    private Cus_Menu parentMenu;

    public void setData(Product product, int quantity, Cus_Menu parentMenu) {
        this.product = product;
        this.parentMenu = parentMenu;
        productImage.setImage(new Image(product.getImageSrc()));
        productName.setText(product.getName());
        productPrice.setText(String.valueOf(product.getSellingPrice()) + " $");
        productQuantity.setText(String.valueOf(quantity));
        productSumCost.setText(String.valueOf(product.getSellingPrice() * quantity) + " $");
    }

    @FXML
    private void handleDelete(MouseEvent event) {
        Cart.getInstance().remove(product);
        parentMenu.updateCartView();
    }
}
