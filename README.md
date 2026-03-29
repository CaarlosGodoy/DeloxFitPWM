NOMBRE:
-
DELOXFIT GYM WEBSITE

INTEGRANTES:
-
PAULA SANTANA GARCÍA

MARCOS PEÑA ARMARIO

CARLOS GODOY DE LEÓN

UBICACIÓN DEL PDF DE LOS MOCKUP Y EL STORYBOARD:
-
El PDF se encuentra en la ruta "/FIGMA/FIGMA_SPRINT_2.pdf".

Por si fuese necesario se encuentra el link al Figma en la sección "Otros Aspectos" de este documento.

PÁGINAS:
-

> PAGINA PRINCIPAL: index.html

Es la página de inicio del sitio web.

Representa el mockup "INDICE".

##### ASPECTOS RESPONSIVE IMPLEMENTADOS

Para que nuestro código sepa que proporciones desplegar acorde al tipo de dispositivo, nos apoyamos de las reglas @media, donde jugando con la altura y ancho de nuestro dispositivo, diferenciamos entre móvil, tablet u ordenador.


##### CARGA DE CONTENIDO JSON

Todo el contenido estático de la página se carga desde el archivo static.json, en caso de esta página utilizando el slug "home".

Para ello, se hace uso de la función loadDynamicContent() del archivo fetching.js, la cúal carga el contenido de esta sección del static.josn, cuando lea que la ruta de la página actual incluya el nombre de esta página.

> INSCRIPCIÓN: login.html

Representa el mockup "LOG-IN".

##### ASPECTOS RESPONSIVE IMPLEMENTADOS

Para que nuestro código sepa que proporciones desplegar acorde al tipo de dispositivo, nos apoyamos de las reglas @media, donde jugando con la altura y ancho de nuestro dispositivo, diferenciamos entre móvil, tablet u ordenador.


##### CARGA DE CONTENIDO JSON

Todo el contenido estático de la página se carga desde el archivo static.json, en caso de esta página utilizando el slug "login".

Para ello, se hace uso de la función loadDynamicContent() del archivo fetching.js, la cúal carga el contenido de esta sección del static.josn, cuando lea que la ruta de la página actual incluya el nombre de esta página.

##### FORMULARIO

En los formularios de la página de acceso (`login.html`) se han aplicado las siguientes validaciones HTML5 para garantizar la correcta introducción de datos:

##### Formulario de Registro (`form-registro`)

- `required`: Todos los campos son obligatorios: correo, DNI, usuario y contraseña.


- `type="email"`: El campo correo valida automáticamente que el formato sea un email válido.


- `pattern="[0-9]{8}[A-Z,a-z]{1}"`: El campo DNI debe contener **8 números seguidos de 1 letra** (mayúscula o minúscula).


- `minlength`:
  - Usuario: mínimo 4 caracteres.
  - Contraseña: mínimo 6 caracteres.


- `placeholder` y `title`:
  - `placeholder` en correo: guía al usuario con un ejemplo.
  - `title` en DNI: indica el formato esperado.

##### Formulario de Inicio de Sesión (`form-login`)

- `required`: Todos los campos son obligatorios: usuario y contraseña.


- `type="password"`: El campo contraseña enmascara la entrada para mayor seguridad.

##### Usuario y contraseña de prueba:
- En nuestro caso usamos localstorage, por lo que por mucho que creemos un usario de prueba solo funcionaría en nuestro navegador.

> MI CUENTA: accountInformation.html

Representa el mockup "INFORMACION CUENTA".

##### ASPECTOS RESPONSIVE IMPLEMENTADOS

Para que nuestro código sepa que proporciones desplegar acorde al tipo de dispositivo, nos apoyamos de las reglas @media, donde jugando con la altura y ancho de nuestro dispositivo, diferenciamos entre móvil, tablet u ordenador.


##### CARGA DE CONTENIDO JSON

Todo el contenido estático de la página se carga desde el archivo static.json, en caso de esta página utilizando el slug "account".

Para ello, se hace uso de la función loadDynamicContent() del archivo fetching.js, la cúal carga el contenido de esta sección del static.josn, cuando lea que la ruta de la página actual incluya el nombre de esta página.

> SUSCRIPCIONES: subscriptionPage.html

Representa el mockup "SUSCRIPCIONES".

##### ASPECTOS RESPONSIVE IMPLEMENTADOS

Para que nuestro código sepa que proporciones desplegar acorde al tipo de dispositivo, nos apoyamos de las reglas @media, donde jugando con la altura y ancho de nuestro dispositivo, diferenciamos entre móvil, tablet u ordenador.


##### CARGA DE CONTENIDO JSON

Todo el contenido estático de la página se carga desde el archivo static.json, en caso de esta página utilizando el slug "subs".

Para ello, se hace uso de la función loadDynamicContent() del archivo fetching.js, la cúal carga el contenido de esta sección del static.josn, cuando lea que la ruta de la página actual incluya el nombre de esta página.

> CLASES: classesPage.html

Representa el mockup "CLASES".

##### ASPECTOS RESPONSIVE IMPLEMENTADOS

Para que nuestro código sepa que proporciones desplegar acorde al tipo de dispositivo, nos apoyamos de las reglas @media, donde jugando con la altura y ancho de nuestro dispositivo, diferenciamos entre móvil, tablet u ordenador.


##### CARGA DE CONTENIDO JSON

Todo el contenido estático de la página se carga desde el archivo static.json, en caso de esta página utilizando el slug "classes".

Para ello, se hace uso de la función loadDynamicContent() del archivo fetching.js, la cúal carga el contenido de esta sección del static.josn, cuando lea que la ruta de la página actual incluya el nombre de esta página.

> FAQS: faqsPage.html

Representa el mockup "FAQS".

##### ASPECTOS RESPONSIVE IMPLEMENTADOS

Para que nuestro código sepa que proporciones desplegar acorde al tipo de dispositivo, nos apoyamos de las reglas @media, donde jugando con la altura y ancho de nuestro dispositivo, diferenciamos entre móvil, tablet u ordenador.


##### CARGA DE CONTENIDO JSON

Todo el contenido estático de la página se carga desde el archivo static.json, en caso de esta página utilizando el slug "faqs".

Para ello, se hace uso de la función loadDynamicContent() del archivo fetching.js, la cúal carga el contenido de esta sección del static.josn, cuando lea que la ruta de la página actual incluya el nombre de esta página.

> AVISO LEGAL: legalNotice.html

Para esto último no hicimos mockup en su momento.

##### ASPECTOS RESPONSIVE IMPLEMENTADOS

Para que nuestro código sepa que proporciones desplegar acorde al tipo de dispositivo, nos apoyamos de las reglas @media, donde jugando con la altura y ancho de nuestro dispositivo, diferenciamos entre móvil, tablet u ordenador.


##### CARGA DE CONTENIDO JSON

Todo el contenido estático de la página se carga desde el archivo static.json, en caso de esta página utilizando el slug "legal".

Para ello, se hace uso de la función loadDynamicContent() del archivo fetching.js, la cúal carga el contenido de esta sección del static.josn, cuando lea que la ruta de la página actual incluya el nombre de esta página.

UBICACIÓN CONTENIDO JSON:
-
El JSON se encuentra local en la ruta "/database/database.json" y "/database/static.json".

OTROS ASPECTOS:
-

Link al Trello: https://trello.com/b/Kog92fEf/pwm-proyecto

Link al Figma: https://www.figma.com/files/team/1600466749776033112/project/546594723?fuid=1600474527495390804 
