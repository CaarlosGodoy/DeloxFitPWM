NOMBRE:
-
DELOXFIT GYM WEBSITE

INTEGRANTES:
-
PAULA SANTANA GARCÍA

MARCOS PEÑA ARMARIO

CARLOS GODOY DE LEÓN

Estructura del Código:
-

### HOME
Muestra una sección de presentación ("Entrena a tu aire") explicando la filosofía del gimnasio, un carrusel de imágenes interactivo para mostrar las instalaciones, y dos grandes botones/banners que actúan como accesos rápidos directos a las páginas de Clases y Suscripciones.

### HEADER
Permite moverse entre todas estas páginas. Es "inteligente", es decir, el botón de arriba a la derecha cambia: si no estás logueado te invita a "Iniciar Sesión", pero si ya estás dentro, cambia para decir "Mi Cuenta".

### FOOTER
Contiene enlaces a las redes sociales, accesos directos al horario/precios, el enlace al Aviso Legal y la marca de copyright.

### CLASSES
Muestra el horario semanal en una tabla dinámica (los datos de las clases se cargan automáticamente desde un archivo JSON). Cuando un usuario hace clic sobre una clase concreta (Zumba, Spinning, etc.), se abre una ventana emergente (modal) con la foto de la actividad, día y hora. Si el usuario ha iniciado sesión, desde ese modal puede hacer clic en "Reservar" para apuntarse a la clase.

### SUBSCRIPTIONS
Lista en forma de tarjetas los distintos planes que ofrece el gimnasio (mensual, anual, etc.), los cuales también se cargan de forma dinámica. Si el usuario está logueado, puede pulsar en "Adquirir" para vincular esa suscripción a su cuenta.

### FAQS
Muestra una lista de preguntas típicas de los clientes y sus respectivas respuestas (ej: normas, uso de taquillas, etc.). Para mantener el diseño limpio, se organizan en dos columnas de tarjetas (cards) y se alimentan de los datos dinámicos del JSON.

### LEGAL NOTICE
Muestra texto estático e informativo referente a los términos de uso, políticas de privacidad, leyes de protección de datos y condiciones de contratación del gimnasio.

### LOGIN
Contiene dos formularios. El primero permite a un usuario nuevo crear su cuenta introduciendo sus datos (DNI, Correo, Usuario y Contraseña). El segundo permite a los usuarios ya registrados iniciar sesión. Toda la gestión de cuentas y sesión activa se simula guardando la información en el almacenamiento local del navegador (localStorage) a través del servicio de autenticación.

### ACCOUNT
Es el panel de control privado del usuario (solo accesible si se ha iniciado sesión) que muestra:

- Datos personales: Muestra la información del usuario en modo lectura (Usuario, Correo, DNI).

- Gestión de Suscripciones: Muestra la suscripción actual que el usuario tiene contratada y dispone de un botón para cancelarla.

- Gestión de Reservas: Despliega una lista con todas las clases que el usuario ha reservado previamente. Permite seleccionar una reserva en concreto y pulsar un botón para cancelar la clase.

- Cerrar Sesión: Un botón para salir de la cuenta de forma segura.


TOUR DEL PROYECTO:
-

Link al Tour: 

EVOLUCIÓN DEL TRELLO:
-

Link al Trello: https://trello.com/b/Kog92fEf/pwm-proyecto
