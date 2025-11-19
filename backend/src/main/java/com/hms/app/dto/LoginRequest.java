package com.hms.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String email;
    private String username;
    private String password;

    // ADD THIS METHOD - This is what's causing the "Cannot resolve method 'getIdentifier'" error
    public String getIdentifier() {
        return username != null ? username : email;
    }

}