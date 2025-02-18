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
			const nomservicio = button.getAttribute("data-nombre");
			if (!nomservicio) {
				console.error("Error: nomplan es null o vacío.");
				return;
			}

			fetch(`/paneles/buscar/${encodeURIComponent(nomservicio)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error("No se pudo obtener el plan.");
					}
					return response.json();
				})
				.then(servicio => {
					document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
					document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
					document.getElementById("inputNombreHidden").value = servicio.nomservicio;
					document.getElementById("inputNombre").value = servicio.nomservicio;
					//document.getElementById("inputNombre").readOnly = true;
					document.getElementById("nomPlan").value = servicio.nomplan;
					document.getElementById("inputDominio").value = servicio.dominio;
					document.getElementById("inputPerfiles").value = servicio.perfiles;
					document.getElementById("inputCostoCredito").value = servicio.costocredito;
					document.getElementById("inputContacto").value = servicio.contacto;

					document.getElementById("modalLabel").innerHTML = "EDITAR SERVICIO";
					document.getElementById("botonModal").innerHTML = "ACTUALIZAR";
				})
				.catch(error => {
					console.error("Error al obtener los datos:", error);
					alert("No se pudo cargar la información del plan.");
				});

		} else {
			// Resetear modal para nuevo plan
			document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
			document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
			document.getElementById("modalLabel").innerHTML = "NUEVO SERVICIO";
			document.getElementById("botonModal").innerHTML = "CREAR";

			document.getElementById("inputNombre").value = "";
			document.getElementById("inputNombre").readOnly = false;
			document.getElementById("nomPlan").selectedIndex = 0;
			document.getElementById("inputDominio").value = "";
			document.getElementById("inputPerfiles").value = 0;
			document.getElementById("inputCostoCredito").value = 0;
			document.getElementById("inputContacto").value = "";
		}
	});
});


// PROCESAR DATOS UPDATE O CREATE
document.getElementById('botonModal').addEventListener('click', async function(event) {
	event.preventDefault(); // Evita el envío automático del formulario

	document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
	const nomservicio = document.getElementById("inputNombreHidden").value.trim();
	const nuevonomservicio = document.getElementById("inputNombre").value.trim();
	const nomPlan = document.getElementById("nomPlan").value.trim();
	const nomurl = document.getElementById("inputDominio").value.trim();
	const perfiles = document.getElementById("inputPerfiles").value;
	const costocredito = document.getElementById("inputCostoCredito").value;
	const contact = document.getElementById("inputContacto").value.trim();


	if (tipodeAccion === "actualizar") {
		try {
			const response = await fetch(`/paneles/actualizar`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nomservicio: nomservicio,
					nuevonomservicio: nuevonomservicio,
					nomplan: nomPlan,
					dominio: nomurl,
					perfiles: perfiles,
					costocredito: costocredito,
					contacto: contact
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
				title: "Panel Actualizado",
				icon: "success",
				timer: 1000,
				showConfirmButton: false
			});
			location.reload(); // Recargar la página para ver los cambios

		} catch (error) {
			Swal.fire("Error", "Error al actualizar el panel.", "error");
		}

	} else {
		const buscarPanel = await fetch(`/paneles/buscar/${encodeURIComponent(nuevonomservicio)}`);
		if (buscarPanel.ok) {
			Swal.fire("Error", "El nombre de servicio ya existe.", "error");
			return;
		} else {
			try {
				const response = await fetch(`/paneles/crear`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						nomservicio: nuevonomservicio,
						nomplan: nomPlan,
						dominio: nomurl,
						perfiles: perfiles,
						costocredito: costocredito,
						contacto: contact
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
					title: "Panel Registrado",
					icon: "success",
					timer: 1000,
					showConfirmButton: false
				});
				location.reload(); // Recargar la página para ver los cambios

			} catch (error) {
				Swal.fire("Error", "Error al registrar el panel.", "error");
			}
		}
	}
});

function mostrarErrores(errores) {
	errores.forEach(error => {
		if (error.includes("nombre")) {
			document.getElementById("errorNombre").textContent = error;
		} else if (error.includes("plan")) {
			document.getElementById("errorPlan").textContent = error;
		} else if (error.includes("dominio")) {
			document.getElementById("errorDominio").textContent = error;
		} else if (error.includes("Perfil")) {
			document.getElementById("errorPerfiles").textContent = error;
		} else if (error.includes("costo")) {
			document.getElementById("errorCostoCredito").textContent = error;
		} else if (error.includes("contacto")) {
			document.getElementById("errorContacto").textContent = error;
		}
	});
}



//ELIMINAR REGISTRO

document.addEventListener("DOMContentLoaded", function() {
	document.querySelectorAll(".botonEliminar").forEach(boton => {
		boton.addEventListener("click", function() {

			const nomservicio = this.getAttribute("data-nombre"); // Obtener el nombre del plan
			//console.log(nomplan);
			if (nomservicio) {
				Swal.fire({
					title: "Eliminar " + nomservicio,
					text: "¿Estás seguro?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Sí, eliminar!"
				}).then(async (result) => {
					if (result.isConfirmed) {
						try {
							const response = await fetch(`/paneles/eliminar?` + new URLSearchParams({ nomservicio: nomservicio }), {
								method: "DELETE"
							});

							if (!response.ok) {
								Swal.fire({
									icon: "error",
									title: "El panel tiene cuentas en uso!",
									timer: 2000
								});
								throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
							} else {
								await Swal.fire({
									title: "Panel Eliminado",
									icon: "success",
									timer: 1000,
									showConfirmButton: false
								});
								location.reload();
							}
						} catch (error) {
							console.error("Error al eliminar el panel:", error);
						}
					}
				});
			}
		});
	});
});


