package com.hms.app.service.impl;

import com.hms.app.entity.Prescription;
import com.hms.app.repository.PrescriptionRepository;
import com.hms.app.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    @Autowired
    public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    @Override
    public Prescription savePrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    @Override
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @Override
    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    @Override
    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}
