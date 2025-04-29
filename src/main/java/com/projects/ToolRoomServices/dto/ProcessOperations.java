package com.projects.ToolRoomServices.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ProcessOperations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nameProcess;
    private String descriptionProcess;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameProcess() {
        return nameProcess;
    }

    public void setNameProcess(String nameProcess) {
        this.nameProcess = nameProcess;
    }

    public String getDescriptionProcess() {
        return descriptionProcess;
    }

    public void setDescriptionProcess(String descriptionProcess) {
        this.descriptionProcess = descriptionProcess;
    }

    @Override
    public String toString() {
        return "ProcessOperations{" +
                "id=" + id +
                ", nameProcess='" + nameProcess + '\'' +
                ", descriptionProcess='" + descriptionProcess + '\'' +
                '}';
    }
}
