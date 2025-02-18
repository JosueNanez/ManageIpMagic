package com.magictl.repository;

import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.magictl.entity.Dispositivo;

import jakarta.transaction.Transactional;

@Repository
public interface DispositivoRepository extends JpaRepository<Dispositivo, Integer> {

	// Dispositivos de los clientes cuya fecha de vencimiento (fecvenc) es mayor que
	// la actual
	@Query("SELECT d FROM Dispositivo d " + "JOIN Cliente c ON d.nomcliente = c.nomcliente "
			+ "WHERE c.fecvenc >= :fechaHoy AND c.estado <> 'Inactivo' " + "ORDER BY d.nomcliente ASC")
	Page<Dispositivo> listarDispositivosClientesActivos(@Param("fechaHoy") LocalDate fechaHoy, Pageable pageable);

	// Búsqueda dinámica por CLIENTE o CUENTA USUARIO
	@Query("SELECT d FROM Dispositivo d WHERE LOWER(d.nomcliente) LIKE LOWER(CONCAT('%', :letra, '%'))"
			+ "ORDER BY d.nomcliente ASC")
	Page<Dispositivo> buscarPorLetra(@Param("letra") String letra, Pageable pageable);

	@Query("SELECT d FROM Dispositivo d " + "JOIN Cliente c ON d.nomcliente = c.nomcliente "
			+ "WHERE LOWER(c.usuario) LIKE LOWER(CONCAT('%', :letra, '%')) " + "ORDER BY d.nomcliente ASC")
	Page<Dispositivo> buscarPorUsuarioLetra(@Param("letra") String letra, Pageable pageable);

	// ACTUALIZACION
	Dispositivo findById(int id);

	@Modifying
	@Transactional
	@Query("UPDATE Dispositivo d SET " + "d.nomcliente = :nuevonomcliente, " + "d.nomreproduc = :nomreproduc, "
			+ "d.mac = :mac, " + "d.clave = :clave, " + "d.fecactiv = :fecactiv, " + "d.fecvenc = :fecvenc "
			+ "WHERE d.id = :id")
	int actualizarDispositivo(@Param("id") int id, @Param("nuevonomcliente") String nomcliente,
			@Param("nomreproduc") String nomreproduc, @Param("mac") String mac, @Param("clave") String clave,
			@Param("fecactiv") LocalDate fecactiv, @Param("fecvenc") LocalDate fecvenc);

	@Modifying
	@Transactional
	@Query("DELETE FROM Dispositivo d WHERE d.id = :id")
	void eliminarDispositivo(int id);

	
	//Para contar la cantidad de reproductores por Cliente
	@Query("""
			    SELECT COUNT(d) FROM Dispositivo d
			    WHERE d.nomcliente = :nomcliente
			""")
	long contarDispositivosPorCliente(@Param("nomcliente") String nomcliente);

}
