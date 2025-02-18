package com.magictl.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.magictl.entity.Plan;

import jakarta.transaction.Transactional;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Integer> {

	List<Plan> findByOrderByPrecventaAsc(); //Lista ordenada por el campo precio
	
	Plan findByNomplan(String nomplan); //Bscar registro por nombre
	
	@Modifying
	@Transactional
	@Query("UPDATE Plan p SET "
			+ "p.nomplan = :nuevonomplan, "
			+ "p.precventa = :precio, "
			+ "p.perfiles = :perfiles, "
			+ "p.imagen = :imagen,"
			+ "p.soporte = :soporte "
			+ "WHERE TRIM(p.nomplan) = TRIM(:nomplanActual)")
	int actualizarPlan(
			@Param("nomplanActual") String nomplanActual,
			@Param("nuevonomplan") String nuevonomplan, 
			@Param("precio") BigDecimal precio, 
			@Param("perfiles") int perfiles,
			@Param("imagen") String imagen,
			@Param("soporte") String soporte);
	
	@Modifying
	@Transactional
	@Query("DELETE FROM Plan p WHERE p.nomplan = :nomplan")
	void eliminarPLan(String nomplan);
	
	
	
}
