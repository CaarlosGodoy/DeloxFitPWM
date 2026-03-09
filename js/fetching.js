let currentUser = JSON.parse(localStorage.getItem('currentUser'));

document.addEventListener('DOMContentLoaded', async function() {
    // 1. Cargamos la estructura común (Header/Footer)
    await loadStructure();

    // 2. Cargamos el contenido dinámico de la página
    await loadDynamicContent();

    // 3. Inicializamos los eventos de Login/Registro
    initAuthListeners();

    // 4. Rellenamos datos si estamos en la sección de cuenta
    fillAccountData();
});

async function getTemplate(url) {
    let response = await fetch(url);
    let text = await response.text();

    let template = document.createElement('template');
    template.innerHTML = text;
    return document.importNode(template.content, true);
}

async function loadStructure() {
    let header = document.querySelector('header');
    let footer = document.querySelector('footer');

    if (header) header.appendChild(await getTemplate('templates/header.html'));
    if (footer) footer.appendChild(await getTemplate('templates/footer.html'));

    loadHeaderVariableBtn();
}

function loadHeaderVariableBtn() {
    let nav = document.querySelector('header nav');
    if (nav) {
        let authBtn = currentUser
            ? `<li><a href="./accountInformation.html" class="btn-header">MI CUENTA</a></li>`
            : `<li><a href="./login.html" class="btn-header">INSCRIBIRSE</a></li>`;

        nav.innerHTML = nav.innerHTML.replace("{{authButton}}", authBtn);
    }
}

async function loadDynamicContent() {
    let path = window.location.pathname;
    let routes = {
        'legalNotice.html': 'legal',
        'subscriptionPage.html': 'subs',
        'classesPage.html': 'classes',
        'faqsPage.html': 'faqs',
        'accountInformation.html': 'account',
        'index.html': 'home',
        'login.html': 'login'
    };

    let routeKey = Object.keys(routes).find(key => path.includes(key));
    let slug = routeKey ? routes[routeKey] : 'home';

    try {
        let response = await fetch('/database/static.json');
        let db = await response.json();
        let container = document.querySelector('main');
        let page = db.data.find(p => p.slug === slug);

        if (page && container) {
            container.innerHTML = page.content.map(block =>
                block.children.map(child => child.text).join("")
            ).join("");

            await processSubTemplates(container);
        }
    } catch (error) {
        console.error('Error cargando contenido dinámico:', error);
    }
}

async function processSubTemplates(dynamicContentSection) {
    let subElements = dynamicContentSection.querySelectorAll('[data-xlu-include-file]');

    for (let el of subElements) {
        let url = el.getAttribute('data-xlu-include-file');
        let response = await fetch(url);
        let html = await response.text();

        Object.keys(el.dataset).forEach(key => {
            let value = el.dataset[key];
            let regex = new RegExp(`{{${key}}}|__${key.toUpperCase()}__`, "g");
            html = html.replace(regex, value);
        });

        el.innerHTML = html;
        el.removeAttribute('data-xlu-include-file');
    }
}

// --- FUNCIONES DE AUTENTICACIÓN Y CUENTA ---

function initAuthListeners() {
    const regForm = document.getElementById('form-registro');
    const logForm = document.getElementById('form-login');

    // Manejo de Registro
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newUser = {
                correo: document.getElementById('reg-correo').value,
                dni: document.getElementById('reg-dni').value,
                usuario: document.getElementById('reg-usuario').value,
                pass: document.getElementById('reg-pass').value
            };

            let users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.find(u => u.usuario === newUser.usuario)) {
                alert("El nombre de usuario ya está registrado.");
                return;
            }

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert("¡Registro completado con éxito!");
            regForm.reset();
        });
    }

    // Manejo de Login
    if (logForm) {
        logForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const userIn = document.getElementById('log-usuario').value;
            const passIn = document.getElementById('log-pass').value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.usuario === userIn && u.pass === passIn);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = './accountInformation.html';
            } else {
                alert("Usuario o contraseña incorrectos.");
            }
        });
    }
}

function fillAccountData() {
    if (window.location.pathname.includes('accountInformation.html')) {

        if (!currentUser) {
            window.location.href = './login.html';
            return;
        }

        // Delay para asegurar que el DOM del JSON se ha cargado
        setTimeout(() => {
            const inputs = document.querySelectorAll('.account-input');
            if (inputs.length >= 3) {
                inputs[0].value = currentUser.usuario;
                inputs[1].value = currentUser.correo;
                inputs[2].value = currentUser.dni;
            }

            const logoutBtn = document.querySelector('.btn-sign_out');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    window.location.href = './index.html';
                });
            }
        }, 150);
    }
}