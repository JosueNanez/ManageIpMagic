package com.magictl.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.magictl.entity.Plan;
import com.magictl.repository.PlanRepository;

@Service
public class PlanServiceImpl implements PlanService {

	@Autowired
	private PlanRepository repositorio;

	@Override
	public List<Plan> listaDePlanes() {
		List<Plan> listaSinNull = repositorio.findByOrderByPrecventaAsc();
		
		//Remover el plan null de la lista
		listaSinNull.removeIf(plan -> "NULL".equals(plan.getNomplan()));
		return listaSinNull;
	}

	@Override
	public Plan obtenerPlanPorNombre(String nomplan) {
		return repositorio.findByNomplan(nomplan);
	}

	@Override
	public int actualizarPlan(String nomplanActual, String nuevonomplan, BigDecimal precio, int perfiles, String imagen, String soporte) {
		return repositorio.actualizarPlan(nomplanActual, nuevonomplan, precio, perfiles, imagen, soporte);
	}

	@Override
	public Plan registrarPlan(Plan plan) {
		return repositorio.save(plan);
	}

	@Override
	public void eliminarplan(String nomplan) {
		repositorio.eliminarPLan(nomplan);
	}

}
