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
	let navbarHeight = fixedDiv.offsetHeight;

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
			const nomplan = button.getAttribute("data-nombre");
			if (!nomplan) {
				console.error("Error: nomplan es null o vacío.");
				return;
			}

			fetch(`/planes/buscar/${encodeURIComponent(nomplan)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error("No se pudo obtener el plan.");
					}
					return response.json();
				})
				.then(plan => {
					document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
					document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
					document.getElementById("inputNombreHidden").value = plan.nomplan;
					document.getElementById("inputNombre").value = plan.nomplan;

					//document.getElementById("inputNombre").readOnly = true;
					document.getElementById("inputPrecio").value = plan.precventa;
					document.getElementById("inputCantidad").value = plan.perfiles;
					document.getElementById("inputImagen").value = plan.imagen;
					document.getElementById("tipoSoporte").value = plan.soporte;

					document.getElementById("modalLabel").innerHTML = "EDITAR PLAN";
					document.getElementById("botonModal").innerHTML = "ACTUALIZAR";
				})
				.catch(error => {
					console.error("Error al obtener los datos:", error);
					alert("No se pudo cargar la información del plan.");
				});

		} else {
			document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
			document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
			// Resetear modal para nuevo plan
			document.getElementById("modalLabel").innerHTML = "NUEVO PLAN";
			document.getElementById("botonModal").innerHTML = "CREAR PLAN";
			document.getElementById("inputNombre").value = "";
			document.getElementById("inputNombre").readOnly = false;
			document.getElementById("inputPrecio").value = 0;
			document.getElementById("inputCantidad").value = 0;
			document.getElementById("inputImagen").value = "";
			document.getElementById("tipoSoporte").selectedIndex(0);

		}
	});
});


// PROCESAR DATOS UPDATE O CREATE
document.getElementById('botonModal').addEventListener('click', async function(event) {
	event.preventDefault(); // Evita el envío automático del formulario

	document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
	const nuevoNombre = document.getElementById("inputNombre").value.trim();
	const nomplan = document.getElementById("inputNombreHidden").value.trim();
	const precio = document.getElementById("inputPrecio").value;
	const perfiles = document.getElementById("inputCantidad").value;
	const tipoimagen = document.getElementById("inputImagen").value;
	const tipoSoporte = document.getElementById("tipoSoporte").value;


	if (tipodeAccion === "actualizar") {
		try {
			const response = await fetch(`/planes/actualizar`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nuevonomplan: nuevoNombre,
					nomplan: nomplan,
					precventa: precio,
					perfiles: perfiles,
					imagen: tipoimagen,
					soporte: tipoSoporte
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
				title: "Plan Actualizado",
				icon: "success",
				timer: 1000,
				showConfirmButton: false
			});
			location.reload(); // Recargar la página para ver los cambios

		} catch (error) {
			Swal.fire("Error", "Error al actualizar el plan.", "error");
		}

	} else {

		const buscarPlan = await fetch(`/planes/buscar/${encodeURIComponent(nuevoNombre)}`);
		if (buscarPlan.ok) {
			Swal.fire("Error", "El plan ya existe.", "error");
			return;
		} else {
			try {
				const response = await fetch(`/planes/crear`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						nomplan: nuevoNombre,
						precventa: precio,
						perfiles: perfiles, 
						imagen: tipoimagen,
						soporte: tipoSoporte
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
					title: "Plan Agregado",
					icon: "success",
					timer: 1000,
					showConfirmButton: false
				});
				location.reload(); // Recargar la página para ver los cambios

			} catch (error) {
				Swal.fire("Error", "Error al crear el plan.", "error");
			}

		}
	}
});

function mostrarErrores(errores) {
	errores.forEach(error => {
		if (error.includes("nombre")) {
			document.getElementById("errorNombre").textContent = error;
		} else if (error.includes("precio")) {
			document.getElementById("errorPrecio").textContent = error;
		} else if (error.includes("Perfil")) {
			document.getElementById("errorPerfiles").textContent = error;
		} else if (error.includes("imagen")) {
			document.getElementById("errorImagen").textContent = error;
		}
	});
}



//ELIMINAR REGISTRO

document.addEventListener("DOMContentLoaded", function() {
	document.querySelectorAll(".botonEliminar").forEach(boton => {
		boton.addEventListener("click", function() {

			const nomplan = this.getAttribute("data-nombre"); // Obtener el nombre del plan
			console.log(nomplan);
			if (nomplan) {
				Swal.fire({
					title: "Eliminar " + nomplan,
					text: "¿Estás seguro?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Sí, eliminar!"
				}).then(async (result) => {
					if (result.isConfirmed) {
						try {
							const response = await fetch(`/planes/eliminar?` + new URLSearchParams({ nomplan: nomplan }), {
								method: "DELETE"
							});

							if (!response.ok) {
								Swal.fire({
									icon: "error",
									title: "El plan está asociado a un panel!",
									timer: 2000
								});
								throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
							} else {
								await Swal.fire({
									title: "Plan Eliminado",
									icon: "success",
									timer: 1000,
									showConfirmButton: false
								});
								location.reload();
							}
						} catch (error) {
							console.error("Error al eliminar el plan:", error);
						}
					}
				});
			}
		});
	});
});


