package com.hms.app.controller;

import com.hms.app.entity.MedicalRecord;
import com.hms.app.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @Autowired
    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @PostMapping
    public ResponseEntity<MedicalRecord> createMedicalRecord(@RequestBody MedicalRecord medicalRecord) {
        MedicalRecord savedRecord = medicalRecordService.saveMedicalRecord(medicalRecord);
        return new ResponseEntity<>(savedRecord, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MedicalRecord>> getAllMedicalRecords() {
        List<MedicalRecord> records = medicalRecordService.getAllMedicalRecords();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable Long id) {
        Optional<MedicalRecord> recordOptional = medicalRecordService.getMedicalRecordById(id);
        return recordOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(@PathVariable Long id, @RequestBody MedicalRecord recordDetails) {
        Optional<MedicalRecord> recordOptional = medicalRecordService.getMedicalRecordById(id);

        if (!recordOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        MedicalRecord existingRecord = recordOptional.get();


        existingRecord.setPatient(recordDetails.getPatient());
        existingRecord.setAppointment(recordDetails.getAppointment());
        existingRecord.setVisitDate(recordDetails.getVisitDate());
        existingRecord.setSymptoms(recordDetails.getSymptoms());
        existingRecord.setDiagnosis(recordDetails.getDiagnosis());
        existingRecord.setVitals(recordDetails.getVitals());
        existingRecord.setPrescriptions(recordDetails.getPrescriptions());


        MedicalRecord updatedRecord = medicalRecordService.saveMedicalRecord(existingRecord);
        return ResponseEntity.ok(updatedRecord);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        if (!medicalRecordService.getMedicalRecordById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }
}
