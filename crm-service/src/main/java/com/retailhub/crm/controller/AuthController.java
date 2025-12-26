package com.retailhub.crm.controller;

import com.retailhub.crm.model.AppUser;
import com.retailhub.crm.repository.UserRepository;
import com.retailhub.crm.dto.LoginRequest;
import com.retailhub.crm.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Value("${service.payment.url}")
    private String paymentUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private com.retailhub.crm.util.JwtUtil jwtUtil;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public AppUser register(@RequestBody LoginRequest request) {
        return registerUser(request.getUsername(), request.getPassword(), "CUSTOMER");
    }

    @PostMapping("/register-internal")
    public AppUser registerInternal(@RequestBody LoginRequest request) {
        // In a real app, verify that the caller is ADMIN here via SecurityContext
        return registerUser(request.getUsername(), request.getPassword(), request.getRole());
    }

    private AppUser registerUser(String username, String password, String role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        // 1. Create User (Encoded Password)
        AppUser user = new AppUser(username, passwordEncoder.encode(password), role);
        AppUser saved = userRepository.save(user);

        // 2. Create Wallet (Only for Customers or everyone? Let's give everyone a
        // wallet for simplicity, or just customers)
        if ("CUSTOMER".equalsIgnoreCase(role)) {
            try {
                String url = paymentUrl + "/wallet/create?username=" + username + "&initialAmount=1000";
                restTemplate.postForObject(url, null, String.class);
            } catch (Exception e) {
                System.err.println("Failed to create wallet for " + username);
            }
        }
        return saved;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        AppUser user = userRepository.findByUsername(request.getUsername())
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPassword()))
                .orElseThrow(() -> new RuntimeException("Invalid Credentials"));

        String token = jwtUtil.generateToken(request.getUsername());
        return new AuthResponse(token, user);
    }
}
