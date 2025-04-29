package com.projects.ToolRoomServices.service;

import com.projects.ToolRoomServices.dto.ProcessOperations;
import com.projects.ToolRoomServices.dto.ToolRoomService;
import com.projects.ToolRoomServices.dto.Worker;
import com.projects.ToolRoomServices.model.ToolRoomServiceCompleted;
import com.projects.ToolRoomServices.repositories.ProcessOperationServiceRepository;
import com.projects.ToolRoomServices.repositories.ToolRoomServiceCompletedRepository;
import com.projects.ToolRoomServices.repositories.ToolRoomServiceRepository;
import com.projects.ToolRoomServices.repositories.WorkerServiceRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
public class ToolRoomServicesService {

    @Autowired
    ToolRoomServiceRepository toolRoomServiceRepository;

    @Autowired
    ToolRoomServiceCompletedRepository toolRoomServiceCompletedRepository;

    @Autowired
    EntityManager entityManager;

    @Autowired
    WorkerServiceRepository workerServiceRepository;

    @Autowired
    ProcessOperationServiceRepository processOperationServiceRepository;

    public ToolRoomService createService(ToolRoomService toolRoomService) {
        return toolRoomServiceRepository.save(toolRoomService);
    }

    public Optional<ToolRoomService> getServiceById(Long idService) {
        return toolRoomServiceRepository.findById(idService);
    }

    public List<ToolRoomService> getAllServices() {
        return toolRoomServiceRepository.findAll();
    }

    public ToolRoomService updateService(ToolRoomService toolRoomService) {
        return toolRoomServiceRepository.save(toolRoomService);
    }

    public void deleteService(Long idService) {
        toolRoomServiceRepository.deleteById(idService);
    }

    @Transactional
    public void moveToCompleted(ToolRoomService service) {
        ToolRoomServiceCompleted completedService = new ToolRoomServiceCompleted();

        completedService.setCustomer(service.getCustomer());
        completedService.setEmail(service.getEmail());
        completedService.setDateTime(service.getDateTime()); // Fecha de creación
        completedService.setCompletedDateTime(LocalDateTime.now(ZoneId.of("America/Mexico_City"))); // Fecha de finalización

        // Calcula los días entre dateTime y completedDateTime
        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(
                service.getDateTime(), LocalDateTime.now(ZoneId.of("America/Mexico_City"))
        );

        completedService.setDays(daysBetween); // Asigna el resultado al nuevo campo
        completedService.setDescriptionService(service.getDescriptionService());
        completedService.setWorker(service.getWorker());
        completedService.setProcess1(service.getProceso1());
        completedService.setProcess2(service.getProceso2());
        completedService.setProcess3(service.getProceso3());
        completedService.setArea(service.getArea());
        completedService.setStatus("Completado");

        System.out.println(completedService);


        entityManager.persist(completedService);
    }

    public List<ToolRoomServiceCompleted> getAllServicesCompleted() {
        return toolRoomServiceCompletedRepository.findAll();
    }

    public List<Worker> getAllWorkers() {
        return workerServiceRepository.findAll();
    }

    public Optional<Worker> getWorkerById(Long id) {
        return workerServiceRepository.findById(id);
    }

    public Worker createWorker(Worker worker) {
        return workerServiceRepository.save(worker);
    }

    public Worker updateWorker(Worker worker) {
        return workerServiceRepository.save(worker);
    }

    public void deleteWorker(Long idWorker) {
        workerServiceRepository.deleteById(idWorker);
    }

    @Transactional
    public ToolRoomService assignWorkerToService(Long serviceId, Long workerId) {
        ToolRoomService service = toolRoomServiceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        Worker worker = workerServiceRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));

        service.setWorker(worker.getNameWorker() + worker.getLastName()); // ← Solo guardas el nombre como String

        return toolRoomServiceRepository.save(service);
    }

    public List<ProcessOperations> getAllProcessOperations() {
        return processOperationServiceRepository.findAll();
    }

    public Optional<ProcessOperations> getProcessOperationById(Long id) {
        return processOperationServiceRepository.findById(id);
    }

    public ProcessOperations createProcessOperation(ProcessOperations processOperation) {
        return processOperationServiceRepository.save(processOperation);
    }

    public ProcessOperations updateProcessOperation(ProcessOperations processOperation) {
        return processOperationServiceRepository.save(processOperation);
    }

    public void deleteProcessOperation(Long id) {
        processOperationServiceRepository.deleteById(id);
    }
}
