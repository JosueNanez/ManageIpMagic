package com.magictl.entity;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "cliente")
public class Cliente {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;
	
    @Transient // 🔹 No se guarda en la base de datos
    private String nuevonomcliente;
	
	@NotBlank (message = "El nombre no puede estar vacío.")
	@Size(min = 2, max = 50, message = "El nombre debe ser de 2 a 40 caracteres.")
	@Column(name = "nomcliente")
	private String nomcliente;
	
	@Column(name = "contacto")
	private String contacto;
	
	@NotBlank (message = "El plan no puede estar vacío.")
	@Size(min = 2, max = 20, message = "El plan debe ser de 2 a 20 caracteres.")
	@Column(name = "nomplan")
	private String nomplan;
	
	@NotBlank(message = "El usuario no puede estar vacío.")
	@Size(min = 2, max = 50, message = "El usuario debe ser entre 2 a 30 caracteres.")
	@Column(name = "usuario")
	private String usuario;
	
	@NotNull(message = "La fecha de activación no puede ser nula.")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "fecactiv", nullable = false)
	private LocalDate fecactiv;
	
	@NotNull(message = "La fecha de expiración no puede ser nula.")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "fecvenc", nullable = false)
	private LocalDate fecvenc;
	
	@NotBlank (message = "El estado no puede estar vacío.")
	@Size(min = 6, max = 10, message = "El estado debe ser de 6 a 10 caracteres.")
	@Column(name = "estado")
	private String estado;
	
	@NotBlank (message = "El campo adultos no puede estar vacío.")
	@Size(min = 2, max = 2, message = "El valor debe ser SI / NO.")
	@Column(name = "cadultos")
	private String cadultos;
	
	@ManyToOne
	@JoinColumn(name = "nomplan", referencedColumnName = "nomplan", insertable = false, updatable = false)
	private Plan plan;
	
	@ManyToOne
	@JoinColumn(name = "usuario", referencedColumnName = "usuario", insertable = false, updatable = false)
	private Cuenta cuenta;
	

}
