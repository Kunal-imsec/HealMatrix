package com.hms.app.service;

import com.hms.app.entity.Department;
import java.util.List;
import java.util.Optional;

public interface DepartmentService {
    Department saveDepartment(Department department);
    List<Department> getAllDepartments();
    Optional<Department> getDepartmentById(Long id);
    Department updateDepartment(Long id, Department departmentDetails);
    void deleteDepartment(Long id);
}
