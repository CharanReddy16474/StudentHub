
package com.studenthub.studenthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studenthub.studenthub.model.Enrollment;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Integer> {

    List<Enrollment> findByStudentUserId(Integer studentUserId);

    List<Enrollment> findByStudentUserIdAndStatus(
            Integer studentUserId, String status);

    Optional<Enrollment> findByStudentUserIdAndCourseId(
            Integer studentUserId, Integer courseId);

    boolean existsByStudentUserIdAndCourseId(
            Integer studentUserId, Integer courseId);
}
