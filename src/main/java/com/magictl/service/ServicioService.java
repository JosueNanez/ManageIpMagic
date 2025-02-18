package com.magictl.service;

import java.math.BigDecimal;
import java.util.List;

import com.magictl.entity.Servicio;

public interface ServicioService {
	
	public List<Servicio> listaDeServicios();
	
	Servicio obtenerServicioPorNombre(String nomservicio);
	public int actualizarServicio(String nomservicio, String nuevonomservicio, String nomplan, String dominio, int perfiles, BigDecimal costocredito, String contacto);
	public Servicio registrarServicio(Servicio servicio);
	
	public void eliminarServicio(String nomservicio);
	

}
