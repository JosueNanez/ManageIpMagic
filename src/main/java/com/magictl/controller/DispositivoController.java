package com.magictl.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.magictl.entity.Dispositivo;
import com.magictl.service.ClienteService;
import com.magictl.service.CuentaService;
import com.magictl.service.DispositivoService;
import com.magictl.service.ReproductorService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/dispositivos")
public class DispositivoController {

	@Autowired
	private DispositivoService servicioDispositivo;

	@Autowired
	private ReproductorService servicioReproductor;
	
	@Autowired
	private CuentaService servicioCuenta;
	
	@Autowired
	private ClienteService servicioCliente;

	@GetMapping("/")
	public String principal(Model model, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "15") int size) {

		Pageable pageable = PageRequest.of(page, size);
		Page<Dispositivo> listaDispositivos = servicioDispositivo.listarDispositivosPagin(pageable);

		System.out.println(listaDispositivos);
		model.addAttribute("dispositivos", listaDispositivos);
		model.addAttribute("totalPaginas", listaDispositivos.getTotalPages());
		model.addAttribute("paginaActual", listaDispositivos.getNumber());

		model.addAttribute("reproductores", servicioReproductor.listaDeReproductores());
		model.addAttribute("dispositivo", new Dispositivo());
		return "dispositivos";
	}

	@GetMapping("/busqueda")
	@ResponseBody
	public Page<Dispositivo> obtenerSugerencias(@RequestParam() String letra,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "15") int size) {

		Pageable pageable = PageRequest.of(page, size);
		Page<Dispositivo> dispositivosBuscados = servicioDispositivo.buscarporLetraPagin(letra, pageable);

		return dispositivosBuscados;
	}

	// ACTUALIZACION
	@GetMapping("/buscar/{id}")
	@ResponseBody
	public ResponseEntity<Dispositivo> obtenerDispositivo(@PathVariable int id) {
		Dispositivo dispositivo = servicioDispositivo.obtenerDispositivoID(id);

		if (dispositivo != null) {
			return ResponseEntity.ok(dispositivo);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping("/actualizar")
	@ResponseBody
	public ResponseEntity<?> actualizarDispositivo(@Valid @RequestBody Dispositivo dispositivo, BindingResult result) {

		if (result.hasErrors()) {
			List<String> errores = result.getAllErrors().stream().map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			return ResponseEntity.badRequest().body(errores);
		} else {
			try {
				int actualizados = servicioDispositivo.actualizarDispositivo(dispositivo.getId(),
						dispositivo.getNomcliente(), dispositivo.getNomreproduc(), dispositivo.getMac(),
						dispositivo.getClave(), dispositivo.getFecactiv(), dispositivo.getFecvenc());
				if (actualizados > 0) {
					return ResponseEntity.ok(Map.of("mensaje", "Dispositivo actualizado correctamente."));
				} else {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el dispositivo.");
				}
			} catch (Exception e) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el dispositivo.");
			}
		}
	}
	
	
	@PostMapping("/crear")
	@ResponseBody
	public ResponseEntity<?> crearNuevoPlan(@Valid @RequestBody Dispositivo dispositivo, BindingResult result) {
		if (result.hasErrors()) {
			List<String> errores = result.getAllErrors().stream().map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			return ResponseEntity.badRequest().body(Map.of("errores", errores));
		}
		
		//Obtener el valor actual de perfiles en uso de la cuenta del cliente
		Cliente cliente = servicioCliente.obtenerClientePorNombre(dispositivo.getNomcliente());
		int PerfenusoCuenta = cliente.getCuenta().getPerfenuso();
		//Obtener la cuenta del cliente del dispositivo
		String cuenta = cliente.getUsuario();
		int nuevoPerfenuso = PerfenusoCuenta + 1;	

		try {

			//Actualizar Perfenuso + 1
			servicioCuenta.actualizarPerfenuso(cuenta, nuevoPerfenuso);
			
			Dispositivo nuevodispositivo = servicioDispositivo.registrarDispositivo(dispositivo);

			if (nuevodispositivo != null) {
				return ResponseEntity.ok(Map.of("mensaje", "Dispositivo creado correctamente."));
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("mensaje", "No se pudo crear el dispositivo."));
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("mensaje", "Error al crear el dispositivo."));
		}
	}
	
	
	@DeleteMapping("/eliminar")
	@ResponseBody
	public ResponseEntity<String> eliminarServicio(@RequestParam int id) {
		try {
			//Restar -1 a perfenuso de la cuenta del cliente
			Dispositivo dispositivo = servicioDispositivo.obtenerDispositivoID(id);
			int perfilesActualCuenta = dispositivo.getCliente().getCuenta().getPerfenuso();
			String nombredeCuenta = dispositivo.getCliente().getUsuario();
			
			servicioCuenta.actualizarPerfenuso(nombredeCuenta, perfilesActualCuenta - 1);
			
			
			servicioDispositivo.eliminarDispositivo(id);
			return ResponseEntity.ok("Eliminado correctamente");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al eliminar el dispositivo: " + e.getMessage());
		}
	}
	
	
	//Para contar dispositivos por cliente
    @GetMapping("/contar/{nomcliente}")
    public ResponseEntity<Long> contarDispositivos(@PathVariable String nomcliente) {
        long cantidad = servicioDispositivo.contarDispositivos(nomcliente);
        return ResponseEntity.ok(cantidad);
    }
	

}
