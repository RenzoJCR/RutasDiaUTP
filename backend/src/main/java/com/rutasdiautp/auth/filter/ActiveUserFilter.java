package com.rutasdiautp.auth.filter;

import com.rutasdiautp.user.domain.User;
import com.rutasdiautp.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ActiveUserFilter
        extends OncePerRequestFilter {

    private final UserRepository userRepository;

    public ActiveUserFilter(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        var authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication
                instanceof JwtAuthenticationToken jwtAuth) {

            String email =
                    jwtAuth.getToken()
                            .getSubject();

            Object tokenVersionClaim =
                    jwtAuth.getToken()
                            .getClaims()
                            .get("tokenVersion");

            long jwtTokenVersion =
                    tokenVersionClaim instanceof Number number
                            ? number.longValue()
                            : -1;

            User user =
                    userRepository
                            .findByEmailIgnoreCase(email)
                            .orElse(null);

            boolean validUser =
                    user != null
                            && user.isActive()
                            && user.getTokenVersion()
                            == jwtTokenVersion;

            if (!validUser) {

                SecurityContextHolder.clearContext();

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.setContentType(
                        "application/json"
                );

                response.getWriter().write(
                        """
                        {
                          "message":
                          "La sesión ya no es válida"
                        }
                        """
                );

                return;
            }
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}