package com.mednex.hms_backend.auth;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String password; // Only used for creation
    private String role;
    private String fullName;
    private String specialization;
}
