package com.magictl.entity;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name = "dispositivo")
public class Dispositivo {
	
	@Id
	@Column(name = "id")
	private int id;
	
	@NotBlank (message = "El cliente no puede estar vacío.")
	@Size(min = 2, max = 50, message = "El cliente debe ser de 2 a 40 caracteres.")
	@Column(name = "nomcliente")
	private String nomcliente;
	
	@NotBlank (message = "El reproductor no puede estar vacío.")
	@Size(min = 2, max = 40, message = "El reproductor debe ser de 2 a 30 caracteres.")
	@Column(name = "nomreproduc")
	private String nomreproduc;
	
	@Column(name = "mac")
	private String mac;
	
	@Column(name = "clave")
	private String clave;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "fecactiv")
	private LocalDate fecactiv;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "fecvenc")
	private LocalDate fecvenc;
	
	@ManyToOne
	@JoinColumn(name = "nomcliente", referencedColumnName = "nomcliente", insertable = false, updatable = false)
	private Cliente cliente;
	
	@ManyToOne
	@JoinColumn(name = "nomreproduc", referencedColumnName = "nomreproduc", insertable = false, updatable = false)
	private Reproductor reproductor;

}
