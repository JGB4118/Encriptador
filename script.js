// Selección de elementos del DOM
const textArea = document.querySelector('.mensaje');
const mensaje = document.querySelector('.mens-enc');
const divMensajes = document.querySelector('.mensajes'); 
const btnEncriptar = document.querySelector('.btn-encrip');
const btnDesencriptar = document.querySelector('.btn-desencrip');
const btnCopiar = document.querySelector('.btn-copiar');
const mensajeError = document.createElement('div');

// Estilos para el mensaje de error
mensajeError.style.color = 'red';
mensajeError.style.fontSize = '14px';
mensajeError.style.marginTop = '5px';
mensajeError.textContent = ''; 
textArea.parentNode.insertBefore(mensajeError, textArea.nextSibling); 

// Función para verificar el texto en tiempo real
function verificarTexto(event) {
  const texto = textArea.value;
  const textoNormalizado = normalizarTexto(texto);

  if (texto !== textoNormalizado) {
    mensajeError.textContent = 'No se permiten letras mayúsculas ni acentos.';
    textArea.value = textoNormalizado; 
  } else {
    mensajeError.textContent = '';
  }
}

// Función para normalizar el texto (remover acentos y convertir a minúsculas)
function normalizarTexto(texto) {
  return texto
    .toLowerCase() 
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "");
}

// Función para encriptar el texto
function encriptar(texto) {
  texto = normalizarTexto(texto); 
  const reglas = {
    'e': 'enter',
    'i': 'imes',
    'a': 'ai',
    'o': 'ober',
    'u': 'ufat'
  };
  return texto.split('')
    .map(char => reglas[char] || char)
    .join('');
}

// Función para desencriptar el texto
function desencriptar(texto) {
  const reglas = {
    'enter': 'e',
    'imes': 'i',
    'ai': 'a',
    'ober': 'o',
    'ufat': 'u'
  };
  let resultado = texto;
  for (const [clave, valor] of Object.entries(reglas)) {
    resultado = resultado.split(clave).join(valor);
  }
  return resultado;
}

// Función para actualizar la visibilidad de los elementos de la interfaz
function actualizarElementos() {
  if (mensaje.value.trim() === '') {
    mensaje.classList.remove('ocultar-imagen'); 
    btnCopiar.style.display = 'none'; 
    divMensajes.style.display = 'flex'; 
  } else {
    mensaje.classList.add('ocultar-imagen');  
    btnCopiar.style.display = 'block';  
    divMensajes.style.display = 'none'; 
  }
}

// Lógica para encriptar y mostrar el resultado
btnEncriptar.addEventListener('click', () => {
  const texto = textArea.value;
  mensaje.value = encriptar(texto);
  actualizarElementos();  
});

// Lógica para desencriptar y mostrar el resultado
btnDesencriptar.addEventListener('click', () => {
  const texto = textArea.value;
  mensaje.value = desencriptar(texto);
  actualizarElementos();  
});

// Lógica para copiar texto usando la API del Portapapeles
btnCopiar.addEventListener('click', () => {
  const textoACopiar = mensaje.value;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(textoACopiar).then(() => {
      alert('Texto copiado al portapapeles');
    }).catch(err => {
      alert('Error al copiar el texto: ' + err);
    });
  } else {
    // Fallback para navegadores más antiguos
    mensaje.select();
    document.execCommand('copy');
    alert('Texto copiado al portapapeles');
  }
});

// Verificar el texto en tiempo real mientras el usuario escribe
textArea.addEventListener('input', verificarTexto);

// Inicializar la visibilidad de los elementos cuando la página carga
actualizarElementos();