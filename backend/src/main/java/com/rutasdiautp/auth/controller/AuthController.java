package com.rutasdiautp.auth.controller;

import com.rutasdiautp.auth.dto.RegisterMentorRequest;
import com.rutasdiautp.auth.dto.UserResponse;
import com.rutasdiautp.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
            @Valid @RequestBody RegisterMentorRequest request
    ) {

        return authService.registerMentor(request);
    }
}