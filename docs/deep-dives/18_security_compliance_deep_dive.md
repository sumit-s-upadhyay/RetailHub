# 18. Security & Compliance Deep Dive

**Context:** RetailHub (SecOps)  
**Focus:** STRIDE, Encryption, PII, OWASP  
**Role:** CISO / Security Engineer

---

## 1. Executive Overview
Security is not an "Add-on". It is baked into RetailHub. We assume **Zero Trust**: Internally, Services verify each other. Externally, we sanitize every input. We protect Tenant Data (B2B Confidentiality) and User Data (GDPR/PII).

---

## 2. Basics: Core Concepts & Glossary

### 2.1 The CIA Triad
-   **Confidentiality:** Only User A sees User A's data. (Encryption, ACLs).
-   **Integrity:** Data isn't tampered with. (Signatures, Checksums).
-   **Availability:** System stays up. (DDoS Protection).

### 2.2 STRIDE Threat Model
-   **S**poofing
-   **T**ampering
-   **R**epudiation
-   **I**nformation Disclosure
-   **D**enial of Service
-   **E**levation of Privilege

---

## 3. Intermediate: Implementation

### 3.1 OWASP Top 10 Mitigations
-   **Injection:** Use JPA/Hibernate (Prepared Statements).
-   **Broken Auth:** Use OAuth2/JWT. MFA for Admins.
-   **Sensitive Data Exposure:** Encrypt `credit_card` columns.
-   **XSS (Cross Site Scripting):** React escapes HTML by default. Use `Content-Security-Policy`.

### 3.2 Secrets Management
**Rule:** No secrets in Git.
-   **Dev:** `.env` files (gitignored).
-   **Prod:** AWS Secrets Manager -> K8s Secret -> Env Var.

---

## 4. Advanced: Data Privacy

### 4.1 PII Handling (GDPR)
**Scenario:** User requests "Right to be Forgotten".
-   **Challenge:** User ID is FK in `orders` table. Cannot delete row (Accounting needs it).
-   **Solution:** **Anonymization**.
    -   Update `users` table: `email` = `deleted_123@anon`, `name`=`Deleted`.
    -   Keep `orders` rows linked to the Anonymized ID.

### 4.2 Application Level Encryption
For highly sensitive columns (e.g., API Keys of Tenants), we don't just trust Disk Encryption. We encrypt the bytes **before** sending to DB using AES-GCM.

---

## 5. Architecture Visuals

### 5.1 Zero Trust Network
```mermaid
graph LR
    User -->|HTTPS| GW[Gateway]
    GW -->|mTLS| SvcA[Service A]
    SvcA -->|mTLS| SvcB[Service B]
    SvcA -->|TLS| DB[(Database)]
    
    note right of SvcA: Certificate Verification at every hop
```

---

## 6. Code & Config Examples

### 6.1 Content Security Policy (Headers)
```java
// Spring Security Config
http.headers()
    .contentSecurityPolicy("script-src 'self' https://trusted.cdn.com");
```

### 6.2 Input Validation (JSR-303)
```java
public class UserReq {
    @NotNull
    @Email // Prevents some Injection attacks
    private String email;

    @Pattern(regexp = "^[a-zA-Z0-9]{5,20}$") // Whitelist chars
    private String username;
}
```

---

## 7. Operational Playbook

### 7.1 Incident Response
**Scenario:** Data Breach detected.
1.  **Contain:** Revoke all Refresh Tokens. Rotate DB Passwords.
2.  **Analyze:** detailed Audit Logs (Who accessed what?).
3.  **Notify:** Legal team (GDPR requires 72h notice).

### 7.2 Dependency Audit
-   **Tool:** OWASP Dependency Check.
-   **Automation:** Fails CI build if `high` severity CVE found.

---

## 8. Security & Compliance Notes

-   **Audit Logging:** Every WRITE operation must log: `GlobalID`, `User`, `Action`, `Resource`, `Timestamp`. These logs must be immutable (Write Once Read Many storage).

---

## 9. Interview Prep

### 9.1 Common Questions
1.  **Q:** Hashing vs Encryption?
    -   *A:* Hashed data (Passwords) cannot be reversed one-way. Encrypted data (Credit Card) can represent original text with key.
2.  **Q:** How to store passwords?
    -   *A:* BCrypt or Argon2 (Slow hashing + Salt).

### 9.2 Whiteboard Prompt
*"Secure an internal API that has no user context (Machine to Machine)."*
-   **Solution:** Client Credentials Flow (OAuth2) or mTLS (Mutual TLS).

---

## 10. Practice Exercises

1.  **Basic:** Attempt a SQL Injection on a local app. Fix it.
2.  **Intermediate:** Configure a Vault server and read a secret from Spring Boot.
3.  **Advanced:** Implement an Audit Aspect that intercepts `@Auditable` methods and saves logs to specific generic collection.

---

## 11. Checklists

### Pre-Flight Security
- [ ] **HTTPS:** Is it forced? (HSTS header).
- [ ] **Cors:** Is it restrictive?
- [ ] **Actuator:** Are sensitive endpoints hidden?

---

## 12. References
-   *OWASP Top 10*
-   *NIST Cybersecurity Framework*
