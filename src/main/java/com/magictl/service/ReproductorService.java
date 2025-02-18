package com.magictl.service;

import java.util.List;

import com.magictl.entity.Reproductor;

public interface ReproductorService {
	
	public List<Reproductor> listaDeReproductores();
	
	Reproductor obtenerReprodPorNombre(String nomreproduc);
	public int actualizarReproductor(String nomreproducActual, String nuevonomreproduc, String dominio, String conexion);
	public Reproductor registrarReproductor(Reproductor reproductor);
	
	public void eliminarReproductor(String nomreproduc);
	
	
}
