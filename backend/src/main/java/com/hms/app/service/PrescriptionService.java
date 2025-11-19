package com.hms.app.service;

import com.hms.app.entity.Prescription;
import java.util.List;
import java.util.Optional;


public interface PrescriptionService {

    Prescription savePrescription(Prescription prescription);

    List<Prescription> getAllPrescriptions();


    Optional<Prescription> getPrescriptionById(Long id);


    void deletePrescription(Long id);
}
