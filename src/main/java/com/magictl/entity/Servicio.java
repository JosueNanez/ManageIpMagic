package com.magictl.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
@Table(name = "servicio")
public class Servicio {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;
	
    @Transient // 🔹 No se guarda en la base de datos
    private String nuevonomservicio;
	
	@NotBlank(message = "El nombre no puede estar vacío.")
	@Size(min = 2, max = 20, message = "El nombre no debe superar los 20 caracteres.")
	@Column(name = "nomservicio")
	private String nomservicio;
	
	@NotBlank (message = "Seleccionar un tipo de plan.")
	//@Size(min = 2, max = 20, message = "El nombre debe ser de 2 a 20 caracteres.")
	@Column(name = "nomplan")
	private String nomplan;
	
	@NotBlank(message = "El dominio no puede estar vacío.")
	@Size(min = 12, max = 90, message = "El dominio no debe superar los 70 caracteres.")
	@Pattern(
		    regexp = "^(https?://).*", 
		    message = "El dominio debe comenzar con 'http://' o 'https://'."
		)
	@Column(name = "dominio")
	private String dominio;
	
	@Min(value = 1, message = "Perfiles no pueden ser menor que 1.")
	@NotNull(message = "El Perfil no puede estar vacío.")
	@Column(name = "perfiles")
    private int perfiles;
	
    @DecimalMin(value = "0.00", inclusive = true, message = "El costo del crédito no puede ser negativo.")
    @DecimalMax(value = "50.00", inclusive = true, message = "El costo del crédito no puede exceder a 50.00.")
    @Digits(integer = 5, fraction = 2, message = "El costo debe tener como máximo 5 dígitos y 2 decimales.")
    @NotNull(message = "El costo de crédito no puede estar vacío.")
    @Column(name = "costocredito")
    private BigDecimal costocredito; 
    
	
	@Size(max = 20, message = "El contacto no debe superar los 20 caracteres.")
	@Column(name = "contacto")
	private String contacto;
	
	@ManyToOne
	@JoinColumn(name = "nomplan", referencedColumnName = "nomplan", insertable = false, updatable = false)
	private Plan plan;

}
