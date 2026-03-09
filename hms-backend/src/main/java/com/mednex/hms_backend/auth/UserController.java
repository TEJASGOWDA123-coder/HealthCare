package com.mednex.hms_backend.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/doctors")
    public ResponseEntity<List<Map<String, Object>>> getDoctors() {
        List<User> doctors = userRepository.findByRole("DOCTOR");
        List<Map<String, Object>> result = doctors.stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "fullName", u.getFullName() != null ? u.getFullName() : u.getEmail(),
                        "email", u.getEmail(),
                        "specialization", u.getSpecialization() != null ? u.getSpecialization() : ""))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/patients-list")
    public ResponseEntity<List<Map<String, Object>>> getPatientsAsUsers() {
        // Returns users with PATIENT role from the users table
        List<User> patients = userRepository.findByRole("PATIENT");
        List<Map<String, Object>> result = patients.stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "fullName", u.getFullName() != null ? u.getFullName() : u.getEmail(),
                        "email", u.getEmail()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
