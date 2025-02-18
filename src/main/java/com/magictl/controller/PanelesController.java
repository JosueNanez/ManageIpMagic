package com.magictl.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

import com.magictl.entity.Servicio;
import com.magictl.service.PlanService;
import com.magictl.service.ServicioService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/paneles")
public class PanelesController {

	@Autowired
	private ServicioService servicioServicio;

	@Autowired
	private PlanService servicioPlan;

	@GetMapping("/")
	public String principal(Model model) {
		model.addAttribute("servicios", servicioServicio.listaDeServicios());
		model.addAttribute("planes", servicioPlan.listaDePlanes());
		model.addAttribute("servicio", new Servicio());
		return "paneles";
	}

	@GetMapping("/buscar/{nomservicio}")
	@ResponseBody
	public ResponseEntity<Servicio> obtenerPlan(@PathVariable String nomservicio) {
		Servicio servicio = servicioServicio.obtenerServicioPorNombre(nomservicio);

		if (servicio != null) {
			return ResponseEntity.ok(servicio);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping("/actualizar")
	@ResponseBody
	public ResponseEntity<?> actualizarServicio(@Valid @RequestBody Servicio servicio, BindingResult result) {
		// System.out.println(servicio);
		if (result.hasErrors()) {
			List<String> errores = result.getAllErrors().stream().map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			return ResponseEntity.badRequest().body(errores);
		} else {
			try {
				int actualizados = servicioServicio.actualizarServicio(servicio.getNomservicio(),
						servicio.getNuevonomservicio(), servicio.getNomplan(), servicio.getDominio(), servicio.getPerfiles(),
						servicio.getCostocredito(), servicio.getContacto());
				if (actualizados > 0) {
					return ResponseEntity.ok(Map.of("mensaje", "Panel actualizado correctamente."));
				} else {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el panel.");
				}
			} catch (Exception e) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el panel.");
			}
		}
	}

	@PostMapping("/crear")
	@ResponseBody
	public ResponseEntity<?> crearNuevoPlan(@Valid @RequestBody Servicio servicio, BindingResult result) {
		if (result.hasErrors()) {
			List<String> errores = result.getAllErrors().stream().map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			return ResponseEntity.badRequest().body(Map.of("errores", errores));
		}

		try {
			Servicio nuevoServicio = servicioServicio.registrarServicio(servicio);

			if (nuevoServicio != null) {
				return ResponseEntity.ok(Map.of("mensaje", "Panel creado correctamente."));
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("mensaje", "No se pudo crear el panel."));
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("mensaje", "Error al crear el panel."));
		}
	}

	@DeleteMapping("/eliminar")
	@ResponseBody
	public ResponseEntity<String> eliminarServicio(@RequestParam String nomservicio) {
		try {
			servicioServicio.eliminarServicio(nomservicio);
			return ResponseEntity.ok("Eliminado correctamente");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al eliminar el panel: " + e.getMessage());
		}
	}

}
