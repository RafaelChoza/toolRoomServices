package com.projects.ToolRoomServices.repositories;

import com.projects.ToolRoomServices.dto.ToolRoomService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToolRoomServiceRepository extends JpaRepository<ToolRoomService, Long> {
}
