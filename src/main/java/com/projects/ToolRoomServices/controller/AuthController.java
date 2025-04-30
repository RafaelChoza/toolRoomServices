package com.projects.ToolRoomServices.controller;

import com.projects.ToolRoomServices.dto.LoginUser;
import com.projects.ToolRoomServices.service.LoginService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/")
public class AuthController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
        return ResponseEntity.badRequest().body(Map.of("error", "Username y password son requeridos"));
    }

    LoginUser user = loginService.findByUsername(loginRequest.getUsername());
    if (user != null && user.verifyPassword(loginRequest.getPassword())) {
        return ResponseEntity.ok(Map.of(
            "message", "Login exitoso",
            "username", user.getUsername(),
            "perfil", user.getPerfil()
        ));
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Usuario o contraseña incorrectos"));
    }
}
}

class LoginRequest {
    private String username;
    private String password;
    private String perfil;

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }
    // Getters y Setters

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

class LoginResponse {
    private String username;
    private String perfil;

    public LoginResponse(String username, String perfil) {
        this.username = username;
        this.perfil = perfil;
    }

    public String getUsername() {
        return username;
    }

    public String getPerfil() {
        return perfil;
    }
}
