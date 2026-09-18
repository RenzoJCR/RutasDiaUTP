package com.rutasdiautp.auth.controller;

import com.rutasdiautp.auth.dto.*;
import com.rutasdiautp.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.rutasdiautp.auth.service.PasswordService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordService passwordService;

    public AuthController(
            AuthService authService,
            PasswordService passwordService
    ) {
        this.authService = authService;
        this.passwordService = passwordService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse registerMentor(
            @Valid
            @RequestBody
            RegisterMentorRequest request
    ) {

        return authService.registerMentor(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid
            @RequestBody
            LoginRequest request
    ) {

        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me(
            @AuthenticationPrincipal Jwt jwt
    ) {

        return authService
                .getCurrentUser(
                        jwt.getSubject()
                );
    }

    @PostMapping("/password/change")
    public MessageResponse changePassword(
            @AuthenticationPrincipal Jwt jwt,
            @Valid
            @RequestBody
            ChangePasswordRequest request
    ) {

        return passwordService.changePassword(
                jwt.getSubject(),
                request
        );
    }

    @PostMapping("/password/forgot")
    public MessageResponse forgotPassword(
            @Valid
            @RequestBody
            ForgotPasswordRequest request
    ) {

        return passwordService
                .forgotPassword(request);
    }

    @PostMapping("/password/reset")
    public MessageResponse resetPassword(
            @Valid
            @RequestBody
            ResetPasswordRequest request
    ) {

        return passwordService
                .resetPassword(request);
    }
}