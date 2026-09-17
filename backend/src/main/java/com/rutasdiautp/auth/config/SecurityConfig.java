package com.rutasdiautp.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import com.rutasdiautp.auth.filter.ActiveUserFilter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;

@Configuration
public class SecurityConfig {


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            ActiveUserFilter activeUserFilter,
            JwtAuthenticationConverter jwtAuthenticationConverter
    ) throws Exception {

        http

                .csrf(AbstractHttpConfigurer::disable)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/actuator/health"
                        ).permitAll()

                        .requestMatchers(
                                "/ws",
                                "/ws/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()

                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasRole("ADMINISTRADOR")

                        .anyRequest()
                        .authenticated()
                )

                .oauth2ResourceServer(oauth ->
                        oauth.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(
                                        jwtAuthenticationConverter
                                )
                        )
                )

                .addFilterAfter(
                        activeUserFilter,
                        BearerTokenAuthenticationFilter.class
                )

                .formLogin(
                        AbstractHttpConfigurer::disable
                )

                .httpBasic(
                        AbstractHttpConfigurer::disable
                );

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter authoritiesConverter =
                new JwtGrantedAuthoritiesConverter();

        authoritiesConverter
                .setAuthoritiesClaimName("role");

        authoritiesConverter
                .setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter =
                new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(
                authoritiesConverter
        );

        converter.setPrincipalClaimName("sub");

        return converter;
    }
}