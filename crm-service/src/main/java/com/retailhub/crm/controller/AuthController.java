package com.retailhub.crm.controller;

import com.retailhub.crm.model.AppUser;
import com.retailhub.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow React
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/register")
    public AppUser register(@RequestParam String username, @RequestParam String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        // 1. Create User
        AppUser user = new AppUser(username, password, "CUSTOMER");
        AppUser saved = userRepository.save(user);

        // 2. Create Wallet in Payment Service ($1000 Sign-up Bonus)
        // Updated port to 8084
        try {
            String paymentUrl = "http://localhost:8084/api/payment/wallet/create?username=" + username
                    + "&initialAmount=1000";
            restTemplate.postForObject(paymentUrl, null, String.class);
        } catch (Exception e) {
            System.err.println("Failed to create wallet for " + username);
        }

        return saved;
    }

    @PostMapping("/login")
    public AppUser login(@RequestParam String username, @RequestParam String password) {
        return userRepository.findByUsername(username)
                .filter(u -> u.getPassword().equals(password))
                .orElseThrow(() -> new RuntimeException("Invalid Credentials"));
    }
}
