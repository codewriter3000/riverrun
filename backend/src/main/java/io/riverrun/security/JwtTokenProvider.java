package io.riverrun.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

/**
 * JWT token utility for generating and validating tokens.
 */
@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${riverrun.jwt.secret:defaultSecretKeyThatShouldBeChangedInProduction1234567890}")
    private String secret;

    @Value("${riverrun.jwt.expiration:86400000}") // 24 hours
    private long jwtExpiration;

    @Value("${riverrun.jwt.expiration-remember-me:2592000000}") // 30 days
    private long jwtExpirationRememberMe;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(UUID userId, String username, UUID tenantId) {
        return generateToken(userId, username, tenantId, false);
    }

    public String generateToken(UUID userId, String username, UUID tenantId, boolean rememberMe) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId.toString());
        claims.put("tenantId", tenantId.toString());
        long expiration = rememberMe ? jwtExpirationRememberMe : jwtExpiration;
        return createToken(claims, username, expiration);
    }

    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .claims()
                    .add(claims)
                    .subject(subject)
                    .issuedAt(new Date(System.currentTimeMillis()))
                    .expiration(new Date(System.currentTimeMillis() + expiration))
                    .and()
                .signWith(getSigningKey())
                .compact();
    }

    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(extractClaim(token, claims -> claims.get("userId", String.class)));
    }

    public UUID extractTenantId(String token) {
        return UUID.fromString(extractClaim(token, claims -> claims.get("tenantId", String.class)));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

}
