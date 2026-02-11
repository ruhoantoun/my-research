package controller;

import java.io.IOException;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Stage;
import model.Toy;

public class ToyController {
    @FXML
    private Label toyName;
    @FXML
    private Label toyPrice;
    @FXML
    private Label toyBrand;
    @FXML
    private ImageView toyImage;

    @FXML
    private VBox box;

    private Toy currentToy;

    public void setData(Toy toy) {
        this.currentToy = toy;
        toyName.setText(toy.getName());
        toyPrice.setText(String.format("$%.2f", toy.getSellingPrice()));
        toyBrand.setText(toy.getBrand());

        Image image = new Image(getClass().getResourceAsStream(toy.getImageSrc()));
        toyImage.setImage(image);

        currentToy.setImageSrc(toy.getImageSrc());
        currentToy.setName(toy.getName());
        currentToy.setBrand(toy.getBrand());
        currentToy.setSellingPrice(toy.getSellingPrice());
        currentToy.setSuitableAges(toy.getSuitableAges());
        currentToy.setToyType(toy.getToyType());
    }

    @FXML
    public void showInfo(MouseEvent event) throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/view/fxml/Toy_Information.fxml"));
        Parent root = loader.load();

        ToyInformationController controller = loader.getController();
        controller.setData(currentToy);

        Stage popupStage = new Stage();
        popupStage.setTitle("Toy Information");
        popupStage.setScene(new Scene(root));
        popupStage.initModality(Modality.APPLICATION_MODAL);
        popupStage.showAndWait();
    }
}
