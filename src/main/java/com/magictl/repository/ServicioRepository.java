package com.magictl.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.magictl.entity.Servicio;

import jakarta.transaction.Transactional;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Integer>{
	
	List<Servicio> findByOrderByCostocreditoAsc();
	
	Servicio findByNomservicio(String nomservicio);
	
	@Modifying
	@Transactional
	@Query("UPDATE Servicio s SET "
			+ "s.nomservicio = :nuevonomservicio, "
			+ "s.nomplan = :nomplan, "
			+ "s.dominio = :dominio, "
			+ "s.perfiles = :perfiles, "
			+ "s.costocredito = :costocredito, "
			+ "s.contacto = :contacto "
			+ "WHERE TRIM(s.nomservicio) = TRIM(:nomservicioActual)")
	int actualizarServicio(
			@Param("nomservicioActual") String nomservicioActual,
			@Param("nuevonomservicio") String nuevonomservicio,
			@Param("nomplan") String nomplan,
			@Param("dominio") String dominio,
			@Param("perfiles") float perfiles,
			@Param("costocredito") BigDecimal costocredito,
			@Param("contacto") String contacto);
	
	
	@Modifying
	@Transactional
	@Query("DELETE FROM Servicio s WHERE s.nomservicio = :nomservicio")
	void eliminarServicio(String nomservicio);

}
