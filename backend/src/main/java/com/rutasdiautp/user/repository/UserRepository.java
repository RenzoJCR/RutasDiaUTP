package com.rutasdiautp.user.repository;

import com.rutasdiautp.user.domain.User;
import com.rutasdiautp.user.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByRole(UserRole role);

    List<User> findAllByRoleAndActiveTrueOrderByFirstNamesAscLastNamesAsc(
            UserRole role
    );

    List<User> findAllByRoleOrderByFirstNamesAscLastNamesAsc(
            UserRole role
    );

    long countByRoleAndActiveTrue(
            UserRole role
    );
}