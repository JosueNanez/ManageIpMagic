// ALTURA DINÁMICA CON SCROLL PARA TABLA
document.addEventListener('DOMContentLoaded', () => {
	// Obtener elementos del DOM
	const fixedDiv = document.getElementById('nav');
	const header = document.getElementById('encabezado');
	const dynamicDiv = document.getElementById('contenedorTabla');
	const contFiltro = document.getElementById('contenedorFiltro');
	const contPagina = document.getElementById('contenedorPaginacion');

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
		console.log("Altura agregada");
	});

	//ocultar boton de filtroDesactivos en vista movil
	const filtroDesactivados = document.getElementById("filtroDesactivados");
	function ajustarVista() {
		if (window.innerWidth <= 918) {
			filtroDesactivados.style.visibility = "hidden"; // Ocultar sin perder espacio
			filtroDesactivados.style.position = "absolute"; // Evita afectar el diseño
		} else {
			filtroDesactivados.style.visibility = "visible";
			filtroDesactivados.style.position = "relative";
		}
	}

	ajustarVista(); // Ejecutar al cargar
	window.addEventListener("resize", ajustarVista);

});





//PARA TRAER LAS CUENTAS PARA SELECTED DEL CONTROLADOR
const cuentasOriginales = [];
async function cargarCuentas() {
	try {
		const response = await fetch("/clientes/listadinamicaselect");
		if (!response) throw new Error("No se pudo obtener la lista de cuentas.");

		const cuentas = await response.json();
		var nomUsuario = document.getElementById("nomUsuario");
		nomUsuario.innerHTML = ""; // Limpiar opciones previas

		// Crear opciones y almacenarlas en cuentasOriginales (para reutilizar)
		cuentas.forEach(cuenta => {
			const option = document.createElement("option");
			option.value = cuenta.usuario;
			option.textContent = cuenta.formattedText;
			cuentasOriginales.push(option.cloneNode(true)); // Guardar copia
			nomUsuario.appendChild(option);
		});

	} catch (error) {
		console.error("Error al cargar cuentas:", error);
	}
}

//BUSCADOR DE CUENTAS LA EL USUARIO Y SUS DATOS SE USAN PARA LOS FILTROS
async function buscarCuenta(usuario) {
	try {
		const response = await fetch(`/cuentas/buscar/${encodeURIComponent(usuario)}`);

		if (!response.ok) {
			throw new Error("Cuenta no encontrada");
		}

		const cuenta = await response.json();
		return cuenta; // Devuelve el la cuenta buscada
	} catch (error) {
		console.error("Error al buscar el plan:", error);
		return null;
	}
}



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




//FUNCINA PARA PRIMER FILTRO DE CARGA DE PAGINA

/*var cuentasFiltradasRes = null;
async function primerFiltroSelected() {

	var nomUsuario = document.getElementById("");
	.innerHTML = '';

	const cuentasPromises = cuentasOriginales.map(async (option) => {
		//let usuario = option.value; // Usamos el valor en lugar de textContent

		let cumpleCondicion = true;
		/*const cuenta = await buscarCuenta(usuario);

		// Se envian cuentas con perfiles disponibles
		if (!cuenta || cuenta.perfenuso == cuenta.servicio.perfiles) {
			cumpleCondicion = false;
		}

		// Se envían cuentas no vencidas desde controlador
		const hoy = fecha();
		const hoyMas2 = fecha();
		const fechaVencimiento = fechaUTC(cuenta.fecvenc);
		hoyMas2.setDate(hoy.getDate() + 2);
		if (!cuenta || fechaVencimiento <= hoyMas2) { //se quitan fechas con 2 días por vencer
			cumpleCondicion = false;
		}
		//return cumpleCondicion ? option : null;
		return cumpleCondicion ? option.cloneNode(true) : null; // Clonar opción antes de agregarla
	});

	// Esperar todas las promesas y filtrar las cuentas válidas
	//cuentasFiltradasRes = (await Promise.all(cuentasOriginales)).filter(option => option !== null);

	// Agregar opciones al select
	cuentasOriginales.forEach(option => .appendChild(option));
}*/

//FUNCINA PARA FILTRO COMPLETO DESPUES DE LOS SELECTED
var cuentasFiltradasCompleto = null;
var clienteSeleccionado = "";
async function filtrarCuentas() {
	const planSeleccionado = document.getElementById("nomPlan").value;
	const adultosSeleccionado = document.querySelector("input[name='cadultos']:checked")?.value;

	// Obtener promesas de cuentas filtradas
	const cuentasPromises = cuentasOriginales.map(async (option) => {
		let usuario = option.value; // Usamos el valor en lugar de textContent

		let cumpleCondicion = true;
		const cuenta = await buscarCuenta(usuario);
		// FILTROS DE SUGERENCIA DE CUENTAS
		// Se envia priorizando las fechas mas largas desde controlador

		// Se envian cuentas con perfiles disponibles
		/*if (!cuenta || cuenta.perfenuso == cuenta.servicio.perfiles) {
			cumpleCondicion = false;
		}

		// Se envían cuentas no vencidas desde controlador
		const hoy = fecha();
		const hoyMas2 = fecha();
		const fechaVencimiento = fechaUTC(cuenta.fecvenc);
		hoyMas2.setDate(hoy.getDate() + 2);
		if (!cuenta || fechaVencimiento <= hoyMas2) { //se quitan fechas con 2 días por vencer
			cumpleCondicion = false;
		} else if (!cuenta || cuenta.instalacion == "Manual") { //Si la cuenta es manual retirar si vence en 6 días
			const hoyMas7 = fecha();
			hoyMas7.setDate(hoy.getDate() + 6);
			if (!cuenta || fechaVencimiento <= hoyMas7) {
				cumpleCondicion = false;
			}
		}*/

		// Se muestran las cuentas con relación al tipo de plan:
		if (!cuenta || planSeleccionado !== cuenta.servicio.nomplan) {
			cumpleCondicion = false;
		}

		//Si el plan inlcuye 3 perfiles quitar las cuentas que tienen al menos un dispositivo
		if (cuenta.servicio.plan.perfiles == 3 && cuenta.perfenuso != 0) {
			cumpleCondicion = false;
		}

		// Se muestras cuentas que coincidan con el checkbox cadultos
		if (!cuenta || adultosSeleccionado !== cuenta.cadultos) {
			cumpleCondicion = false;
		}

		//return cumpleCondicion ? option : null;
		return cumpleCondicion ? option.cloneNode(true) : null; // Clonar opción antes de agregarla
	});

	// Esperar todas las promesas y filtrar las cuentas válidas
	cuentasFiltradasCompleto = (await Promise.all(cuentasPromises)).filter(option => option !== null);
	// Agregar opciones al select
	var nomUsuario = document.getElementById("nomUsuario");
	if (nomUsuario) {
		// Limpiar el select
		nomUsuario.innerHTML = '';
		cuentasFiltradasCompleto.forEach(option => nomUsuario.appendChild(option)); //Envia las cuentas filtradas
		/*if (cuentasFiltradasCompleto.length === 0) {
			const optionCuentaCliente = document.createElement("option");
			optionCuentaCliente.value = clienteSeleccionado.usuario;
			optionCuentaCliente.textContent = clienteSeleccionado.cuenta.formattedText;
			nomUsuario.appendChild(optionCuentaCliente);
		} else {
		    
		}*/

	}

	const errorInputVenc = document.getElementById("error-msgUsuarioVencido");
	//errorInputVenc.textContent = "⚠️ La cuenta está vencida, actualizarla!";
	errorInputVenc.style.display = "none";


	//Para quitar el mensaje en cAdultos
	const errorElement = document.getElementById("error-msgAdultos");
	errorElement.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async function() {
	var adultosRadios = document.querySelectorAll("input[name='cadultos']");


	await cargarCuentas();

	//await primerFiltroSelected();
	//CARGAR EL PRIMER FILTRO AL ABRIR EL MODAL
	var nomUsuario = document.getElementById("nomUsuario");
	nomUsuario.innerHTML = '';
	cuentasOriginales.forEach(option => nomUsuario.appendChild(option));

	// FILTRO FINAL POR COMBINACIÓN DE SELECTEDS

	// Agregar eventos para actualizar la lista de cuentas cuando cambie un filtro
	document.getElementById("nomPlan").addEventListener("change", filtrarCuentas);
	adultosRadios.forEach(radio => radio.addEventListener("change", filtrarCuentas));
	//document.getElementById("nomUsuario").addEventListener("change", filtrarCuentas);
});




//CARGAR USUARIOS - BUSCADOR DINÁMICO DE USUARIOS
let currentPage = 0;
let size = 15; // Tamaño de la página 
var seleccion = false; // Servirá para estados del botón "Cuentas Vencidas"

async function cargarUsuarios(page = 0) {
	const inputBusqueda = document.getElementById('busqueda');
	const tbody = document.getElementById('tablaClientes');

	let letra = inputBusqueda.value.trim();

	try {
		const response = await fetch(`/clientes/busqueda?letra=${encodeURIComponent(letra)}&page=${page}&size=${size}`);
		if (!response.ok) {
			throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
		}
		const data = await response.json();
		const clientes = data.content;
		const totalPages = data.totalPages;
		currentPage = page;

		tbody.innerHTML = ""; // Limpiar tabla
		clientes.forEach(clien => {
			// Crear la fila <tr>
			const row = document.createElement("tr");

			// Crear y agregar la celda <th> con el nombre del cliente
			const th = document.createElement("th");
			th.className = "text-start";
			th.scope = "row";

			const botonDetalle = document.createElement("button");
			botonDetalle.className = "btn btn-outline-secondary  me-1";
			botonDetalle.onclick = function() { listarDetalleServicio(botonDetalle, clien.usuario, clien.cuenta.clave, clien.cuenta.servicio.dominio, clien.cuenta.servicio.plan.perfiles, clien.fecactiv, clien.fecvenc, clien.cuenta.servicio.plan.imagen, clien.cuenta.servicio.plan.soporte); };
			const iconodet = document.createElement("i");
			iconodet.className = "fa-solid fa-file-lines";
			botonDetalle.appendChild(iconodet);
			th.appendChild(botonDetalle);

			const texto = document.createElement("span")
			texto.textContent = clien.nomcliente;
			th.appendChild(texto);
			row.appendChild(th);

			// Crear las celdas <td> por separado
			const tdFecActiv = document.createElement("td");
			tdFecActiv.textContent = clien.fecactiv;
			//tdFecActiv.classList.add("fila-roja");

			const tdFecVenc = document.createElement("td");
			const botonRenovar = document.createElement("button");
			botonRenovar.className = "btn btn-outline-secondary  me-1";
			botonRenovar.onclick = function() { recordatorioVenc(botonRenovar, clien.fecvenc, clien.cuenta.servicio.plan.precventa); };
			const iconorev = document.createElement("i");
			iconorev.className = "fa-solid fa-file-lines";
			botonRenovar.appendChild(iconorev);
			tdFecVenc.appendChild(botonRenovar);
			const textodeta = document.createElement("span")
			textodeta.textContent = clien.fecvenc;
			tdFecVenc.appendChild(textodeta);

			const tdUsuario = document.createElement("td");
			const botonUser = document.createElement("button");
			botonUser.className = "btn btn-outline-secondary  me-1";
			botonUser.onclick = function() { listarConexion(botonUser, clien.usuario, clien.cuenta.clave, clien.cuenta.servicio.dominio); };
			const icono = document.createElement("i");
			icono.className = "fa-solid fa-file-lines";
			botonUser.appendChild(icono);
			tdUsuario.appendChild(botonUser);
			const textouser = document.createElement("span")
			textouser.textContent = clien.usuario;
			tdUsuario.appendChild(textouser);






			const tdNomPlan = document.createElement("td");
			tdNomPlan.textContent = clien.nomplan;

			const tdContacto = document.createElement("td");
			tdContacto.textContent = clien.contacto;

			const tdCAdultos = document.createElement("td");
			tdCAdultos.textContent = clien.cadultos;

			var color = "";
			const fechavenc = fechaUTC(clien.fecvenc);
			const fechavencCuenta = fechaUTC(clien.cuenta.fecvenc);
			const fechahoy = fecha();
			const fechahoymas2 = fecha();
			fechahoymas2.setDate(fechahoy.getDate() + 2);

			if (clien.estado == "Inactivo") {
				color = "color: red";
			} else if (fechavencCuenta.getTime() <= fechahoy.getTime()) {
				color = "color: red";
			} else if (fechavenc.getTime() <= fechahoymas2.getTime()) {
				color = "color: #bb710d";
			} else if (clien.cadultos != clien.cuenta.cadultos) {
				color = "color: #bb710d";
			} else if (fechavencCuenta.getTime() <= fechahoymas2.getTime()) {
				color = "color: #bb710d";
			}

			th.style = color;
			tdFecActiv.style = color;
			tdFecVenc.style = color;
			tdUsuario.style = color;
			tdNomPlan.style = color;
			tdContacto.style = color;
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
			btnEdit.setAttribute("data-nombre", clien.nomcliente);

			// Botón Eliminar
			const btnEliminar = document.createElement("button");
			btnEliminar.classList.add("btn", "btn-outline-danger", "btn-sm", "ms-3", "botonDesactivar");
			btnEliminar.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
			btnEliminar.setAttribute("data-nombre", clien.nomcliente);

			// Agregar botones a la celda <td>
			tdBotones.appendChild(btnEdit);
			tdBotones.appendChild(btnEliminar);

			// Agregar las celdas a la fila <tr>
			row.appendChild(tdFecActiv);
			row.appendChild(tdFecVenc);
			row.appendChild(tdUsuario);
			row.appendChild(tdNomPlan);
			row.appendChild(tdContacto);
			row.appendChild(tdCAdultos);
			row.appendChild(tdBotones);

			// Agregar la fila al tbody
			tbody.appendChild(row);
		});

		actualizarPaginacion(totalPages);
	} catch (error) {
		console.error("Error al buscar el cliente", error);
	}
}

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

	if (seleccion) {
		//seleccion = false;
		setTimeout(() => {
			document.getElementById("btnInicio").addEventListener("click", () => cargarClientesVencidos(0));
			document.getElementById("btnAnterior").addEventListener("click", () => {
				if (currentPage > 0) cargarClientesVencidos(currentPage - 1);
			});
			document.getElementById("btnSiguiente").addEventListener("click", () => {
				cargarClientesVencidos(currentPage + 1);
			});
			document.getElementById("btnUltima").addEventListener("click", async () => {
				const response = await fetch(`/cuentas/vencidas?page=${page}&size=${size}`);
				const data = await response.json();
				cargarClientesVencidos(data.totalPages - 1);
			});
		}, 50);


	} else {
		setTimeout(() => {
			document.getElementById("btnInicio").addEventListener("click", () => cargarUsuarios(0));
			document.getElementById("btnAnterior").addEventListener("click", () => {
				if (currentPage > 0) cargarUsuarios(currentPage - 1);
			});
			document.getElementById("btnSiguiente").addEventListener("click", () => {
				cargarUsuarios(currentPage + 1);
			});
			document.getElementById("btnUltima").addEventListener("click", async () => {
				const response = await fetch(`/cuentas/busqueda?letra=${encodeURIComponent(document.getElementById("busqueda").value)}&page=0&size=${size}`);
				const data = await response.json();
				cargarUsuarios(data.totalPages - 1);
			});
		}, 50);
	}

}





// BUSCADOR DINÁMICO
let debounceTimer;

document.addEventListener('DOMContentLoaded', function() {
    const inputBusqueda = document.getElementById('busqueda');

    inputBusqueda.addEventListener('keyup', function() {
        clearTimeout(debounceTimer); // Limpiar el temporizador anterior

        debounceTimer = setTimeout(() => {
            let letra = inputBusqueda.value.trim();

            if (letra === "") {
                location.reload(); // Si el input está vacío, recargar la página
                return;
            }

            cargarUsuarios(0); // Llamar a la función después del tiempo de espera
        }, 560); // Tiempo de espera en milisegundos
    });
});





//REGISTRO Y ACTUALIZACIÓN
var tipodeAccion = "";
var estadoAnteriorAlCambio = "";
document.addEventListener("DOMContentLoaded", function() {

	var botonNuevoCliente = document.getElementById("NuevoCliente");
	botonNuevoCliente.addEventListener("click", async function() {
		var nomUsuario = document.getElementById("nomUsuario");
		nomUsuario.innerHTML = '';
		cuentasOriginales.forEach(option => nomUsuario.appendChild(option));
	})


	var registroModal = document.getElementById("registroModal");

	registroModal.addEventListener("show.bs.modal", async function(event) {
		var button = event.relatedTarget; // Botón que disparó el modal
		var tipo = button.getAttribute("data-tipo");
		tipodeAccion = tipo;
		//await filtrarCuentas();

		if (tipodeAccion === "actualizar") {
			const nomcliente = button.getAttribute("data-nombre");
			if (!nomcliente) {
				console.error("Error: usuario es null o vacío.");
				return;
			}

			try {
				const response = await fetch(`/clientes/buscar/${encodeURIComponent(nomcliente)}`);
				if (!response.ok) {
					throw new Error("No se pudo obtener el cliente.");
				}

				const clien = await response.json();
				//clienteSeleccionado = await response.json();

				estadoAnteriorAlCambio = clien.estado;
				document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
				document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
				document.getElementById("inputNombreHidden").value = clien.nomcliente;
				document.getElementById("inputNombre").value = clien.nomcliente;
				//document.getElementById("inputNombre").readOnly = true;
				document.getElementById("inputContacto").value = clien.contacto;
				document.getElementById("nomPlan").value = clien.nomplan;
				document.getElementById("inputActivacion").value = clien.fecactiv;

				document.getElementById("inputVencimiento").value = clien.fecvenc;
				const errorElementVenc = document.getElementById("error-msgVencimiento");
				const fechaActual = fecha();
				const fechaActualmas2 = fecha();
				const fechaVencer = fechaUTC(clien.fecvenc);
				fechaActualmas2.setDate(fechaActual.getDate() + 2);
				if (fechaVencer.getTime() < fechaActual.getTime()) {
					errorElementVenc.textContent = "⚠️ El plan del cliente ha vencido.";
					errorElementVenc.style.display = "inline";
				} else if (fechaVencer.getTime() === fechaActual.getTime()) {
					errorElementVenc.textContent = "⚠️ El plan del cliente vence hoy.";
					errorElementVenc.style.display = "inline";
				} else if (fechaVencer.getTime() <= fechaActualmas2.getTime()) {
					errorElementVenc.textContent = "⚠️ El plan del cliente está por vencer!";
					errorElementVenc.style.display = "inline";
				}
				if (clien.cadultos === 'Si') {
					document.getElementById("radioSi").checked = true;
					if (clien.cadultos !== clien.cuenta.cadultos) {
						const errorElement = document.getElementById("error-msgAdultos");
						errorElement.textContent = "⚠️ La cuenta " + clien.usuario + ", no trae canales adultos!";
						errorElement.style.display = "inline";
					}
				} else {
					document.getElementById("radioNo").checked = true;
					if (clien.cadultos !== clien.cuenta.cadultos) {
						const errorElement = document.getElementById("error-msgAdultos");
						errorElement.textContent = "⚠️ La cuenta " + clien.usuario + ", trae canales adultos!";
						errorElement.style.display = "inline";
					}
				}



				const nomUsuarioSelect = document.getElementById("nomUsuario");
				nomUsuarioSelect.innerHTML = '';


				// Filtrar los options de la lista cuentasOriginases en base al cliente
				const cuentasPromises = cuentasOriginales.map(async (option) => {
					let usuario = option.value;
					let cumpleCondicion = true;
					const cuenta = await buscarCuenta(usuario);

					if (!cuenta || cuenta.perfenuso == cuenta.servicio.perfiles) {
						cumpleCondicion = false;
					}

					const hoy = fecha();
					const hoyMas2 = fecha();
					hoyMas2.setDate(hoy.getDate() + 2);
					const fechaVencimiento = fechaUTC(cuenta.fecvenc);

					if (!cuenta || fechaVencimiento.getTime() <= hoyMas2.getTime()) {
						cumpleCondicion = false;
					} else if (cuenta.instalacion === "Manual") {
						const hoyMas7 = fecha();
						hoyMas7.setDate(hoy.getDate() + 6);
						if (fechaVencimiento.getTime() <= hoyMas7.getTime()) {
							cumpleCondicion = false;
						}
					}

					/*if (!cuenta || clien.nomplan !== cuenta.servicio.nomplan) {
						cumpleCondicion = false;
					}*/

					if (!cuenta || clien.nomplan !== cuenta.servicio.nomplan) {
						cumpleCondicion = false;
					}


					/*Si el plan es de 3 perfiles, eliminar las cuentas con perfenuso != 0
					if (cuenta.servicio.plan.perfiles == 3 && cuenta.perfenuso != 0){
						cumpleCondicion = false;
					}*/

					if (!cuenta || clien.cadultos !== cuenta.cadultos) {
						cumpleCondicion = false;
					}

					return cumpleCondicion ? option.cloneNode(true) : null;
				});
				// Agregar opciones al select
				if (nomUsuarioSelect) {
					cuentasFiltradasCompleto = (await Promise.all(cuentasPromises)).filter(option => option !== null);
					cuentasFiltradasCompleto.forEach(option => nomUsuarioSelect.appendChild(option));
				}

				//Para mostrar el option actual del cliente
				const optionCuentaCliente = document.createElement("option");
				const FechaHoy = fecha();
				const hoyMas2 = fecha();
				hoyMas2.setDate(FechaHoy.getDate() + 2);
				const fechaVencimiento = fechaUTC(clien.cuenta.fecvenc);

				console.clear();
				console.log("Fecha de vencimiento = " + fechaVencimiento);
				console.log("Fecha de Hoy+2 = " + hoyMas2);

				//Si el option actual del cliente no se encuentra en la lista original se agrega al select
				if (clien.cuenta.perfenuso === clien.cuenta.servicio.perfiles) {

					optionCuentaCliente.value = clien.usuario;
					optionCuentaCliente.textContent = clien.cuenta.formattedText;
					nomUsuarioSelect.appendChild(optionCuentaCliente);

				} else if (hoyMas2.getTime() >= fechaVencimiento.getTime()) { //Aquí colocar si la fecha del cliente está a dos días por vencer colocar en el select

					optionCuentaCliente.value = clien.usuario;
					optionCuentaCliente.textContent = clien.cuenta.formattedText;
					nomUsuarioSelect.appendChild(optionCuentaCliente);
				} else if (clien.cuenta.servicio.plan.perfiles > 1 && fechaVencimiento.getTime() >= hoyMas2.getTime()) {
					optionCuentaCliente.value = clien.usuario;
					optionCuentaCliente.textContent = clien.cuenta.formattedText;
					nomUsuarioSelect.appendChild(optionCuentaCliente);
				}

				nomUsuarioSelect.value = clien.usuario;



				const errorInputVenc = document.getElementById("error-msgUsuarioVencido");
				const vencUsuario = fechaUTC(clien.cuenta.fecvenc);

				/*if (clien.cuenta.perfenuso == clien.cuenta.servicio.perfiles) {
					errorInputVenc.textContent = "Sugerencia de otras cuentas!";
					errorInputVenc.className = "text-success validacion";
					errorInputVenc.style.display = "inline";
				} else {
					errorInputVenc.className = "text-danger validacion";
				}*/

				if (clien.cuenta.usuario == "Sin usuario") {
					errorInputVenc.className = "text-danger validacion";
					errorInputVenc.textContent = "Sugerencia de cuentas!";
					errorInputVenc.style.display = "inline";
				} else if (vencUsuario.getTime() < fecha().getTime()) {
					errorInputVenc.className = "text-danger validacion";
					errorInputVenc.textContent = "⚠️ " + clien.usuario + " está vencida, aquí sugerencias!";
					errorInputVenc.style.display = "inline";
				} else if (vencUsuario.getTime() === fecha().getTime()) {
					errorInputVenc.className = "text-danger validacion";
					errorInputVenc.textContent = "⚠️ " + clien.usuario + " vence hoy, actualizarla!";
					errorInputVenc.style.display = "inline";
				} else if (vencUsuario.getTime() <= fechaActualmas2.getTime()) {
					errorInputVenc.className = "text-danger validacion";
					errorInputVenc.textContent = "⚠️ " + clien.usuario + " está por vencer, actualizarla!";
					errorInputVenc.style.display = "inline";
				}

				document.getElementById("modalLabel").innerHTML = "EDITAR CLIENTE";
				document.getElementById("botonModal").innerHTML = "ACTUALIZAR";

			} catch (error) {
				console.error("Error al obtener los datos:", error);
				alert("No se pudo cargar la información del plan.");
			}

			//VALIDACIÓN DE FECHA DE VENCIMIENTO AL EDITAR
			const inputVencimiento = document.getElementById("inputVencimiento");
			const errorElementVenc = document.getElementById("error-msgVencimiento");

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
			document.getElementById("modalLabel").innerHTML = "NUEVO CLIENTE";
			document.getElementById("botonModal").innerHTML = "REGISTRAR CLIENTE";

			document.getElementById("inputNombre").value = "";
			document.getElementById("inputNombre").readOnly = false;
			document.getElementById("inputContacto").value = "";
			document.getElementById("inputActivacion").value = fecha().toISOString().split('T')[0];
			document.getElementById("inputVencimiento").value = null;
			document.getElementById("nomPlan").selectedIndex = 0;
			document.getElementById("radioNo").checked = true;

			//await primerFiltroSelected();
			//VALIDACIÓN DE FECHA DE VENCIMIENTO AL EDITAR
			const inputVencimiento = document.getElementById("inputVencimiento");
			const errorElementVenc = document.getElementById("error-msgVencimiento");
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




/*
//CARGA DE DATOS PARA MODAL
document.addEventListener("DOMContentLoaded", function() {
	var registroModal = document.getElementById("registroModal");

	registroModal.addEventListener("show.bs.modal", async function(event) {
		var button = event.relatedTarget; // Botón que disparó el modal
		var tipo = button.getAttribute("data-tipo");
		tipodeAccion = tipo;
		//await filtrarCuentas();

		if (tipodeAccion === "actualizar") {
			const nomcliente = button.getAttribute("data-nombre");
			if (!nomcliente) {
				console.error("Error: usuario es null o vacío.");
				return;
			}

			fetch(`/clientes/buscar/${encodeURIComponent(nomcliente)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error("No se pudo obtener el cliente.");
					}
					return response.json();
				})
				.then(clien => {
					document.querySelectorAll('.validacion').forEach(div => div.textContent = '');
					document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
					document.getElementById("inputNombreHidden").value = clien.nomcliente;
					document.getElementById("inputNombre").value = clien.nomcliente;
					//document.getElementById("inputNombre").readOnly = true;
					document.getElementById("inputContacto").value = clien.contacto;
					document.getElementById("inputActivacion").value = clien.fecactiv;
					document.getElementById("inputVencimiento").value = clien.fecvenc;
					document.getElementById("nomPlan").value = clien.nomplan;
					if (clien.cadultos === 'Si') {
						document.getElementById("radioSi").checked = true;
					} else {
						document.getElementById("radioNo").checked = true;
					}

					const nomUsuarioSelect = document.getElementById("nomUsuario");
					nomUsuarioSelect.innerHTML = '';
					// Buscar la opción que coincida con el usuario
					const cuentaFiltrada = cuentasOriginales.find(option => option.value === clien.usuario);
					const cuentasPromises = cuentasOriginales.map(async (option) => {
						let usuario = option.value; // Usamos el valor en lugar de textContent

						let cumpleCondicion = true;
						const cuenta = await buscarCuenta(usuario);
						// FILTROS DE SUGERENCIA DE CUENTAS
						// Se envia priorizando las fechas mas largas controlador
						
						// Se envian cuentas con perfiles disponibles
						if(!cuenta || cuenta.perfenuso == cuenta.servicio.perfiles) {
							cumpleCondicion = false;
						}
						
						// Se envían cuentas no vencidas desde controlador
						const hoy = new Date();
						const hoyMas2 = new Date();
						const fechaVencimiento = new Date(cuenta.fecvenc);
						hoyMas2.setDate(hoy.getDate() + 2);
						if (!cuenta || fechaVencimiento <= hoyMas2) { //se quitan fechas con 2 días por vencer
							cumpleCondicion = false;
						} else if (!cuenta || cuenta.instalacion == "Manual") { //Si la cuenta es manual retirar si vence en 6 días
							const hoyMas7 = new Date();
							hoyMas7.setDate(hoy.getDate() + 6);
							if (!cuenta || fechaVencimiento <= hoyMas7) {
								cumpleCondicion = false;
							}
						 }

						// Se muestran las cuentas con relación al tipo de plan:
						if (!cuenta || planSeleccionado !== cuenta.servicio.nomplan) {
							cumpleCondicion = false;
						}
						// Se muestras cuentas que coincidan con el checkbox cadultos
						if (!cuenta || adultosSeleccionado !== cuenta.cadultos) {
							cumpleCondicion = false;
						}

						//return cumpleCondicion ? option : null;
						return cumpleCondicion ? option.cloneNode(true) : null; // Clonar opción antes de agregarla
					});

					// Esperar todas las promesas y filtrar las cuentas válidas
					cuentasFiltradasCompleto = (await Promise.all(cuentasPromises)).filter(option => option !== null);
					// Agregar opciones al select
					var nomUsuario = document.getElementById("nomUsuario");
					if (nomUsuario){
						// Limpiar el select
						nomUsuario.innerHTML = '';
						cuentasFiltradasCompleto.forEach(option => nomUsuario.appendChild(option));
					}
					
					
					
					if (cuentaFiltrada) {
						nomUsuarioSelect.appendChild(cuentaFiltrada.cloneNode(true)); // Clonar y agregar			
					}
					
					
					document.getElementById("modalLabel").innerHTML = "EDITAR CLIENTE";
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
			document.getElementById("modalLabel").innerHTML = "NUEVO CLIENTE";
			document.getElementById("botonModal").innerHTML = "REGISTRAR CLIENTE";

			document.getElementById("inputNombre").value = "";
			document.getElementById("inputNombre").readOnly = false;
			document.getElementById("inputContacto").value = "";
			document.getElementById("inputActivacion").value = new Date().toISOString().split('T')[0];
			document.getElementById("inputVencimiento").value = null;
			document.getElementById("nomPlan").selectedIndex = 0;
			document.getElementById("radioNo").checked = true;
			
			await primerFiltroSelected();
		}
	});
}); */



// PROCESAR DATOS UPDATE O CREATE
document.getElementById('botonModal').addEventListener('click', async function(event) {
	event.preventDefault(); // Evita el envío automático del formulario

	document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
	const nomCliente = document.getElementById("inputNombreHidden").value.trim();
	const nuevonomCliente = document.getElementById("inputNombre").value.trim();
	const contactoCliente = document.getElementById("inputContacto").value.trim();
	const fecActive = document.getElementById("inputActivacion").value.trim();
	const fecVenc = document.getElementById("inputVencimiento").value.trim();
	const tipodePlan = document.getElementById("nomPlan").value.trim();
	const adultos = document.querySelector('input[name="cadultos"]:checked').value;
	let nombreUsuario = document.getElementById("nomUsuario").value.trim();

	// Convertir fecVenc (String) a objeto Date. Determinar estado basado en la fecha Vencimiento
	const fechaVencimiento = fechaUTC(fecVenc);
	const fechaActual = fecha();
	const estado = fechaVencimiento >= fechaActual ? "Activo" : "Inactivo";
	console.log(nuevonomCliente);
	if (tipodeAccion === "actualizar") {

		//No procede cuando se intenta colocar fecha anterior a hoy de un cliente Inactivo
		if (estadoAnteriorAlCambio === "Inactivo" && fechaVencimiento < fechaActual) {
			Swal.fire("Error", "Elegir una fecha mayor a hoy.", "error");
			return;
		}

		try {
			const response = await fetch(`/clientes/actualizar`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nomcliente: nomCliente,
					nuevonomcliente: nuevonomCliente,
					contacto: contactoCliente,
					nomplan: tipodePlan,
					usuario: nombreUsuario,
					fecactiv: fecActive,
					fecvenc: fecVenc,
					estado: estado,
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
				title: "Cliente Actualizado",
				icon: "success",
				timer: 1000,
				showConfirmButton: false
			});
			location.reload(); // Recargar la página para ver los cambios

		} catch (error) {
			Swal.fire("Error", "Error al actualizar la cuenta.", "error");
		}

	} else {
		// Verificar si el usuario ya existe antes de crear
		const buscarUsuario = await fetch(`/clientes/buscar/${encodeURIComponent(nuevonomCliente)}`);

		if (buscarUsuario.ok) {
			Swal.fire("Error", "El usuario ya existe.", "error");
			return;
		} else if (!nombreUsuario) {
			Swal.fire({
				title: "No hay cuenta asignada!",
				text: "Quiere registrar al cliente Sin Usuario?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Si, registrar!"
			}).then(async (result) => {
				if (result.isConfirmed) {
					nombreUsuario = "Sin usuario";

					try {
						const response = await fetch(`/clientes/crear`, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								nomcliente: nuevonomCliente,
								contacto: contactoCliente,
								nomplan: tipodePlan,
								usuario: nombreUsuario,
								fecactiv: fecActive,
								fecvenc: fecVenc,
								estado: estado,
								cadultos: adultos
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
							title: "Cliente Registrado",
							icon: "success",
							timer: 1000,
							showConfirmButton: false
						});
						location.reload(); // Recargar la página para ver los cambios

					} catch (error) {
						Swal.fire("Error", "La fecha de vencimiento es hoy o ya ha pasado.", "error");
					}
				}
			});
		} else {
			try {
				const response = await fetch(`/clientes/crear`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						nomcliente: nuevonomCliente,
						contacto: contactoCliente,
						nomplan: tipodePlan,
						usuario: nombreUsuario,
						fecactiv: fecActive,
						fecvenc: fecVenc,
						estado: estado,
						cadultos: adultos
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
					title: "Cliente Registrado",
					icon: "success",
					timer: 1000,
					showConfirmButton: false
				});
				location.reload(); // Recargar la página para ver los cambios

			} catch (error) {
				Swal.fire("Error", "La fecha de vencimiento es hoy o ya ha pasado.", "error");
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
		} else if (error.includes("usuario")) {
			document.getElementById("errorUsuario").textContent = error;
		} else if (error.includes("activación")) {
			document.getElementById("errorActivacion").textContent = error;
		} else if (error.includes("expiración")) {
			document.getElementById("errorVencimiento").textContent = error;
		}
	});
}



//ELIMINAR REGISTRO EN FISICO
document.addEventListener("DOMContentLoaded", function() {
	const tbody = document.getElementById("tablaClientes");

	// Delegación de eventos: Captura clics en los botones de eliminar dentro de tbody
	tbody.addEventListener("click", async function(event) {
		if (event.target.closest(".botonEliminar")) {  // Verifica si el clic fue en un botón de eliminar
			const boton = event.target.closest(".botonEliminar");
			const nombreCliente = boton.getAttribute("data-nombre");

			if (nombreCliente) {
				Swal.fire({
					title: "Eliminar " + nombreCliente + " definitivamente?",
					text: "Se eliminarán también sus dispositivos",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Sí, eliminar!"
				}).then(async (result) => {
					if (result.isConfirmed) {
						try {
							const response = await fetch(`/clientes/eliminar?` + new URLSearchParams({ cliente: nombreCliente }), {
								method: "DELETE"
							});

							if (!response.ok) {
								Swal.fire({
									icon: "error",
									title: "Cliente no eliminado!",
									timer: 2000
								});
								throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
							} else {
								await Swal.fire({
									title: "Cliente Eliminado!",
									icon: "success",
									timer: 1000,
									showConfirmButton: false
								});
								location.reload();
							}
						} catch (error) {
							console.error("Error al eliminar el cliente:", error);
						}
					}
				});
			}
		}
	});
});


//ELIMINAR REGISTRO EN LOGICO - ESTADO
document.addEventListener("DOMContentLoaded", function() {
	const tbody = document.getElementById("tablaClientes");

	// Delegación de eventos: Captura clics en los botones de eliminar dentro de tbody
	tbody.addEventListener("click", async function(event) {
		if (event.target.closest(".botonDesactivar")) {  // Verifica si el clic fue en un botón de eliminar
			const boton = event.target.closest(".botonDesactivar");
			const nombreCliente = boton.getAttribute("data-nombre");

			if (nombreCliente) {
				Swal.fire({
					title: "Desactivar " + nombreCliente,
					text: "¿Estás seguro?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Sí, desactivar!"
				}).then(async (result) => {
					if (result.isConfirmed) {

						try {
							const response = await fetch(`/clientes/actualizarEstado?` + new URLSearchParams({ nomcliente: nombreCliente }), {
								method: "POST"
							});
							if (!response.ok) {
								Swal.fire({
									icon: "error",
									title: "Cliente no desactivado!",
									timer: 2000
								});
								throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
							} else {
								await Swal.fire({
									title: "Cliente Desactivado!",
									icon: "success",
									timer: 1000,
									showConfirmButton: false
								});
								location.reload();
							}
						} catch (error) {
							console.error("Error al desactivar el cliente:", error);
						}
					}
				});
			}
		}
	});
});




async function cargarClientesVencidos(page = 0) {
	const tbody = document.getElementById('tablaClientes');

	try {
		const response = await fetch(`/clientes/inactivos?page=${page}&size=${size}`);
		if (!response.ok) {
			throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
		}

		const data = await response.json();
		const clientes = data.content;
		const totalPages = data.totalPages;
		currentPage = page;

		tbody.innerHTML = ""; // Limpiar tabla
		clientes.forEach(clien => {
			// Crear la fila <tr>
			const row = document.createElement("tr");

			// Crear y agregar la celda <th> con el nombre del cliente
			const th = document.createElement("th");
			th.textContent = clien.nomcliente;
			row.appendChild(th);

			// Crear las celdas <td> por separado
			const tdFecActiv = document.createElement("td");
			tdFecActiv.textContent = clien.fecactiv;
			//tdFecActiv.classList.add("fila-roja");

			const tdFecVenc = document.createElement("td");
			tdFecVenc.textContent = clien.fecvenc;

			const tdUsuario = document.createElement("td");
			tdUsuario.textContent = clien.usuario;

			const tdNomPlan = document.createElement("td");
			tdNomPlan.textContent = clien.nomplan;

			const tdContacto = document.createElement("td");
			tdContacto.textContent = clien.contacto;

			const tdCAdultos = document.createElement("td");
			tdCAdultos.textContent = clien.cadultos;

			var color = "";
			const fechavenc = fechaUTC(clien.fecvenc);
			const fechavencCuenta = fechaUTC(clien.cuenta.fecvenc);
			const fechahoy = fecha();
			const fechahoymas2 = fecha();
			fechahoymas2.setDate(fechahoy.getDate() + 2);

			if (clien.estado == "Inactivo") {
				color = "color: red";
			} else if (fechavencCuenta.getTime() <= fechahoy.getTime()) {
				color = "color: red";
			} else if (fechavenc.getTime() <= fechahoymas2.getTime()) {
				color = "color: #bb710d";
			} else if (clien.cadultos != clien.cuenta.cadultos) {
				color = "color: #bb710d";
			}

			th.style = color;
			tdFecActiv.style = color;
			tdFecVenc.style = color;
			tdUsuario.style = color;
			tdNomPlan.style = color;
			tdContacto.style = color;
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
			btnEdit.setAttribute("data-nombre", clien.nomcliente);

			// Botón Eliminar
			const btnEliminar = document.createElement("button");
			btnEliminar.classList.add("btn", "btn-outline-danger", "btn-sm", "ms-3", "botonEliminar");
			btnEliminar.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
			btnEliminar.setAttribute("data-nombre", clien.nomcliente);

			// Agregar botones a la celda <td>
			tdBotones.appendChild(btnEdit);
			tdBotones.appendChild(btnEliminar);

			// Agregar las celdas a la fila <tr>
			row.appendChild(tdFecActiv);
			row.appendChild(tdFecVenc);
			row.appendChild(tdUsuario);
			row.appendChild(tdNomPlan);
			row.appendChild(tdContacto);
			row.appendChild(tdCAdultos);
			row.appendChild(tdBotones);

			// Agregar la fila al tbody
			tbody.appendChild(row);
		});
		actualizarPaginacion(totalPages);
	} catch (error) {
		console.error("Error al buscar el cliente", error);
	}
}




// EVENTO BOTÓN - LISTA DE CLIENTES SIN RENOVACIÓN
document.addEventListener("DOMContentLoaded", function() {
	const filtroDesactivados = document.getElementById("filtroDesactivados");
	//var seleccion = true;

	filtroDesactivados.addEventListener("click", async function() {

		if (!seleccion) {
			filtroDesactivados.textContent = "Volver activos";
			seleccion = true;
			//const tbody = document.getElementById('tablaClientes');
			cargarClientesVencidos(0);


		} else {
			filtroDesactivados.textContent = "Sin renovación";
			location.reload();
			seleccion = false;
		}
	});
});



function formatearFecha(fecha) {
	const partes = fecha.split("-"); // Divide en ["YYYY", "MM", "DD"]
	return `${partes[2]}/${partes[1]}/${partes[0].slice(-2)}`; // Reorganiza como DD/MM/YY
}


//LISTAR PARA ENVIAR EL DETALLE DEL SERVICIO
function listarDetalleServicio(boton, usuario, claveuser, dominio, perfiles, activacion, vencimiento, imagen, soporte) {
	//const nomEmpresa = document.getElementById("nomEmpresa").textContent;
	const nomEmpresa = "MAGIC TL";
	const face = "https://www.facebook.com/magictl/";

	var textoCopiar = "";

	if (perfiles == 3) {
		const textoCopiar1 = "✅ DETALLES DEL SERVICIO 📝 : " + "\n\n" +
			"🟢 ListName: *" + nomEmpresa + "* \n" +
			"👤 UserName: *" + usuario + "* \n" +
			"🔐 Clave: *" + claveuser + "* \n" +
			"🌎 Url: " + dominio + "\n\n" +
			"🎫 Accesos : *" + perfiles + "* dispositivos" + " \n" +
			"📹 Imagen : *" + imagen + "* " + " \n" +
			"⚙️ Soporte : *" + soporte + "* " + " \n" +
			"🔌 Activación : " + formatearFecha(activacion) + " \n" +
			"📅 Vencimiento : " + formatearFecha(vencimiento) + " \n" +
			"📺 Program : " + face;

		textoCopiar = textoCopiar1;
	} else {
		const textoCopiar2 = "✅ DETALLES DEL SERVICIO 📝 : " + "\n\n" +
			"🟢 ListName: *" + nomEmpresa + "* \n" +
			"🎫 Accesos : *" + perfiles + "* dispositivos" + "\n" +
			"📹 Imagen : *" + imagen + "* " + " \n" +
			"⚙️ Soporte : *" + soporte + "* " + " \n" +
			"🔌 Activación : " + formatearFecha(activacion) + " \n" +
			"📅 Vencimiento : " + formatearFecha(vencimiento) + " \n" +
			"📺 Program : " + face;
		textoCopiar = textoCopiar2;
	}

	const icono = boton.querySelector("i"); // Busca el icono dentro del botón
	navigator.clipboard.writeText(textoCopiar).then(() => {
		icono.classList.remove("fa-file-lines");
		icono.classList.add("fa-check"); // Cambia el ícono a "copiado"
		// Restaurar icono después de 2 segundos
		setTimeout(() => {
			icono.classList.remove("fa-check");
			icono.classList.add("fa-file-lines");
		}, 2000);
	}).catch(err => console.error("Error al copiar:", err));
}




//LISTAR DATOS PARA CONEXIONES MANUAL DE DISPOSITIVOS
function listarConexion(boton, usuario, claveuser, dominio) {
	//const nomEmpresa = document.getElementById("nomEmpresa").textContent;
	const nomEmpresa = "MAGIC TL";
	const textoCopiar = "✨ Datos de la cuenta 🎟️ : " + "\n\n" +
		"🟢 ListName: *" + nomEmpresa + "* \n" +
		"👤 UserName: *" + usuario + "* \n" +
		"🔐 Clave: *" + claveuser + "* \n" +
		"🌎 Url: " + dominio;

	const icono = boton.querySelector("i"); // Busca el icono dentro del botón

	navigator.clipboard.writeText(textoCopiar).then(() => {
		icono.classList.remove("fa-file-lines");
		icono.classList.add("fa-check"); // Cambia el ícono a "copiado"
		// Restaurar icono después de 2 segundos
		setTimeout(() => {
			icono.classList.remove("fa-check");
			icono.classList.add("fa-file-lines");
		}, 2000);
	}).catch(err => console.error("Error al copiar:", err));
}




/*
function verificarVencimiento(fecha) {
	// Convertir la fecha de string a objeto Date
	const fechaObj = fecha(fecha);

	// Obtener la fecha de hoy sin horas (ajustada a la zona horaria local)
	const hoy = fecha();
	hoy.setHours(0, 0, 0, 0);

	// Obtener la fecha de mañana
	const manana = fecha(hoy);
	manana.setDate(hoy.getDate() + 1);

	if (fechaObj < hoy) {
		return "Venció el día ";
	} else if (fechaObj.getTime() === hoy.getTime()) {
		return "Vence hoy";
	} else if (fechaObj.getTime() === manana.getTime()) {
		return "Vence mañana ";
	} else {
		return "Vence el ";
	}
}*/




function verificarVencimiento(fecha) {
	// Convertir la fecha de string a objeto Date
	const [year, month, day] = fecha.split("T")[0].split("-");
	const fechaVencim = new Date(year, month - 1, day);

	// Obtener la fecha de hoy sin horas (ajustada a la zona horaria local)
	const hoy = new Date();
	hoy.setHours(0, 0, 0, 0);

	// Formatear la fecha en "12 de Febrero"
	const opcionesFormato = { day: 'numeric', month: 'long' };
	const fechaFormateada = fechaVencim.toLocaleDateString('es-ES', opcionesFormato);

	// Obtener la fecha de mañana
	const manana = new Date(hoy);
	manana.setDate(hoy.getDate() + 1);

	if (fechaVencim < hoy) {
		return `VENCIÓ EL DÍA ${fechaFormateada}`;
	} else if (fechaVencim.getTime() === hoy.getTime()) {
		return `VENCE HOY ${fechaFormateada}`;
	} else if (fechaVencim.getTime() === manana.getTime()) {
		return `VENCE MAÑANA ${fechaFormateada}`;
	} else {
		return `VENCE EL DÍA ${fechaFormateada}`;
	}
}
//
//LISTAR DATOS PARA CONEXIONES MANUAL DE DISPOSITIVOS
function recordatorioVenc(boton, vencimiento, precventa) {
	//const nomEmpresa = document.getElementById("nomEmpresa").textContent;

	const textoCopiar = "Su suscripción de *TV DIGITAL " + verificarVencimiento(vencimiento) + "*, quedaré atento para su renovación ✨" + "\n\n" +
		"*CUENTAS DE BANCO*" + "\n" +
		"👤 *TITULAR*: JOSUE NANEZ " + "\n" +
		"💜 *YAPE: 948687609* " + "\n\n" +
		"*CUENTA BCP SOLES*" + "\n" +
		"👤 *TITULAR*: JOSUE NANEZ " + "\n" +
		"🔵 *BCP:* *19196184178033*" + "\n" +
		"🟠 *CCI:* *00219119618417803353*" + "\n\n" +
		"*PLAN A RENOVAR*" + "\n" +
		"s/ *" + precventa + " Soles*" + "\n\n" +
		"⚠️ Importante  una vez hecho el pago no olvide enviarnos el comprobante de pago para proceder con la activación.";

	const icono = boton.querySelector("i"); // Busca el icono dentro del botón

	navigator.clipboard.writeText(textoCopiar).then(() => {
		icono.classList.remove("fa-cart-shopping");
		icono.classList.add("fa-check"); // Cambia el ícono a "copiado"
		// Restaurar icono después de 2 segundos
		setTimeout(() => {
			icono.classList.remove("fa-check");
			icono.classList.add("fa-cart-shopping");
		}, 2000);
	}).catch(err => console.error("Error al copiar:", err));
}




