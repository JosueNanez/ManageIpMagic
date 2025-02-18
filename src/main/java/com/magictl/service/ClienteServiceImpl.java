package com.magictl.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.magictl.entity.Cliente;
import com.magictl.repository.ClienteRepository;

@Service
public class ClienteServiceImpl implements ClienteService{

	@Autowired
	private ClienteRepository repositorio;
	
	
	@Override
	public List<Cliente> listaDeClientes() {
		// TODO Auto-generated method stub
		return repositorio.findByOrderByFecvencAsc();
	}

	@Override
	public List<Cliente> buscarporLetra(String letra) {
		// TODO Auto-generated method stub
		return repositorio.buscarPorLetra(letra);
	}

	@Override
	public List<Cliente> listaDeInactivos() {
		// TODO Auto-generated method stub
		return repositorio.obtenerClientesInactivosOrdenados();
	}

	
	
	
	@Override
	public List<Cliente> listarPorUsuario(String usuario) {
		// TODO Auto-generated method stub
		return repositorio.findByUsuario(usuario);
	}
	
	@Override
	public Cliente obtenerClientePorNombre(String nomcliente) {
		// TODO Auto-generated method stub
		return repositorio.findByNomcliente(nomcliente);
	}

	@Override
	public int actualizarCliente(String nomcliente, String nuevonomcliente,  String contacto, String nomplan, String usuario, LocalDate fecactiv,
			LocalDate fecvenc, String estado, String cadultos) {
		// TODO Auto-generated method stub
		return repositorio.actualizarCliente(nomcliente, nuevonomcliente, contacto, nomplan, usuario, fecactiv, fecvenc, estado, cadultos);
	}

	@Override
	public Cliente registrarCliente(Cliente cliente) {
		// TODO Auto-generated method stub
		return repositorio.save(cliente);
	}

	@Override
	public void eliminarCliente(String nomcliente) {
		repositorio.eliminarCliente(nomcliente);
	}


	@Override
	public boolean actualizarCadultos(String nomcliente, String cadultos) {
		int filasActualizadas = repositorio.actualizarCadultosPorNombre(nomcliente, cadultos);
        return filasActualizadas > 0;
	}

	@Override
	public boolean desactivarCliente(String nomcliente, String estado) {
		int filasActualizadas = repositorio.desactivarCliente(nomcliente, estado);
		return filasActualizadas > 0;
	}

	@Override
	public boolean actualizarUsuario(String nomcliente, String usuario) {

		
		
		int filasActualizadas = repositorio.actualizarUsuariodeCliente(nomcliente, usuario);
        return filasActualizadas > 0;
	}
	
	
	
	//PAGINACION

	@Override
	public Page<Cliente> listaDeClientesPagin(Pageable pageable) {
		// TODO Auto-generated method stub
		return repositorio.listarClientesPorFechaVencAscPag(pageable);
	}

	@Override
	public Page<Cliente> buscarporLetraPagin(String letra, Pageable pageable) {
		// TODO Auto-generated method stub
		Page<Cliente> resultado = repositorio.buscarPorLetraPag(letra, pageable);
		if (resultado.isEmpty()) {
			resultado = repositorio.buscarPorUsuarioLetra(letra, pageable);
		}
		return resultado;
		
		//return repositorio.buscarPorLetraPag(letra, pageable);
		
	}

	@Override
	public Page<Cliente> listaDeInactivosPagin(Pageable pageable) {
		// TODO Auto-generated method stub
		return repositorio.obtenerClientesInactivosOrdenadosPag(pageable);
	}

	
	//Servicio para sugerencia de dispositivos
	/*@Override
	public Page<String> buscarClientesPorNombre(String letra, Pageable pageable) {
	    return repositorio.buscarClientesPorNombre(letra, pageable);
	}*/


	@Override
	public Page<Map<String, String>> buscarClientesPorNombre(String letra, Pageable pageable) {
		// TODO Auto-generated method stub
		Page<Object[]> resultados = repositorio.buscarClientesPorNombre(letra, pageable);
	    // Convertir Object[] a Map<String, String>
	    return resultados.map(obj -> {
	        Map<String, String> cliente = new HashMap<>();
	        cliente.put("nomcliente", (String) obj[0]); // Primer campo: nombre
	        cliente.put("usuario", (String) obj[1]);   // Segundo campo: usuario
	        return cliente;
	    });
	}



}
