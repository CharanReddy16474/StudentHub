
package com.studenthub.studenthub.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studenthub.studenthub.dto.CourseResponse;
import com.studenthub.studenthub.model.Course;
import com.studenthub.studenthub.model.Enrollment;
import com.studenthub.studenthub.model.User;
import com.studenthub.studenthub.repository.CourseRepository;
import com.studenthub.studenthub.repository.EnrollmentRepository;
import com.studenthub.studenthub.repository.StudentProfileRepository;
import com.studenthub.studenthub.repository.UserRepository;

@Service
public class CourseService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseService(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository) {

        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // Retrieve all active courses and their enrollment status
    @Transactional(readOnly = true)
    public List<CourseResponse> getAvailableCourses(String email) {

        User student = findStudent(email);

        List<Course> courses = courseRepository.findByIsActiveTrue();
        List<CourseResponse> responses = new ArrayList<>();

        for (Course course : courses) {

            Optional<Enrollment> enrollment =
                    enrollmentRepository.findByStudentUserIdAndCourseId(
                            student.getId(), course.getId());

            String status = enrollment
                    .map(Enrollment::getStatus)
                    .orElse("AVAILABLE");

            responses.add(toResponse(course, status));
        }

        return responses;
    }

    // Retrieve courses currently enrolled by the student
    @Transactional(readOnly = true)
    public List<CourseResponse> getMyCourses(String email) {

        User student = findStudent(email);

        List<Enrollment> enrollments =
                enrollmentRepository.findByStudentUserIdAndStatus(
                        student.getId(), "ENROLLED");

        List<CourseResponse> responses = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {

            Course course = courseRepository.findById(
                    enrollment.getCourseId())
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "The enrolled course was not found."));

            responses.add(toResponse(course, enrollment.getStatus()));
        }

        return responses;
    }

    // Enroll the currently authenticated student in a course
    @Transactional
    public void enrollInCourse(String email, Integer courseId) {

        User student = findStudent(email);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Course not found."));

        if (!Boolean.TRUE.equals(course.getIsActive())) {
            throw new IllegalArgumentException(
                    "This course is not currently available.");
        }

        Optional<Enrollment> existingEnrollment =
                enrollmentRepository.findByStudentUserIdAndCourseId(
                        student.getId(), courseId);

        if (existingEnrollment.isPresent()) {

            Enrollment enrollment = existingEnrollment.get();

            if ("ENROLLED".equals(enrollment.getStatus())) {
                throw new IllegalArgumentException(
                        "You are already enrolled in this course.");
            }

            // Reactivate a previous withdrawn enrollment
            enrollment.setStatus("ENROLLED");
            enrollmentRepository.save(enrollment);

        } else {

            Enrollment enrollment = new Enrollment();

            enrollment.setStudentUserId(student.getId());
            enrollment.setCourseId(courseId);
            enrollment.setStatus("ENROLLED");

            enrollmentRepository.save(enrollment);
        }
    }

    // Withdraw the currently authenticated student from a course
    @Transactional
    public void withdrawFromCourse(String email, Integer courseId) {

        User student = findStudent(email);

        Enrollment enrollment =
                enrollmentRepository.findByStudentUserIdAndCourseId(
                        student.getId(), courseId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Enrollment not found."));

        if (!"ENROLLED".equals(enrollment.getStatus())) {
            throw new IllegalArgumentException(
                    "You are not currently enrolled in this course.");
        }

        enrollment.setStatus("WITHDRAWN");
        enrollmentRepository.save(enrollment);
    }

    // Find the account belonging to the authenticated student
    private User findStudent(String email) {

        String normalizedEmail =
                email.trim().toLowerCase(Locale.ROOT);

        User student = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Student account not found."));

        studentProfileRepository.findById(student.getId())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Student profile not found."));

        return student;
    }

    // Convert a Course entity into a safe frontend response
    private CourseResponse toResponse(
            Course course, String enrollmentStatus) {

        return new CourseResponse(
                course.getId(),
                course.getCourseCode(),
                course.getCourseName(),
                course.getDescription(),
                course.getCredits() == null
                        ? null
                        : course.getCredits().intValue(),
                enrollmentStatus
        );
    }
}
