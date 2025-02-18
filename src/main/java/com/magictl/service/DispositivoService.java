package com.magictl.service;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.magictl.entity.Dispositivo;

public interface DispositivoService {
	
	public Page<Dispositivo> listarDispositivosPagin(Pageable pageable);
	public Page<Dispositivo> buscarporLetraPagin(String letra, Pageable pageable);
	
	Dispositivo obtenerDispositivoID(int id);
	public int actualizarDispositivo(int id, String nomcliente, String nomreproduc, String mac, String clave, LocalDate fecactiv, LocalDate fecvenc);
	public Dispositivo registrarDispositivo(Dispositivo dispositivo);
	
	public void eliminarDispositivo(int id);
	
	public long contarDispositivos(String nomcliente);
	

}
