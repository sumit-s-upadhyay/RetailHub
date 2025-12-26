package com.retailhub.crm.controller;

import com.retailhub.crm.model.AppUser;
import com.retailhub.crm.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ONLY ADMINS CAN ACCESS THIS
    @PostMapping("/create-csr")
    public String createCSR(@RequestParam String username, @RequestParam String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            return "Error: User already exists";
        }
        AppUser newCsr = new AppUser(username, password, "ROLE_CSR");
        userRepository.save(newCsr);
        return "SUCCESS: CSR '" + username + "' created by Admin.";
    }
}
