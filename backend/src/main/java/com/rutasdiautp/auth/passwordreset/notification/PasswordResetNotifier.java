package com.rutasdiautp.auth.passwordreset.notification;

import com.rutasdiautp.user.domain.User;

public interface PasswordResetNotifier {

    void sendResetLink(
            User user,
            String resetUrl
    );
}