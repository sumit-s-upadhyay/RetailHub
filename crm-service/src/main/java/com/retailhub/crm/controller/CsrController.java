package com.retailhub.crm.controller;

import com.retailhub.crm.model.Customer;
import com.retailhub.crm.model.RegularCustomer;
import com.retailhub.crm.repository.CustomerRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/csr")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
public class CsrController {

    private final CustomerRepository customerRepository;

    public CsrController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // ONLY CSRs (and Admin) CAN ACCESS THIS
    @PostMapping("/onboard-customer")
    public String onboardCustomer(@RequestParam String name, @RequestParam String email) {
        Customer cust = new RegularCustomer(name, email);
        customerRepository.save(cust);
        return "SUCCESS: Customer '" + name + "' onboarded by CSR.";
    }
}
