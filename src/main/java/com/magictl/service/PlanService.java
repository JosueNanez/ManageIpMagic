package com.magictl.service;

import java.math.BigDecimal;
import java.util.List;

import com.magictl.entity.Plan;

public interface PlanService {
	
	public List<Plan> listaDePlanes();
	
	Plan obtenerPlanPorNombre(String nomplan);
	public int actualizarPlan(String nomplanActual, String nuevonomplan, BigDecimal precio, int perfiles, String imagen, String soporte);
	public Plan registrarPlan(Plan plan);

	public void eliminarplan(String nomplan);
	
	
}
