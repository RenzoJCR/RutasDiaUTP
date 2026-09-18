package com.rutasdiautp.user.controller;

import com.rutasdiautp.auth.dto.UserResponse;
import com.rutasdiautp.user.dto.CreateAdminRequest;
import com.rutasdiautp.user.dto.UpdateUserStatusRequest;
import com.rutasdiautp.user.service.UserManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.rutasdiautp.user.dto.UpdateAdminRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserManagementService userManagementService;

    public AdminUserController(
            UserManagementService userManagementService
    ) {
        this.userManagementService =
                userManagementService;
    }

    @GetMapping("/mentors")
    public List<UserResponse> getMentors() {

        return userManagementService.getMentors();
    }

    @GetMapping("/admins")
    public List<UserResponse> getAdmins() {

        return userManagementService.getAdmins();
    }

    @PostMapping("/admins")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createAdmin(
            @Valid
            @RequestBody
            CreateAdminRequest request
    ) {

        return userManagementService
                .createAdmin(request);
    }

    @PutMapping("/admins/{adminId}")
    public UserResponse updateAdmin(
            @PathVariable Long adminId,
            @Valid
            @RequestBody
            UpdateAdminRequest request
    ) {

        return userManagementService
                .updateAdmin(
                        adminId,
                        request
                );
    }

    @PatchMapping("/admins/{adminId}/status")
    public UserResponse updateAdminStatus(
            @PathVariable Long adminId,
            @Valid
            @RequestBody
            UpdateUserStatusRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {

        return userManagementService
                .updateAdminStatus(
                        adminId,
                        request,
                        jwt.getSubject()
                );
    }

    @PatchMapping("/mentors/{mentorId}/status")
    public UserResponse updateMentorStatus(
            @PathVariable Long mentorId,
            @Valid
            @RequestBody
            UpdateUserStatusRequest request
    ) {

        return userManagementService
                .updateMentorStatus(
                        mentorId,
                        request
                );
    }
}