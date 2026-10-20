
package com.studenthub.studenthub.controller;

import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studenthub.studenthub.dto.ChangePasswordRequest;
import com.studenthub.studenthub.dto.ProfileResponse;
import com.studenthub.studenthub.dto.ProfileUpdateRequest;
import com.studenthub.studenthub.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // View the authenticated student's profile
    @GetMapping
    public ResponseEntity<ProfileResponse> getMyProfile(
            Authentication authentication) {

        ProfileResponse response =
                profileService.getMyProfile(
                        authentication.getName());

        return ResponseEntity.ok(response);
    }

    // Update the student's permitted profile details
    @PutMapping
    public ResponseEntity<ProfileResponse> updateMyProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            Authentication authentication) {

        ProfileResponse response =
                profileService.updateMyProfile(
                        authentication.getName(), request);

        return ResponseEntity.ok(response);
    }

    // Change the authenticated student's password
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        try {
            profileService.changePassword(
                    authentication.getName(), request);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Password changed successfully."
                    ));

        } catch (IllegalArgumentException exception) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            exception.getMessage()
                    ));
        }
    }
}
