// Estructura de datos para almacenar los valores
const formData = {}; // Uso const porque solamente modifico las propiedades del objeto, pero nunca lo reemplazo
let dialog; // Para mantener una referencia al dialog para poder abrirlo y escuchar sus eventos

document.addEventListener('DOMContentLoaded', function() {
  // Inicializo el componente de Material Design para poder usar sus métodos
  // NOTA: No es necesario inicializar el resto de componentes porque ya funcionan automáticamente con HTML y CSS de Material Design
  dialog = new mdc.dialog.MDCDialog(document.getElementById('data-dialog'));
  
  // Uso el método listen para poder escuchar el evento de cierre del dialog
  dialog.listen('MDCDialog:closed', (event) => {
    if (event.detail.action == 'confirm') {
      actualizarDatosEmpresa();
    }
    // Si es 'cancel', no hace nada (solamente cierra el dialog)
  });
  
  // Traigo los datos de la empresa
  cargarDatosEmpresa();

  // Ahora quiero capturar el valor de cada input que llene el usuario y cargarlo en el objeto formData
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
  inputs.forEach(input => {
    input.addEventListener('input', (e) => {
      formData[e.target.id] = e.target.value;
    });
  });
  
  // Idem que antes pero para el valor de los radio buttons (y tambien los cargo en un formato legible)
  const radios = document.querySelectorAll('input[name="certificado"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      formData['certificado-digital'] = e.target.value == 'si' ? 'Sí' : 'No';
    });
  });
  
  // Esta función se hizo para 
  configurarNavegacionSidebar();

  // Esta función es para observar las secciones y cambiar el link activo en la sidebar según la sección visible
  configurarObservadorSecciones();
  
  // Manejar click en botones ENVIAR
  const buttons = document.querySelectorAll('.button-enviar');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault(); // Para evitar el comportamiento por defecto del submit (recargar la página)
      
      const seccionActiva = obtenerSeccionVisible();

      if (seccionActiva && seccionActiva.id == 'section-datos-empresa') { 
        if (!validarCamposObligatorios()) {
          return;
        }
      }
      
      if (seccionActiva && seccionActiva.id == 'section-representante-legal') {
        if (!validarEmail()) {
          return;
        }
      }
      
      mostrarDialog();
    });
  });
});


function configurarNavegacionSidebar() {
  const navLinks = document.querySelectorAll('.nav-link');
  const contenedor = document.querySelector('.form-container'); 

  const seccionesDisponibles = {
    'datos-empresa': 'section-datos-empresa',
    'representante-legal': 'section-representante-legal'
  };
  
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Para evitar que los link recarguen la página
      
      // Identifico a qué sección quiere navegar el usuario
      const seccionDestino = link.getAttribute('data-section');
      const idSeccion = seccionesDisponibles[seccionDestino];
      
      if (idSeccion) {
        const seccion = document.getElementById(idSeccion);

        if (seccion && contenedor) {
          const offsetTop = seccion.offsetTop - contenedor.offsetTop;
          
          contenedor.scrollTo({
            behavior: 'smooth',
            top: offsetTop
          });
        }
      } else {
        alert('Esta sección aún no está disponible');
      }
    });
  });
}

// Configuro el Intersection Observer para que detecte automáticamente qué sección está visible y active su nav-link
function configurarObservadorSecciones() {
  const secciones = document.querySelectorAll('.form-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const contenedor = document.querySelector('.form-container');
  
  const observer = new IntersectionObserver(
    (entries) => {
      // "entries" contiene información sobre cada elemento observado (en este caso las secciones)
      // Es un array de objetos que tiene información sobre cada elemento observado (ej: isIntersecting para ver si está visible)
      entries.forEach(entry => {
        console.log(entry);

        if (entry.isIntersecting) {
          
          const seccionId = entry.target.id; // target devuelve el elemento HTML. Yo me quedo con el id directamente: 'section-datos-empresa'
          const seccionNombre = seccionId.replace('section-', ''); // Le quito "section-" porque los nav-links usan solamente el nombre (ej: 'datos-empresa')
          
          // Activar el nav-link correspondiente
          navLinks.forEach(link => {
            const linkSeccion = link.getAttribute('data-section');
            
            if (linkSeccion == seccionNombre) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      root: contenedor, // Para observar dentro del contenedor (por defecto es el viewport, pero yo quiero que sea el contenedor con scroll)
      threshold: 0.5, // La sección se considera visible a partir del 50% de visibilidad del elemento
    }
  );
  
  // Observar todas las secciones
  secciones.forEach(seccion => {
    observer.observe(seccion);
  });
}

// Función para obtener la sección actualmente visible
function obtenerSeccionVisible() {
  const navLinkActivo = document.querySelector('.nav-link.active');
  
  if (navLinkActivo) {
    const seccionNombre = navLinkActivo.getAttribute('data-section');
    return document.getElementById(`section-${seccionNombre}`);
  }
  
  return null;
}

function validarCamposObligatorios() {
  const rutEmpresa = formData['rut-empresa'] || '';
  const razonSocial = formData['razon-social'] || '';
  
  // Uso trim para que los campos no estén vacios antes de continuar
  if (!rutEmpresa.trim() || !razonSocial.trim()) {
    alert('Por favor, complete los campos obligatorios: RUT de la empresa y Razón social');
    return false;
  }
  
  return true;
}

function validarEmail() {
  const email = formData['email-representante'] || '';
  
  // Si el campo está vacío, permitir continuar (porque es un campo opcional)
  if (!email.trim()) {
    return true;
  }
  
  // Esto no se pedía pero me pareció útil. Valido el formato del email con una ER
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!regexEmail.test(email)) {
    alert('Por favor, ingrese un email válido');
    return false;
  }
  
  return true;
}

function mostrarDialog() {
  const content = document.getElementById('dialog-content');
  let html = '';
  
  // Mapeo de nombres para que los campos sean más legibles
  const nombresMapeados = {
    'rut-empresa': 'RUT de la empresa',
    'razon-social': 'Razón social',
    'direccion-empresa': 'Dirección de la empresa',
    'comuna': 'Comuna',
    'actividad-economica': 'Actividad económica',
    'rut-representante': 'RUT del representante legal',
    'nombre-representante': 'Nombre del representante legal',
    'email-representante': 'Email del representante legal',
    'certificado-digital': '¿Tiene certificado digital?'
  };
  
  // Solamente muestro los campos de la sección que se encuentra activa
  const seccionActiva = obtenerSeccionVisible();
  let camposAMostrar = [];
  
  // Defino que campos corresponden a la sección activa
  if (seccionActiva && seccionActiva.id == 'section-datos-empresa') {
    camposAMostrar = [
      'rut-empresa',
      'razon-social',
      'direccion-empresa',
      'comuna',
      'actividad-economica'
    ];
  } else if (seccionActiva && seccionActiva.id == 'section-representante-legal') {
    camposAMostrar = [
      'rut-representante',
      'nombre-representante',
      'email-representante',
      'certificado-digital'
    ];
  }
  
  // Genero un HTML para mostrar los campos mencionados (incluyendo los vacíos)
  camposAMostrar.forEach(key => {
    const nombreCampo = nombresMapeados[key] || key;
    const valor = formData[key] || '(vacío)';
    html += `<p><strong>${nombreCampo}:</strong> ${valor}</p>`;
  });
  
  content.innerHTML = html || '<p>No hay datos ingresados</p>';
  
  // Uso del método open para mostrar el dialogo para que el usuario revise los datos antes de enviarlos
  dialog.open();
}

function pasarASiguienteSeccion() {
  const seccionActual = obtenerSeccionVisible();
  const contenedor = document.querySelector('.form-container');

  if (!seccionActual || !contenedor) {
    return;
  }
  
  const siguienteSeccion = seccionActual.nextElementSibling;
  
  if (siguienteSeccion && siguienteSeccion.classList.contains('form-section')) {
    const offsetTop = siguienteSeccion.offsetTop - contenedor.offsetTop;

    contenedor.scrollTo({
      behavior: 'smooth',
      top: offsetTop
    });
  }
}

// Para obtener el ID de la compañía desde la URL ingresada por el usuario
function obtenerCompanyId() {
  // La idea es obtener el ID de la compañía desde la URL completa, dividiendola por "/" y tomando la última parte (pero son el ".json")
  const url = window.location.pathname;
  
  const partes = url.split('/');
  
  const ultimaParte = partes[partes.length - 1];
  
  const id = ultimaParte.replace('.json', '');
  
  return id;
}

// Función para cargar los datos desde la API
async function cargarDatosEmpresa() {
  const companyId = obtenerCompanyId();
  console.log('Company ID obtenido de la URL:', companyId);

  if (!companyId) {
    return;
  }

  try {
    const response = await fetch(`/companies/api/${companyId}`);

    const apiResponse = await response.json();
    const { data } = apiResponse; // equivalente a 'const data = apiResponse.data;'

    if (!response.ok) {
      console.error('Error al cargar los datos de la empresa:', data.errors);
      return;
    }

    // Datos correspondientes a la primera sección: Datos de la empresa
    if (data.cpnCode) {
      document.getElementById('rut-empresa').value = data.cpnCode;
      formData['rut-empresa'] = data.cpnCode;
    }

    if (data.cpnName) {
      document.getElementById('razon-social').value = data.cpnName;
      formData['razon-social'] = data.cpnName;
    }

    if (data.cpnLegalAddress) {
      document.getElementById('direccion-empresa').value = data.cpnLegalAddress;
      formData['direccion-empresa'] = data.cpnLegalAddress;
    }

    if (data.cpnLegalCounty) {
      document.getElementById('comuna').value = data.cpnLegalCounty;
      formData['comuna'] = data.cpnLegalCounty;
    }

    if (data.activity) {
      document.getElementById('actividad-economica').value = data.activity;
      formData['actividad-economica'] = data.activity;
    }

    // Datos correspondientes a la segunda sección: Representante legal
    if (data.legalAgentCode) {
      document.getElementById('rut-representante').value = data.legalAgentCode;
      formData['rut-representante'] = data.legalAgentCode;
    }

    if (data.legalAgentName) {
      document.getElementById('nombre-representante').value = data.legalAgentName;
      formData['nombre-representante'] = data.legalAgentName;
    }

    if (data.legalAgentEmail) {
      document.getElementById('email-representante').value = data.legalAgentEmail;
      formData['email-representante'] = data.legalAgentEmail;
    }

    if (data.cpnDteActive) {
      const tieneCertificado = data.cpnDteActive == 1 ? 'si' : 'no';
      // document.querySelector(`input[name="certificado"][value="${tieneCertificado}"]`).checked = true;
      // formData['certificado-digital'] = tieneCertificado ? 'Sí' : 'No';
      const radio = document.querySelector(`input[name="certificado"][value="${tieneCertificado}"]`);
      if (radio) {
        radio.checked = true;
        formData['certificado-digital'] = tieneCertificado == 'si' ? 'Sí' : 'No';
      }
    }

  } catch (error) {
    console.error('Error al cargar datos:', error);
    alert('No se pudieron cargar los datos de la empresa');
  }
  
}

// Función para actualizar los datos de la empresa mediante la API
async function actualizarDatosEmpresa() {
  const companyId = obtenerCompanyId();

  if (!companyId) {
    alert('No se puede guardar: ID no encontrado');
    return;
  }

  try {
    console.log('Entro a actualizar los datos...');

    // Voy a enviar solamente los campos que tienen valor
    const nuevaData = {};

    // Solo agregar campos si tienen valor
    if (formData['rut-empresa']) {
      nuevaData.cpnCode = formData['rut-empresa'];
    }
    
    if (formData['razon-social']) {
      nuevaData.cpnName = formData['razon-social'];
    }
    
    if (formData['direccion-empresa']) {
      nuevaData.cpnLegalAddress = formData['direccion-empresa'];
    }
    
    if (formData['comuna']) {
      nuevaData.cpnLegalCounty = formData['comuna'];
    }
    
    if (formData['actividad-economica']) {
      nuevaData.activity = formData['actividad-economica'];
    }
    
    if (formData['rut-representante']) {
      nuevaData.legalAgentCode = formData['rut-representante'];
    }
    
    if (formData['nombre-representante']) {
      nuevaData.legalAgentName = formData['nombre-representante'];
    }
    
    if (formData['email-representante']) {
      nuevaData.legalAgentEmail = formData['email-representante'];
    }
    
    if (formData['certificado-digital']) {
      nuevaData.cpnDteActive = formData['certificado-digital'] == 'Sí' ? 1 : 0;
    }

    console.log('Datos a enviar:', nuevaData);

    const response = await fetch(`/companies/api/${companyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      alert('Error al actualizar los datos');
      return;
    }

    alert('¡Datos guardados exitosamente!');

    pasarASiguienteSeccion();

  } catch (error) {
    console.error('Error al actualizar datos:', error);
    alert('No se pudieron guardar los datos de la empresa');
  }
}