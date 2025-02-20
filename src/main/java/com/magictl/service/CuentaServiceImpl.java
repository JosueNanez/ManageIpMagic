package com.magictl.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import com.magictl.entity.Cuenta;
import com.magictl.repository.CuentaRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class CuentaServiceImpl implements CuentaService {
	
	@PersistenceContext
	private EntityManager entityManager;
	
	@Autowired
	private CuentaRepository repositorio;
	
	/*@Override
	public List<Cuenta> listaDeCuentas() {
		// TODO Auto-generated method stub
		List<Cuenta> cuentaSinNull = repositorio.findByOrderByFecvencAsc();
		cuentaSinNull.removeIf(cuenta -> "Sin usuario".equals(cuenta.getUsuario()));
		return cuentaSinNull;
	}*/

	@Override
	public List<Cuenta> listaDeCuentasDesc() {
		LocalDate hoy = LocalDate.now();
		LocalDate fechaDosDias = hoy.plusDays(2);
		LocalDate fechaSeisDias = hoy.plusDays(6);
		List<Cuenta> cuentas = repositorio.listadeUsuariosActivosDesc(fechaDosDias, fechaSeisDias);
		// TODO Auto-generated method stub
		return cuentas;
	}
	
	
	/*@Override
	public List<Cuenta> buscarporLetra(String letra) {
		// TODO Auto-generated method stub
		List<Cuenta> cuentaSinNull = repositorio.buscarPorLetra(letra);
		cuentaSinNull.removeIf(cuenta -> "Sin usuario".equals(cuenta.getUsuario()));
		return cuentaSinNull;
	}*/
	/*
	@Override
	public List<Cuenta> obtenerCuentasVencidas() {
		// TODO Auto-generated method stub
		List<Cuenta> cuentasVencidas = repositorio.listarCuentasVencidas(LocalDate.now());
		cuentasVencidas.removeIf(cuenta -> "Sin usuario".equals(cuenta.getUsuario()));
		return cuentasVencidas;
	}*/
	
	@Override
	public Cuenta obtenerCuentaPorUsuario(String usuario) {
		// TODO Auto-generated method stub
		return repositorio.findByUsuario(usuario);
	}

	@Override
	public Optional<Cuenta> buscarPorUsuario(String usuario) {
	    return Optional.ofNullable(repositorio.findByUsuario(usuario));
	}

	@Modifying
	@Transactional
	public void actualizarPerfenuso(String usuario, int perfenuso) {
		//Obtener perfenuso por Usuario
		
		
		System.err.println("🔎 Valor recibido en el servicio: " + perfenuso);
		repositorio.actualizarPerfenuso(usuario, perfenuso);
        entityManager.flush();  // Forzar que la transacción se ejecute inmediatamente
        entityManager.clear();  // Limpiar el contexto de persistencia para evitar caché
	}
	
	@Override
	public int actualizarCuenta(String usuario, String nuevonomusuario, String clave, String nomservicio, LocalDate fecactiv, LocalDate fecvenc,
			int perfenuso, String instalacion, String cadultos, String mtresu) {
		// TODO Auto-generated method stub
		return repositorio.actualizarCuenta(usuario, nuevonomusuario, clave, nomservicio, fecactiv, fecvenc, perfenuso, instalacion, cadultos, mtresu);
	}

	@Override
	public Cuenta registrarCuenta(Cuenta cuenta) {
		// TODO Auto-generated method stub
		return repositorio.save(cuenta);
	}

	@Override
	public void eliminarcuenta(String usuario) {
		repositorio.eliminarCuenta(usuario);
		
	}
	
	
	
	//PAGINACION

	@Override
	public Page<Cuenta> listaDeCuentasPagin(Pageable pageable) {
		// TODO Auto-generated method stub
		return repositorio.listadeUsuariosActivosAscPag(LocalDate.now(), pageable);
	}

	/*@Override
	public Page<Cuenta> listaDeCuentasDescPagin(Pageable pageable) {
		// TODO Auto-generated method stub
		return repositorio.listadeUsuariosActivosDescPag(LocalDate.now(), pageable);
	}*/

	@Override
	public Page<Cuenta> buscarporLetraPagin(String letra, Pageable pageable) {
		// TODO Auto-generated method stub
		Page<Cuenta> resultado = repositorio.buscarPorLetraPag(letra, pageable);
		if (resultado.isEmpty()) {
			resultado = repositorio.buscarPorClavePag(letra, pageable);
		}
		 return resultado;
	}

	@Override
	public Page<Cuenta> listarCuentasVencidasPagin(Pageable pageable) {
		// TODO Auto-generated method stub
		return repositorio.listarCuentasVencidasPag(LocalDate.now(), pageable);
	}




}
