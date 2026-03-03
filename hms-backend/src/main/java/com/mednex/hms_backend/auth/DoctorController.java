package com.mednex.hms_backend.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DoctorController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllDoctors() {
        List<Map<String, Object>> doctors = userRepository.findByRole("DOCTOR")
                .stream()
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", u.getId());
                    map.put("fullName", u.getFullName() != null ? u.getFullName() : u.getEmail());
                    map.put("email", u.getEmail());
                    map.put("specialization",
                            u.getSpecialization() != null ? u.getSpecialization() : "General Medicine");
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/suggest")
    public ResponseEntity<Map<String, Object>> suggestDoctor(@RequestParam String complaint) {
        String specialty = mapComplaintToSpecialty(complaint.toLowerCase());

        List<User> matched = userRepository.findByRole("DOCTOR")
                .stream()
                .filter(u -> specialty.equalsIgnoreCase(u.getSpecialization()))
                .collect(Collectors.toList());

        if (matched.isEmpty()) {
            matched = userRepository.findByRole("DOCTOR").stream()
                    .filter(u -> "General Medicine".equalsIgnoreCase(u.getSpecialization()))
                    .collect(Collectors.toList());
        }

        Map<String, Object> result = new HashMap<>();
        if (matched.isEmpty()) {
            result.put("specialty", specialty);
            result.put("message", "No doctor found");
            return ResponseEntity.ok(result);
        }

        User doctor = matched.get(0);
        result.put("id", doctor.getId());
        result.put("fullName", doctor.getFullName() != null ? doctor.getFullName() : doctor.getEmail());
        result.put("specialization", specialty);
        result.put("email", doctor.getEmail());
        return ResponseEntity.ok(result);
    }

    private String mapComplaintToSpecialty(String complaint) {
        if (complaint.matches(".*(heart|chest|cardiac|palpitation|coronary).*"))
            return "Cardiology";
        if (complaint.matches(".*(bone|fracture|joint|spine|ortho|knee|hip).*"))
            return "Orthopedics";
        if (complaint.matches(".*(eye|vision|retina|optic|cataract|blind).*"))
            return "Ophthalmology";
        if (complaint.matches(".*(brain|neuro|seizure|stroke|headache|memory|nerve).*"))
            return "Neurology";
        if (complaint.matches(".*(child|pediatric|infant|baby|toddler).*"))
            return "Pediatrics";
        if (complaint.matches(".*(skin|rash|derma|acne|eczema|psoriasis).*"))
            return "Dermatology";
        if (complaint.matches(".*(lung|breath|asthma|pneumo|cough|respiratory|airway).*"))
            return "Pulmonology";
        if (complaint.matches(".*(mental|anxiety|depression|psychiatry|psycho|mood|stress).*"))
            return "Psychiatry";
        if (complaint.matches(".*(stomach|gastro|digestion|liver|colon|bowel|nausea|vomit).*"))
            return "Gastroenterology";
        if (complaint.matches(".*(kidney|renal|urine|bladder|nephro).*"))
            return "Nephrology";
        if (complaint.matches(".*(cancer|oncology|tumor|chemo|lymphoma).*"))
            return "Oncology";
        return "General Medicine";
    }
}
