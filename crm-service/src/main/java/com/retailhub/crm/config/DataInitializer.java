package com.retailhub.crm.config;

import com.retailhub.crm.model.AppUser;
import com.retailhub.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Admin
        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(new AppUser("admin", passwordEncoder.encode("admin123"), "ROLE_ADMIN"));
        }

        // Customer
        if (userRepository.findByUsername("john_doe").isEmpty()) {
            userRepository.save(new AppUser("john_doe", passwordEncoder.encode("password"), "ROLE_CUSTOMER"));
        }

        // CSR
        if (userRepository.findByUsername("csr").isEmpty()) {
            userRepository.save(new AppUser("csr", passwordEncoder.encode("csr123"), "ROLE_CSR"));
        }
    }
}
