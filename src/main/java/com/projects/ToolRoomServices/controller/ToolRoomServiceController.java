package com.projects.ToolRoomServices.controller;

import com.projects.ToolRoomServices.dto.LoginUser;
import com.projects.ToolRoomServices.dto.ToolRoomService;
import com.projects.ToolRoomServices.dto.Worker;
import com.projects.ToolRoomServices.model.ToolRoomServiceCompleted;
import com.projects.ToolRoomServices.service.LoginService;
import com.projects.ToolRoomServices.service.ToolRoomServicesService;
import org.apache.juli.logging.Log;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
public class ToolRoomServiceController {

    private static final Logger log = LoggerFactory.getLogger(ToolRoomServiceController.class);
    @Autowired
    ToolRoomServicesService toolRoomServicesService;

    @Autowired
    LoginService loginService;

    @GetMapping("/services")
    public ResponseWrapper<List<ToolRoomService>> getServices() {
        System.out.println("Obteniendo Servicios");
        log.info("Obteniendo Servicios");
        List<ToolRoomService> toolRoomServiceList = toolRoomServicesService.getAllServices();
        ResponseEntity<List<ToolRoomService>> responseEntity = ResponseEntity.ok(toolRoomServiceList);

        return new ResponseWrapper<>(true, "Listado de Usuarios", responseEntity);
    }

    @GetMapping("/services/{id}")
    public ResponseWrapper<ToolRoomService> getServiceById(@PathVariable Long id) {
        System.out.println("Id recibido: " + id);
        Optional<ToolRoomService> toolRoomServiceOptional = toolRoomServicesService.getServiceById(id);
        log.info("Obteniendo servicio por si id {}", id);
        ResponseEntity<ToolRoomService> toolRoomServiceResponseEntity =
                toolRoomServiceOptional.map(ResponseEntity::ok).orElseGet(()-> ResponseEntity.notFound().build());
        return new ResponseWrapper<>(true, "Informacion del servicio " + id, toolRoomServiceResponseEntity);
    }

    @PostMapping("/services")
    public ResponseWrapper<ToolRoomService> createService(@RequestBody ToolRoomService toolRoomService) {
        try {
            ToolRoomService toolRoomServiceCreated = toolRoomServicesService.createService(toolRoomService);
            ResponseEntity<ToolRoomService> responseEntity = ResponseEntity.created(new URI("http://localhost/services")).build();
            return new ResponseWrapper<>( true, "Servicio creado con éxito", responseEntity);
        } catch (Exception e) {
            ResponseEntity<ToolRoomService> responseEntity = ResponseEntity.badRequest().build();
            return new ResponseWrapper<>(false, e.getMessage(), responseEntity);
        }
    }

    @PutMapping("/services/{id}")
    public ResponseWrapper<ToolRoomService> updateService(@PathVariable Long id, @RequestBody ToolRoomService updatedToolRoomService) {
        System.out.println("Id recibido: " + id);
        System.out.println("Servicio recibido: " + updatedToolRoomService);
        Optional<ToolRoomService> toolRoomServiceOptional = toolRoomServicesService.getServiceById(id);

        if (toolRoomServiceOptional.isPresent()) {
            updatedToolRoomService.setId(toolRoomServiceOptional.get().getId());
            toolRoomServicesService.updateService(updatedToolRoomService);

            ResponseEntity<ToolRoomService> responseEntity = ResponseEntity.ok(updatedToolRoomService);
            return new ResponseWrapper<>(true, "Servicio actualziado con éxito", responseEntity);
        } else {
            ResponseEntity<ToolRoomService> responseEntity = ResponseEntity.notFound().build();
            return new ResponseWrapper<>(false, "El servicio indicado no existe", responseEntity);
        }
    }


    @DeleteMapping("/services/{id}")
    public ResponseWrapper<Void> deleteToolRoomService(@PathVariable Long id) {

        Optional<ToolRoomService> toolRoomServiceOptional = toolRoomServicesService.getServiceById(id);
        if (toolRoomServiceOptional.isPresent()) {
            System.out.println("Id recibido: " + id);
            toolRoomServicesService.deleteService(id);
            ResponseEntity<Void> responseEntity = ResponseEntity.noContent().build();
            return new ResponseWrapper<>(true, "Servicio eliminado con éxito", responseEntity);
        } else {
            ResponseEntity<Void> responseEntity = ResponseEntity.notFound().build();
            return new ResponseWrapper<>(false, "El servicio a eliminar no existe", responseEntity);
        }
    }

    @PostMapping("/services/{id}/complete")
    public ResponseWrapper<ToolRoomService> completeService(@PathVariable Long id) {
        try {
            Optional<ToolRoomService> optionalService = toolRoomServicesService.getServiceById(id);

            if(optionalService.isPresent()) {
                ToolRoomService service = optionalService.get();

                toolRoomServicesService.moveToCompleted(service);

                toolRoomServicesService.deleteService(id);

                ResponseEntity<ToolRoomService> responseEntity = ResponseEntity.ok(service);
                return new ResponseWrapper<>(true, "Servicio marcado como completado y movido a servicios completados", responseEntity);
            } else {
                throw new Exception("El servicio con el id proporcionado no existe.");
            }
        } catch (Exception e) {
            log.error("Error completando el servicio:", e);
            ResponseEntity<ToolRoomService> responseEntity = ResponseEntity.status(500).build();
            return new ResponseWrapper<>(false, "Ocurrió un error al completar el servicio: " + e.getMessage(), responseEntity);
        }
    }

    @GetMapping("/completed")
    public ResponseWrapper<List<ToolRoomServiceCompleted>> getAllServicesCompleted() {
        System.out.println("Obteniendo Servicios");
        log.info("Obteniendo Servicios Completados");
        List<ToolRoomServiceCompleted> toolRoomCompletedServicesList = toolRoomServicesService.getAllServicesCompleted();
        System.out.println("Listado de servicios completados: " + toolRoomCompletedServicesList);
        ResponseEntity<List<ToolRoomServiceCompleted>> responseEntity = ResponseEntity.ok(toolRoomCompletedServicesList);


        return new ResponseWrapper<>(true, "Listado de Servicios Completados", responseEntity);
    }

    @GetMapping("/workers")
    public ResponseWrapper<List<Worker>> getAllWorkers() {
        System.out.println("Obteniendo los trabajadores");
        log.info("Obteniendo Trabajadores");
        List<Worker> workersList = toolRoomServicesService.getAllWorkers();
        System.out.println("Listado de trabajadores: " + workersList);
        ResponseEntity<List<Worker>> responseEntity = ResponseEntity.ok(workersList);


        return new ResponseWrapper<>(true, "Listado de Trabajadores", responseEntity);
    }

    @GetMapping("/workers/{id}")
    public ResponseWrapper<Worker> getWorkerById(@PathVariable Long id) {
        System.out.println("Id recibido: " + id);
        Optional<Worker> workerOptional = toolRoomServicesService.getWorkerById(id);
        log.info("Obteniendo trabajador por si id {}", id);
        ResponseEntity<Worker> workerResponseEntity =
                workerOptional.map(ResponseEntity::ok).orElseGet(()-> ResponseEntity.notFound().build());
        return new ResponseWrapper<>(true, "Informacion del trabajador " + id, workerResponseEntity);
    }

    @PostMapping("/workers")
    public ResponseWrapper<Worker> createWorker(@RequestBody Worker worker) {
        try {
            Worker workerCreated = toolRoomServicesService.createWorker(worker);
            ResponseEntity<Worker> responseEntity = ResponseEntity.created(new URI("http://localhost/workers")).build();
            return new ResponseWrapper<>( true, "Trabajador creado con éxito", responseEntity);
        } catch (Exception e) {
            ResponseEntity<Worker> responseEntity = ResponseEntity.badRequest().build();
            return new ResponseWrapper<>(false, e.getMessage(), responseEntity);
        }
    }

    @PutMapping("/workers/{id}")
    public ResponseWrapper<Worker> updateWorker(@PathVariable Long id, @RequestBody Worker updatedWorker) {
        System.out.println("Id recibido: " + id);
        System.out.println("Trabajador recibido: " + updatedWorker);
        Optional<Worker> workerOptional = toolRoomServicesService.getWorkerById(id);

        if (workerOptional.isPresent()) {
            updatedWorker.setId(workerOptional.get().getId());
            toolRoomServicesService.updateWorker(updatedWorker);

            ResponseEntity<Worker> responseEntity = ResponseEntity.ok(updatedWorker);
            return new ResponseWrapper<>(true, "Trabajador actualizado con éxito", responseEntity);
        } else {
            ResponseEntity<Worker> responseEntity = ResponseEntity.notFound().build();
            return new ResponseWrapper<>(false, "El trabajador indicado no existe", responseEntity);
        }
    }

    @DeleteMapping("/workers/{id}")
    public ResponseWrapper<Void> deleteWorker(@PathVariable Long id) {

        Optional<Worker> workerOptional = toolRoomServicesService.getWorkerById(id);
        if (workerOptional.isPresent()) {
            System.out.println("Id recibido: " + id);
            toolRoomServicesService.deleteWorker(id);
            ResponseEntity<Void> responseEntity = ResponseEntity.noContent().build();
            return new ResponseWrapper<>(true, "Trabajador eliminado con éxito", responseEntity);
        } else {
            ResponseEntity<Void> responseEntity = ResponseEntity.notFound().build();
            return new ResponseWrapper<>(false, "El trabajador a eliminar no existe", responseEntity);
        }
    }

    @PostMapping("/services/{serviceId}/assign/{workerId}")
    public ResponseWrapper<ToolRoomService> assignWorkerToService(@PathVariable Long serviceId, @PathVariable Long workerId) {
        try {
            ToolRoomService updatedService = toolRoomServicesService.assignWorkerToService(serviceId, workerId);
            return new ResponseWrapper<>(true, "Trabajador asignado correctamente al servicio", ResponseEntity.ok(updatedService));
        } catch (Exception e) {
            return new ResponseWrapper<>(false, e.getMessage(), ResponseEntity.badRequest().build());
        }
    }

    @GetMapping("/users")
    public ResponseWrapper<LoginUser> getAllUsers() {
        System.out.println("Obteniendo los usuarios");
        log.info("Obteniendo usuarios");
        List<LoginUser> loginUserList = loginService.getAllUsers();
        System.out.println("Listado de usuarios: " + loginUserList);
        ResponseEntity<List<LoginUser>> responseEntity = ResponseEntity.ok(loginUserList);

        return new ResponseWrapper(true, "Usuarios obtenidos con éxito", responseEntity);
    }

    @GetMapping("users/{id}")
    public ResponseWrapper<LoginUser> getUserById(@PathVariable  Long id) {
        System.out.println("Obteniendo usuario con id: " + id);
        log.info("Obteniendo usuarios con id: {}", id);
        Optional<LoginUser> userOptional = loginService.getUserById(id);
        ResponseEntity<LoginUser> loginUserResponseEntity;

        loginUserResponseEntity = userOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());

        return new ResponseWrapper<>(true, "Usuario con id obtenido", loginUserResponseEntity);
    }

    @PostMapping("/users")
    public ResponseWrapper<LoginUser> createUser(@RequestBody LoginUser loginUser) {
        try {
            LoginUser loginUserCreated = loginService.createUser(loginUser);
            ResponseEntity<LoginUser> responseEntity = ResponseEntity.created(new URI("http://localhost/users")).build();
            return new ResponseWrapper<>( true, "Usuario creado con éxito", responseEntity);
        } catch (Exception e) {
            ResponseEntity<LoginUser> responseEntity = ResponseEntity.badRequest().build();
            return new ResponseWrapper<>(false, e.getMessage(), responseEntity);
        }
    }

    @PutMapping("/users/{id}")
    public ResponseWrapper<LoginUser> updateUser(@PathVariable Long id, @RequestBody LoginUser updatedUser) {
        System.out.println("Id recibido: " + id);
        System.out.println("Usuario recibido: " + updatedUser);
        Optional<LoginUser> userOptional = loginService.getUserById(id);

        if (userOptional.isPresent()) {
            updatedUser.setId(userOptional.get().getId());
            loginService.updateUser(updatedUser);

            ResponseEntity<LoginUser> responseEntity = ResponseEntity.ok(updatedUser);
            return new ResponseWrapper<>(true, "Usuario actualizado con éxito", responseEntity);
        } else {
            ResponseEntity<LoginUser> responseEntity = ResponseEntity.notFound().build();
            return new ResponseWrapper<>(false, "El usuario indicado no existe", responseEntity);
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseWrapper<Void> deleteUser(@PathVariable Long id) {

        Optional<LoginUser> userOptional = loginService.getUserById(id);
        if (userOptional.isPresent()) {
            System.out.println("Id recibido: " + id);
            loginService.deleteUser(id);
            ResponseEntity<Void> responseEntity = ResponseEntity.noContent().build();
            return new ResponseWrapper<>(true, "Usuario eliminado con éxito", responseEntity);
        } else {
            ResponseEntity<Void> responseEntity = ResponseEntity.notFound().build();
            return new ResponseWrapper<>(false, "El usuario a eliminar no existe", responseEntity);
        }
    }
}
