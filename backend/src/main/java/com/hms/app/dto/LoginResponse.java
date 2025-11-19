package com.hms.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String tokenType;
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String redirectUrl;
    private String message;
    private LocalDateTime loginTime;
    private Long expiresIn;

    // Alternative constructor for basic response
    public LoginResponse(String token, String username, String role, String message) {
        this.token = token;
        this.tokenType = "Bearer";
        this.username = username;
        this.role = role;
        this.message = message;
        this.loginTime = LocalDateTime.now();
    }
}
