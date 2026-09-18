package com.rutasdiautp.auth.passwordreset.notification;

import com.rutasdiautp.user.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
        prefix = "app.mail",
        name = "enabled",
        havingValue = "false",
        matchIfMissing = true
)
public class ConsolePasswordResetNotifier
        implements PasswordResetNotifier {

    private static final Logger log =
            LoggerFactory.getLogger(
                    ConsolePasswordResetNotifier.class
            );

    @Override
    public void sendResetLink(
            User user,
            String resetUrl
    ) {

        log.info(
                """
                
                ============================================
                RECUPERACION DE CONTRASEÑA - DESARROLLO
                Usuario: {}
                Correo: {}
                Enlace:
                {}
                ============================================
                """,
                user.getFullName(),
                user.getEmail(),
                resetUrl
        );
    }
}