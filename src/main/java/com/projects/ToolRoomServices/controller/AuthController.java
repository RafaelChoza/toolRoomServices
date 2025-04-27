package com.projects.ToolRoomServices.controller;

import com.projects.ToolRoomServices.dto.LoginUser;
import com.projects.ToolRoomServices.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth/login")
public class AuthController {

    @Autowired
    private LoginService loginService;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest().body("Username y password son requeridos");
            }

            LoginUser loginUser = loginService.findByUsername(loginRequest.getUsername());
            if (loginUser != null && loginUser.getPassword().equals(loginRequest.getPassword())) {
                // Aquí devolvemos un objeto con username y perfil
                return ResponseEntity.ok(new LoginResponse(loginUser.getUsername(), loginUser.getPerfil()));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Hubo un error en el servidor");
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

