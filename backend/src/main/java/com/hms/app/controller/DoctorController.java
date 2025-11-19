package com.hms.app.controller;

import com.hms.app.entity.Doctor;
import com.hms.app.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        Doctor addedDoctor = doctorService.addDoctor(doctor);
        return new ResponseEntity<>(addedDoctor, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        Optional<Doctor> doctorOptional = doctorService.getDoctorById(id);
        return doctorOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        Optional<Doctor> doctorOptional = doctorService.getDoctorById(id);

        if (!doctorOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Doctor existingDoctor = doctorOptional.get();


        existingDoctor.setFirstName(doctorDetails.getFirstName());
        existingDoctor.setLastName(doctorDetails.getLastName());
        existingDoctor.setSpecialization(doctorDetails.getSpecialization());


        Doctor updatedDoctor = doctorService.addDoctor(existingDoctor);
        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        if (!doctorService.getDoctorById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
