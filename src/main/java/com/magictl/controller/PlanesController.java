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

import com.magictl.entity.Plan;
import com.magictl.service.PlanService;

import jakarta.validation.Valid;


@Controller
@RequestMapping("/planes")
public class PlanesController {
	
	@Autowired
	private PlanService servicioPlan;
	
	
	@GetMapping("/")
	public String principal(Model model) {
		model.addAttribute("planes", servicioPlan.listaDePlanes());
		model.addAttribute("plan", new Plan());
		return "planes";
	}
	
	
	
	@GetMapping("/buscar/{nomplan}")
	@ResponseBody
	public ResponseEntity<Plan> obtenerPlan(@PathVariable String nomplan) {
	    Plan plan = servicioPlan.obtenerPlanPorNombre(nomplan);
	    
	    if (plan != null) {
	        return ResponseEntity.ok(plan);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
	
	@PostMapping("/actualizar")
	@ResponseBody
	public ResponseEntity<?> actualizarPlan(@Valid @RequestBody Plan plan, BindingResult result) {
		System.out.println(plan);
	    if (result.hasErrors()) {
	        List<String> errores = result.getAllErrors()
	                .stream()
	                .map(error -> error.getDefaultMessage())
	                .collect(Collectors.toList());
	        return ResponseEntity.badRequest().body(errores);
	    } else {
		    try {
		        int actualizados = servicioPlan.actualizarPlan(plan.getNomplan(), plan.getNuevonomplan(), plan.getPrecventa(), plan.getPerfiles(), plan.getImagen(), plan.getSoporte());
		        if (actualizados > 0) {
		        	return ResponseEntity.ok(Map.of("mensaje", "Plan actualizado correctamente."));
		        } else {
		            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el plan.");
		        }
		    } catch (Exception e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el plan.");
		    }
	    }
	}
	
	@PostMapping("/crear")
	@ResponseBody
	public ResponseEntity<?> crearNuevoPlan(@Valid @RequestBody Plan plan,  BindingResult result) {
	    System.out.println(plan);
	    
	    if (result.hasErrors()) {
	        List<String> errores = result.getAllErrors()
	            .stream()
	            .map(error -> error.getDefaultMessage())
	            .collect(Collectors.toList());
	        return ResponseEntity.badRequest().body(Map.of("errores", errores));
	    }

	    try {
	        Plan nuevoPlan = servicioPlan.registrarPlan(plan);
	        
	        if (nuevoPlan != null) {
	            return ResponseEntity.ok(Map.of("mensaje", "Plan creado correctamente."));
	        } else {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje", "No se pudo crear el plan."));
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje", "Error al crear el plan."));
	    }
	}

	
	@DeleteMapping("/eliminar") 
	@ResponseBody
	public ResponseEntity<String> eliminarPlan(@RequestParam String nomplan) {
	    try {
	        servicioPlan.eliminarplan(nomplan);
	        return ResponseEntity.ok("Eliminado correctamente");
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el plan: " + e.getMessage());
	    }
	}


}
