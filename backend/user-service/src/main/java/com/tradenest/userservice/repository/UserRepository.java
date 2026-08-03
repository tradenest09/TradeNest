package com.tradenest.userservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.tradenest.userservice.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    @EntityGraph(attributePaths = "role")
    Optional<User> findByEmail(String email);

    Optional<User> findByUname(String uname);

    Optional<User> findByContactNumber(String contactNumber);

    boolean existsByEmail(String email);

    boolean existsByUname(String uname);

    boolean existsByContactNumber(String contactNumber);
}