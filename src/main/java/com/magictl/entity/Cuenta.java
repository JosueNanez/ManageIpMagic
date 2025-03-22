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
@Table(name = "cuenta")
public class Cuenta {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;
	
    @Transient // 🔹 No se guarda en la base de datos
    private String nuevonomusuario;
	
	@NotBlank(message = "El usuario no puede estar vacío.")
	@Size(min = 3, max = 50, message = "El usuario debe tener mínimo 3 caracteres.")
	@Column(name = "usuario")
	private String usuario;
	
	@NotBlank(message = "La clave no puede estar vacía.")
	@Size(min = 3, max = 15, message = "La clave debe ser entre 3 a 15 caracteres.")
	@Column(name = "clave")
	private String clave;
	
	@NotBlank(message = "Seleccionar el servicio.")
	//@Size(min = 2, max = 20, message = "El nombre no debe superar los 20 caracteres.")
	@Column(name = "nomservicio")
	private String nomservicio;
	
	@NotNull(message = "La fecha de activación no puede ser nula.")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "fecactiv", nullable = false)
	private LocalDate fecactiv;
	
	@NotNull(message = "La fecha de expiración no puede ser nula.")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "fecvenc", nullable = false)
	private LocalDate fecvenc;
	
	@Column(name = "perfenuso")
	private int perfenuso;
	
	@NotBlank(message = "Elegir el tipo de instalación.")
	@Column(name = "instalacion")
	private String instalacion;
	
	@NotBlank(message = "Seleccionar adultos.")
	@Column(name = "cadultos")
	private String cadultos;
	
	@Column(name = "mtresu")
	private String mtresu;
	
	
    public String getFormattedText() {
        return String.format(
            "%-15s | %-10s / %-10s | %-20s |  %s",
            usuario, 
            perfenuso, 
            servicio.getPerfiles(), 
            instalacion, 
            fecvenc
        );
    }
	
	
	
	@ManyToOne
	@JoinColumn(name = "nomservicio", referencedColumnName = "nomservicio", insertable = false, updatable = false)
	private Servicio servicio;
	

}
