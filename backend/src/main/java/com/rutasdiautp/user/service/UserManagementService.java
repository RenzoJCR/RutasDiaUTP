package com.rutasdiautp.user.service;

import com.rutasdiautp.auth.dto.UserResponse;
import com.rutasdiautp.user.domain.User;
import com.rutasdiautp.user.domain.UserRole;
import com.rutasdiautp.user.dto.CreateAdminRequest;
import com.rutasdiautp.user.dto.UpdateUserStatusRequest;
import com.rutasdiautp.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getMentors() {

        return userRepository
                .findAllByRoleOrderByFirstNamesAscLastNamesAsc(
                        UserRole.MENTOR
                )
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAdmins() {

        return userRepository
                .findAllByRoleOrderByFirstNamesAscLastNamesAsc(
                        UserRole.ADMINISTRADOR
                )
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse createAdmin(
            CreateAdminRequest request
    ) {

        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCase(email)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una cuenta registrada con ese correo"
            );
        }

        User admin = new User(
                request.firstNames().trim(),
                request.lastNames().trim(),
                email,
                passwordEncoder.encode(request.password()),
                UserRole.ADMINISTRADOR
        );

        return UserResponse.from(
                userRepository.save(admin)
        );
    }

    @Transactional
    public UserResponse updateMentorStatus(
            Long mentorId,
            UpdateUserStatusRequest request
    ) {

        User user = userRepository
                .findById(mentorId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Usuario no encontrado"
                        )
                );

        if (user.getRole() != UserRole.MENTOR) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El usuario seleccionado no es un mentor"
            );
        }

        if (Boolean.TRUE.equals(request.active())) {
            user.activate();
        } else {
            user.deactivate();
        }

        return UserResponse.from(user);
    }

    private String normalizeEmail(String email) {

        return email
                .trim()
                .toLowerCase(Locale.ROOT);
    }
}