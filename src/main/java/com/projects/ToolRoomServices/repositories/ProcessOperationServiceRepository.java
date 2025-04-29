package com.projects.ToolRoomServices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projects.ToolRoomServices.dto.ProcessOperations;

public interface ProcessOperationServiceRepository extends JpaRepository<ProcessOperations, Long> {

}
