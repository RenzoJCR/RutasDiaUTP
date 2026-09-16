package com.rutasdiautp.auth.dto;

public record AuthResponse(

        String token,
        String tokenType,
        long expiresInSeconds,
        UserResponse user

) {
}