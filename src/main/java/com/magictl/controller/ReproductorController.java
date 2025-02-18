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
import com.magictl.entity.Reproductor;
import com.magictl.service.ReproductorService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/reproductores")
public class ReproductorController {
	
	@Autowired
	private ReproductorService servicioReproductor;
	
	@GetMapping("/")
	public String principal(Model model) {
		model.addAttribute("reproductores", servicioReproductor.listaDeReproductores());
		model.addAttribute("reproductor", new Reproductor());
		return "reproductores";
	}
	
	@GetMapping("/buscar/{nomreproduc}")
	@ResponseBody
	public ResponseEntity<Reproductor> obtenerReproductor(@PathVariable String nomreproduc) {
		Reproductor reproductor = servicioReproductor.obtenerReprodPorNombre(nomreproduc);
		if (reproductor != null) {
			return ResponseEntity.ok(reproductor);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	
	@PostMapping("/actualizar")
	@ResponseBody
	public ResponseEntity<?> actualizarPlan(@Valid @RequestBody Reproductor reproductor, BindingResult result) {
		//System.out.println();
	    if (result.hasErrors()) {
	        List<String> errores = result.getAllErrors()
	                .stream()
	                .map(error -> error.getDefaultMessage())
	                .collect(Collectors.toList());
	        return ResponseEntity.badRequest().body(errores);
	    } else {
		    try {
		        int actualizados = servicioReproductor.actualizarReproductor(reproductor.getNomreproduc(), reproductor.getNuevonomreproduc(), reproductor.getDominio(), reproductor.getConexion());
		        if (actualizados > 0) {
		        	return ResponseEntity.ok(Map.of("mensaje", "Reproductor actualizado correctamente."));
		        } else {
		            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el reproductor.");
		        }
		    } catch (Exception e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el reproductor.");
		    }
	    }
	}
	
	@PostMapping("/crear")
	@ResponseBody
	public ResponseEntity<?> crearNuevoPlan(@Valid @RequestBody Reproductor reproductor,  BindingResult result) {
	    //System.out.println(plan);
	    
	    if (result.hasErrors()) {
	        List<String> errores = result.getAllErrors()
	            .stream()
	            .map(error -> error.getDefaultMessage())
	            .collect(Collectors.toList());
	        return ResponseEntity.badRequest().body(Map.of("errores", errores));
	    }

	    try {
	        Reproductor nuevoreproductor = servicioReproductor.registrarReproductor(reproductor);
	        
	        if (nuevoreproductor != null) {
	            return ResponseEntity.ok(Map.of("mensaje", "Reprodcutor creado correctamente."));
	        } else {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje", "No se pudo crear el reproductor."));
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje", "Error al crear el reproductor."));
	    }
	}

	
	@DeleteMapping("/eliminar") 
	@ResponseBody
	public ResponseEntity<String> eliminarReprodcutor(@RequestParam String nomreproduc) {
	    try {
	        servicioReproductor.eliminarReproductor(nomreproduc);
	        return ResponseEntity.ok("Eliminado correctamente");
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el reproductor: " + e.getMessage());
	    }
	}
	
	
	
	

}
