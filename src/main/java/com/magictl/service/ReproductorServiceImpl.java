package com.magictl.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.magictl.entity.Reproductor;
import com.magictl.repository.ReproductorRepository;

@Service
public class ReproductorServiceImpl implements ReproductorService {
	
	@Autowired
	private ReproductorRepository repositorio;

	@Override
	public List<Reproductor> listaDeReproductores() {
		// TODO Auto-generated method stub
		return repositorio.findByOrderByNomreproducAsc();
	}

	@Override
	public Reproductor obtenerReprodPorNombre(String nomreproduc) {
		// TODO Auto-generated method stub
		return repositorio.findByNomreproduc(nomreproduc);
	}

	@Override
	public int actualizarReproductor(String nomreproducActual, String nuevonomreproduc, String dominio,
			String conexion) {
		// TODO Auto-generated method stub
		return repositorio.actualizarReproductor(nomreproducActual, nuevonomreproduc, dominio, conexion);
	}

	@Override
	public Reproductor registrarReproductor(Reproductor reproductor) {
		// TODO Auto-generated method stub
		return repositorio.save(reproductor);
	}

	@Override
	public void eliminarReproductor(String nomreproduc) {
		// TODO Auto-generated method stub
		repositorio.eliminarReproductor(nomreproduc);
	}

}
