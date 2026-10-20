
package com.studenthub.studenthub.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studenthub.studenthub.model.StudentProfile;

public interface StudentProfileRepository
        extends JpaRepository<StudentProfile, Integer> {

    Optional<StudentProfile> findByStudentNumber(String studentNumber);

    boolean existsByStudentNumber(String studentNumber);
}
