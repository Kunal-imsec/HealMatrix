package com.hms.app.controller;

import com.hms.app.entity.Prescription;
import com.hms.app.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        Prescription savedPrescription = prescriptionService.savePrescription(prescription);
        return new ResponseEntity<>(savedPrescription, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        List<Prescription> prescriptions = prescriptionService.getAllPrescriptions();
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        Optional<Prescription> prescriptionOptional = prescriptionService.getPrescriptionById(id);
        return prescriptionOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id, @RequestBody Prescription prescriptionDetails) {
        Optional<Prescription> prescriptionOptional = prescriptionService.getPrescriptionById(id);

        if (!prescriptionOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Prescription existingPrescription = prescriptionOptional.get();


        existingPrescription.setMedicalRecord(prescriptionDetails.getMedicalRecord());
        existingPrescription.setMedicationName(prescriptionDetails.getMedicationName());
        existingPrescription.setDosage(prescriptionDetails.getDosage());
        existingPrescription.setFrequency(prescriptionDetails.getFrequency());
        existingPrescription.setDuration(prescriptionDetails.getDuration());
        existingPrescription.setNotes(prescriptionDetails.getNotes());

        Prescription updatedPrescription = prescriptionService.savePrescription(existingPrescription);
        return ResponseEntity.ok(updatedPrescription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        if (!prescriptionService.getPrescriptionById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
}
