package com.hms.app.repository;

import com.hms.app.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

}
