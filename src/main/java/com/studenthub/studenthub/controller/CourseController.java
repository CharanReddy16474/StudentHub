
package com.studenthub.studenthub.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studenthub.studenthub.dto.CourseResponse;
import com.studenthub.studenthub.service.CourseService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Display all available courses and enrollment statuses
    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAvailableCourses(
            Authentication authentication) {

        List<CourseResponse> courses =
                courseService.getAvailableCourses(
                        authentication.getName());

        return ResponseEntity.ok(courses);
    }

    // Display courses currently enrolled by the student
    @GetMapping("/mine")
    public ResponseEntity<List<CourseResponse>> getMyCourses(
            Authentication authentication) {

        List<CourseResponse> courses =
                courseService.getMyCourses(
                        authentication.getName());

        return ResponseEntity.ok(courses);
    }

    // Enroll the logged-in student in a course
    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<Map<String, String>> enrollInCourse(
            @PathVariable Integer courseId,
            Authentication authentication) {

        try {
            courseService.enrollInCourse(
                    authentication.getName(), courseId);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message",
                            "Successfully enrolled in the course."));

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            exception.getMessage()));
        }
    }

    // Withdraw the logged-in student from a course
    @PostMapping("/{courseId}/withdraw")
    public ResponseEntity<Map<String, String>> withdrawFromCourse(
            @PathVariable Integer courseId,
            Authentication authentication) {

        try {
            courseService.withdrawFromCourse(
                    authentication.getName(), courseId);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Successfully withdrawn from the course."));

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            exception.getMessage()));
        }
    }
}
