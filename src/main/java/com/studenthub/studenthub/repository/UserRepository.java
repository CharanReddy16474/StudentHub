
package com.studenthub.studenthub.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studenthub.studenthub.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
