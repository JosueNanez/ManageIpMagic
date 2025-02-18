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
	let margenInferior = 50;

	if (window.innerWidth <= 918) { //Si la vista es en celular ajustar margen
		margenInferior = 65;
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

});



// CARGAR CUENTAS - BUSCADOR DINÁMICO
let currentPage = 0;
let size = 15; // Tamaño de la página 
var seleccion = false; // Servirá para estados del botón "Cuentas Vencidas"
async function cargarCuentas(page = 0) {
	const tbody = document.getElementById("tablaDispositivos");
	const inputBusqueda = document.getElementById("busqueda");
	let letra = inputBusqueda.value.trim();

	try {
		const response = await fetch(`/dispositivos/busqueda?letra=${encodeURIComponent(letra)}&page=${page}&size=${size}`);
		if (!response.ok) {
			throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
		}
		const data = await response.json();
		const dispositivos = data.content;
		const totalPages = data.totalPages;
		currentPage = page;

		tbody.innerHTML = "";
		dispositivos.forEach((dispo) => {
			const row = document.createElement("tr");

			const thCliente = document.createElement("th");
			thCliente.textContent = dispo.nomcliente;
			thCliente.className = "text-start";
			row.appendChild(thCliente);

			const tdreproduc = document.createElement("td");
			tdreproduc.className = "text-start";
			const texto = document.createElement("span");
			texto.textContent = dispo.nomreproduc;
			const boton = document.createElement("button");
			boton.className = "btn btn-outline-secondary me-2";
			boton.onclick = function() { listarConexion(dispo.cliente.usuario, dispo.cliente.cuenta.clave, dispo.cliente.cuenta.servicio.dominio, dispo.reproductor.dominio, dispo.mac, dispo.clave, dispo.cliente.cuenta.mtresu); };
			const icono = document.createElement("i");
			icono.className = "fa-solid fa-file-lines";
			boton.appendChild(icono);
			tdreproduc.appendChild(boton);
			tdreproduc.appendChild(texto);


			const tdmac = document.createElement("td");
			tdmac.textContent = dispo.mac;

			const tdClave = document.createElement("td");
			tdClave.textContent = dispo.clave;

			const tdUsuario = document.createElement("td");
			tdUsuario.textContent = dispo.cliente.usuario;

			const tdFecVenc = document.createElement("td");
			tdFecVenc.textContent = dispo.fecvenc;

			// Celda de botones
			const tdBotones = document.createElement("td");

			const btnEdit = document.createElement("button");
			btnEdit.classList.add("btn", "btn-outline-warning", "btn-sm", "btn-edit");
			btnEdit.setAttribute("data-bs-toggle", "modal");
			btnEdit.setAttribute("data-tipo", "actualizar");
			btnEdit.setAttribute("data-bs-target", "#registroModal");
			btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
			btnEdit.setAttribute("data-nombre", dispo.id);

			const btnEliminar = document.createElement("button");
			btnEliminar.classList.add("btn", "btn-outline-danger", "btn-sm", "ms-3", "botonEliminar");
			btnEliminar.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
			btnEliminar.setAttribute("data-nombre", dispo.nomcliente);
			btnEliminar.setAttribute("data-id", dispo.id);

			tdBotones.appendChild(btnEdit);
			tdBotones.appendChild(btnEliminar);

			row.append(tdreproduc, tdUsuario, tdmac, tdClave, tdFecVenc, tdBotones);
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

	//seleccion = false;
	setTimeout(() => {
		document.getElementById("btnInicio").addEventListener("click", () => cargarCuentas(0));
		document.getElementById("btnAnterior").addEventListener("click", () => {
			if (currentPage > 0) cargarCuentas(currentPage - 1);
		});
		document.getElementById("btnSiguiente").addEventListener("click", () => {
			cargarCuentas(currentPage + 1);
		});
		document.getElementById("btnUltima").addEventListener("click", async () => {
			const response = await fetch(`/dispositivos/busqueda?page=${page}&size=${size}`);
			const data = await response.json();
			cargarCuentas(data.totalPages - 1);
		});
	}, 50);
}

// BUSCADOR DINÁMICO
let debounceTimer;
document.addEventListener("DOMContentLoaded", function() {
	const inputBusqueda = document.getElementById("busqueda");

	inputBusqueda.addEventListener("keyup", async function() {
		clearTimeout(debounceTimer);

		debounceTimer = setTimeout(() => {

			let letra = inputBusqueda.value.trim();

			if (letra === "") {
				location.reload();
				return;
			}

			cargarCuentas(0);
		}, 560);
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
		//const errorVencimiento = document.getElementById("error-msVencimiento");
		//const errorPanel = document.getElementById("error-msPanel");
		//const fechaActual = fecha();
		//const fechaActualmas2 = fecha();
		//fechaActualmas2.setDate(fechaActual.getDate() + 2);
		if (tipodeAccion === "actualizar") {

			const id = button.getAttribute("data-nombre");
			if (!id) {
				console.error("Error: dispositivo es null o vacío.");
				return;
			}
			document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
			document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
			fetch(`/dispositivos/buscar/${encodeURIComponent(id)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error("No se pudo obtener el dispositivo.");
					}
					return response.json();
				})
				.then(dispo => {
					//const fechaVencer = fechaUTC(cuenta.fecvenc);
					document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
					document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");

					document.getElementById("inputNombreHidden").value = dispo.id;
					document.getElementById("inputNombre").value = dispo.nomcliente;
					document.getElementById("inputNombre").readOnly = true;
					document.getElementById("nomReprod").value = dispo.nomreproduc;
					document.getElementById("inputMac").value = dispo.mac;
					document.getElementById("inputKey").value = dispo.clave;
					document.getElementById("inputActivacion").value = dispo.fecactiv;
					document.getElementById("inputVencimiento").value = dispo.fecvenc;

					/*if (fechaVencer.getTime() < fechaActual.getTime()) {
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
					}*/

					document.getElementById("modalLabel").innerHTML = "EDITAR DISPOSITIVO";
					document.getElementById("botonModal").innerHTML = "ACTUALIZAR";
				})
				.catch(error => {
					console.error("Error al obtener los datos:", error);
					alert("No se pudo cargar la información del dispositivo.");
				});


		} else {
			// Resetear modal para nuevo plan
			document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
			document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
			document.getElementById("modalLabel").innerHTML = "NUEVO DISPOSITIVO";
			document.getElementById("botonModal").innerHTML = "CREAR DISPOSITIVO";

			document.getElementById("inputNombre").value = "";
			document.getElementById("inputNombre").readOnly = false;
			document.getElementById("nomReprod").selectedIndex = 0;
			document.getElementById("inputMac").value = "";
			document.getElementById("inputKey").value = "";
			document.getElementById("inputActivacion").value = null;
			document.getElementById("inputVencimiento").value = null;

		}
	});
});


//PARA ENVIAR SIGERENCIAS DE CLIENTES EN NUEVOS DISPOSITIVOS

const listaClientes = document.getElementById("sugerencias");
let pagina = 0;
let registros = 6;
async function buscarClientes(letra) {
	if (letra.length < 1) {
		listaClientes.innerHTML = "";
		document.getElementById("nombreUser").innerText = "";
		listaClientes.classList.remove('show'); // Corrige la referencia
		return;
	}

	try {
		let response = await fetch(`/clientes/nombres?letra=${encodeURIComponent(letra)}&page=${pagina}&size=${registros}`);
		if (!response.ok) throw new Error("Error en la consulta");

		let data = await response.json();
		mostrarClientesEnLista(data.content); // Usa `data.content` para extraer los nombres
	} catch (error) {
		console.error("Error:", error);
	}
}
function mostrarClientesEnLista(clientes) {
	listaClientes.innerHTML = ""; // Limpiar la lista anterior

	if (clientes.length === 0) {
		listaClientes.classList.remove("show");
		return;
	}

	clientes.forEach(cliente => {
		let li = document.createElement("li");
		let boton = document.createElement("button");
		li.appendChild(boton);
		boton.textContent = cliente.nomcliente;
		boton.className = "dropdown-item ps-3 py-1";
		boton.type = "button";


		listaClientes.appendChild(li);

		// Cuando se hace clic en un cliente, rellenar el input
		boton.addEventListener("click", function() {
			document.getElementById("inputNombre").value = cliente.nomcliente;
			document.getElementById("inputNombreHidden").value = cliente.nomcliente;
			listaClientes.classList.remove("show"); // Ocultar la lista después de seleccionar
			document.getElementById("nombreUser").innerText = "Usuario : " + cliente.usuario;
		});
	});

	// Mostrar la lista desplegable
	listaClientes.classList.add("show");
}




// PROCESAR DATOS UPDATE O CREATE
document.getElementById('botonModal').addEventListener('click', async function(event) {
	event.preventDefault(); // Evita el envío automático del formulario

	document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");

	const codigoID = document.getElementById("inputNombreHidden").value.trim();
	const nomCliente = document.getElementById("inputNombre").value.trim();
	const nomReproductor = document.getElementById("nomReprod").value.trim();
	const codigoMac = document.getElementById("inputMac").value.trim();
	const codigoClave = document.getElementById("inputKey").value.trim();
	const fecActive = document.getElementById("inputActivacion").value.trim();
	const fecVenc = document.getElementById("inputVencimiento").value.trim();

	if (tipodeAccion === "actualizar") {
		try {
			const response = await fetch(`/dispositivos/actualizar`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: codigoID,
					nomcliente: nomCliente,
					nomreproduc: nomReproductor,
					mac: codigoMac,
					clave: codigoClave,
					fecactiv: fecActive,
					fecvenc: fecVenc,
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
				title: "Dispositivo Actualizado",
				icon: "success",
				timer: 1000,
				showConfirmButton: false
			});
			location.reload(); // Recargar la página para ver los cambios

		} catch (error) {
			Swal.fire("Error", "Error al actualizar el dispositivo.", "error");
		}

	} else {
		// Verificar si el cliente ya existe antes de crear
		if (nomCliente.length > 1) {
			const buscarUsuario = await fetch(`/clientes/buscar/${encodeURIComponent(nomCliente)}`);
			if (!buscarUsuario.ok) {
				Swal.fire("Error", "El cliente no está registrado.", "error");
				return;
			} else {
				const cliente = await buscarUsuario.json();

				const response = await fetch(`/dispositivos/contar/${encodeURIComponent(nomCliente)}`);
				if (!response.ok) {
					throw new Error(`Error al obtener la cantidad de dispositivos: ${response.statusText}`);
				}
				const cantidadDispositivos = await response.json();

				if (cantidadDispositivos === cliente.cuenta.servicio.plan.perfiles) {
					Swal.fire("Error", "Dispositivos completos según el plan.", "error");
					return;
				}
			}

		}

		try {
			const response = await fetch(`/dispositivos/crear`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					//id: codigoID,
					nomcliente: nomCliente,
					nomreproduc: nomReproductor,
					mac: codigoMac,
					clave: codigoClave,
					fecactiv: fecActive,
					fecvenc: fecVenc,
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
				title: "Dispositivo Registrado",
				icon: "success",
				timer: 1000,
				showConfirmButton: false
			});
			location.reload(); // Recargar la página para ver los cambios

		} catch (error) {
			Swal.fire("Error", "Error al registrar la cuenta.", "error");
		}

	}
});

function mostrarErrores(errores) {
	errores.forEach(error => {
		if (error.includes("cliente")) {
			document.getElementById("errorNombre").textContent = error;
		} else if (error.includes("reproductor")) {
			document.getElementById("errorReproductor").textContent = error;
		}
	});
}



//ELIMINAR REGISTRO
document.addEventListener("DOMContentLoaded", function() {
	const tbody = document.getElementById("tablaDispositivos");

	// Delegación de eventos: Captura clics en los botones de eliminar dentro de tbody
	tbody.addEventListener("click", async function(event) {
		if (event.target.closest(".botonEliminar")) {  // Verifica si el clic fue en un botón de eliminar
			const boton = event.target.closest(".botonEliminar");
			const nombreCuenta = boton.getAttribute("data-nombre");
			const idCuenta = boton.getAttribute("data-id");

			if (idCuenta) {
				Swal.fire({
					title: "Eliminar dispositivo de " + nombreCuenta,
					text: "¿Estás seguro?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Sí, eliminar!"
				}).then(async (result) => {
					if (result.isConfirmed) {
						try {
							const response = await fetch(`/dispositivos/eliminar?` + new URLSearchParams({ id: idCuenta }), {
								method: "DELETE"
							});

							if (!response.ok) {
								throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
							} else {
								await Swal.fire({
									title: "Dispositivo Eliminado!",
									icon: "success",
									timer: 1000,
									showConfirmButton: false
								});
								location.reload();
							}
						} catch (error) {
							console.error("Error al eliminar el dispositivo:", error);
						}
					}
				});
			}
		}
	});
});

//LISTAR DATOS PARA CONEXIONES DE DISPOSITIVOS
function listarConexion(usuario, claveuser, dominio, dominioDispo, mac, clave, mtresu) {

	//const nomEmpresa = document.getElementById("nomEmpresa").textContent;
	const nomEmpresa = "MAGIC TL";
	if (!mac || mac == "") {
		dominioDispo = "";
	}

	Swal.fire({
		title: "Datos de Conexión",
		html: `
				<button id="copyBtn" style="margin-top: 10px; padding: 8px; border-radius: 5px; background: #3085d6; color: white; border: none;">
		 			Copiar datos - Manual
				</button>
				
				 <div class="mt-4" style="text-align: center;">
					<a href="${dominioDispo}" target="_blank">${dominioDispo}</a>
					
					<div class="row mt-3">
						<div class="mb-3 col-md-6 d-flex align-items-center">
					    	<div class="input-group">
					        	<button class="btn btn-outline-secondary" id="botonMac">
					            	<i class="bi bi-clipboard"></i>
					        	</button>
					       	 	<input type="text" id="macACopiar" class="form-control" value="${mac}" readonly>
					    	</div>
						</div>	
						<div class="mb-3 col-md-6 d-flex align-items-center">
					    	<div class="input-group">
					        	<button class="btn btn-outline-secondary" id="botonClave">
					            	<i class="icon bi bi-clipboard"></i>
					       	 	</button>
					        	<input type="text" id="claveACopiar" class="form-control"value="${clave}" readonly>
					    	</div>
						</div>	
					<div>
					<div class="mb-3 col-12">
						<div class="input-group">
					    	<button class="btn btn-outline-secondary" id="botonMtresu">
					        	<i class="mu bi bi-clipboard"></i>
					    	</button>
					   	 	<input type="text" id="mtresuACopiar" class="form-control" value="${mtresu}" readonly>
						</div>
					</div>	

				 </div>
				`,
		//icon: "error",
		showConfirmButton: true,
		confirmButtonText: "Ok"
	}).then((result) => {
		if (result.isConfirmed) {
			//location.reload();
		}
	});

	// Esperar a que el alert se cargue para agregar evento al botón
	setTimeout(() => {
		const botonMac = document.getElementById("botonMac");
		botonMac.addEventListener("click", () => {
			let texto = document.getElementById("macACopiar");
			navigator.clipboard.writeText(texto.value).then(() => {
				let boton = document.querySelector(".bi");
				boton.classList.remove("bi-clipboard");
				boton.classList.add("bi-clipboard-check"); // Cambia el ícono a "copiado"

				setTimeout(() => {
					boton.classList.remove("bi-clipboard-check");
					boton.classList.add("bi-clipboard");
				}, 2000); // Vuelve al ícono original después de 2 segundos
			});
		});

		const botonClave = document.getElementById("botonClave");
		botonClave.addEventListener("click", () => {
			let texto = document.getElementById("claveACopiar");
			navigator.clipboard.writeText(texto.value).then(() => {
				let boton = document.querySelector(".icon");
				boton.classList.remove("bi-clipboard");
				boton.classList.add("bi-clipboard-check"); // Cambia el ícono a "copiado"

				setTimeout(() => {
					boton.classList.remove("bi-clipboard-check");
					boton.classList.add("bi-clipboard");
				}, 2000); // Vuelve al ícono original después de 2 segundos
			});
		});

		const botonMtresu = document.getElementById("botonMtresu");
		botonMtresu.addEventListener("click", () => {
			let texto = document.getElementById("mtresuACopiar");
			navigator.clipboard.writeText(texto.value).then(() => {
				let boton = document.querySelector(".mu");
				boton.classList.remove("bi-clipboard");
				boton.classList.add("bi-clipboard-check"); // Cambia el ícono a "copiado"

				setTimeout(() => {
					boton.classList.remove("bi-clipboard-check");
					boton.classList.add("bi-clipboard");
				}, 2000); // Vuelve al ícono original después de 2 segundos
			});
		});


		const copyBtn = document.getElementById("copyBtn");
		if (copyBtn) {
			copyBtn.addEventListener("click", () => {
				//const textoCopiar = clientes.map(cliente => cliente.nomcliente).join(", " + "\n"); // Lista en formato de texto
				const textoCopiar = "Completar los datos como sigue: " + "\n\n" +
					"🟢 ListName: *" + nomEmpresa + "* \n" +
					"👤 UserName: *" + usuario + "* \n" +
					"🔐 Clave: *" + claveuser + "* \n" +
					"🌎 Url: " + dominio;

				navigator.clipboard.writeText(textoCopiar).then(() => {
					// Cambiar color y texto del botón
					copyBtn.style.backgroundColor = "#16a34a"; // Verde (Tailwind: bg-green-600)
					copyBtn.style.color = "white";
					copyBtn.innerHTML = "¡Copiado! ✔️";

					// Restaurar color después de 2 segundos
					setTimeout(() => {
						copyBtn.style.backgroundColor = "#3085d6"; // Azul (Tailwind: bg-blue-500)
						copyBtn.innerHTML = "Copiar datos - Manual";
					}, 2000);
				}).catch(err => console.error("Error al copiar:", err));
			});
		}
	}, 100);
}







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
