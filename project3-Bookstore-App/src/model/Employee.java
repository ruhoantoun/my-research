package model;

public class Employee {
    private final int id;
    private final String name;
    private final String dob;
    private final String address;
    private final double salary;
    private final String image;
    private final String phone;
    private final String email;
    private String salaryStatus;

    public Employee(int id, String name, String dob, String address, double salary,
                    String image, String phone, String email, String salaryStatus) {
        this.id = id;
        this.name = name;
        this.dob = dob;
        this.address = address;
        this.salary = salary;
        this.image = image;
        this.phone = phone;
        this.email = email;
        this.salaryStatus = "UNPAID";
    }

    public String getSalaryStatus() {
        return salaryStatus;
    }

    public void setSalaryStatus(String salaryStatus) {
        this.salaryStatus = salaryStatus;
    }

    // Getter cho id
    public int getId() {
        return id;
    }

    // Getter cho name
    public String getName() {
        return name;
    }

    // Getter cho dob
    public String getDob() {
        return dob;
    }

    // Getter cho address
    public String getAddress() {
        return address;
    }

    // Getter cho salary
    public double getSalary() {
        return salary;
    }

    public String getImage() {
        return image;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }
}


