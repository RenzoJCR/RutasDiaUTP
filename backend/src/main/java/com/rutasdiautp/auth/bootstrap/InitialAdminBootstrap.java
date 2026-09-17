package com.rutasdiautp.auth.bootstrap;

import com.rutasdiautp.user.domain.User;
import com.rutasdiautp.user.domain.UserRole;
import com.rutasdiautp.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class InitialAdminBootstrap
        implements ApplicationRunner {

    private static final Logger log =
            LoggerFactory.getLogger(
                    InitialAdminBootstrap.class
            );

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final boolean enabled;
    private final String firstNames;
    private final String lastNames;
    private final String email;
    private final String password;

    public InitialAdminBootstrap(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,

            @Value("${app.initial-admin.enabled:false}")
            boolean enabled,

            @Value("${app.initial-admin.first-names:}")
            String firstNames,

            @Value("${app.initial-admin.last-names:}")
            String lastNames,

            @Value("${app.initial-admin.email:}")
            String email,

            @Value("${app.initial-admin.password:}")
            String password
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.enabled = enabled;
        this.firstNames = firstNames;
        this.lastNames = lastNames;
        this.email = email;
        this.password = password;
    }

    @Override
    public void run(
            ApplicationArguments args
    ) {

        if (!enabled) {
            return;
        }

        if (userRepository.existsByRole(
                UserRole.ADMINISTRADOR
        )) {

            log.info(
                    "Ya existe un administrador. "
                            + "Se omite el bootstrap inicial."
            );

            return;
        }

        validateConfiguration();

        String normalizedEmail =
                email.trim()
                        .toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmailIgnoreCase(
                normalizedEmail
        )) {

            throw new IllegalStateException(
                    "El correo configurado para el "
                            + "administrador inicial ya existe"
            );
        }

        User admin = new User(
                firstNames.trim(),
                lastNames.trim(),
                normalizedEmail,
                passwordEncoder.encode(password),
                UserRole.ADMINISTRADOR
        );

        userRepository.save(admin);

        log.info(
                "Administrador inicial creado correctamente."
        );
    }

    private void validateConfiguration() {

        if (
                firstNames.isBlank()
                        || lastNames.isBlank()
                        || email.isBlank()
                        || password.isBlank()
        ) {

            throw new IllegalStateException(
                    "La configuración del administrador "
                            + "inicial está incompleta"
            );
        }

        if (!email
                .toLowerCase(Locale.ROOT)
                .endsWith("@utp.edu.pe")) {

            throw new IllegalStateException(
                    "El administrador inicial debe usar "
                            + "correo institucional UTP"
            );
        }

        if (password.length() < 8) {

            throw new IllegalStateException(
                    "La contraseña inicial debe tener "
                            + "al menos 8 caracteres"
            );
        }
    }
}