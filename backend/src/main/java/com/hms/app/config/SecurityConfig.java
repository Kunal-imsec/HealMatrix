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
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .authorizeHttpRequests(auth -> auth
                        // H2 Console
                        .requestMatchers("/h2-console/**").permitAll()

                        // ✅ Health check for Render
                        .requestMatchers("/api/health", "/api/ping").permitAll()

                        // Public endpoints
                        .requestMatchers(
                                "/",
                                "/health",
                                "/error",
                                "/favicon.ico",
                                "/actuator/**"
                        ).permitAll()

                        // Authentication endpoints
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/api/auth/**"
                        ).permitAll()

                        // Public data endpoints
                        .requestMatchers(
                                "/api/v1/departments",
                                "/api/departments",
                                "/api/v1/doctors/specializations",
                                "/api/doctors/specializations"
                        ).permitAll()

                        // Public read-only doctor list
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/v1/doctors",
                                "/api/doctors"
                        ).permitAll()

                        // Admin endpoints
                        .requestMatchers(
                                "/api/v1/admin/**",
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // Role-specific endpoints
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

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ Allow all origins in development, specific in production
        configuration.setAllowedOriginPatterns(List.of("*"));

        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
