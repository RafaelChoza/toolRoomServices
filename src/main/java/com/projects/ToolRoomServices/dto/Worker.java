package com.projects.ToolRoomServices.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nameWorker;
    private String lastName;
    private Long employNumber;
    private LocalDate date;

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getNameWorker() {
        return nameWorker;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNameWorker(String nameWorker) {
        this.nameWorker = nameWorker;
    }

    public Long getEmployNumber() {
        return employNumber;
    }

    public void setEmployNumber(Long employNumber) {
        this.employNumber = employNumber;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "Worker{" +
                "id=" + id +
                ", nameWorker='" + nameWorker + '\'' +
                ", lastName='" + lastName + '\'' +
                ", employNumber=" + employNumber +
                ", date=" + date +
                '}';
    }

}
