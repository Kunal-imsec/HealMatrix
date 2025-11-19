package com.hms.app.service.impl;

import com.hms.app.entity.MedicalRecord;
import com.hms.app.repository.MedicalRecordRepository;
import com.hms.app.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    @Autowired
    public MedicalRecordServiceImpl(MedicalRecordRepository medicalRecordRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
    }

    @Override
    public MedicalRecord saveMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    @Override
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    @Override
    public Optional<MedicalRecord> getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id);
    }

    @Override
    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }
}
