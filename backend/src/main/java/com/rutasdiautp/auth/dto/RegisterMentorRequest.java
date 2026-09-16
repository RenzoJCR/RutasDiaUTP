package com.rutasdiautp.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterMentorRequest(

        @NotBlank(message = "Los nombres son obligatorios")
        @Size(
                max = 100,
                message = "Los nombres no pueden superar los 100 caracteres"
        )
        String firstNames,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(
                max = 100,
                message = "Los apellidos no pueden superar los 100 caracteres"
        )
        String lastNames,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no tiene un formato válido")
        @Size(max = 150)
        @Pattern(
                regexp = "(?i)^[A-Z0-9._%+-]+@utp\\.edu\\.pe$",
                message = "Debes utilizar tu correo institucional UTP"
        )
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(
                min = 8,
                max = 72,
                message = "La contraseña debe tener entre 8 y 72 caracteres"
        )
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "La contraseña debe contener letras y números"
        )
        String password

) {
}