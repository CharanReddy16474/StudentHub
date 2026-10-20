
package com.studenthub.studenthub.dto;

public class ProfileResponse {

    private String email;
    private String studentNumber;
    private String fullName;
    private String phone;
    private String department;
    private Integer semester;

    public ProfileResponse() {
    }

    public ProfileResponse(
            String email,
            String studentNumber,
            String fullName,
            String phone,
            String department,
            Integer semester) {

        this.email = email;
        this.studentNumber = studentNumber;
        this.fullName = fullName;
        this.phone = phone;
        this.department = department;
        this.semester = semester;
    }

    public String getEmail() {
        return email;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getDepartment() {
        return department;
    }

    public Integer getSemester() {
        return semester;
    }
}
