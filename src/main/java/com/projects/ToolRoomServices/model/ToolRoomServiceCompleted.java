package com.projects.ToolRoomServices.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "services_completed")
public class ToolRoomServiceCompleted {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customer;
    private String email;
    private String descriptionService;
    private String worker;
    private String process1;
    private String process2;
    private String process3;
    private String area;
    private String status;
    private LocalDateTime dateTime;

    public long getDays() {
        return days;
    }

    public void setDays(long days) {
        this.days = days;
    }

    private long days;

    public LocalDateTime getCompletedDateTime() {
        return completedDateTime;
    }

    public void setCompletedDateTime(LocalDateTime completedDateTime) {
        this.completedDateTime = completedDateTime;
    }

    private LocalDateTime completedDateTime;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
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

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProcess1() {
        return process1;
    }

    public void setProcess1(String process1) {
        this.process1 = process1;
    }

    public String getProcess2() {
        return process2;
    }

    public void setProcess2(String process2) {
        this.process2 = process2;
    }

    public String getProcess3() {
        return process3;
    }

    public void setProcess3(String process3) {
        this.process3 = process3;
    }
    
}
