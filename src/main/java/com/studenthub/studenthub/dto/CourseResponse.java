
package com.studenthub.studenthub.dto;

public class CourseResponse {

    private Integer id;
    private String courseCode;
    private String courseName;
    private String description;
    private Integer credits;
    private String enrollmentStatus;

    public CourseResponse() {
    }

    public CourseResponse(
            Integer id,
            String courseCode,
            String courseName,
            String description,
            Integer credits,
            String enrollmentStatus) {

        this.id = id;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.description = description;
        this.credits = credits;
        this.enrollmentStatus = enrollmentStatus;
    }

    public Integer getId() {
        return id;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public String getDescription() {
        return description;
    }

    public Integer getCredits() {
        return credits;
    }

    public String getEnrollmentStatus() {
        return enrollmentStatus;
    }
}
