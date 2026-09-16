package com.rutasdiautp.auth.service;

import com.rutasdiautp.auth.dto.RegisterMentorRequest;
import com.rutasdiautp.auth.dto.UserResponse;
import com.rutasdiautp.user.domain.User;
import com.rutasdiautp.user.domain.UserRole;
import com.rutasdiautp.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rutasdiautp.auth.dto.AuthResponse;
import com.rutasdiautp.auth.dto.LoginRequest;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UserResponse registerMentor(
            RegisterMentorRequest request
    ) {

        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCase(email)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una cuenta registrada con ese correo"
            );
        }

        String passwordHash =
                passwordEncoder.encode(request.password());

        User user = new User(
                request.firstNames().trim(),
                request.lastNames().trim(),
                email,
                passwordHash,
                UserRole.MENTOR
        );

        User savedUser = userRepository.save(user);

        return UserResponse.from(savedUser);
    }

    private String normalizeEmail(String email) {

        return email
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    public AuthResponse login(
            LoginRequest request
    ) {

        String email = normalizeEmail(request.email());

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        invalidCredentials()
                );

        if (!user.isActive()) {
            throw invalidCredentials();
        }

        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash()
        )) {
            throw invalidCredentials();
        }

        String token =
                jwtService.generateToken(user);

        return new AuthResponse(
                token,
                "Bearer",
                jwtService.getExpirationSeconds(),
                UserResponse.from(user)
        );
    }

    public UserResponse getCurrentUser(
            String email
    ) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Usuario no encontrado"
                        )
                );

        return UserResponse.from(user);
    }

    private ResponseStatusException invalidCredentials() {

        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Correo o contraseña incorrectos"
        );
    }
}