package com.hms.app.dto;

import com.hms.app.enums.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long userId;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private Role role;
    private boolean active;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    // Constructor without timestamps for backward compatibility
    public UserResponse(Long userId, String firstName, String lastName, String username,
                        String email, Role role, boolean active) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.role = role;
        this.active = active;
        this.enabled = active;
    }

    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public String getDisplayName() {
        return getFullName() + " (" + role.name() + ")";
    }

    // Sync methods to keep both active and enabled fields consistent
    public void setActive(boolean active) {
        this.active = active;
        this.enabled = active;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
        this.active = enabled;
    }
}