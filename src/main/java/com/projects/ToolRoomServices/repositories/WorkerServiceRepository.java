package com.projects.ToolRoomServices.repositories;

import com.projects.ToolRoomServices.dto.Worker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkerServiceRepository extends JpaRepository<Worker, Long> {
}
