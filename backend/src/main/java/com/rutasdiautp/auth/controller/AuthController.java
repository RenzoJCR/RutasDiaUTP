package com.rutasdiautp.auth.controller;

import com.rutasdiautp.auth.dto.*;
import com.rutasdiautp.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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
}