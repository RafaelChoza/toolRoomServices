package com.projects.ToolRoomServices.repositories;

import com.projects.ToolRoomServices.dto.LoginUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginRepository extends JpaRepository<LoginUser, Long> {
    LoginUser findByUsername(String username);
}
