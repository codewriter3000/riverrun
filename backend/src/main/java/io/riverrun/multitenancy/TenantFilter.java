package io.riverrun.multitenancy;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Servlet filter that extracts tenant ID from request header and sets it in TenantContext.
 * Header: X-Tenant-ID
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TenantFilter extends OncePerRequestFilter {

    private static final String TENANT_HEADER = "X-Tenant-ID";

    private final TenantContext tenantContext;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        try {
            String tenantIdHeader = request.getHeader(TENANT_HEADER);
            if (tenantIdHeader != null && !tenantIdHeader.isEmpty()) {
                try {
                    UUID tenantId = UUID.fromString(tenantIdHeader);
                    tenantContext.setCurrentTenant(tenantId);
                    log.debug("Tenant set from header: {}", tenantId);
                } catch (IllegalArgumentException e) {
                    log.warn("Invalid tenant ID in header: {}", tenantIdHeader);
                }
            } else {
                log.debug("No tenant header found, using default");
            }

            filterChain.doFilter(request, response);
        } finally {
            tenantContext.clear();
        }
    }

}
