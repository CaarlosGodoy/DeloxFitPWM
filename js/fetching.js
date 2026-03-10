let currentUser = JSON.parse(localStorage.getItem('currentUser'));

document.addEventListener('DOMContentLoaded', async function() {
    await loadStructure();
    await loadDynamicContent();
    initAuthListeners();
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
        console.error(error);
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

function initAuthListeners() {
    const regForm = document.getElementById('form-registro');
    const logForm = document.getElementById('form-login');

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

            const saveBtn = document.querySelector('.btn-save');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    const newUsuario = inputs[0].value.trim();
                    const newCorreo = inputs[1].value.trim();
                    const newDni = inputs[2].value.trim();

                    if (!newUsuario || !newCorreo || !newDni) {
                        alert("Por favor, rellena todos los campos.");
                        return;
                    }

                    let users = JSON.parse(localStorage.getItem('users')) || [];
                    let userIndex = users.findIndex(u => u.usuario === currentUser.usuario);

                    if (userIndex !== -1) {
                        if (newUsuario !== currentUser.usuario && users.some(u => u.usuario === newUsuario)) {
                            alert("Ese nombre de usuario ya está en uso. Elige otro.");
                            return;
                        }

                        users[userIndex].usuario = newUsuario;
                        users[userIndex].correo = newCorreo;
                        users[userIndex].dni = newDni;
                        localStorage.setItem('users', JSON.stringify(users));

                        currentUser.usuario = newUsuario;
                        currentUser.correo = newCorreo;
                        currentUser.dni = newDni;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));

                        alert("¡Tus datos se han actualizado correctamente!");
                    } else {
                        alert("Error: No se encontró el usuario en la base de datos.");
                    }
                });
            }
        }, 150);
    }
}

function openClassInfo(className) {
    const popupElement = document.getElementById('popup-class');
    const titleElement = document.getElementById('popup-title');
    const infoElement = document.getElementById('popup-info');
    const imageElement = document.getElementById('popup-img');

    if (!popupElement) return;

    titleElement.innerText = className;

    const classDescriptions = {
        'Spinning': 'Sesión de cardio intenso sobre bicicleta estática al ritmo de la mejor música.',
        'Zumba': 'Combina movimientos de baile con rutinas aeróbicas. ¡Diversión y quema de grasa!',
        'Boxeo': 'Entrenamiento de técnica, sacos y agilidad. ¡Suelta toda tu energía!'
    };

    const classImages = {
        'Spinning': './assets/classes/spinning.png',
        'Zumba': './assets/classes/zumba.png',
        'Boxeo': './assets/classes/box.png'
    };

    infoElement.innerText = classDescriptions[className] || 'Información no disponible.';
    imageElement.src = classImages[className] || '';

    popupElement.classList.add('active');
}

function closePopup() {
    const popupElement = document.getElementById('popup-class');
    if (popupElement) {
        popupElement.classList.remove('active');
    }
}