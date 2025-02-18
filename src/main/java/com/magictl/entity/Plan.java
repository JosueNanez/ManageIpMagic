package com.magictl.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
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
@Table(name = "plan")
public class Plan {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;
	
    @Transient // 🔹 No se guarda en la base de datos
    private String nuevonomplan;
	
	@NotBlank (message = "El nombre no puede estar vacío.")
	@Size(min = 2, max = 20, message = "El nombre debe ser de 2 a 20 caracteres.")
	@Column(name = "nomplan")
	private String nomplan;
	
    @DecimalMin(value = "0.00", inclusive = true, message = "El precio de venta no puede ser negativo.")
    @DecimalMax(value = "100.00", inclusive = true, message = "El precio de venta no puede exceder a 100.00.")
    @Digits(integer = 5, fraction = 2, message = "El precio debe tener como máximo 5 dígitos y 2 decimales.")
    @NotNull(message = "El precio de venta no puede estar vacío.")
    @Column(name = "precventa")
    private BigDecimal precventa; 
    
	@Min(value = 1, message = "Perfiles no pueden ser menor que 1.")
	@NotNull(message = "El Perfil no puede estar vacío.")
	@Column(name = "perfiles")
    private int perfiles;
	
	@NotBlank (message = "El tipo de imagen no puede estar vacío.")
	private String imagen;
	
	private String soporte;
	

}
