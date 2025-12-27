package io.riverrun.config;

import io.riverrun.domain.model.Role;
import io.riverrun.domain.model.Tenant;
import io.riverrun.domain.model.User;
import io.riverrun.domain.repository.RoleRepository;
import io.riverrun.domain.repository.TenantRepository;
import io.riverrun.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.UUID;

/**
 * Initializes default data on application startup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if admin user already exists
        if (userRepository.findByUsername("admin").isPresent()) {
            log.info("Admin user already exists, updating password...");
            User admin = userRepository.findByUsername("admin").get();
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            log.info("Admin password updated successfully");
        } else {
            log.info("Creating default admin user...");

            // Get default tenant
            Tenant defaultTenant = tenantRepository.findById(UUID.fromString("00000000-0000-0000-0000-000000000001"))
                    .orElseThrow(() -> new RuntimeException("Default tenant not found"));

            // Get ADMIN role
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            // Create admin user
            User admin = new User();
            admin.setId(UUID.fromString("20000000-0000-0000-0000-000000000001"));
            admin.setUsername("admin");
            admin.setEmail("admin@riverrun.io");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setEnabled(true);
            admin.setTenantId(defaultTenant.getId());
            admin.setRoles(Set.of(adminRole));

            userRepository.save(admin);
            log.info("Default admin user created successfully");
        }
    }
}
