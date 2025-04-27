package com.projects.ToolRoomServices.service;

import com.projects.ToolRoomServices.dto.LoginUser;
import com.projects.ToolRoomServices.repositories.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    public boolean authenticate(String username, String password, String perfil) {
        LoginUser loginUser = loginRepository.findByUsername(username);
        if (loginUser != null) {
            return loginUser.getPassword().equals(password);
        }
        return false;
    }

    public List<LoginUser> getAllUsers() {
        return loginRepository.findAll();
    }

    public Optional<LoginUser> getUserById(Long id) {
        return loginRepository.findById(id);
    }

    public LoginUser createUser(LoginUser loginUser) {
        return loginRepository.save(loginUser);
    }

    public LoginUser updateUser(LoginUser loginUser) {
        return loginRepository.save(loginUser);
    }

    public void deleteUser(Long id) {
        loginRepository.deleteById(id);
    }

    public LoginUser findByUsername(String username) {
        return loginRepository.findByUsername(username);
    }
}
