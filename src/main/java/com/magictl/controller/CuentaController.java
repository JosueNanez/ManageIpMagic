package com.magictl.controller;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
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
import com.magictl.entity.Cuenta;
import com.magictl.service.CuentaService;
import com.magictl.service.ServicioService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/cuentas")
public class CuentaController {

	int perfilesEnUso; // Guardar el valor de la cuenta por actualizar

	@Autowired
	private CuentaService servicioCuenta;

	@Autowired
	private ServicioService servicioServicio;

	/*@GetMapping("/")
	public String principal(Model model) {
		List<Cuenta> listadeCuentas = servicioCuenta.listaDeCuentas();
		
		// Filtrar las cuentas vencidas de la lista
		LocalDate fechaHoy = LocalDate.now();
		listadeCuentas.removeIf(cuen -> {
		    if (cuen.getFecvenc().isBefore(fechaHoy)) {
		        return true; 
		    }
		    return false; 
		});
		//Aquí quitar los dispositivos del cliente en la cuenta
        //...
		
		model.addAttribute("cuentas", listadeCuentas);
		model.addAttribute("servicios", servicioServicio.listaDeServicios());
		model.addAttribute("cuenta", new Cuenta());
		return "cuentas";
	}*/
	
	@GetMapping("/")
	public String principal(Model model, @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "15") int size) {
		
		//Pageable pageable = PageRequest.of(page, size, Sort.by("fecvenc").ascending());
		Pageable pageable = PageRequest.of(page, size);
		Page<Cuenta> paginaDeCuentas = servicioCuenta.listaDeCuentasPagin(pageable);
		System.out.println(paginaDeCuentas);
		model.addAttribute("cuentas", paginaDeCuentas);
	    model.addAttribute("totalPaginas", paginaDeCuentas.getTotalPages());
	    model.addAttribute("paginaActual", paginaDeCuentas.getNumber());
	    model.addAttribute("totalRegistros", paginaDeCuentas.getTotalElements());
	    
		model.addAttribute("servicios", servicioServicio.listaDeServicios());
		model.addAttribute("cuenta", new Cuenta());
		return "cuentas";
	}
	
	/*@GetMapping("/busqueda")
	@ResponseBody
	public List<Cuenta> obtenerSugerencias(@RequestParam() String letra) {
		return servicioCuenta.buscarporLetra(letra);
	}*/

	@GetMapping("/busqueda")
	@ResponseBody
	public Page<Cuenta> obtenerSugerencias(@RequestParam() String letra, @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "15") int size) {
		
		Pageable pageable = PageRequest.of(page, size);
		Page<Cuenta> paginasSugerencias = servicioCuenta.buscarporLetraPagin(letra, pageable);
		return paginasSugerencias;
	}

	// Actualizar
	@GetMapping("/buscar/{usuario}")
	@ResponseBody
	public ResponseEntity<Cuenta> obtenerCuenta(@PathVariable String usuario) {
		Cuenta cuenta = servicioCuenta.obtenerCuentaPorUsuario(usuario);
		if (cuenta != null) {
			perfilesEnUso = cuenta.getPerfenuso(); // Guardar el valor en variable
			return ResponseEntity.ok(cuenta);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping("/actualizar")
	@ResponseBody
	public ResponseEntity<?> actualizarCuenta(@Valid @RequestBody Cuenta cuenta, BindingResult result) {
		// System.err.println(cuenta);
		if (result.hasErrors()) {
			List<String> errores = result.getAllErrors().stream().map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			return ResponseEntity.badRequest().body(errores);
		} else {
			try {
				int actualizados = servicioCuenta.actualizarCuenta(cuenta.getUsuario(), cuenta.getNuevonomusuario(),
						cuenta.getClave(), cuenta.getNomservicio(), cuenta.getFecactiv(), cuenta.getFecvenc(),
						perfilesEnUso, cuenta.getInstalacion(), cuenta.getCadultos(), cuenta.getMtresu());
				if (actualizados > 0) {
					return ResponseEntity.ok(Map.of("mensaje", "Cuenta actualizada correctamente."));
				} else {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró la cuenta.");
				}
			} catch (Exception e) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la cuenta.");
			}
		}
	}

	@PostMapping("/crear")
	@ResponseBody
	public ResponseEntity<?> crearNuevoPlan(@Valid @RequestBody Cuenta cuenta, BindingResult result) {
		System.err.println(cuenta);
		if (result.hasErrors()) {
			List<String> errores = result.getAllErrors().stream().map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			return ResponseEntity.badRequest().body(Map.of("errores", errores));
		}

		try {
			Cuenta nuevaCuenta = servicioCuenta.registrarCuenta(cuenta);

			if (nuevaCuenta != null) {
				return ResponseEntity.ok(Map.of("mensaje", "Cuenta creada correctamente."));
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("mensaje", "No se pudo crear la cuenta."));
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("mensaje", "Error al crear la cuenta."));
		}
	}

	@DeleteMapping("/eliminar")
	@ResponseBody
	public ResponseEntity<String> eliminarCuenta(@RequestParam String usuario) {
		try {
			servicioCuenta.eliminarcuenta(usuario);
			return ResponseEntity.ok("Eliminada correctamente");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al eliminar la cuenta: " + e.getMessage());
		}
	}
	
	/*@GetMapping("/vencidas")
	@ResponseBody
	public List<Cuenta> listadeInactivos() {
		return servicioCuenta.obtenerCuentasVencidas();
	}*/
	
	@GetMapping("/vencidas")
	@ResponseBody
	public Page<Cuenta> listadeInactivosPage(@RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "15") int size) {
		
		Pageable pageable = PageRequest.of(page, size);
		Page<Cuenta> paginasCuenVencidas = servicioCuenta.listarCuentasVencidasPagin(pageable);
				
		return paginasCuenVencidas;
	}
	
}
