package com.magictl.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.magictl.entity.Cuenta;

public interface CuentaService {
	
	public Page<Cuenta> listaDeCuentasPagin(Pageable pageable);
	//public Page<Cuenta> listaDeCuentasDesc(Pageable pageable);
	public Page<Cuenta> buscarporLetraPagin(String letra, Pageable pageable);
	public Page<Cuenta> listarCuentasVencidasPagin(Pageable pageable);
	
	
	//public List<Cuenta> listaDeCuentas();
	public List<Cuenta> listaDeCuentasDesc();
	//public List<Cuenta> buscarporLetra(String letra);
	//public List<Cuenta> obtenerCuentasVencidas();
	
	public Optional<Cuenta> buscarPorUsuario(String usuario); //Para ubicar las cuentas en la actualización
	public void actualizarPerfenuso(String usuario, int perfenuso); // Para actualizar perfenuso de las cuentas en la actualización
	
	Cuenta obtenerCuentaPorUsuario(String usuario);
	public int actualizarCuenta(String usuario, String nuevonomusuario, String clave, String nomservicio, LocalDate fecactiv, LocalDate fecvenc, int perfenuso, String instalacion, String cadultos, String mtresu);
	public Cuenta registrarCuenta(Cuenta cuenta);
	
	public void eliminarcuenta(String usuario);
	
	

}
