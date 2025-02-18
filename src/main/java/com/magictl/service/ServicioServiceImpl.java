package com.magictl.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.magictl.entity.Servicio;
import com.magictl.repository.ServicioRepository;

@Service
public class ServicioServiceImpl implements ServicioService {
	@Autowired
	private ServicioRepository repositorio;

	@Override
	public List<Servicio> listaDeServicios() {
		// TODO Auto-generated method stub
		List<Servicio> servicioSinNull = repositorio.findByOrderByCostocreditoAsc();
		servicioSinNull.removeIf(servicio -> "NULL".equals(servicio.getNomservicio()));
		return servicioSinNull;
	}

	@Override
	public Servicio obtenerServicioPorNombre(String nomservicio) {
		// TODO Auto-generated method stub
		return repositorio.findByNomservicio(nomservicio);
	}

	@Override
	public int actualizarServicio(String nomservicio, String nuevonomservicio, String nomplan, String dominio, int perfiles, BigDecimal costocredito,
			String contacto) {
		// TODO Auto-generated method stub
		return repositorio.actualizarServicio(nomservicio, nuevonomservicio, nomplan, dominio, perfiles, costocredito, contacto);
	}

	@Override
	public Servicio registrarServicio(Servicio servicio) {
		// TODO Auto-generated method stub
		return repositorio.save(servicio);
	}

	@Override
	public void eliminarServicio(String nomservicio) {
		repositorio.eliminarServicio(nomservicio);
		
	}
	

}
