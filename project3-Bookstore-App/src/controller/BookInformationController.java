package controller;

import java.io.IOException;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import model.Book;
import model.Cart;

public class BookInformationController {
    private Book book;

    @FXML
    private Label bookAuthor;

    @FXML
    private Label bookISBN;

    @FXML
    private ImageView bookImage;

    @FXML
    private Label bookName;

    @FXML
    private Label bookPrice;

    @FXML
    private Label bookPublisher;

    // Set Book Data
    public void setBookData(Book book) {
        this.book = book;
        bookAuthor.setText(book.getAuthor());
        bookISBN.setText(book.getIsbn());
        bookImage.setImage(new Image(book.getImageSrc()));
        bookName.setText(book.getName());
        bookPrice.setText(String.valueOf(book.getSellingPrice()));
        bookPublisher.setText(book.getPublisher());
        updateQuantityLabel();
    }

    // Back Button
    @FXML
    public void handleBackButton(ActionEvent event) {
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.close();
    }

    // Handle Amount of Book
    @FXML
    private Label quantityLabel;

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

    // Add to Cart
    @FXML
    private void handleAddToCart(MouseEvent event) {
        Cart cart = Cart.getInstance();
        cart.addProduct(book, quantity);
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.close();

    }
}
