package com.hms.app.repository;


import com.hms.app.entity.Billing;
import com.hms.app.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BillingRepository extends JpaRepository<Billing, Long> {

    List<Billing> findByPatient(Patient patient);
}
