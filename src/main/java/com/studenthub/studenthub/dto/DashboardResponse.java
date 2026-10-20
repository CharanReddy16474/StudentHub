
package com.studenthub.studenthub.dto;

public class DashboardResponse {

    private String fullName;
    private String studentNumber;
    private String department;
    private Integer semester;
    private int enrolledCourseCount;

    public DashboardResponse() {
    }

    public DashboardResponse(
            String fullName,
            String studentNumber,
            String department,
            Integer semester,
            int enrolledCourseCount) {

        this.fullName = fullName;
        this.studentNumber = studentNumber;
        this.department = department;
        this.semester = semester;
        this.enrolledCourseCount = enrolledCourseCount;
    }

    public String getFullName() {
        return fullName;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public String getDepartment() {
        return department;
    }

    public Integer getSemester() {
        return semester;
    }

    public int getEnrolledCourseCount() {
        return enrolledCourseCount;
    }
}
