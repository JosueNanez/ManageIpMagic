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

import com.magictl.entity.Cliente;

import jakarta.transaction.Transactional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer>{
	
	List<Cliente> findByOrderByFecvencAsc();
	
	@Query("SELECT c FROM Cliente c WHERE LOWER(c.nomcliente) LIKE LOWER(CONCAT('%', :letra, '%'))")
	List<Cliente> buscarPorLetra(@Param("letra") String letra);
	
	
    @Query("SELECT c FROM Cliente c WHERE c.estado = 'Inactivo' ORDER BY c.fecvenc DESC")
    List<Cliente> obtenerClientesInactivosOrdenados();

    
    //PAGINACIONbuscarPorLetraPag
    @Query("SELECT c FROM Cliente c WHERE c.usuario <> 'Sin usuario' AND c.estado <> 'Inactivo' ORDER BY c.fecvenc ASC")
    Page<Cliente> listarClientesPorFechaVencAscPag(Pageable pageable);
    
	@Query("SELECT c FROM Cliente c WHERE LOWER(c.nomcliente) LIKE LOWER(CONCAT('%', :letra, '%'))" + "ORDER BY c.nomcliente ASC")
	Page<Cliente> buscarPorLetraPag(@Param("letra") String letra, Pageable pageable);
	
	@Query("SELECT c FROM Cliente c " + "JOIN Cuenta cu ON c.usuario = cu.usuario "
			+ "WHERE LOWER(cu.usuario) LIKE LOWER(CONCAT('%', :letra, '%')) " + "ORDER BY c.nomcliente ASC")
	Page<Cliente> buscarPorUsuarioLetra(@Param("letra") String letra, Pageable pageable);
	
	
    
	@Query("SELECT c FROM Cliente c WHERE c.estado = 'Inactivo' ORDER BY c.fecvenc DESC")
    Page<Cliente> obtenerClientesInactivosOrdenadosPag(Pageable pageable);
    
  
    
    List<Cliente> findByUsuario(String usuario);
    Cliente findByNomcliente(String nomcliente);
    
    @Modifying
    @Transactional
    @Query("UPDATE Cliente c SET c.cadultos = :cadultos WHERE c.nomcliente = :nomcliente")
    int actualizarCadultosPorNombre(@Param("nomcliente") String nomcliente, @Param("cadultos") String cadultos);
    
    @Modifying
    @Transactional
    @Query("UPDATE Cliente c SET c.usuario = :usuario WHERE c.nomcliente = :nomcliente")
    int actualizarUsuariodeCliente(@Param("nomcliente") String nomcliente, @Param("usuario") String usuario);
	
	@Modifying
	@Transactional
	@Query("UPDATE Cliente c SET "
			+ "c.nomcliente =:nuevonomcliente, "
			+ "c.contacto =:contacto, "
			+ "c.nomplan =:nomplan, "
			+ "c.usuario =:usuario, "
			+ "c.fecactiv =:fecactiv, "
			+ "c.fecvenc =:fecvenc, "
			+ "c.estado =:estado, "
			+ "c.cadultos =:cadultos "
			+ "WHERE TRIM(c.nomcliente) = TRIM(:nomclienteActual)")
	int actualizarCliente(
			@Param("nomclienteActual") String nomclienteActual,
			@Param("nuevonomcliente") String nuevonomcliente,
			@Param("contacto") String contacto,
			@Param("nomplan") String nomplan,
			@Param("usuario") String usuario,
			@Param("fecactiv") LocalDate fecactiv,
			@Param("fecvenc") LocalDate fecvenc,
			@Param("estado") String estado,
			@Param("cadultos") String cadultos
			);
	
	//Eliminación fisica
	@Modifying
	@Transactional
	@Query("DELETE FROM Cliente c WHERE c.nomcliente =:nomcliente")
	void eliminarCliente(String nomcliente);
	
	
	//Eliminación por estado
    @Modifying
    @Transactional
    @Query("UPDATE Cliente c SET c.estado = :estado WHERE c.nomcliente = :nomcliente")
    int desactivarCliente(@Param("nomcliente") String nomcliente, @Param("estado") String estado);
    
    
    
    @Query("SELECT c.nomcliente, c.usuario FROM Cliente c " +
    	       "JOIN c.cuenta cu " +
    	       "JOIN cu.servicio s " +
    	       "JOIN Plan p ON s.nomplan = p.nomplan " +
    	       "WHERE c.estado = 'Activo' " +
    	       "AND cu.perfenuso <> s.perfiles " +
    	       "AND c.nomcliente LIKE %:letra% " +
    	       "AND NOT (p.perfiles = 1 AND (SELECT COUNT(d) FROM Dispositivo d WHERE d.nomcliente = c.nomcliente) = 1) " +
    	       "ORDER BY c.nomcliente ASC")
    Page<Object[]> buscarClientesPorNombre(@Param("letra") String letra, Pageable pageable);

    
    @Transactional
    @Modifying
    @Query("UPDATE Cliente c SET c.fecactiv = :fecactiv, c.fecvenc = :fecvenc WHERE c.nomcliente = :nomcliente")
    int actualizarFechas(String nomcliente, LocalDate fecactiv, LocalDate fecvenc);
    
}
