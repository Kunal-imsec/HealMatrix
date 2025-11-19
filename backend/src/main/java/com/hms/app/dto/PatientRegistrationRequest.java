package com.hms.app.dto;

import com.hms.app.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientRegistrationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String address;
    private String bloodGroup;
    private String emergencyContactName;
    private String emergencyContactNumber;
}
