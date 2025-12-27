package io.riverrun.domain.repository;

import io.riverrun.domain.model.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CaseRepository extends JpaRepository<Case, UUID> {

    List<Case> findByStatus(String status);

    List<Case> findByAssignedTo(UUID userId);

    @Query("SELECT c FROM Case c WHERE c.status = :status AND c.assignedTo = :userId")
    List<Case> findByStatusAndAssignedTo(@Param("status") String status, @Param("userId") UUID userId);

}
