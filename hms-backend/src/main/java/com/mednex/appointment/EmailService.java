package com.mednex.appointment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendAppointmentConfirmation(Appointment a) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(a.getPatient().getEmail());
        message.setSubject("Appointment Confirmation - " + "Hospital Management System");

        String text = String.format(
                "Dear %s,\n\n" +
                        "Your appointment with %s has been booked successfully.\n\n" +
                        "Details:\n" +
                        "Doctor: %s\n" +
                        "Date: %s\n" +
                        "Time: %s\n" +
                        "Type: %s\n\n" +
                        "Thank you for choosing our hospital.",
                a.getPatient().getFirstName(),
                a.getDoctor().getFullName(),
                a.getDoctor().getFullName(),
                a.getStartTime().toLocalDate(),
                a.getStartTime().toLocalTime(),
                a.getType());

        message.setText(text);
        mailSender.send(message);
    }
}
