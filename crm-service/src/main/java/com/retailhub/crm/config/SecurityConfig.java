package com.retailhub.crm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for simpler Postman/client testing
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/csr/**").hasRole("CSR")
                        .requestMatchers("/api/customer/**").hasAnyRole("CSR", "CUSTOMER", "ADMIN")
                        .anyRequest().permitAll() // Allow H2 console, login, etc
                )
                .httpBasic(withDefaults()); // Use Basic Auth (simplest for API testing)

        return http.build();
    }

    /**
     * SIMULATED USER DATABASE
     * For this demo, we pre-load users here to avoid complex DB seeding
     * interactions on startup.
     * In a real app, this would use a JDBC UserDetailsService.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.withDefaultPasswordEncoder()
                .username("admin")
                .password("admin123")
                .roles("ADMIN")
                .build();

        UserDetails csr = User.withDefaultPasswordEncoder()
                .username("csr1")
                .password("csr123")
                .roles("CSR")
                .build();

        return new InMemoryUserDetailsManager(admin, csr);
    }
}
