package controller;

import java.io.IOException;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Stage;
import model.Book;

public class BookController {
    private Book currentBook;

    @FXML
    private Label authorName;

    @FXML
    private ImageView bookImage;

    @FXML
    private Label bookName;

    @FXML
    private VBox box;

    @FXML
    private Label bookPrice;

    public void setData(Book book) {
        this.currentBook = book;
        Image image = new Image(getClass().getResourceAsStream(book.getImageSrc()));
        bookImage.setImage(image);
        bookName.setText(book.getName());
        authorName.setText(book.getAuthor());
        bookPrice.setText(String.valueOf(book.getSellingPrice()) + " $");

        currentBook.setImageSrc(book.getImageSrc());
        currentBook.setName(book.getName());
        currentBook.setAuthor(book.getAuthor());
        currentBook.setSellingPrice(book.getSellingPrice());
        currentBook.setIsbn(book.getIsbn());
        currentBook.setPublisher(book.getPublisher());
    }

    public void showInfo(MouseEvent event) throws IOException {
        // Load FXML cho cửa sổ phụ
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/view/fxml/Book_Information.fxml"));
        Parent root = loader.load();

        BookInformationController infoController = loader.getController();
        infoController.setBookData(currentBook);

        // Tạo Stage mới (cửa sổ phụ)
        Stage popupStage = new Stage();
        popupStage.setTitle("Book Information");
        popupStage.setScene(new Scene(root));
        popupStage.initModality(Modality.APPLICATION_MODAL); // Chặn thao tác với cửa sổ chính nếu muốn
        popupStage.showAndWait(); // show() nếu muốn cho phép thao tác song song
    }

}
