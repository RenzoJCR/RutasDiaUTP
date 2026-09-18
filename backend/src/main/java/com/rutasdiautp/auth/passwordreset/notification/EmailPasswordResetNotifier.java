package com.rutasdiautp.auth.passwordreset.notification;

import com.rutasdiautp.user.domain.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
        prefix = "app.mail",
        name = "enabled",
        havingValue = "true"
)
public class EmailPasswordResetNotifier
        implements PasswordResetNotifier {

    private final JavaMailSender mailSender;
    private final String from;

    public EmailPasswordResetNotifier(
            JavaMailSender mailSender,
            @Value("${app.mail.from}")
            String from
    ) {
        this.mailSender = mailSender;
        this.from = from;
    }

    @Override
    public void sendResetLink(
            User user,
            String resetUrl
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(from);

        message.setTo(
                user.getEmail()
        );

        message.setSubject(
                "Recuperación de contraseña - Rutas Día UTP"
        );

        message.setText(
                """
                Hola %s,

                Se solicitó restablecer tu contraseña de Rutas Día UTP.

                Utiliza el siguiente enlace:

                %s

                El enlace tiene una duración limitada.

                Si no realizaste esta solicitud, puedes ignorar este correo.
                """
                        .formatted(
                                user.getFirstNames(),
                                resetUrl
                        )
        );

        mailSender.send(message);
    }
}