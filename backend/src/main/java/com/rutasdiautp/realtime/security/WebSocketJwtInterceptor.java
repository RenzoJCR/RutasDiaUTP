package com.rutasdiautp.realtime.security;

import com.rutasdiautp.user.domain.User;
import com.rutasdiautp.user.repository.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WebSocketJwtInterceptor
        implements ChannelInterceptor {

    private final JwtDecoder jwtDecoder;

    private final UserRepository userRepository;

    public WebSocketJwtInterceptor(
            JwtDecoder jwtDecoder,
            UserRepository userRepository
    ) {
        this.jwtDecoder = jwtDecoder;
        this.userRepository = userRepository;
    }

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        if (accessor == null) {
            return message;
        }

        StompCommand command =
                accessor.getCommand();

        if (StompCommand.CONNECT.equals(command)) {

            authenticateConnection(accessor);
        }

        if (
                StompCommand.SEND.equals(command)
                        || StompCommand.SUBSCRIBE.equals(command)
        ) {

            validateAuthenticatedUser(accessor);
        }

        if (StompCommand.SEND.equals(command)) {

            String destination =
                    accessor.getDestination();

            if (
                    destination != null
                            && destination.startsWith("/topic/")
            ) {

                throw new AccessDeniedException(
                        "No se permite enviar mensajes directamente a /topic"
                );
            }
        }

        return message;
    }

    private void authenticateConnection(
            StompHeaderAccessor accessor
    ) {

        String authorization =
                accessor.getFirstNativeHeader(
                        HttpHeaders.AUTHORIZATION
                );

        if (
                authorization == null
                        || !authorization.startsWith(
                        "Bearer "
                )
        ) {

            throw new BadCredentialsException(
                    "Token WebSocket requerido"
            );
        }

        String rawToken =
                authorization.substring(7);

        Jwt jwt;

        try {

            jwt =
                    jwtDecoder.decode(rawToken);

        } catch (JwtException exception) {

            throw new BadCredentialsException(
                    "Token WebSocket inválido",
                    exception
            );
        }

        User user =
                validateUser(jwt);

        var authority =
                new SimpleGrantedAuthority(
                        "ROLE_"
                                + user.getRole().name()
                );

        var authentication =
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        List.of(authority)
                );

        authentication.setDetails(
                user.getTokenVersion()
        );

        accessor.setUser(authentication);
    }

    private void validateAuthenticatedUser(
            StompHeaderAccessor accessor
    ) {

        if (!(
                accessor.getUser()
                        instanceof UsernamePasswordAuthenticationToken authentication
        )) {

            throw new BadCredentialsException(
                    "Sesión WebSocket no autenticada"
            );
        }

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Usuario WebSocket inválido"
                                )
                        );

        long connectionTokenVersion =
                authentication.getDetails()
                        instanceof Number number
                        ? number.longValue()
                        : -1;

        if (
                !user.isActive()
                        || user.getTokenVersion()
                        != connectionTokenVersion
        ) {

            throw new BadCredentialsException(
                    "La sesión WebSocket ya no es válida"
            );
        }
    }

    private User validateUser(
            Jwt jwt
    ) {

        String email =
                jwt.getSubject();

        Object claim =
                jwt.getClaims()
                        .get("tokenVersion");

        long jwtTokenVersion =
                claim instanceof Number number
                        ? number.longValue()
                        : -1;

        User user =
                userRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Usuario no encontrado"
                                )
                        );

        if (
                !user.isActive()
                        || user.getTokenVersion()
                        != jwtTokenVersion
        ) {

            throw new BadCredentialsException(
                    "Usuario WebSocket no autorizado"
            );
        }

        return user;
    }
}