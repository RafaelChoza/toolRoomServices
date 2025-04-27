package com.projects.ToolRoomServices.repositories;

import com.projects.ToolRoomServices.model.ToolRoomServiceCompleted;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToolRoomServiceCompletedRepository extends JpaRepository<ToolRoomServiceCompleted, Long> {
}
