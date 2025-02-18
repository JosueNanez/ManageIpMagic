const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const toggleButton = document.getElementById('toggleSidebar');
const toggleButtonMobile = document.getElementById('toggleSidebarMobile');
const nombreUsuario = document.getElementById('nomuser');

document.addEventListener("DOMContentLoaded", function () {
	if (window.innerWidth < 768) {
		nombreUsuario.style.display = 'none';
	}
	
	const perfilContainer = document.getElementById("perfilContainer");
	const navbarToggler = document.querySelector(".navbar-toggler");

	// Elemento original del perfil (su posición por defecto)
	let perfilOriginalParent = perfilContainer.parentNode;
	let perfilOriginalNextSibling = perfilContainer.nextSibling;

	function repositionProfile() {
	    if (window.matchMedia("(max-width: 991px)").matches) {
	        // Si es vista móvil, mover el perfil antes del navbar-toggler
	        navbarToggler.parentNode.insertBefore(perfilContainer, navbarToggler);
			
	    } else {
	        // Si es vista de escritorio, devolverlo a su posición original
	        if (perfilOriginalNextSibling) {
	            perfilOriginalParent.insertBefore(perfilContainer, perfilOriginalNextSibling);
	        } else {
	            perfilOriginalParent.appendChild(perfilContainer);
	        }
	    }
	}

	// Ejecutar en carga inicial y en cambios de tamaño
	repositionProfile();
	window.addEventListener("resize", repositionProfile);
});
	
// Abre o cierra el sidebar en vista de escritorio
toggleButton.addEventListener('click', () => {
	if (window.innerWidth >= 768) {
		// Si el sidebar está colapsado
		if (sidebar.classList.contains('collapsed')) {
			// Ocultamos el texto de los items mientras el sidebar se despliega
			const sidebarTexts = document.querySelectorAll('.sidebar-text');
			sidebarTexts.forEach(text => text.style.display = 'none');

			// Desplegamos el sidebar
			sidebar.classList.remove('collapsed');
			mainContent.classList.remove('collapsed');

			// Después de que el sidebar se despliegue completamente, mostramos el texto
			setTimeout(() => {
				sidebarTexts.forEach(text => text.style.display = 'inline');
			}, 300); // Coincide con la duración de la transición
		} else {
			// Si el sidebar no está colapsado, simplemente lo colapsamos
			const sidebarTexts = document.querySelectorAll('.sidebar-text');
			sidebarTexts.forEach(text => text.style.display = 'none');

			sidebar.classList.add('collapsed');
			mainContent.classList.add('collapsed');
		}
	} else {
		sidebar.classList.toggle('show');
	}
});

// Abre o cierra el sidebar en vista móvil
toggleButtonMobile.addEventListener('click', () => {
	sidebar.classList.toggle('show');
});

// Reseteamos la visibilidad del sidebar al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
	if (window.innerWidth >= 768) {
		sidebar.classList.remove('show');
		nombreUsuario.style.display = '';
	} else {
		nombreUsuario.style.display = 'none';
	}
});

// Evento de clic fuera del sidebar para cerrar el menú en móvil
document.addEventListener('click', (event) => {
	if (window.innerWidth < 768) {
		const isClickInsideSidebar = sidebar.contains(event.target);
		const isClickInsideButton = toggleButtonMobile.contains(event.target);

		// Si el clic no fue dentro del sidebar ni en el botón de abrir/cerrar
		if (!isClickInsideSidebar && !isClickInsideButton) {
			sidebar.classList.remove('show');
		}
	}
});



//DESPLEGABLE PARA PERFIL ---------------------------------------------------
const perfil = document.getElementById('perfil');
const perfilMenu = document.getElementById('perfilMenu');

perfil.addEventListener('click', (event) => {
    event.preventDefault(); // Evita que el enlace recargue la página
    perfilMenu.classList.toggle('show'); // Agrega o quita la clase 'show'
});

// Cierra el menú si se hace clic fuera de él
document.addEventListener('click', (event) => {
    if (!perfil.contains(event.target) && !perfilMenu.contains(event.target)) {
        perfilMenu.classList.remove('show');
    }
});





