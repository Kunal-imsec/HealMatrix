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
public class UserProfile {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String role;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
