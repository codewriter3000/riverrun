package io.riverrun.audit;

import io.riverrun.domain.model.AuditLog;
import io.riverrun.domain.repository.AuditLogRepository;
import io.riverrun.multitenancy.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

/**
 * Service for creating audit log entries.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final TenantContext tenantContext;

    public void logCreate(String entityType, UUID entityId, Map<String, Object> newValues) {
        createAuditLog(entityType, entityId, "CREATE", null, newValues);
    }

    public void logUpdate(String entityType, UUID entityId, Map<String, Object> oldValues, Map<String, Object> newValues) {
        createAuditLog(entityType, entityId, "UPDATE", oldValues, newValues);
    }

    public void logDelete(String entityType, UUID entityId, Map<String, Object> oldValues) {
        createAuditLog(entityType, entityId, "DELETE", oldValues, null);
    }

    public void logStateChange(String entityType, UUID entityId, String oldState, String newState) {
        Map<String, Object> oldValues = Map.of("state", oldState);
        Map<String, Object> newValues = Map.of("state", newState);
        createAuditLog(entityType, entityId, "STATE_CHANGE", oldValues, newValues);
    }

    private void createAuditLog(String entityType, UUID entityId, String action,
                                Map<String, Object> oldValues, Map<String, Object> newValues) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication != null ? authentication.getName() : "system";

            AuditLog auditLog = AuditLog.builder()
                    .entityType(entityType)
                    .entityId(entityId)
                    .action(action)
                    .username(username)
                    .oldValues(oldValues)
                    .newValues(newValues)
                    .changes(calculateChanges(oldValues, newValues))
                    .build();

            auditLog.setTenantId(tenantContext.getCurrentTenant());

            auditLogRepository.save(auditLog);
            log.debug("Audit log created: {} {} for entity {}", action, entityType, entityId);
        } catch (Exception e) {
            log.error("Failed to create audit log", e);
            // Don't fail the main operation if audit logging fails
        }
    }

    private Map<String, Object> calculateChanges(Map<String, Object> oldValues, Map<String, Object> newValues) {
        if (oldValues == null || newValues == null) {
            return null;
        }

        return newValues.entrySet().stream()
                .filter(entry -> {
                    Object oldValue = oldValues.get(entry.getKey());
                    Object newValue = entry.getValue();
                    return !java.util.Objects.equals(oldValue, newValue);
                })
                .collect(java.util.stream.Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> Map.of(
                                "old", oldValues.get(entry.getKey()),
                                "new", entry.getValue()
                        )
                ));
    }

}
