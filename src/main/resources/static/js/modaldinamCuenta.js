// ALTURA DINÁMICA CON SCROLL PARA TABLA
document.addEventListener('DOMContentLoaded', () => {
	// Obtener elementos del DOM
	const fixedDiv = document.getElementById('nav');
	const header = document.getElementById('encabezado');
	const contFiltro = document.getElementById('contenedorFiltro');
	const contPagina = document.getElementById('contenedorPaginacion');

	const dynamicDiv = document.getElementById('contenedorTabla');

	let alturaNav = 0;
	Array.from(fixedDiv.children).forEach(child => {
		alturaNav += child.offsetHeight;
	});

	let alturaheader = 0;
	Array.from(header.children).forEach(child => {
		alturaheader += child.offsetHeight;
	});

	let alturafiltro = 0;
	Array.from(contFiltro.children).forEach(child => {
		alturafiltro += child.offsetHeight;
	});

	let contPaginacion = 0;
	Array.from(contPagina.children).forEach(child => {
		contPaginacion += child.offsetHeight;
	});


	let sumaAltura = alturaNav + alturaheader + alturafiltro + contPaginacion;

	//Margen inferior de la tabla al borde pantalla
	let margenInferior = 10;

	if (window.innerWidth <= 918) { //Si la vista es en celular ajustar margen
		margenInferior = -30;
	}

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
		//console.log("Altura agregada");
	});
	//ocultar boton de filtroDesactivos en vista movil
	const filtroDesactivados = document.getElementById("filtroDesactivados");
	function ajustarVista() {
		if (window.innerWidth <= 918) {
			filtroDesactivados.style.visibility = "hidden"; // Ocultar sin perder espacio
			filtroDesactivados.style.position = "absolute"; // Evita afectar el diseño
			//margenInferior = 0;
		} else {
			filtroDesactivados.style.visibility = "visible";
			filtroDesactivados.style.position = "relative";
		}
	}

	ajustarVista(); // Ejecutar al cargar
	window.addEventListener("resize", ajustarVista);
});



// CARGAR CUENTAS - BUSCADOR DINÁMICO
let currentPage = 0;
let size = 15; // Tamaño de la página 
var seleccion = false; // Servirá para estados del botón "Cuentas Vencidas"
async function cargarCuentas(page = 0) {
	const tbody = document.getElementById("tablaCuentas");
	const inputBusqueda = document.getElementById("busqueda");
	let letra = inputBusqueda.value.trim();

	try {
		const response = await fetch(`/cuentas/busqueda?letra=${encodeURIComponent(letra)}&page=${page}&size=${size}`);
		if (!response.ok) {
			throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
		}
		const data = await response.json();
		const cuentas = data.content;
		const totalPages = data.totalPages;
		currentPage = page;

		tbody.innerHTML = "";
		cuentas.forEach((cuenta) => {
			const row = document.createElement("tr");

			const thUsuario = document.createElement("th");
			thUsuario.textContent = cuenta.usuario;
			row.appendChild(thUsuario);

			const tdClave = document.createElement("td");
			tdClave.textContent = cuenta.clave;

			const tdFecVenc = document.createElement("td");
			tdFecVenc.textContent = cuenta.fecvenc;

			const tdPerfiles = document.createElement("td");
			tdPerfiles.textContent = `${cuenta.perfenuso} / ${cuenta.servicio.perfiles}`;

			const tdNomServicio = document.createElement("td");
			tdNomServicio.textContent = cuenta.nomservicio;

			const tdInstalacion = document.createElement("td");
			tdInstalacion.textContent = cuenta.instalacion;

			const tdCAdultos = document.createElement("td");
			tdCAdultos.textContent = cuenta.cadultos;

			// Condiciones de colores
			let color = "";
			const fechavenc = fechaUTC(cuenta.fecvenc);
			const fechahoy = fecha();
			const fechahoymas2 = new Date(fechahoy);
			fechahoymas2.setDate(fechahoy.getDate() + 2);

			if (fechavenc.getTime() < fechahoy.getTime()) {
				color = "color: red";
			} else if (cuenta.perfenuso > cuenta.servicio.perfiles) {
				color = "color: red";
			} else if (fechavenc.getTime() <= fechahoymas2.getTime()) {
				color = "color: #bb710d";
			}

			[thUsuario, tdClave, tdFecVenc, tdPerfiles, tdNomServicio, tdInstalacion, tdCAdultos].forEach((el) => (el.style = color));

			// Celda de botones
			const tdBotones = document.createElement("td");

			const btnEdit = document.createElement("button");
			btnEdit.classList.add("btn", "btn-outline-warning", "btn-sm", "btn-edit");
			btnEdit.setAttribute("data-bs-toggle", "modal");
			btnEdit.setAttribute("data-tipo", "actualizar");
			btnEdit.setAttribute("data-bs-target", "#registroModal");
			btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
			btnEdit.setAttribute("data-nombre", cuenta.usuario);

			const btnEliminar = document.createElement("button");
			btnEliminar.classList.add("btn", "btn-outline-danger", "btn-sm", "ms-3", "botonEliminar");
			btnEliminar.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
			btnEliminar.setAttribute("data-nombre", cuenta.usuario);

			tdBotones.appendChild(btnEdit);
			tdBotones.appendChild(btnEliminar);

			row.append(tdClave, tdFecVenc, tdPerfiles, tdNomServicio, tdInstalacion, tdCAdultos, tdBotones);
			tbody.appendChild(row);
		});

		actualizarPaginacion(totalPages);
	} catch (error) {
		console.error("Error al buscar el usuario", error);
	}
}

// ACTUALIZAR PAGINACIÓN - BUSCADOR DINAMICO
function actualizarPaginacion(totalPages) {
	const paginacion = document.getElementById("ulPaginacion");
	paginacion.innerHTML = "";

	const container = document.createElement("div");
	container.classList.add("me-4", "mt-2");

	const paginaActualTexto = document.createElement("span");
	paginaActualTexto.id = "paginaActualTexto";
	paginaActualTexto.textContent = `Página ${currentPage + 1} de ${totalPages}`;
	container.appendChild(paginaActualTexto);
	paginacion.appendChild(container);

	function crearBoton(id, label, iconClass = null, disabled = false) {
		const listItem = document.createElement("li");
		listItem.classList.add("page-item");

		const button = document.createElement("button");
		button.classList.add("page-link");
		button.id = id;
		button.setAttribute("aria-label", label);
		if (disabled) {
			button.classList.add("disabled");
			//button.disabled = true; // Deshabilita el botón si la condición es true
		}

		if (iconClass) {
			const icon = document.createElement("i");
			icon.classList.add("fa-solid", iconClass);
			button.appendChild(icon);
		} else {
			button.textContent = label;
		}

		listItem.appendChild(button);
		return listItem;
	}

	// Crear los botones con la condición de habilitación/deshabilitación
	const btnInicio = crearBoton("btnInicio", "1", null, currentPage === 0);
	const btnAnterior = crearBoton("btnAnterior", "Anterior", "fa-backward", currentPage === 0);
	const btnSiguiente = crearBoton("btnSiguiente", "Siguiente", "fa-forward", currentPage + 1 >= totalPages);
	const btnUltima = crearBoton("btnUltima", `${totalPages}`, null, currentPage + 1 >= totalPages);

	paginacion.append(btnInicio, btnAnterior, btnSiguiente, btnUltima);


	// Agregar eventos después de renderizar botones
	
	if(seleccion){
		//seleccion = false;
		setTimeout(() => {
			document.getElementById("btnInicio").addEventListener("click", () => cargarCuentasVencidas(0));
			document.getElementById("btnAnterior").addEventListener("click", () => {
				if (currentPage > 0) cargarCuentasVencidas(currentPage - 1);
			});
			document.getElementById("btnSiguiente").addEventListener("click", () => {
				cargarCuentasVencidas(currentPage + 1);
			});
			document.getElementById("btnUltima").addEventListener("click", async () => {
				const response = await fetch(`/cuentas/vencidas?page=${page}&size=${size}`);
				const data = await response.json();
				cargarCuentasVencidas(data.totalPages - 1);
			});
		}, 50);
		
		
	} else {
		setTimeout(() => {
			document.getElementById("btnInicio").addEventListener("click", () => cargarCuentas(0));
			document.getElementById("btnAnterior").addEventListener("click", () => {
				if (currentPage > 0) cargarCuentas(currentPage - 1);
			});
			document.getElementById("btnSiguiente").addEventListener("click", () => {
				cargarCuentas(currentPage + 1);
			});
			document.getElementById("btnUltima").addEventListener("click", async () => {
				const response = await fetch(`/cuentas/busqueda?letra=${encodeURIComponent(document.getElementById("busqueda").value)}&page=0&size=${size}`);
				const data = await response.json();
				cargarCuentas(data.totalPages - 1);
			});
		}, 50);
	}
}

// BUSCADOR DINÁMICO
document.addEventListener("DOMContentLoaded", function() {
	const inputBusqueda = document.getElementById("busqueda");

	inputBusqueda.addEventListener("keyup", async function() {
		let letra = inputBusqueda.value.trim();

		if (letra === "") {
			location.reload();
			return;
		}

		cargarCuentas(0);
	});
});







//CONVERSION - USO DE FECHAS JSON "yyyy-MM-dd" EN JAVASCRIPT
//Para que JAVASCRIPT no agregue hora 00:00 y luego le reste la zona horaria UTC-5
//Se obtiene fecha JAVASCRIPT "yyyy-MM-dd" y se obtiene solo fecha
//Si tiene hora se separa dejando el año, mes y día en un arreglo del cual sale un nuevo Date
function fechaUTC(fechaISO) {
	const [year, month, day] = fechaISO.split("T")[0].split("-");
	return new Date(year, month - 1, day); // Se ajusta manualmente sin TZ
}
function fecha() {
	const fechaActual = new Date();
	fechaActual.setHours(0, 0, 0, 0);
	return fechaActual;
}
//Uso de fechas con horas a 00
/*const fechaActual = new Date();
fechaActual.setHours(0, 0, 0, 0);
const fechaVencer = fechaUTC(clien.fecvenc);
if (fechaVencer.getTime() < fecha()) {}*/


//REGISTRO Y ACTUALIZACIÓN
var tipodeAccion = "";

//CARGA DE DATOS PARA MODAL
document.addEventListener("DOMContentLoaded", function() {
	var registroModal = document.getElementById("registroModal");

	registroModal.addEventListener("show.bs.modal", function(event) {
		var button = event.relatedTarget; // Botón que disparó el modal
		var tipo = button.getAttribute("data-tipo");
		tipodeAccion = tipo;
		const errorVencimiento = document.getElementById("error-msVencimiento");
		const errorPanel = document.getElementById("error-msPanel");
		const fechaActual = fecha();
		const fechaActualmas2 = fecha();
		fechaActualmas2.setDate(fechaActual.getDate() + 2);
		if (tipodeAccion === "actualizar") {

			const usuario = button.getAttribute("data-nombre");
			if (!usuario) {
				console.error("Error: usuario es null o vacío.");
				return;
			}
			document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
			document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
			fetch(`/cuentas/buscar/${encodeURIComponent(usuario)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error("No se pudo obtener la cuenta.");
					}
					return response.json();
				})
				.then(cuenta => {
					const fechaVencer = fechaUTC(cuenta.fecvenc);
					document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
					document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
					document.getElementById("inputNombreHidden").value = cuenta.usuario;
					document.getElementById("inputNombre").value = cuenta.usuario;
					//document.getElementById("inputNombre").readOnly = true;
					document.getElementById("inputClave").value = cuenta.clave;
					document.getElementById("inputActivacion").value = cuenta.fecactiv;
					document.getElementById("inputVencimiento").value = cuenta.fecvenc;
					if (fechaVencer.getTime() < fechaActual.getTime()) {
						errorVencimiento.textContent = "⚠️ La cuenta ha vencido.";
						errorVencimiento.style.display = "inline";
					} else if (fechaVencer.getTime() === fechaActual.getTime()) {
						errorVencimiento.textContent = "⚠️ La cuenta vence hoy.";
						errorVencimiento.style.display = "inline";
					} else if (fechaVencer.getTime() <= fechaActualmas2.getTime()) {
						errorVencimiento.textContent = "⚠️ La cuenta está por vencer.";
						errorVencimiento.style.display = "inline";
					}

					document.getElementById("nomServicio").value = cuenta.nomservicio;
					if (cuenta.perfenuso > cuenta.servicio.perfiles) {
						errorPanel.textContent = "⚠️ Conexiones exceden lo permitido: " + cuenta.perfenuso + " / " + cuenta.servicio.perfiles;
						errorPanel.style.display = "inline";
					}


					document.getElementById("nomInstalacion").value = cuenta.instalacion;
					if (cuenta.cadultos === 'Si') {
						document.getElementById("radioSi").checked = true;
					} else {
						document.getElementById("radioNo").checked = true;
					}
					document.getElementById("inputDominio").value = cuenta.mtresu;

					document.getElementById("modalLabel").innerHTML = "EDITAR CUENTA";
					document.getElementById("botonModal").innerHTML = "ACTUALIZAR";
				})
				.catch(error => {
					console.error("Error al obtener los datos:", error);
					alert("No se pudo cargar la información del plan.");
				});
			//VALIDACIÓN DE FECHA DE VENCIMIENTO AL EDITAR
			const inputVencimiento = document.getElementById("inputVencimiento");
			const errorElementVenc = document.getElementById("error-msVencimiento");
			inputVencimiento.addEventListener("input", function() {
				const fechaSeleccionada = fechaUTC(inputVencimiento.value); // Convierte el valor a Date
				const fechaHoy = fecha(); // Fecha actual

				if (fechaSeleccionada.getTime() < fechaHoy.getTime()) {
					errorElementVenc.textContent = "⚠️ La fecha ya ha vencido.";
					errorElementVenc.style.display = "inline";
				} else if (fechaSeleccionada.getTime() === fechaHoy.getTime()) {
					errorElementVenc.textContent = "⚠️ La fecha es hoy.";
					errorElementVenc.style.display = "inline";
				} else {
					errorElementVenc.style.display = "none";
				}
			});

		} else {
			// Resetear modal para nuevo plan
			document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
			document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
			document.getElementById("modalLabel").innerHTML = "NUEVA CUENTA";
			document.getElementById("botonModal").innerHTML = "CREAR CUENTA";

			document.getElementById("inputNombre").value = "";
			document.getElementById("inputNombre").readOnly = false;
			document.getElementById("inputClave").value = "";
			document.getElementById("inputActivacion").value = fecha().toISOString().split('T')[0];
			document.getElementById("inputVencimiento").value = null;
			document.getElementById("radioNo").checked = true;
			document.getElementById("nomServicio").selectedIndex = 0;
			document.getElementById("nomInstalacion").selectedIndex = 0;
			document.getElementById("inputDominio").value = "";
			//VALIDACIÓN DE FECHA DE VENCIMIENTO AL EDITAR
			const inputVencimiento = document.getElementById("inputVencimiento");
			const errorElementVenc = document.getElementById("error-msVencimiento");
			inputVencimiento.addEventListener("input", function() {
				const fechaSeleccionada = fechaUTC(inputVencimiento.value); // Convierte el valor a Date
				const fechaHoy = fecha(); // Fecha actual

				if (fechaSeleccionada.getTime() < fechaHoy.getTime()) {
					errorElementVenc.textContent = "⚠️ La fecha ya ha vencido.";
					errorElementVenc.style.display = "inline";
				} else if (fechaSeleccionada.getTime() === fechaHoy.getTime()) {
					errorElementVenc.textContent = "⚠️ La fecha es hoy.";
					errorElementVenc.style.display = "inline";
				} else {
					errorElementVenc.style.display = "none";
				}
			});
		}
	});
});





// PROCESAR DATOS UPDATE O CREATE
document.getElementById('botonModal').addEventListener('click', async function(event) {
	event.preventDefault(); // Evita el envío automático del formulario

	document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
	const nomUsuario = document.getElementById("inputNombreHidden").value.trim();
	const nuevonomUsuario = document.getElementById("inputNombre").value.trim();
	const nomClave = document.getElementById("inputClave").value.trim();
	const fecActive = document.getElementById("inputActivacion").value.trim();
	const fecVenc = document.getElementById("inputVencimiento").value.trim();
	const nomServicio = document.getElementById("nomServicio").value;
	const nomInstalacion = document.getElementById("nomInstalacion").value;
	const adultos = document.querySelector('input[name="cadultos"]:checked').value;
	const mtresu = document.getElementById("inputDominio").value.trim();


	if (tipodeAccion === "actualizar") {
		//Consultado el obejto cuenta a actualizar por su nomUsuario
		const response = await fetch(`/cuentas/buscar/${encodeURIComponent(nomUsuario)}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		});
		if (!response.ok) {
			throw new Error("No se pudo obtener la Cuenta.");
		}
		const cuentaConsulta = await response.json();

		//Verifica si la cuenta no tiene conexiones perfenuso
		if (cuentaConsulta.perfenuso == 0) {
			try {
				const response = await fetch(`/cuentas/actualizar`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						usuario: nomUsuario,
						nuevonomusuario: nuevonomUsuario,
						clave: nomClave,
						nomservicio: nomServicio,
						fecactiv: fecActive,
						fecvenc: fecVenc,
						perfenuso: 0,
						instalacion: nomInstalacion,
						cadultos: adultos,
						mtresu: mtresu
					})
				});
				const result = await response.json();

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
					title: "Cuenta Actualizada",
					icon: "success",
					timer: 1000,
					showConfirmButton: false
				});
				location.reload(); // Recargar la página para ver los cambios

			} catch (error) {
				Swal.fire("Error", "Error al actualizar la cuenta.", "error");
			}
		} else { // De lo contrario la cuenta tiene conexiones
			Swal.fire({
				title: "Está seguro?",
				text: "Hay clientes conectados a esta cuenta!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Sí, actualizar !",
				cancelButtonText: "Cancelar"
			}).then(async (result) => {
				if (result.isConfirmed) {
					//Lista de clientes que usan la cuenta a actualizar
					const responseClients = await fetch(`/clientes/clientesporUsuario?usuario=${encodeURIComponent(nomUsuario)}`, {
						method: "GET",
						headers: { "Content-Type": "application/json" }
					});
					if (!responseClients.ok) {
						Swal.fire("Error", "No se pudieron obtener los clientes.", "error");
						return;
					}
					const clientes = await responseClients.json();
					//Si solo hay un cliente en la lista se actualiza también su valor cadultos
					if (clientes.length === 1) {
						var clienteUnico = clientes[0];
						try {
							await fetch(`/clientes/actualizarCadultos?nomcliente=${encodeURIComponent(clienteUnico.nomcliente)}&cadultos=${encodeURIComponent(adultos)}`, {
								method: "POST",
								headers: { "Content-Type": "application/json" }
							});
						} catch (error) {
							console.error("Error al actualizar cadultos:", error);
							return;
						}
					}

					//Realizar la actualización de cuenta
					try {
						const response = await fetch(`/cuentas/actualizar`, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								usuario: nomUsuario,
								nuevonomusuario: nuevonomUsuario,
								clave: nomClave,
								nomservicio: nomServicio,
								fecactiv: fecActive,
								fecvenc: fecVenc,
								perfenuso: 0,
								instalacion: nomInstalacion,
								cadultos: adultos,
								mtresu: mtresu
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
							title: "Cuenta Actualizada",
							icon: "success",
							timer: 1000,
							showConfirmButton: false
						});
						//location.reload(); // Recargar la página para ver los cambios

					} catch (error) {
						Swal.fire("Error", "Error al actualizar la cuenta.", "error");
					}
					//Al finar generar una lista de clientes afectados
					const listaClientes = clientes.map(cliente => `<h5>🔸 ${cliente.nomcliente}</h5> `).join("");

					Swal.fire({
						title: "Clientes Impactados:",
						html: `
					        <div style="text-align: center;">
					            ${listaClientes}
					            <button id="copyBtn" style="margin-top: 10px; padding: 8px; border-radius: 5px; background: #3085d6; color: white; border: none;">
					                Copiar Lista
					            </button>
					        </div>
					    `,
						icon: "info",
						showConfirmButton: true,
						confirmButtonText: "Ok"
					}).then((result) => {
						if (result.isConfirmed) {
							location.reload();
						}
					});

					// Esperar a que el alert se cargue para agregar evento al botón
					setTimeout(() => {
						const copyBtn = document.getElementById("copyBtn");
						if (copyBtn) {
							copyBtn.addEventListener("click", () => {
								const textoCopiar = clientes.map(cliente => cliente.nomcliente).join(", " + "\n"); // Lista en formato de texto
								navigator.clipboard.writeText(textoCopiar).then(() => {
									// Cambiar color y texto del botón
									copyBtn.style.backgroundColor = "#16a34a"; // Verde (Tailwind: bg-green-600)
									copyBtn.style.color = "white";
									copyBtn.innerHTML = "¡Copiado! ✔️";

									// Restaurar color después de 2 segundos
									setTimeout(() => {
										copyBtn.style.backgroundColor = "#3085d6"; // Azul (Tailwind: bg-blue-500)
										copyBtn.innerHTML = "Copiar Lista";
									}, 2000);
								}).catch(err => console.error("Error al copiar:", err));
							});
						}
					}, 100);

				}
			});

		}

		//AQUÍ ES LO ANTERIOR
		/*try {
			const response = await fetch(`/cuentas/actualizar`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					usuario: nomUsuario,
					nuevonomusuario: nuevonomUsuario,
					clave: nomClave,
					nomservicio: nomServicio,
					fecactiv: fecActive,
					fecvenc: fecVenc,
					perfenuso: 0,
					instalacion: nomInstalacion,
					cadultos: adultos
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
				title: "Cuenta Actualizada",
				icon: "success",
				timer: 1000,
				showConfirmButton: false
			});
			location.reload(); // Recargar la página para ver los cambios

		} catch (error) {
			Swal.fire("Error", "Error al actualizar la cuenta.", "error");
		}*/

	} else {
		// Verificar si el usuario ya existe antes de crear
		const buscarUsuario = await fetch(`/cuentas/buscar/${encodeURIComponent(nuevonomUsuario)}`);

		if (buscarUsuario.ok) {
			Swal.fire("Error", "El usuario ya existe.", "error");
			return;
		} else {
			try {
				const response = await fetch(`/cuentas/crear`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						usuario: nuevonomUsuario,
						clave: nomClave,
						nomservicio: nomServicio,
						fecactiv: fecActive,
						fecvenc: fecVenc,
						perfenuso: 0,
						instalacion: nomInstalacion,
						cadultos: adultos,
						mtresu: mtresu
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
					title: "Cuenta Registrada",
					icon: "success",
					timer: 1000,
					showConfirmButton: false
				});
				location.reload(); // Recargar la página para ver los cambios

			} catch (error) {
				Swal.fire("Error", "Error al registrar la cuenta.", "error");
			}
		}
	}
});

function mostrarErrores(errores) {
	errores.forEach(error => {
		if (error.includes("usuario")) {
			document.getElementById("errorNombre").textContent = error;
		} else if (error.includes("clave")) {
			document.getElementById("errorClave").textContent = error;
		} else if (error.includes("servicio")) {
			document.getElementById("errorServicio").textContent = error;
		} else if (error.includes("activación")) {
			document.getElementById("errorActivacion").textContent = error;
		} else if (error.includes("expiración")) {
			document.getElementById("errorVencimiento").textContent = error;
		}
	});
}



//ELIMINAR REGISTRO
document.addEventListener("DOMContentLoaded", function() {
	const tbody = document.getElementById("tablaCuentas");

	// Delegación de eventos: Captura clics en los botones de eliminar dentro de tbody
	tbody.addEventListener("click", async function(event) {
		if (event.target.closest(".botonEliminar")) {  // Verifica si el clic fue en un botón de eliminar
			const boton = event.target.closest(".botonEliminar");
			const nombreCuenta = boton.getAttribute("data-nombre");

			if (nombreCuenta) {
				Swal.fire({
					title: "Eliminar " + nombreCuenta,
					text: "¿Estás seguro?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Sí, eliminar!"
				}).then(async (result) => {
					if (result.isConfirmed) {
						try {
							

							//Se debe mostrar mensaje solo si uno de los clientes tiene estado=Activo
							//Si Todos son inactivos no mostrar mensaje	
								
							//Si hay clientes con estado activo e inactivo, solo cambiar el usuario del inactivo y mostrar listado de los activos.
							//Si solo hay clientes con estado activo, no se elimina y aparece mensaje con listado de los activos.

							//if()
							
							
							
							const response = await fetch(`/cuentas/eliminar?` + new URLSearchParams({ usuario: nombreCuenta }), {
								method: "DELETE"
							});

							
							
							
							if (!response.ok) {
								const responseClients = await fetch(`/clientes/clientesporUsuario?usuario=${encodeURIComponent(nombreCuenta)}`, {
									method: "GET",
									headers: { "Content-Type": "application/json" }
								});
								if (!responseClients.ok) {
									Swal.fire("Error", "No se pudieron obtener los clientes.", "error");
									return;
								}
								const clientes = await responseClients.json();

								const listaClientes = clientes.map(cliente => `<h5>🔸 ${cliente.nomcliente}</h5> `).join("");
								Swal.fire({
									title: "Hay clientes usando a la cuenta! :",
									html: `
								        <div style="text-align: center;">
								            ${listaClientes}
								            <button id="copyBtn" style="margin-top: 10px; padding: 8px; border-radius: 5px; background: #3085d6; color: white; border: none;">
								                Copiar Lista
								            </button>
								        </div>
								    `,
									icon: "error",
									showConfirmButton: true,
									confirmButtonText: "Ok"
								}).then((result) => {
									if (result.isConfirmed) {
										location.reload();
									}
								});

								// Esperar a que el alert se cargue para agregar evento al botón
								setTimeout(() => {
									const copyBtn = document.getElementById("copyBtn");
									if (copyBtn) {
										copyBtn.addEventListener("click", () => {
											const textoCopiar = clientes.map(cliente => cliente.nomcliente).join(", " + "\n"); // Lista en formato de texto
											navigator.clipboard.writeText(textoCopiar).then(() => {
												// Cambiar color y texto del botón
												copyBtn.style.backgroundColor = "#16a34a"; // Verde (Tailwind: bg-green-600)
												copyBtn.style.color = "white";
												copyBtn.innerHTML = "¡Copiado! ✔️";

												// Restaurar color después de 2 segundos
												setTimeout(() => {
													copyBtn.style.backgroundColor = "#3085d6"; // Azul (Tailwind: bg-blue-500)
													copyBtn.innerHTML = "Copiar Lista";
												}, 2000);
											}).catch(err => console.error("Error al copiar:", err));
										});
									}
								}, 100);
								throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
							} else {
								await Swal.fire({
									title: "Cuenta Eliminada!",
									icon: "success",
									timer: 1000,
									showConfirmButton: false
								});
								location.reload();
							}
						} catch (error) {
							console.error("Error al eliminar la cuenta:", error);
						}
					}
				});
			}
		}
	});
});






async function cargarCuentasVencidas(page = 0) {
	const tbody = document.getElementById('tablaCuentas');

	try {
		const response = await fetch(`/cuentas/vencidas?page=${page}&size=${size}`);
		if (!response.ok) {
			throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
		}
		//const cuentas = await response.json();
		const data = await response.json();
		const cuentas = data.content;
		const totalPages = data.totalPages;
		currentPage = page;
		
		
		tbody.innerHTML = ""; // Limpiar tabla
		cuentas.forEach(cuenta => {
			// Crear la fila <tr>
			const row = document.createElement("tr");

			// Crear y agregar la celda <th> con el usuario
			const thUsuario = document.createElement("th");
			thUsuario.textContent = cuenta.usuario;
			row.appendChild(thUsuario);

			// Crear las celdas <td> por separado
			const tdClave = document.createElement("td");
			tdClave.textContent = cuenta.clave;

			const tdFecVenc = document.createElement("td");
			tdFecVenc.textContent = cuenta.fecvenc;

			const tdPerfiles = document.createElement("td");
			tdPerfiles.textContent = `${cuenta.perfenuso} / ${cuenta.servicio.perfiles}`;

			const tdNomServicio = document.createElement("td");
			tdNomServicio.textContent = cuenta.nomservicio;

			const tdInstalacion = document.createElement("td");
			tdInstalacion.textContent = cuenta.instalacion;

			const tdCAdultos = document.createElement("td");
			tdCAdultos.textContent = cuenta.cadultos;


			//Condicion para pintar las filas filtradas
			var color = "";
			const fechavenc = fechaUTC(cuenta.fecvenc);
			const fechahoy = fecha();
			const fechahoymas2 = fecha();
			fechahoymas2.setDate(fechahoy.getDate() + 2);
			if (fechavenc.getTime() < fechahoy.getTime()) {
				color = "color: red";
			} else if (cuenta.perfenuso > cuenta.servicio.perfiles) {
				color = "color: red";
			} else if (fechavenc.getTime() <= fechahoymas2.getTime()) {
				color = "color: #bb710d";
			}
			thUsuario.style = color;
			tdClave.style = color;
			tdFecVenc.style = color;
			tdPerfiles.style = color;
			tdNomServicio.style = color;
			tdInstalacion.style = color;
			tdCAdultos.style = color;


			// Crear la celda de botones
			const tdBotones = document.createElement("td");

			// Botón Editar
			const btnEdit = document.createElement("button");
			btnEdit.classList.add("btn", "btn-outline-warning", "btn-sm", "btn-edit");
			btnEdit.setAttribute("data-bs-toggle", "modal");
			btnEdit.setAttribute("data-tipo", "actualizar");
			btnEdit.setAttribute("data-bs-target", "#registroModal");
			btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
			btnEdit.setAttribute("data-nombre", cuenta.usuario);

			// Botón Eliminar
			const btnEliminar = document.createElement("button");
			btnEliminar.classList.add("btn", "btn-outline-danger", "btn-sm", "ms-3", "botonEliminar");
			btnEliminar.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
			btnEliminar.setAttribute("data-nombre", cuenta.usuario);

			// Agregar botones a la celda <td>
			tdBotones.appendChild(btnEdit);
			tdBotones.appendChild(btnEliminar);

			// Agregar las celdas a la fila <tr>
			row.appendChild(tdClave);
			row.appendChild(tdFecVenc);
			row.appendChild(tdPerfiles);
			row.appendChild(tdNomServicio);
			row.appendChild(tdInstalacion);
			row.appendChild(tdCAdultos);
			row.appendChild(tdBotones);


			// Agregar la fila al tbody
			tbody.appendChild(row);
		});
		actualizarPaginacion(totalPages);
	} catch (error) {
		console.error("Error al buscar la cuenta", error);
	}


}



// EVENTO BOTÓN - LISTA DE CUENTAS SIN RENOVACIÓN
document.addEventListener("DOMContentLoaded", function() {
	const filtroDesactivados = document.getElementById("filtroDesactivados");

	filtroDesactivados.addEventListener("click", async function() {

		if (!seleccion) {
			filtroDesactivados.textContent = "Volver activas";
			seleccion = true;
			cargarCuentasVencidas(0);


		} else {
			filtroDesactivados.textContent = "Sin renovación";
			location.reload();
			seleccion = false;
		}
	});
});





/*document.addEventListener("DOMContentLoaded", function() {
	const filtroDesactivados = document.getElementById("filtroDesactivados");
	var seleccion = true;

	filtroDesactivados.addEventListener("click", async function() {

		if (seleccion) {
			filtroDesactivados.textContent = "Volver activas";
			seleccion = false;
			const tbody = document.getElementById('tablaCuentas');
			try {
				const response = await fetch(`/cuentas/vencidas`);
				if (!response.ok) {
					throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
				}
				const cuentas = await response.json();
				tbody.innerHTML = ""; // Limpiar tabla
				cuentas.forEach(cuenta => {
					// Crear la fila <tr>
					const row = document.createElement("tr");

					// Crear y agregar la celda <th> con el usuario
					const thUsuario = document.createElement("th");
					thUsuario.textContent = cuenta.usuario;
					row.appendChild(thUsuario);

					// Crear las celdas <td> por separado
					const tdClave = document.createElement("td");
					tdClave.textContent = cuenta.clave;

					const tdFecVenc = document.createElement("td");
					tdFecVenc.textContent = cuenta.fecvenc;

					const tdPerfiles = document.createElement("td");
					tdPerfiles.textContent = `${cuenta.perfenuso} / ${cuenta.servicio.perfiles}`;

					const tdNomServicio = document.createElement("td");
					tdNomServicio.textContent = cuenta.nomservicio;

					const tdInstalacion = document.createElement("td");
					tdInstalacion.textContent = cuenta.instalacion;

					const tdCAdultos = document.createElement("td");
					tdCAdultos.textContent = cuenta.cadultos;


					//Condicion para pintar las filas filtradas
					var color = "";
					const fechavenc = fechaUTC(cuenta.fecvenc);
					const fechahoy = fecha();
					const fechahoymas2 = fecha();
					fechahoymas2.setDate(fechahoy.getDate() + 2);
					if (fechavenc.getTime() < fechahoy.getTime()) {
						color = "color: red";
					} else if (cuenta.perfenuso > cuenta.servicio.perfiles) {
						color = "color: red";
					} else if (fechavenc.getTime() <= fechahoymas2.getTime()) {
						color = "color: #bb710d";
					}
					thUsuario.style = color;
					tdClave.style = color;
					tdFecVenc.style = color;
					tdPerfiles.style = color;
					tdNomServicio.style = color;
					tdInstalacion.style = color;
					tdCAdultos.style = color;


					// Crear la celda de botones
					const tdBotones = document.createElement("td");

					// Botón Editar
					const btnEdit = document.createElement("button");
					btnEdit.classList.add("btn", "btn-outline-warning", "btn-sm", "btn-edit");
					btnEdit.setAttribute("data-bs-toggle", "modal");
					btnEdit.setAttribute("data-tipo", "actualizar");
					btnEdit.setAttribute("data-bs-target", "#registroModal");
					btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
					btnEdit.setAttribute("data-nombre", cuenta.usuario);

					// Botón Eliminar
					const btnEliminar = document.createElement("button");
					btnEliminar.classList.add("btn", "btn-outline-danger", "btn-sm", "ms-3", "botonEliminar");
					btnEliminar.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
					btnEliminar.setAttribute("data-nombre", cuenta.usuario);

					// Agregar botones a la celda <td>
					tdBotones.appendChild(btnEdit);
					tdBotones.appendChild(btnEliminar);

					// Agregar las celdas a la fila <tr>
					row.appendChild(tdClave);
					row.appendChild(tdFecVenc);
					row.appendChild(tdPerfiles);
					row.appendChild(tdNomServicio);
					row.appendChild(tdInstalacion);
					row.appendChild(tdCAdultos);
					row.appendChild(tdBotones);


					// Agregar la fila al tbody
					tbody.appendChild(row);
				});
			} catch (error) {
				console.error("Error al buscar el cliente", error);
			}


		} else {
			filtroDesactivados.textContent = "Sin renovación";
			location.reload();
			seleccion = true;
		}
	});
}); */
