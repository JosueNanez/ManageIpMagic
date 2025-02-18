package com.magictl.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.magictl.entity.Dispositivo;
import com.magictl.repository.DispositivoRepository;

@Service
public class DispositivoServiceImpl implements DispositivoService{
	
	@Autowired
	private DispositivoRepository repositorio;

	@Override
	public Page<Dispositivo> listarDispositivosPagin(Pageable pageable) {
		// TODO Auto-generated method stub
		LocalDate fechaHoy = LocalDate.now();
        LocalDate fechaMenosDos = fechaHoy.minusDays(2);
		return repositorio.listarDispositivosClientesActivos(fechaMenosDos, pageable);
	}

	@Override
	public Page<Dispositivo> buscarporLetraPagin(String letra, Pageable pageable) {
		
		Page<Dispositivo> resultado = repositorio.buscarPorLetra(letra, pageable); //Busca por cliente
	    if (resultado.isEmpty()) {
	        resultado = repositorio.buscarPorUsuarioLetra(letra, pageable); //Busca por usuario
	    }
		return resultado;
	}

	
	
	@Override
	public Dispositivo obtenerDispositivoID(int id) {
		// TODO Auto-generated method stub
		return repositorio.findById(id);
	}

	@Override
	public int actualizarDispositivo(int id, String nomcliente, String nomreproduc, String mac, String clave,
			LocalDate fecactiv, LocalDate fecvenc) {
		// TODO Auto-generated method stub
		return repositorio.actualizarDispositivo(id, nomcliente, nomreproduc, mac, clave, fecactiv, fecvenc);
	}
	
	
	
	

	@Override
	public Dispositivo registrarDispositivo(Dispositivo dispositivo) {
		// TODO Auto-generated method stub
		return repositorio.save(dispositivo);
	}

	
	

	@Override
	public void eliminarDispositivo(int id) {
		// TODO Auto-generated method stub
		repositorio.eliminarDispositivo(id);
	}

	
	
	//Para contar la cantidad de dispositivos por cliente
	@Override
	public long contarDispositivos(String nomcliente) {
		// TODO Auto-generated method stub
		return repositorio.contarDispositivosPorCliente(nomcliente);
	}

	
	
	
	

	
}
