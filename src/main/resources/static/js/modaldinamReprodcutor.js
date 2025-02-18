// ALTURA DINÁMICA CON SCROLL PARA TABLA
document.addEventListener('DOMContentLoaded', () => {
	// Obtener elementos del DOM
	const fixedDiv = document.getElementById('nav');
	const header = document.getElementById('encabezado');
	const dynamicDiv = document.getElementById('contenedorTabla');

	let alturaNav = 0;
	Array.from(fixedDiv.children).forEach(child => {
	    alturaNav += child.offsetHeight;
	});
	
	let alturaheader = 0;
	Array.from(header.children).forEach(child => {
	    alturaheader += child.offsetHeight;
	});

	// Obtener altura de navbar (Para dispositivo movil)
	let  navbarHeight = fixedDiv.offsetHeight;

	let sumaAltura = navbarHeight + alturaNav + alturaheader;
	
	//Margen inferior de la tabla al borde pantalla
	let margenInferior = 10;

	// Calcular la altura restante
	const alturaPantalla = window.innerHeight;
	const alturaRestante = alturaPantalla - sumaAltura - margenInferior;
	
	// Asignar la altura restante al div dinámico
	dynamicDiv.style.height = `${alturaRestante}px`;

	// Ajustar altura al cambiar el tamaño de la ventana
	window.addEventListener('resize', () => {
		const alturaPantalla = window.innerHeight;
		const alturaRestante = alturaPantalla - sumaAltura;
		dynamicDiv.style.height = `${alturaRestante}px`;
		console.log("Altura agregada");
	});
});



var tipodeAccion = "";

//CARGA DE DATOS
document.addEventListener("DOMContentLoaded", function() {
	var registroModal = document.getElementById("registroModal");

	registroModal.addEventListener("show.bs.modal", function(event) {
		var button = event.relatedTarget; // Botón que disparó el modal
		var tipo = button.getAttribute("data-tipo");
		tipodeAccion = tipo;

		if (tipodeAccion === "actualizar") {
			const nomReproduc = button.getAttribute("data-nombre");
			if (!nomReproduc) {
				console.error("Error: nombreReproductor es null o vacío.");
				return;
			}

			fetch(`/reproductores/buscar/${encodeURIComponent(nomReproduc)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error("No se pudo obtener el reproductor.");
					}
					return response.json();
				})
				.then(reprod => {
					document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
					document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
					document.getElementById("inputNombreHidden").value = reprod.nomreproduc;
					document.getElementById("inputReproduc").value = reprod.nomreproduc;
					
					//document.getElementById("inputNombre").readOnly = true;
					document.getElementById("inputDominio").value = reprod.dominio;
					document.getElementById("nomInstalacion").value = reprod.conexion;

					document.getElementById("modalLabel").innerHTML = "EDITAR REPRODUCTOR";
					document.getElementById("botonModal").innerHTML = "ACTUALIZAR";
				})
				.catch(error => {
					console.error("Error al obtener los datos:", error);
					alert("No se pudo cargar la información del reproductor.");
				});

		} else {
			document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
			document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
			// Resetear modal para nuevo plan
			document.getElementById("modalLabel").innerHTML = "NUEVO REPRODUCTOR";
			document.getElementById("botonModal").innerHTML = "CREAR";
			document.getElementById("inputReproduc").value = "";
			document.getElementById("inputReproduc").readOnly = false;
			document.getElementById("inputDominio").value = "";
			document.getElementById("nomInstalacion").selectedIndex = 0;
			
		}
	});
});


// PROCESAR DATOS UPDATE O CREATE
document.getElementById('botonModal').addEventListener('click', async function(event) {
	event.preventDefault(); // Evita el envío automático del formulario

	document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
	const nuevoNombre = document.getElementById("inputReproduc").value.trim();
	const nomreproduc = document.getElementById("inputNombreHidden").value.trim();
	const dominio = document.getElementById("inputDominio").value;
	const conexion = document.getElementById("nomInstalacion").value;


	if (tipodeAccion === "actualizar") {
		try {
			const response = await fetch(`/reproductores/actualizar`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nuevonomreproduc: nuevoNombre,
					nomreproduc: nomreproduc,
					dominio: dominio,
					conexion: conexion
				})
			});

			const result = await response.json(); // Convertir la respuesta a JSON

			if (!response.ok) {
				if (Array.isArray(result)) {
					mostrarErrores(result);
				} else {
					throw new Error(result.mensaje);
				}
				return;
			}

			var modalCloseButton = document.querySelector('[data-bs-dismiss="modal"]');
			if (modalCloseButton) {
				modalCloseButton.click();  // Simula el clic en el botón que cierra el modal
			}

			await Swal.fire({
				title: "Reprodcutor Actualizado",
				icon: "success",
				timer: 1000,
				showConfirmButton: false
			});
			location.reload(); // Recargar la página para ver los cambios

		} catch (error) {
			Swal.fire("Error", "Error al actualizar el reproductor.", "error");
		}

	} else {
		
		const buscarPlan = await fetch(`/reproductores/buscar/${encodeURIComponent(nuevoNombre)}`);
		if (buscarPlan.ok){
			Swal.fire("Error", "El reprodcutor ya existe.", "error");
			return;
		} else {
			try {
				const response = await fetch(`/reproductores/crear`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						nomreproduc: nuevoNombre,
						dominio: dominio,
						conexion: conexion
					})
				});

				const result = await response.json(); // Convertir la respuesta a JSON

				if (!response.ok) {
					if (result.errores && Array.isArray(result.errores)) {
					    mostrarErrores(result.errores);
					} else {
					    throw new Error(result.mensaje);
					}
					return;
				}

				var modalCloseButton = document.querySelector('[data-bs-dismiss="modal"]');
				if (modalCloseButton) {
					modalCloseButton.click();  // Simula el clic en el botón que cierra el modal
				}

				await Swal.fire({
					title: "Reproductor Agregado",
					icon: "success",
					timer: 1000,
					showConfirmButton: false
				});
				location.reload(); // Recargar la página para ver los cambios

			} catch (error) {
				Swal.fire("Error", "Error al crear el reprodcutor.", "error");
			}
			
		}
	}
});

function mostrarErrores(errores) {
	errores.forEach(error => {
		if (error.includes("nombre")) {
			document.getElementById("errorNombre").textContent = error;
		} else if (error.includes("dominio")) {
			document.getElementById("errorDominio").textContent = error;
		} else if (error.includes("conexión")) {
			document.getElementById("errorInstalacion").textContent = error;
		}
	});
}



//ELIMINAR REGISTRO

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".botonEliminar").forEach(boton => {
        boton.addEventListener("click", function () {
            
            const nomReprod = this.getAttribute("data-nombre"); // Obtener el nombre del plan
			//console.log(nomplan);
            if (nomReprod) {
                Swal.fire({
                    title: "Eliminar " + nomReprod,
                    text: "¿Estás seguro?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, eliminar!"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const response = await fetch(`/reproductores/eliminar?` + new URLSearchParams({ nomreproduc: nomReprod }), {
                                method: "DELETE"
                            });

                            if (!response.ok) {
                                Swal.fire({
                                    icon: "error",
                                    title: "Hay dispositivos asociados al Reproductor!",
                                    timer: 2000
                                });
                                throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
                            } else {
                                await Swal.fire({
                                    title: "Reproductor Eliminado",
                                    icon: "success",
                                    timer: 1000,
                                    showConfirmButton: false
                                });
                                location.reload();
                            }
                        } catch (error) {
                            console.error("Error al eliminar el reproductor:", error);
                        }
                    }
                });
            }
        });
    });
});


