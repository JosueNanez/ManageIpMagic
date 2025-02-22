// Validación para permitir solo letras y números
function validateNombre(input, minLength, errorMsgId) {
    const errorElement = document.getElementById(errorMsgId);

    // Expresión regular para permitir solo letras, números y espacios
	input.value = input.value.replace(/[^a-zA-Z0-9@#ñÑ ]/g, '');
	
	// Elimina espacios iniciales
	if (input.value.startsWith(" ")) {
	    input.value = input.value.trimStart();
	}

	// Convierte el primer carácter a mayúscula si es una letra
	if (input.value.length > 0 && /^[a-zA-Z]$/.test(input.value.charAt(0))) {
	    input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
	}

	// Valida si tiene un solo caracter
    if (input.value.length < minLength) {
        //input.value = input.value.slice(0, maxLength); // Limita la longitud del texto
		errorElement.textContent = "Ingresar al menos " + minLength + " caracteres.";
        errorElement.style.display = "inline"; // Muestra el mensaje de error
    } else {
        errorElement.style.display = "none"; // Oculta el mensaje de error
    }
}


// Validación para permitir solo letras y números
function validateTexto(input, minLength, errorMsgId) {
    const errorElement = document.getElementById(errorMsgId);

    // Expresión regular para permitir solo letras, números y espacios y simbolo suma
	input.value = input.value.replace(/[^a-zA-Z0-9ñÑ+-,.@# ]/g, '');
	
	// Elimina espacios iniciales
	if (input.value.startsWith(" ")) {
	    input.value = input.value.trimStart();
	}

	// Valida si tiene un solo caracter
    if (input.value.length < minLength) {
        //input.value = input.value.slice(0, maxLength); // Limita la longitud del texto
		errorElement.textContent = "Ingresar al menos " + minLength + " caracteres.";
        errorElement.style.display = "inline"; // Muestra el mensaje de error
    } else {
        errorElement.style.display = "none"; // Oculta el mensaje de error
    }
}


function validateNumber(input, minLength, maxLength, errorMsgId) {
    const errorMsg = document.getElementById(errorMsgId);
	
	// Eliminar caracteres no numéricos y espacios
	input.value = input.value.replace(/[^0-9]/g, '').replace(/\s+/g, '');

    // Verifica si el número tiene más de 9 dígitos
    if (input.value.length < minLength) {
		errorMsg.textContent = "Ingresar al menos " + minLength+ " dígitos.";
        errorMsg.style.display = "inline"; // Muestra el mensaje de error
    } else {
        errorMsg.style.display = "none"; // Oculta el mensaje de error
    }
}




//VALIDACIÓN PARA FECHA - (Agregar @DateTimeFormat(pattern = "yyyy-MM-dd")    a la entidad)
function setMinDate(inputId, daysToAdd) {
    const today = new Date(); // Obtén la fecha actual
    today.setDate(today.getDate() + daysToAdd); // Agrega los días especificados
    const minDate = today.toISOString().split('T')[0]; // Convierte la fecha al formato yyyy-mm-dd

    if (inputId) {
        inputId.setAttribute("min", minDate); // Asigna la fecha mínima al input
    } else {
		console.log("No realizó el ajuste de calendario");
    }
}

document.addEventListener('DOMContentLoaded', async () => { //cargar al inicio
    const inputFecha = document.getElementById("fecvenc");
	setMinDate(inputFecha, 7);
});





// Validación para URL con http://, https://, letras, números y los símbolos : / .
function validateURL(input, minLength, errorMsgId) {
    const errorElement = document.getElementById(errorMsgId);

    // Expresión regular para permitir http://, https://, letras, números y los símbolos : / .
    input.value = input.value.replace(/[^a-zA-Z0-9:/.-]/g, '');

    // Elimina espacios iniciales
    input.value = input.value.trimStart();

    // Verifica si la URL comienza con "http://" o "https://"
    if (!input.value.startsWith("http://") && !input.value.startsWith("https://")) {
        errorElement.textContent = "Debe empezar con http:// o https://";
        errorElement.style.display = "inline";
        return; // Detiene la validación aquí
    }

    // Valida si tiene el mínimo de caracteres requeridos
    if (input.value.length < minLength) {
        errorElement.textContent = "Ingresar al menos " + minLength + " caracteres.";
        errorElement.style.display = "inline";
    } else {
        errorElement.style.display = "none"; // Oculta el mensaje de error
    }
}










