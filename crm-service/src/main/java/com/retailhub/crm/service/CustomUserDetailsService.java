package com.retailhub.crm.service;

import com.retailhub.crm.model.AppUser;
import com.retailhub.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Map AppUser role to Spring Security Authority
        // Note: Spring Security expects "ROLE_ADMIN", etc. usually, or we can just pass
        // the string.
        // Assuming AppUser role is like "ADMIN", we prepend ROLE_ if not present or
        // handle in SecurityConfig
        String role = user.getRole();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections
                        .singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(role)));
    }
}
