package com.projects.ToolRoomServices.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;

@Entity
public class ToolRoomService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customer;
    private String email;
    private LocalDateTime dateTime;
    private String descriptionService;
    private String worker = "Sin asignar";
    private String proceso1 = "Sin asignar";
    private String proceso2 = "Sin asignar";
    private String proceso3 = "Sin asignar";
    private String area;
    private String status = "Recibido";

    // Constructor vacío o con parámetros, según lo necesites

    public String getProceso1() {
        return proceso1;
    }

    public void setProceso1(String proceso1) {
        this.proceso1 = proceso1;
    }

    public String getProceso2() {
        return proceso2;
    }

    public void setProceso2(String proceso2) {
        this.proceso2 = proceso2;
    }

    public String getProceso3() {
        return proceso3;
    }

    public void setProceso3(String proceso3) {
        this.proceso3 = proceso3;
    }

    public ToolRoomService() {
    }

    @PrePersist
    public void prePersist() {
        if (this.dateTime == null) {
            this.dateTime = LocalDateTime.now(); // Asigna la fecha y hora actual si no está presente
        }
    }

    // Getters y setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCustomer() {
        return customer;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getDescriptionService() {
        return descriptionService;
    }

    public void setDescriptionService(String descriptionService) {
        this.descriptionService = descriptionService;
    }

    public String getWorker() {
        return worker;
    }

    public void setWorker(String worker) {
        this.worker = worker;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
