package com.rutasdiautp.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateAdminRequest(

        @NotBlank(message = "Los nombres son obligatorios")
        @Size(max = 100)
        String firstNames,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(max = 100)
        String lastNames,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no tiene un formato válido")
        @Pattern(
                regexp = "(?i)^[A-Z0-9._%+-]+@utp\\.edu\\.pe$",
                message = "Debe utilizarse un correo institucional UTP"
        )
        String email

) {
}