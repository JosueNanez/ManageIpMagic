package com.magictl.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.magictl.entity.Cliente;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClienteService {
	
	public List<Cliente> listaDeClientes();
	public List<Cliente> buscarporLetra(String letra);
	public List<Cliente> listaDeInactivos();
	
	//PAGINACION
	public Page<Cliente> listaDeClientesPagin(Pageable pageable);
	public Page<Cliente> buscarporLetraPagin(String letra, Pageable pageable);
	public Page<Cliente> listaDeInactivosPagin(Pageable pageable);
	
	
	
	
	public List<Cliente> listarPorUsuario(String usuario); //Para cuentas compartidas
	
	Cliente obtenerClientePorNombre(String nomcliente);
	public boolean actualizarCadultos(String nomcliente, String cadultos); //Para cuenta única por cliente
	public int actualizarCliente(String nomcliente, String nuevonomcliente, String contacto, String nomplan, String usuario, LocalDate fecactiv, LocalDate fecvenc, String estado, String cadultos );
	public Cliente registrarCliente(Cliente cliente);
	
	public void eliminarCliente(String nomcliente);
	public boolean desactivarCliente(String nomcliente, String estado);
	public boolean actualizarUsuario(String nomcliente, String usuario); //Para cuenta única por cliente
	
	//public Page<String> buscarClientesPorNombre(String letra, Pageable pageable);
	public Page<Map<String, String>> buscarClientesPorNombre(String letra, Pageable pageable);
	
	
	public boolean actualizarFechasCliente(String nomcliente, LocalDate fecactiv, LocalDate fecvenc);
	
	
}
