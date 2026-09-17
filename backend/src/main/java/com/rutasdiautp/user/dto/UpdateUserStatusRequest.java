package com.rutasdiautp.user.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(

        @NotNull(message = "El estado es obligatorio")
        Boolean active

) {
}