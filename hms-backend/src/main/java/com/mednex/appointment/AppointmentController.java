package com.mednex.appointment;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/appointments")
@CrossOrigin(origins = "http://localhost:4200")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Appointment> list() {
        return service.all();
    }

    @PostMapping
    public Appointment create(@RequestBody Appointment a) {
        return service.save(a);
    }
}
