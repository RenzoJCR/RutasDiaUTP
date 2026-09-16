package com.rutasdiautp.auth.dto;

import com.rutasdiautp.user.domain.User;

public record UserResponse(

        Long id,
        String firstNames,
        String lastNames,
        String fullName,
        String email,
        String role,
        boolean active

) {

    public static UserResponse from(User user) {

        return new UserResponse(
                user.getId(),
                user.getFirstNames(),
                user.getLastNames(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive()
        );
    }
}