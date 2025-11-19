package com.hms.app.service;

import com.hms.app.entity.MedicalRecord;
import java.util.List;
import java.util.Optional;


public interface MedicalRecordService {

    MedicalRecord saveMedicalRecord(MedicalRecord medicalRecord);


    List<MedicalRecord> getAllMedicalRecords();


    Optional<MedicalRecord> getMedicalRecordById(Long id);

    void deleteMedicalRecord(Long id);
}
