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

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
}