package com.hms.app.service.impl;

import com.hms.app.exception.ResourceNotFoundException;
import com.hms.app.entity.Department;
import com.hms.app.repository.DepartmentRepository;
import com.hms.app.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public Department saveDepartment(Department department) {
        return departmentRepository.save(department);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    @Override
    public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        department.setName(departmentDetails.getName());

        return departmentRepository.save(department);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        departmentRepository.delete(department);
    }
}
