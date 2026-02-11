package model;

public class Book extends Product {
	private String publisher;
	private String author;
	private String isbn;

	public Book() {
		super();
	}

	public Book(int id, String name, int quantity, double purchasePrice, double sellingPrice,
		String publisher, String author, String isbn) {
		super(id, name, quantity, purchasePrice, sellingPrice);
		this.publisher = publisher;
		this.author = author;
		this.isbn = isbn;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

}
