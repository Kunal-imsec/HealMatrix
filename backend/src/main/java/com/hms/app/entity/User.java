package com.hms.app.entity;

import com.hms.app.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(unique = true)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Builder.Default
    @Column(name = "account_non_expired")
    private Boolean accountNonExpired = true;

    @Builder.Default
    @Column(name = "account_non_locked")
    private Boolean accountNonLocked = true;

    @Builder.Default
    @Column(name = "credentials_non_expired")
    private Boolean credentialsNonExpired = true;

    @Builder.Default
    @Column(name = "enabled")
    private Boolean enabled = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        // ✅ CRITICAL FIX: Auto-set username to email if not provided
        if (username == null || username.trim().isEmpty()) {
            username = email;
        }

        // Set defaults
        if (accountNonExpired == null) accountNonExpired = true;
        if (accountNonLocked == null) accountNonLocked = true;
        if (credentialsNonExpired == null) credentialsNonExpired = true;
        if (enabled == null) enabled = true;
        if (isActive == null) isActive = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ==================== UserDetails Implementation ====================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username != null ? username : email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired != null ? accountNonExpired : true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked != null ? accountNonLocked : true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired != null ? credentialsNonExpired : true;
    }

    @Override
    public boolean isEnabled() {
        return (enabled != null ? enabled : true) && (isActive != null ? isActive : true);
    }

    // ==================== Helper Methods ====================

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public Long getUserId() {
        return this.id;
    }

    public Long getId() {
        return this.id;
    }

    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return (this.enabled != null ? this.enabled : true) &&
                (this.isActive != null ? this.isActive : true);
    }

    public void setActive(boolean active) {
        this.enabled = active;
        this.isActive = active;
        this.updatedAt = LocalDateTime.now();
    }

    public void deactivate() {
        this.enabled = false;
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void activate() {
        this.enabled = true;
        this.isActive = true;
        this.accountNonLocked = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void lockAccount() {
        this.accountNonLocked = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void unlockAccount() {
        this.accountNonLocked = true;
        this.updatedAt = LocalDateTime.now();
    }
}
