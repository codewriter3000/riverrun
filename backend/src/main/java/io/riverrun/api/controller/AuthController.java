package io.riverrun.api.controller;

import io.riverrun.api.dto.AuthRequest;
import io.riverrun.api.dto.AuthResponse;
import io.riverrun.domain.model.User;
import io.riverrun.domain.repository.UserRepository;
import io.riverrun.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            log.info("User found: {}, enabled: {}, roles: {}, rememberMe: {}",
                user.getUsername(), user.getEnabled(), user.getRoles().size(), request.isRememberMe());

            String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getTenantId(), request.isRememberMe());

            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .tenantId(user.getTenantId())
                    .roles(user.getRoles().stream()
                            .map(role -> role.getName())
                            .collect(Collectors.toList()))
                    .build();

            log.info("Login successful for user: {}", request.getUsername());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Login failed for user: {}, error: {}", request.getUsername(), e.getMessage());
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtTokenProvider.extractUsername(token);

            if (jwtTokenProvider.validateToken(token, username)) {
                return ResponseEntity.ok("Token is valid");
            }
        }
        return ResponseEntity.badRequest().body("Invalid token");
    }

}
