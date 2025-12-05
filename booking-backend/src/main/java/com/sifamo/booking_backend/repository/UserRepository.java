package com.sifamo.booking_backend.repository;

import com.sifamo.booking_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Wir brauchen eine Methode, um User per Email zu finden
    Optional<User> findByEmail(String email);
}