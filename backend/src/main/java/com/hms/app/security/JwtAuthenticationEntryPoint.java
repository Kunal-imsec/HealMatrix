package com.hms.app.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {

        // Log more details for debugging
        log.error("Unauthorized access attempt - URI: {}, Method: {}, Exception: {}",
                request.getRequestURI(),
                request.getMethod(),
                authException.getMessage());

        // Log Authorization header for debugging (remove in production)
        String authHeader = request.getHeader("Authorization");
        log.debug("Authorization header present: {}", authHeader != null ? "Yes" : "No");

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        body.put("error", "Unauthorized");
        body.put("message", "Authentication required");
        body.put("details", getDetailedMessage(request, authException));
        body.put("path", request.getRequestURI());
        body.put("method", request.getMethod());

        objectMapper.writeValue(response.getOutputStream(), body);
    }

    private String getDetailedMessage(HttpServletRequest request, AuthenticationException authException) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || authHeader.isEmpty()) {
            return "No authentication token provided. Please include 'Authorization: Bearer <token>' header";
        } else if (!authHeader.startsWith("Bearer ")) {
            return "Invalid authentication format. Use 'Authorization: Bearer <token>' format";
        } else {
            return "Invalid or expired authentication token. Please login again";
        }
    }
}