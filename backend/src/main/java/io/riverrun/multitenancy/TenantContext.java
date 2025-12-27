package io.riverrun.multitenancy;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Thread-local storage for current tenant context.
 * Used by JPA filters and service layer to isolate tenant data.
 */
@Component
@Slf4j
public class TenantContext {

    private static final ThreadLocal<UUID> CURRENT_TENANT = new ThreadLocal<>();

    @Value("${riverrun.multi-tenancy.default-tenant-id}")
    private String defaultTenantId;

    public UUID getCurrentTenant() {
        UUID tenantId = CURRENT_TENANT.get();
        if (tenantId == null) {
            log.debug("No tenant set in context, using default: {}", defaultTenantId);
            return UUID.fromString(defaultTenantId);
        }
        return tenantId;
    }

    public void setCurrentTenant(UUID tenantId) {
        if (tenantId == null) {
            log.warn("Attempted to set null tenant ID");
            return;
        }
        log.debug("Setting current tenant to: {}", tenantId);
        CURRENT_TENANT.set(tenantId);
    }

    public void clear() {
        log.debug("Clearing tenant context");
        CURRENT_TENANT.remove();
    }

}
