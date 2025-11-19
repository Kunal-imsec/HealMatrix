package com.hms.app.dto;

import com.hms.app.enums.Gender;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientRequest {
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String contactNumber;
    private String address;
}