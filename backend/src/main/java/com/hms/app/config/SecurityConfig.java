package com.hms.app.config;

import com.hms.app.security.JwtAuthenticationEntryPoint;
import com.hms.app.security.JwtRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ==================== CSRF DISABLED for REST & H2 ====================
                .csrf(AbstractHttpConfigurer::disable)

                // ==================== CORS CONFIGURATION ====================
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ==================== EXCEPTION HANDLER ====================
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )

                // ==================== AUTHORIZATION RULES ====================
                .authorizeHttpRequests(auth -> auth

                        // ==================== H2 Console - MUST BE FIRST ====================
                        .requestMatchers("/h2-console/**").permitAll()

                        // ==================== PUBLIC ENDPOINTS ====================
                        .requestMatchers(
                                "/",
                                "/health",
                                "/error",
                                "/favicon.ico",
                                "/actuator/**"
                        ).permitAll()

                        // ==================== AUTHENTICATION ENDPOINTS ====================
                        // Support BOTH /api/v1/auth/** AND /api/auth/** paths
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/api/auth/**"
                        ).permitAll()

                        // ==================== PUBLIC DATA ENDPOINTS ====================
                        // ✅ Allow anyone to view departments and doctors (read-only)
                        .requestMatchers(
                                "/api/v1/departments",
                                "/api/departments",
                                "/api/v1/doctors/specializations",
                                "/api/doctors/specializations"
                        ).permitAll()

                        // ✅ Public read-only access to doctor list (for patients to find doctors)
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/v1/doctors",
                                "/api/doctors"
                        ).permitAll()

                        // ==================== ADMIN ENDPOINTS ====================
                        .requestMatchers(
                                "/api/v1/admin/**",
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // ==================== ROLE-SPECIFIC ENDPOINTS ====================
                        .requestMatchers("/api/v1/doctor/**", "/api/doctor/**")
                        .hasAnyRole("DOCTOR", "ADMIN")

                        .requestMatchers("/api/v1/nurse/**", "/api/nurse/**")
                        .hasAnyRole("NURSE", "ADMIN")

                        .requestMatchers("/api/v1/patient/**", "/api/patient/**")
                        .hasAnyRole("PATIENT", "ADMIN")

                        .requestMatchers("/api/v1/receptionist/**", "/api/receptionist/**")
                        .hasAnyRole("RECEPTIONIST", "ADMIN")

                        .requestMatchers("/api/v1/pharmacist/**", "/api/pharmacist/**")
                        .hasAnyRole("PHARMACIST", "ADMIN")

                        // ==================== DEFAULT ====================
                        .anyRequest().authenticated()
                )


                // ==================== SESSION MANAGEMENT ====================
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ==================== AUTHENTICATION PROVIDER & FILTERS ====================
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)

                // ==================== H2 CONSOLE FRAME SUPPORT ====================
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                );

        return http.build();
    }

    // -------------------- CORS CONFIG --------------------
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
