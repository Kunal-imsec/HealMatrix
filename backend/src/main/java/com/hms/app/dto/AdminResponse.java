package com.hms.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminResponse {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String employeeId;
    private String role;
    private boolean isActive;
    private LocalDateTime createdAt;
}
