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

import com.rutasdiautp.user.dto.UpdateAdminRequest;

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

    @Transactional
    public UserResponse updateAdmin(
            Long adminId,
            UpdateAdminRequest request
    ) {

        User admin = userRepository
                .findById(adminId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Administrador no encontrado"
                        )
                );

        if (admin.getRole() != UserRole.ADMINISTRADOR) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El usuario seleccionado no es un administrador"
            );
        }

        String email =
                normalizeEmail(request.email());

        userRepository
                .findByEmailIgnoreCase(email)
                .filter(existing ->
                        !existing.getId().equals(adminId)
                )
                .ifPresent(existing -> {

                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Ya existe una cuenta registrada con ese correo"
                    );
                });

        admin.updateProfile(
                request.firstNames().trim(),
                request.lastNames().trim(),
                email
        );

        return UserResponse.from(admin);
    }

    @Transactional
    public UserResponse updateAdminStatus(
            Long adminId,
            UpdateUserStatusRequest request,
            String currentAdminEmail
    ) {

        User admin = userRepository
                .findById(adminId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Administrador no encontrado"
                        )
                );

        if (admin.getRole() != UserRole.ADMINISTRADOR) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El usuario seleccionado no es un administrador"
            );
        }

        boolean newStatus =
                Boolean.TRUE.equals(
                        request.active()
                );

        if (!newStatus && admin.isActive()) {

            if (
                    admin.getEmail()
                            .equalsIgnoreCase(
                                    currentAdminEmail
                            )
            ) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "No puedes inhabilitar tu propia cuenta"
                );
            }

            long activeAdmins =
                    userRepository
                            .countByRoleAndActiveTrue(
                                    UserRole.ADMINISTRADOR
                            );

            if (activeAdmins <= 1) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Debe existir al menos un administrador activo"
                );
            }

            admin.deactivate();

        } else if (newStatus) {

            admin.activate();
        }

        return UserResponse.from(admin);
    }

    private String normalizeEmail(String email) {

        return email
                .trim()
                .toLowerCase(Locale.ROOT);
    }
}