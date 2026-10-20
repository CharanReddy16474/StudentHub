
package com.studenthub.studenthub.service;

import java.util.Locale;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studenthub.studenthub.dto.ChangePasswordRequest;
import com.studenthub.studenthub.dto.ProfileResponse;
import com.studenthub.studenthub.dto.ProfileUpdateRequest;
import com.studenthub.studenthub.model.StudentProfile;
import com.studenthub.studenthub.model.User;
import com.studenthub.studenthub.repository.StudentProfileRepository;
import com.studenthub.studenthub.repository.UserRepository;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Retrieve the authenticated student's profile
    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile(String email) {

        User user = findUserByEmail(email);

        StudentProfile profile =
                studentProfileRepository.findById(user.getId())
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Student profile was not found."));

        return convertToResponse(user, profile);
    }

    // Update permitted profile fields
    @Transactional
    public ProfileResponse updateMyProfile(
            String email,
            ProfileUpdateRequest request) {

        User user = findUserByEmail(email);

        StudentProfile profile =
                studentProfileRepository.findById(user.getId())
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Student profile was not found."));

        profile.setFullName(request.getFullName().trim());

        String phone = request.getPhone();

        if (phone == null || phone.isBlank()) {
            profile.setPhone(null);
        } else {
            profile.setPhone(phone.trim());
        }

        StudentProfile savedProfile =
                studentProfileRepository.save(profile);

        return convertToResponse(user, savedProfile);
    }

    // Change the authenticated student's password
    @Transactional
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        User user = findUserByEmail(email);

        // Verify the current password against its BCrypt hash
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPasswordHash())) {

            throw new IllegalArgumentException(
                    "Current password is incorrect.");
        }

        // Verify that the new passwords match
        if (!request.getNewPassword().equals(
                request.getConfirmNewPassword())) {

            throw new IllegalArgumentException(
                    "New password and confirmation do not match.");
        }

        // Prevent reusing the current password
        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPasswordHash())) {

            throw new IllegalArgumentException(
                    "Your new password must be different from the current password.");
        }

        // Hash the new password before saving it
        String newPasswordHash =
                passwordEncoder.encode(request.getNewPassword());

        user.setPasswordHash(newPasswordHash);

        userRepository.save(user);
    }

    // Find the account using the authenticated email
    private User findUserByEmail(String email) {

        String normalizedEmail =
                email.trim().toLowerCase(Locale.ROOT);

        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Student account was not found."));
    }

    // Convert database entities into a safe response DTO
    private ProfileResponse convertToResponse(
            User user,
            StudentProfile profile) {

        return new ProfileResponse(
                user.getEmail(),
                profile.getStudentNumber(),
                profile.getFullName(),
                profile.getPhone(),
                profile.getDepartment(),
                profile.getSemester() == null
                        ? null
                        : profile.getSemester().intValue()
        );
    }
}
