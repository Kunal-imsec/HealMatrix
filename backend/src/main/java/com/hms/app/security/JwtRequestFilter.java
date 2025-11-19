package com.hms.app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    // Public endpoints that don't require JWT authentication
    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
            // Support both /v1 and non-/v1 paths
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/send-reset-email",
            "/api/v1/auth/reset-password",
            "/api/v1/auth/forgot-password",
            "/api/auth/login",              // ← ADD THIS
            "/api/auth/register",           // ← ADD THIS
            "/api/auth/send-reset-email",   // ← ADD THIS
            "/api/auth/reset-password",     // ← ADD THIS
            "/api/auth/forgot-password",    // ← ADD THIS
            "/h2-console",
            "/actuator",
            "/error",
            "/favicon.ico"
    );


    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String requestPath = request.getRequestURI();
        final String authHeader = request.getHeader("Authorization");

        // Skip JWT validation for public endpoints
        if (isPublicEndpoint(requestPath)) {
            log.debug("🌐 Public endpoint: {} - Skipping JWT validation", requestPath);
            filterChain.doFilter(request, response);
            return;
        }

        // If no Authorization header, let Spring Security handle it
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String username = jwtService.extractUsername(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    log.debug("✅ JWT validated for user: {} with roles: {}",
                            username, userDetails.getAuthorities());
                }
            }
        } catch (Exception e) {
            log.error("❌ JWT validation error: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String requestPath) {
        return PUBLIC_ENDPOINTS.stream()
                .anyMatch(endpoint -> requestPath.startsWith(endpoint));
    }
}
