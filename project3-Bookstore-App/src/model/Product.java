package model;

public abstract class Product {
	protected int id;
	protected String name;
	protected int quantity;
	protected double purchasePrice;
	protected double sellingPrice;
	protected String ImageSrc;

	public Product() {
	}

	public Product(int id, String name, int quantity, double purchasePrice, double sellingPrice) {
		this.id = id;
		this.name = name;
		this.quantity = quantity;
		this.purchasePrice = purchasePrice;
		this.sellingPrice = sellingPrice;
	}

	public void displayInfo() {
		System.out.println("ID: " + id);
		System.out.println("Name: " + name);
		System.out.println("Quantity: " + quantity);
		System.out.println("Purchase Price: " + purchasePrice);
		System.out.println("Selling Price: " + sellingPrice);
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getPurchasePrice() {
		return purchasePrice;
	}

	public void setPurchasePrice(double purchasePrice) {
		this.purchasePrice = purchasePrice;
	}

	public double getSellingPrice() {
		return sellingPrice;
	}

	public void setSellingPrice(double sellingPrice) {
		this.sellingPrice = sellingPrice;
	}

	public String getImageSrc() {
		return ImageSrc;
	}

	public void setImageSrc(String imageSrc) {
		ImageSrc = imageSrc;
	}

}
