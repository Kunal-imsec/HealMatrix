package com.hms.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminRegistrationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String employeeId;
}
