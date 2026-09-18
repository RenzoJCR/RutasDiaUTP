package com.rutasdiautp.auth.service;

import com.rutasdiautp.auth.dto.*;
import com.rutasdiautp.auth.passwordreset.domain.PasswordResetToken;
import com.rutasdiautp.auth.passwordreset.notification.PasswordResetNotifier;
import com.rutasdiautp.auth.passwordreset.repository.PasswordResetTokenRepository;
import com.rutasdiautp.user.domain.User;
import com.rutasdiautp.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;

@Service
public class PasswordService {

    private final UserRepository userRepository;

    private final PasswordResetTokenRepository
            passwordResetTokenRepository;

    private final PasswordEncoder passwordEncoder;

    private final PasswordResetNotifier notifier;

    private final String frontendUrl;

    private final long expirationMinutes;

    private final SecureRandom secureRandom =
            new SecureRandom();

    public PasswordService(
            UserRepository userRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            PasswordResetNotifier notifier,

            @Value("${app.frontend-url}")
            String frontendUrl,

            @Value(
                    "${app.password-reset.expiration-minutes:30}"
            )
            long expirationMinutes
    ) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository =
                passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.notifier = notifier;
        this.frontendUrl = frontendUrl;
        this.expirationMinutes =
                expirationMinutes;
    }

    @Transactional
    public MessageResponse changePassword(
            String email,
            ChangePasswordRequest request
    ) {

        User user =
                userRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Usuario no encontrado"
                                )
                        );

        if (!passwordEncoder.matches(
                request.currentPassword(),
                user.getPasswordHash()
        )) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La contraseña actual no es correcta"
            );
        }

        if (passwordEncoder.matches(
                request.newPassword(),
                user.getPasswordHash()
        )) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La nueva contraseña debe ser diferente"
            );
        }

        user.changePassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        return new MessageResponse(
                "Contraseña actualizada correctamente"
        );
    }

    @Transactional
    public MessageResponse forgotPassword(
            ForgotPasswordRequest request
    ) {

        String email =
                request.email()
                        .trim()
                        .toLowerCase(Locale.ROOT);

        userRepository
                .findByEmailIgnoreCase(email)
                .filter(User::isActive)
                .ifPresent(
                        this::createResetRequest
                );

        return new MessageResponse(
                "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña"
        );
    }

    @Transactional
    public MessageResponse resetPassword(
            ResetPasswordRequest request
    ) {

        String tokenHash =
                hashToken(
                        request.token()
                );

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByTokenHash(tokenHash)
                        .orElseThrow(() ->
                                invalidResetToken()
                        );

        if (
                resetToken.isUsed()
                        || resetToken.isExpired()
                        || !resetToken
                        .getUser()
                        .isActive()
        ) {

            throw invalidResetToken();
        }

        User user =
                resetToken.getUser();

        user.changePassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        resetToken.markAsUsed();

        return new MessageResponse(
                "Contraseña restablecida correctamente"
        );
    }

    private void createResetRequest(
            User user
    ) {

        passwordResetTokenRepository
                .deleteAllByUser_Id(
                        user.getId()
                );

        String rawToken =
                generateToken();

        String tokenHash =
                hashToken(rawToken);

        PasswordResetToken resetToken =
                new PasswordResetToken(
                        user,
                        tokenHash,
                        LocalDateTime.now()
                                .plusMinutes(
                                        expirationMinutes
                                )
                );

        passwordResetTokenRepository
                .save(resetToken);

        String resetUrl =
                frontendUrl
                        + "/restablecer-contrasena?token="
                        + rawToken;

        notifier.sendResetLink(
                user,
                resetUrl
        );
    }

    private String generateToken() {

        byte[] bytes =
                new byte[32];

        secureRandom.nextBytes(bytes);

        return Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private String hashToken(
            String token
    ) {

        try {

            MessageDigest digest =
                    MessageDigest
                            .getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            token.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            return HexFormat.of()
                    .formatHex(hash);

        } catch (
                NoSuchAlgorithmException exception
        ) {

            throw new IllegalStateException(
                    "SHA-256 no está disponible",
                    exception
            );
        }
    }

    private ResponseStatusException
    invalidResetToken() {

        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El enlace de recuperación no es válido o ha expirado"
        );
    }
}