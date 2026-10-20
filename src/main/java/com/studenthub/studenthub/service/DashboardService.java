
package com.studenthub.studenthub.service;

import java.util.Locale;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studenthub.studenthub.dto.DashboardResponse;
import com.studenthub.studenthub.model.StudentProfile;
import com.studenthub.studenthub.model.User;
import com.studenthub.studenthub.repository.EnrollmentRepository;
import com.studenthub.studenthub.repository.StudentProfileRepository;
import com.studenthub.studenthub.repository.UserRepository;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final EnrollmentRepository enrollmentRepository;

    public DashboardService(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            EnrollmentRepository enrollmentRepository) {

        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(String email) {

        // Find the authenticated student's account
        String normalizedEmail =
                email.trim().toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Student account was not found."));

        // Find the student's profile
        StudentProfile profile =
                studentProfileRepository.findById(user.getId())
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Student profile was not found."));

        // Count the student's active course enrollments
        int enrolledCourseCount =
                enrollmentRepository
                        .findByStudentUserIdAndStatus(
                                user.getId(), "ENROLLED")
                        .size();

        // Prepare the response for the dashboard
        return new DashboardResponse(
                profile.getFullName(),
                profile.getStudentNumber(),
                profile.getDepartment(),
                profile.getSemester() == null
                        ? null
                        : profile.getSemester().intValue(),
                enrolledCourseCount
        );
    }
}
