package com.projects.ToolRoomServices.controller;

import com.projects.ToolRoomServices.dto.ToolRoomService;
import com.projects.ToolRoomServices.service.ToolRoomServicesService;
import jakarta.transaction.TransactionScoped;
import org.aspectj.apache.bcel.classfile.Module;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.auditing.AuditingHandlerSupport;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ToolRoomServiceControllerTest {

    @Mock
    ToolRoomServicesService toolRoomServicesService;

    @InjectMocks
    ToolRoomServiceController toolRoomServiceController;


    @Test
    void getServices() {
        int services = 5;
        List<ToolRoomService> servicesListExpected = crearServicios(services);

        //Configuramos el comportamiento del mock
        when(toolRoomServicesService.getAllServices()).thenReturn(servicesListExpected);

        //Ejecutamos el metodo del controlador
        List<ToolRoomService> toolRoomServiceListActual = toolRoomServicesService.getAllServices();

        //Validamos el resultado
        assertEquals(services, toolRoomServiceListActual.size());
        assertEquals(servicesListExpected,toolRoomServiceListActual);
    }

    @Test
    void getServicesWhenDoNotExistServices() {

        //Configuramos el comportamiento del mock
        when(toolRoomServicesService.getAllServices()).thenReturn((List.of()));

        //Ejecutamos el método del controlador
        List<ToolRoomService> toolRoomServiceListActual = toolRoomServicesService.getAllServices();

        //Validamos el resultado
        assertTrue(toolRoomServiceListActual.isEmpty());
        verify(toolRoomServicesService, times(1)).getAllServices();
    }

    @Test
    void getServiceById() {
        Long id = 1L;
        Optional<ToolRoomService> serviceExpected = Optional.of(crearServicios(1).get(0));

        //Configuramos el comportamiento del mock
        when(toolRoomServicesService.getServiceById(id)).thenReturn(serviceExpected);

        //Ejecutamos el método del controlador
        ResponseEntity<ToolRoomService> toolRoomServiceResponseEntity = toolRoomServiceController.getServiceById(id).getResponseEntity();
        ToolRoomService actualService = toolRoomServiceResponseEntity.getBody();

        //Validamos el resultado
        assertEquals(200, toolRoomServiceResponseEntity.getStatusCode().value());
        assertNotNull(actualService);
        assertEquals("Rafael 1", actualService.getCustomer());
    }

    @Test
    void whenToolRoomServiceByIdDoesNotExist() {
        Long id = 1L;

        //Configuramos el comportamiento del mock
        when(toolRoomServicesService.getServiceById(id)).thenReturn(Optional.empty());

        //Ejecutamos el método del controlador
        ResponseEntity<ToolRoomService> toolRoomServiceResponseEntity = toolRoomServiceController.getServiceById(id).getResponseEntity();
        ToolRoomService actualToolRoomService = toolRoomServiceResponseEntity.getBody();

        //Validamos el resultado
        assertEquals(404, toolRoomServiceResponseEntity.getStatusCode().value());
        assertTrue(Objects.isNull(actualToolRoomService));
    }

    @Test
    void createService() {

        //Configuramos el comportamiento del mock

        //Ejecutamos el método del controlador

        //Validamos el resultado
    }

    @Test
    void updateService() {

        //Configuramos el comportamiento del mock

        //Ejecutamos el método del controlador

        //Validamos el resultado
    }

    @Test
    void deleteToolRoomService() {
    }

    private List<ToolRoomService> crearServicios(int elementos) {
        return IntStream.range(1, elementos + 1)
                .mapToObj(i -> {
                    ToolRoomService toolRoomService = new ToolRoomService();
                    toolRoomService.setId((long) i); // Opcional si usas @GeneratedValue
                    toolRoomService.setDescriptionService("Descripción " + i);
                    toolRoomService.setDateTime(LocalDateTime.now().minusDays(i)); // o cualquier lógica
                    toolRoomService.setCustomer("Rafael " + i);
                    toolRoomService.setStatus("Recibido");
                    toolRoomService.setArea("Área " + i);
                    toolRoomService.setWorker("Por definir");
                    return toolRoomService;
                }).collect(Collectors.toList());
    }

}