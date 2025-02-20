package com.magictl.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.magictl.entity.Cliente;
import com.magictl.entity.Cuenta;
import com.magictl.entity.Dispositivo;
import com.magictl.service.ClienteService;
import com.magictl.service.CuentaService;
import com.magictl.service.DispositivoService;
import com.magictl.service.PlanService;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/clientes")
public class ClienteController {

	@Autowired
	private ClienteService servicioCliente;

	@Autowired
	private PlanService servicioPlan;

	@Autowired
	private CuentaService servicioCuenta;

	@Autowired
	private DispositivoService servicioDispositivo;
	

	@GetMapping("/")
	public String principal(Model model, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "15") int size) {
		
		// --- AHORA SE OBTIENE LA PÁGINA QUE SE MOSTRARÁ EN LA VISTA ---
		Pageable pageable = PageRequest.of(page, size); // Recuperar la página que el usuario solicitó
		Page<Cliente> pagina = servicioCliente.listaDeClientesPagin(pageable);

		// Enviar datos correctos a la vista
		model.addAttribute("clientes", pagina);
		model.addAttribute("totalPaginas", pagina.getTotalPages());
		model.addAttribute("paginaActual", pagina.getNumber());
		model.addAttribute("totalRegistros", pagina.getTotalElements());
		model.addAttribute("planes", servicioPlan.listaDePlanes());
		model.addAttribute("cliente", new Cliente());
		return "clientes";
	}


	@GetMapping("/busqueda")
	@ResponseBody
	public Page<Cliente> obtenerSugerencias(@RequestParam() String letra, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "15") int size) {

		Pageable pageable = PageRequest.of(page, size);
		Page<Cliente> paginasSugerencias = servicioCliente.buscarporLetraPagin(letra, pageable);
		return paginasSugerencias;
	}


	@GetMapping("/inactivos")
	@ResponseBody
	public Page<Cliente> listadeInactivosPage(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "15") int size) {

		Pageable pageable = PageRequest.of(page, size);
		Page<Cliente> clientesInactivos = servicioCliente.listaDeInactivosPagin(pageable);

		return clientesInactivos;
	}

	@GetMapping("/clientesporUsuario")
	@ResponseBody
	public List<Cliente> obtenerClientesporUsuario(@RequestParam() String usuario) {
		return servicioCliente.listarPorUsuario(usuario);
	}

	@GetMapping("/listadinamicaselect")
	@ResponseBody
	public List<Map<String, String>> obtenerListaSelect() {
		List<Cuenta> listaDeCuentas = servicioCuenta.listaDeCuentasDesc();

		List<Map<String, String>> cuentasFormateadas = listaDeCuentas.stream().map(cuenta -> {
			Map<String, String> map = new HashMap<>();
			map.put("usuario", cuenta.getUsuario());
			map.put("formattedText",
					String.format("%-15s | %-10s / %-10s | %-20s | %s", cuenta.getUsuario(), cuenta.getPerfenuso(),
							cuenta.getServicio().getPerfiles(), cuenta.getInstalacion(), cuenta.getFecvenc()));
			return map;
		}).toList();

		return cuentasFormateadas;
	}

	String nombreCliente = ""; // Para cambiar luego el valor perfenuso de la cuenta
	String estadoAnterior = "";
	String usuarioAnterior = "";
	int perfenusoCuentaAnterior = 0;
	@GetMapping("/buscar/{nomcliente}")
	@ResponseBody
	public ResponseEntity<Cliente> obtenerCliente(@PathVariable String nomcliente) {
		Cliente cliente = servicioCliente.obtenerClientePorNombre(nomcliente);
		if (cliente != null) {
			nombreCliente = cliente.getNomcliente();
			estadoAnterior = cliente.getEstado();
			usuarioAnterior = cliente.getUsuario();
			perfenusoCuentaAnterior = cliente.getCuenta().getPerfenuso();
			return ResponseEntity.ok(cliente);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping("/actualizar")
	@ResponseBody
	public ResponseEntity<?> actualizarCliente(@Valid @RequestBody Cliente cliente, BindingResult result) {
		if (result.hasErrors()) {
			List<String> errores = result.getAllErrors().stream().map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			return ResponseEntity.badRequest().body(errores);
		} else {
			try {
				
				//Contador de cantidad de dispositivos del cliente
				Pageable pageable = PageRequest.of(0, 6);
				Page<Dispositivo> paginaDispositivos = servicioDispositivo.buscarporLetraPagin(nombreCliente,
						pageable);
				int totalRegistros = (int) paginaDispositivos.getTotalElements();
				
				//-------------------PARA LAS CUENTAS --------------------------------------------------------
				//CUANDO SE DESACTIVA EL CLIENTE
				if (cliente.getEstado().equals("Inactivo")) { //Para liberar la cuenta de los dispositivos
					
					Cliente clienteconsultado = servicioCliente.obtenerClientePorNombre(nombreCliente);
					String cuenta = clienteconsultado.getUsuario();
					int PerfenusoCuenta = clienteconsultado.getCuenta().getPerfenuso(); //Cuenta sin Usuario => Valor 0
					int nuevoPerfenuso = PerfenusoCuenta - totalRegistros;

					servicioCuenta.actualizarPerfenuso(cuenta, nuevoPerfenuso);
					nombreCliente = "";
				} 
				
				//CUANDO SE ACTIVA O CAMBIA DE CUENTA 
				if (cliente.getEstado().equals("Activo")) { 
					if(estadoAnterior.equals("Inactivo")) { 
						System.err.println("Antes era Inactivo"); //Se suman perfenuso a la cuenta según la cantidad de dispositivos
						//Contar la cantidad de dispositivos 
						Cuenta cuentaNueva = servicioCuenta.obtenerCuentaPorUsuario(cliente.getUsuario()); //El nuevo usuario para el cliente
						int sumaPerfenuso = cuentaNueva.getPerfenuso() + totalRegistros;
						servicioCuenta.actualizarPerfenuso(cliente.getUsuario(), sumaPerfenuso);
					} else {
						System.err.println("Sigue siendo Activo");
						int restaPerfenuso = perfenusoCuentaAnterior - totalRegistros;
						servicioCuenta.actualizarPerfenuso(usuarioAnterior, restaPerfenuso);
						//Agregar perfenuso a la nueva cuenta
						Cuenta Nuevacuenta = servicioCuenta.obtenerCuentaPorUsuario(cliente.getUsuario());
						int nuevovalor = Nuevacuenta.getPerfenuso() + totalRegistros;
						servicioCuenta.actualizarPerfenuso(cliente.getUsuario(), nuevovalor);
						
					}
				}
				
				int actualizados = servicioCliente.actualizarCliente(cliente.getNomcliente(),
						cliente.getNuevonomcliente(), cliente.getContacto(), cliente.getNomplan(), cliente.getUsuario(),
						cliente.getFecactiv(), cliente.getFecvenc(), cliente.getEstado(), cliente.getCadultos());
				if (actualizados > 0) {
					return ResponseEntity.ok(Map.of("mensaje", "Cliente actualizado correctamente."));
				} else {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el cliente.");
				}
				
			} catch (Exception e) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el cliente.");
			}
			
		}
	}  


	@PostMapping("/crear")
	@ResponseBody
	public ResponseEntity<?> crearNuevoPlan(@Valid @RequestBody Cliente cliente, BindingResult result) {
		// System.err.println(cliente);
		if (result.hasErrors()) {
			List<String> errores = result.getAllErrors().stream().map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			return ResponseEntity.badRequest().body(Map.of("errores", errores));
		}

		try {
			//LocalDate fechaHoy = LocalDate.now();
			/*if (cliente.getFecvenc().isBefore(fechaHoy) || cliente.getFecvenc().isEqual(fechaHoy)) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body("La fecha de vencimiento es hoy o ya ha pasado.");
			} else {*/
				Cliente nuevoCliente = servicioCliente.registrarCliente(cliente);
				if (nuevoCliente != null) {
					return ResponseEntity.ok(Map.of("mensaje", "Cliente creado correctamente."));
				} else {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST)
							.body(Map.of("mensaje", "No se pudo crear el cliente."));
				}
			//}

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("mensaje", "Error al crear el cliente.")); 
		}
	}

	@DeleteMapping("/eliminar") // Eliminación fisica
	@ResponseBody
	public ResponseEntity<String> eliminarCliente(@RequestParam String cliente) {
		try {
			servicioCliente.eliminarCliente(cliente);
			return ResponseEntity.ok("Eliminado correctamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al eliminar el cliente: " + e.getMessage());
		}
	}

	@PostMapping("/actualizarCadultos")
	@ResponseBody
	public ResponseEntity<String> actualizarCadultos(@RequestParam String nomcliente, @RequestParam String cadultos) {

		boolean actualizado = servicioCliente.actualizarCadultos(nomcliente, cadultos);
		if (actualizado) {
			return ResponseEntity.ok("Actualización exitosa");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado");
		}
	}

	@PostMapping("/actualizarEstado")
	@ResponseBody
	public ResponseEntity<String> actualizarEstado(@RequestParam String nomcliente) {
		// Aquí quitar los dispositivos del cliente en la cuenta
		// ...

		boolean actualizado = servicioCliente.desactivarCliente(nomcliente, "Inactivo");

		Cliente clienteconsultado = servicioCliente.obtenerClientePorNombre(nomcliente);
		String cuenta = clienteconsultado.getUsuario();
		int PerfenusoCuenta = clienteconsultado.getCuenta().getPerfenuso();

		Pageable pageable = PageRequest.of(0, 6);
		Page<Dispositivo> paginaDispositivos = servicioDispositivo.buscarporLetraPagin(nomcliente, pageable);
		int totalRegistros = (int) paginaDispositivos.getTotalElements();

		int nuevoPerfenuso = PerfenusoCuenta - totalRegistros;
		
		servicioCuenta.actualizarPerfenuso(cuenta, nuevoPerfenuso);
		servicioCliente.actualizarUsuario(nomcliente, "Sin usuario");
		if (actualizado) {
			return ResponseEntity.ok("Actualización exitosa");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado");
		}
	}

	// SUGERENCIAS PARA DISPOSITIVOS
	@GetMapping("/nombres")
	@ResponseBody
	public ResponseEntity<Page<Map<String, String>>> soloNombres(
	        @RequestParam String letra,
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "6") int size) {

	    Pageable pageable = PageRequest.of(page, size);
	    Page<Map<String, String>> clientes = servicioCliente.buscarClientesPorNombre(letra, pageable);

	    return ResponseEntity.ok(clientes);
	}
	
	
	//Proceso automatizado para actualizar fecactiv, fecvenc, y estado en cuentas Deluxe
	
	@PostMapping("/activarClientePorCuenta")
	@ResponseBody
    public ResponseEntity<?> actualizarFechas(@RequestBody Map<String, Object> payload) {
        String nomcliente = (String) payload.get("nomcliente");
        String usuario = (String) payload.get("usuario");
        LocalDate fecactiv = LocalDate.parse((String) payload.get("fecactiv"));
        LocalDate fecvenc = LocalDate.parse((String) payload.get("fecvenc"));
        LocalDate hoy = LocalDate.now();

        Cliente clienteActualizar = servicioCliente.obtenerClientePorNombre(nomcliente);
        clienteActualizar.setNuevonomcliente(nomcliente);
        clienteActualizar.setUsuario(usuario);
        clienteActualizar.setFecactiv(fecactiv);
        clienteActualizar.setFecvenc(fecvenc);
       
        if (fecactiv.isAfter(hoy) || fecactiv.isEqual(hoy)) {
        	clienteActualizar.setEstado("Activo");
        } else {
        	clienteActualizar.setEstado("Inactivo");
        }
        
		int actualizados = servicioCliente.actualizarCliente(clienteActualizar.getNomcliente(),
				clienteActualizar.getNuevonomcliente(), clienteActualizar.getContacto(), clienteActualizar.getNomplan(), clienteActualizar.getUsuario(),
				clienteActualizar.getFecactiv(), clienteActualizar.getFecvenc(), clienteActualizar.getEstado(), clienteActualizar.getCadultos());
		if (actualizados > 0) {
			return ResponseEntity.ok(Map.of("mensaje", "Cliente actualizado correctamente."));
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el cliente.");
		}
       
    }

}


