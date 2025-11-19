package com.hms.app.dto;

import com.hms.app.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String address;
}
