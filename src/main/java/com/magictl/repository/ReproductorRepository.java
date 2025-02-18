package com.magictl.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.magictl.entity.Reproductor;

import jakarta.transaction.Transactional;

@Repository
public interface ReproductorRepository extends JpaRepository<Reproductor, Integer> {

	List<Reproductor> findByOrderByNomreproducAsc();
	
	Reproductor findByNomreproduc(String nomreproduc);
	
	@Modifying
	@Transactional
	@Query("UPDATE Reproductor r SET "
			+ "r.nomreproduc = :nuevonomreproduc, "
			+ "r.dominio = :dominio, "
			+ "r.conexion = :conexion "
			+ "WHERE TRIM(r.nomreproduc) = TRIM(:nomreproducActual)")
	int actualizarReproductor(
			@Param("nomreproducActual") String nomreproducActual,
			@Param("nuevonomreproduc") String nuevonomreproduc,
			@Param("dominio") String dominio,
			@Param("conexion") String conexion);
	
	@Modifying
	@Transactional
	@Query("DELETE FROM Reproductor r WHERE r.nomreproduc = :nomreproduc")
	void eliminarReproductor(String nomreproduc);
	
}
