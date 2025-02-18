package com.magictl.service;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.magictl.entity.Cliente;
import com.magictl.entity.Cuenta;
import com.magictl.entity.Dispositivo;

@Service
public class TareaProgramadaService {
	
	
	private final ClienteService servicioCliente;
	private final CuentaService servicioCuenta;
	private final DispositivoService servicioDispositivo;
	

    // 🔹 Constructor con inyección de dependencias
    public TareaProgramadaService(ClienteService servicioCliente, 
                                  CuentaService servicioCuenta, 
                                  DispositivoService servicioDispositivo) {
        this.servicioCliente = servicioCliente;
        this.servicioCuenta = servicioCuenta;
        this.servicioDispositivo = servicioDispositivo;
    }

    // 🔹 Tarea cada 10 segundos (prueba)
    @Scheduled(fixedRate = 18000000)
    public void tareaCada5Horas() {
		
    	
		// --- PROCESO DE ACTUALIZACIÓN DE CLIENTES ---
		int pageTemp = 0; // Variable auxiliar para iterar sobre todas las páginas
		int size = 15;
		Pageable pageableTemp;
		Page<Cliente> paginaTemp;
		LocalDate fechaHoy = LocalDate.now();
		do {
			pageableTemp = PageRequest.of(pageTemp, size); // Crear paginador temporal
			paginaTemp = servicioCliente.listaDeClientesPagin(pageableTemp);
			
			for (Cliente cliente : paginaTemp.getContent()) {
				if (cliente.getEstado().equals("Activo")) {
					if (cliente.getFecvenc().plusDays(1).isBefore(fechaHoy)) { // Si la cuenta ya pasó de hoy mas un día
						
						Cliente clienteconsultado = servicioCliente.obtenerClientePorNombre(cliente.getNomcliente());
	                    String usuario = clienteconsultado.getUsuario();
	                    
	                    // 🔹 Volver a consultar la cuenta para evitar caché de Hibernate
	                    Cuenta cuentaActualizada = servicioCuenta.obtenerCuentaPorUsuario(usuario);
	                    int PerfenusoCuenta = cuentaActualizada.getPerfenuso();
	                    Pageable pageable = PageRequest.of(0, 6);
	                    Page<Dispositivo> paginaDispositivos = servicioDispositivo.buscarporLetraPagin(cliente.getNomcliente(), pageable);
	                    int totalRegistros = (int) paginaDispositivos.getTotalElements();

	                    int nuevoPerfenuso = PerfenusoCuenta - totalRegistros;
	                    
	                    
	                    servicioCuenta.actualizarPerfenuso(usuario, nuevoPerfenuso);
						
						servicioCliente.desactivarCliente(cliente.getNomcliente(), "Inactivo");
						//servicioCliente.actualizarUsuario(cliente.getNomcliente(), "Sin usuario");
					} 
				}
			}
			pageTemp++; // Avanzar a la siguiente página

		} while (!paginaTemp.isLast());

    	System.err.println("⏳ Tarea ejecutada cada 10 segundos");
    	
    }
    
    
    
	
}
