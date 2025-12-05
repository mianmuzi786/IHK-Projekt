package com.sifamo.booking_backend.controller;

import com.sifamo.booking_backend.model.User;
import com.sifamo.booking_backend.repository.UserRepository; // WICHTIG: Import prüfen
import com.sifamo.booking_backend.service.JwtService;
import com.sifamo.booking_backend.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    // --- HIER HAT ES GEFEHLT ---
    @Autowired
    private UserRepository userRepository;
    // ---------------------------

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    // 1. Login (Token holen)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        // Prüfen ob User/Passwort stimmt
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        // User Details für Token laden
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());

        // Token generieren
        final String jwt = jwtService.generateToken(userDetails);

        // Vollen User aus DB holen (für Rolle) - JETZT FUNKTIONIERT DAS userRepository!
        User dbUser = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();

        // Antwort bauen
        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("email", dbUser.getEmail());
        response.put("role", dbUser.getRole());

        return ResponseEntity.ok(response);
    }

    // Optional: Registrierung (falls du sie brauchst)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email existiert bereits!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        userRepository.save(user);
        return ResponseEntity.ok("User angelegt!");
    }
}