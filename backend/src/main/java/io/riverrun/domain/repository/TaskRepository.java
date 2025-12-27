package io.riverrun.domain.repository;

import io.riverrun.domain.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByCaseEntityId(UUID caseId);

    List<Task> findByAssignedTo(UUID userId);

    List<Task> findByStatus(String status);

}
