package com.magictl.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.magictl.entity.Cuenta;

import jakarta.transaction.Transactional;

@Repository
public interface CuentaRepository extends JpaRepository<Cuenta, Integer> {

	@Query("SELECT c FROM Cuenta c WHERE c.fecvenc >= :fechaHoy AND c.usuario <> 'Sin usuario' ORDER BY c.fecvenc ASC")
	Page<Cuenta> listadeUsuariosActivosAscPag(@Param("fechaHoy") LocalDate fechaHoy, Pageable pageable); // PAGINACION

	@Query("""
			    SELECT c FROM Cuenta c
			    WHERE c.perfenuso <> c.servicio.perfiles
			    AND c.fecvenc > :fechaDosDias
			    AND c.usuario <> 'Sin usuario'
			    AND (c.instalacion = 'Manual' AND c.fecvenc >= :fechaSeisDias OR c.instalacion <> 'Manual')
			    AND (
			     c.servicio.plan.perfiles <= 1 
			     OR (c.servicio.plan.perfiles > 1 AND c.perfenuso = 0) 
			 )
			    ORDER BY c.fecvenc DESC
			""")
	List<Cuenta> listadeUsuariosActivosDesc(@Param("fechaDosDias") LocalDate fechaDosDias,
			@Param("fechaSeisDias") LocalDate fechaSeisDias);

	@Query("SELECT c FROM Cuenta c WHERE LOWER(c.usuario) LIKE LOWER(CONCAT('%', :letra, '%')) AND c.usuario <> 'Sin usuario'")
	Page<Cuenta> buscarPorLetraPag(@Param("letra") String letra, Pageable pageable); // PAGINACION

	@Query("SELECT c FROM Cuenta c WHERE c.fecvenc < :fechaHoy AND c.usuario <> 'Sin usuario' ORDER BY c.fecvenc ASC")
	Page<Cuenta> listarCuentasVencidasPag(@Param("fechaHoy") LocalDate fechaHoy, Pageable pageable); // PAGINACION

	Cuenta findByUsuario(String usuario);

	@Modifying
	@Transactional
	@Query("UPDATE Cuenta c SET c.perfenuso = :perfenuso WHERE c.usuario = :usuario")
	int actualizarPerfenuso(@Param("usuario") String usuario, @Param("perfenuso") int perfenuso);

	@Modifying
	@Transactional
	@Query("UPDATE Cuenta c SET " + "c.usuario = :nuevonomusuario, " + "c.clave = :clave, "
			+ "c.nomservicio = :nomservicio, " + "c.fecactiv = :fecactiv," + "c.fecvenc = :fecvenc, "
			+ "c.perfenuso = :perfenuso, " + "c.instalacion = :instalacion, " + "c.cadultos = :cadultos, "
			+ "c.mtresu = :mtresu " + "WHERE TRIM(c.usuario) = TRIM(:usuarioActual)")
	int actualizarCuenta(@Param("usuarioActual") String usuarioActual, @Param("nuevonomusuario") String nuevonomusuario,
			@Param("clave") String clave, @Param("nomservicio") String nomservicio,
			@Param("fecactiv") LocalDate fecactiv, @Param("fecvenc") LocalDate fecvenc,
			@Param("perfenuso") int perfenuso, @Param("instalacion") String instalacion,
			@Param("cadultos") String cadultos, @Param("mtresu") String mtresu);

	@Modifying
	@Transactional
	@Query("DELETE FROM Cuenta c WHERE c.usuario = :usuario")
	void eliminarCuenta(String usuario);

}
