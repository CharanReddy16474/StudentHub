
package com.studenthub.studenthub.service;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studenthub.studenthub.dto.RegistrationRequest;
import com.studenthub.studenthub.model.StudentProfile;
import com.studenthub.studenthub.model.User;
import com.studenthub.studenthub.repository.StudentProfileRepository;
import com.studenthub.studenthub.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void registerStudent(RegistrationRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        String studentNumber = request.getStudentNumber().trim();

        // Check whether the email already exists
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists.");
        }

        // Check whether the student number already exists
        if (studentProfileRepository
                .existsByStudentNumber(studentNumber)) {

            throw new IllegalArgumentException(
                    "This student number is already registered.");
        }

        // Verify that both passwords match
        if (!request.getPassword()
                .equals(request.getConfirmPassword())) {

            throw new IllegalArgumentException(
                    "Password and confirm password do not match.");
        }

        // Create the user account
        User user = new User();
        user.setEmail(email);

        // Store a BCrypt hash, never the plain-text password
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword()));

        // Save user first to generate its ID
        User savedUser = userRepository.save(user);

        // Create the student's profile using the same user ID
        StudentProfile profile = new StudentProfile();

        profile.setUserId(savedUser.getId());
        profile.setStudentNumber(studentNumber);
        profile.setFullName(request.getFullName().trim());
        profile.setPhone(
                request.getPhone() == null
                        || request.getPhone().isBlank()
                        ? null
                        : request.getPhone().trim());
        profile.setDepartment(request.getDepartment().trim());
        profile.setSemester(request.getSemester().byteValue());

        studentProfileRepository.save(profile);
    }
}
