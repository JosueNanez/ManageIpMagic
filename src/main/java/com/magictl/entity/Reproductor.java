package com.magictl.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "reproductor")
public class Reproductor {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Transient // 🔹 No se guarda en la base de datos
	private String nuevonomreproduc;

	@NotBlank(message = "El nombre no puede estar vacío.")
	@Size(min = 2, max = 40, message = "El nombre debe ser de 2 a 30 caracteres.")
	@Column(name = "nomreproduc")
	private String nomreproduc;

	@Column(name = "dominio")
	private String dominio;
	

	@NotBlank(message = "Elegir el tipo de conexión.")
	@Column(name = "conexion")
	private String conexion;

}
