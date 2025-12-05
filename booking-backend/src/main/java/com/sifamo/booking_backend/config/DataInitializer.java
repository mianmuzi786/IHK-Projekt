package com.sifamo.booking_backend.config;

import com.sifamo.booking_backend.model.User;
import com.sifamo.booking_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository repo, PasswordEncoder encoder) {
        return args -> {

            // 1. Admin User
            if (repo.findByEmail("admin@sifamo.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@sifamo.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole("ADMIN");
                repo.save(admin);
                System.out.println("✅ ADMIN USER ERSTELLT: admin@sifamo.com");
            }

            // 2. Standard User (DIESER TEIL HAT GEFEHLT!)
            if (repo.findByEmail("user@sifamo.com").isEmpty()) {
                User user = new User();
                user.setEmail("user@sifamo.com");
                user.setPassword(encoder.encode("user123"));
                user.setRole("USER"); // Wichtig: Rolle ist nur USER
                repo.save(user);
                System.out.println("✅ STANDARD USER ERSTELLT: user@sifamo.com");
            }
        };
    }
}