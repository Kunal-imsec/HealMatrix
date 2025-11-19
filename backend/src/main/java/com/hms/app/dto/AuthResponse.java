package com.hms.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private UserProfile user;  // ✅ Use existing UserProfile
    private String message;

    // Keep these for backward compatibility
    @Deprecated
    private Long userId;
    @Deprecated
    private String username;
    @Deprecated
    private String email;
    @Deprecated
    private String role;
    @Deprecated
    private String redirectUrl;
}
