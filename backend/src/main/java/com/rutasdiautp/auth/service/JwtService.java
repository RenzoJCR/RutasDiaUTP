package com.rutasdiautp.auth.service;

import com.rutasdiautp.user.domain.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;

    private final long expirationMinutes;

    public JwtService(
            JwtEncoder jwtEncoder,
            @Value(
                    "${app.jwt.expiration-minutes:720}"
            )
            long expirationMinutes
    ) {
        this.jwtEncoder = jwtEncoder;
        this.expirationMinutes = expirationMinutes;
    }

    public String generateToken(User user) {

        Instant now = Instant.now();

        Instant expiresAt =
                now.plus(
                        expirationMinutes,
                        ChronoUnit.MINUTES
                );

        JwtClaimsSet claims =
                JwtClaimsSet.builder()

                        .issuer("rutas-dia-utp")

                        .subject(user.getEmail())

                        .issuedAt(now)

                        .expiresAt(expiresAt)

                        .claim(
                                "userId",
                                user.getId()
                        )

                        .claim(
                                "name",
                                user.getFullName()
                        )

                        .claim(
                                "role",
                                user.getRole().name()
                        )

                        .claim(
                                "tokenVersion",
                                user.getTokenVersion()
                        )

                        .build();

        JwsHeader header =
                JwsHeader
                        .with(MacAlgorithm.HS256)
                        .type("JWT")
                        .build();

        Jwt jwt =
                jwtEncoder.encode(
                        JwtEncoderParameters.from(
                                header,
                                claims
                        )
                );

        return jwt.getTokenValue();
    }

    public long getExpirationSeconds() {

        return expirationMinutes * 60;
    }
}