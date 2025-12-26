package com.retailhub.crm.config;

import com.retailhub.crm.model.AppUser;
import com.retailhub.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Admin
            AppUser admin = new AppUser();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);

            // Customer
            AppUser customer = new AppUser();
            customer.setUsername("john_doe");
            customer.setPassword(passwordEncoder.encode("password"));
            customer.setRole("ROLE_CUSTOMER");
            userRepository.save(customer);

            // CSR
            AppUser csr = new AppUser();
            csr.setUsername("csr");
            csr.setPassword(passwordEncoder.encode("csr123"));
            csr.setRole("ROLE_CSR");
            userRepository.save(csr);

            System.out.println("--- Data Seeding Completed: admin, john_doe, csr ---");
        }
    }
}
