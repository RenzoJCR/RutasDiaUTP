package com.rutasdiautp.user.controller;

import com.rutasdiautp.auth.dto.UserResponse;
import com.rutasdiautp.user.dto.CreateAdminRequest;
import com.rutasdiautp.user.dto.UpdateUserStatusRequest;
import com.rutasdiautp.user.service.UserManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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