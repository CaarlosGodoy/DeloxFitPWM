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

    initMobileMenu();
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
                pass: document.getElementById('reg-pass').value,
                reservas: []
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
            if (inputs.length >= 5) {
                inputs[0].value = currentUser.usuario;
                inputs[1].value = currentUser.correo;
                inputs[2].value = currentUser.dni;
                inputs[3].value = currentUser.suscripcion || 'Ninguna activa';

                const reservaContainer = inputs[4].parentElement;
                if (Array.isArray(currentUser.reservas) && currentUser.reservas.length > 0) {
                    let options = currentUser.reservas.map((res, index) => `<option value="${index}">${res}</option>`).join("");
                    reservaContainer.innerHTML = `
						<label class="account-label">MIS RESERVAS</label>
						<select id="reserva-selector" class="account-input">${options}</select>
						<button type="button" class="btn-cancel" onclick="cancelSelectedClass()">CANCELAR SELECCIONADA</button>
					`;
                } else {
                    inputs[4].value = 'Ninguna activa';
                    inputs[4].readOnly = true;
                }
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
                        users[userIndex].usuario = newUsuario;
                        users[userIndex].correo = newCorreo;
                        users[userIndex].dni = newDni;
                        localStorage.setItem('users', JSON.stringify(users));

                        currentUser.usuario = newUsuario;
                        currentUser.correo = newCorreo;
                        currentUser.dni = newDni;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));

                        alert("¡Tus datos se han actualizado correctamente!");
                    }
                });
            }
        }, 150);
    }
}

function openClassInfo(className) {
    const popup = document.getElementById('popup-class');
    const title = document.getElementById('popup-title');
    const info = document.getElementById('popup-info');
    const img = document.getElementById('popup-img');

    let e = window.event;
    let time = "";
    let day = "";

    if (e && e.target && e.target.classList.contains('class-cell')) {
        let cell = e.target;
        let row = cell.parentElement;
        let timeCell = row.querySelector('.time-col');
        if (timeCell) time = timeCell.innerText;

        let cellIndex = Array.from(row.children).indexOf(cell);
        let table = cell.closest('table');
        if (table) {
            let headerRow = table.querySelector('thead tr');
            if (headerRow && headerRow.children[cellIndex]) day = headerRow.children[cellIndex].innerText;
        }
    }

    if (popup && title) {
        title.innerText = className;
        let dateStr = (day && time) ? `${day} a las ${time}h` : "Horario por confirmar";
        if (info) info.innerText = dateStr;
        if (img) {
            if (className === 'Spinning') img.src = './assets/classes/spinning.png';
            else if (className === 'Zumba') img.src = './assets/classes/zumba.png';
            else if (className === 'Boxeo') img.src = './assets/classes/box.png';
            else img.src = './assets/default.jpg';
        }

        window.claseSeleccionada = (day && time) ? `${className} - ${day} ${time}h` : `${className} - Reservada`;
        popup.style.display = 'flex';
    }
}

function closePopup() {
    const popup = document.getElementById('popup-class');
    if (popup) popup.style.display = 'none';
}

function bookClass(event) {
    if(event) event.preventDefault();

    if (!currentUser) {
        alert("Debes iniciar sesión para poder reservar una clase.");
        window.location.href = './login.html';
        return;
    }

    const reserva = window.claseSeleccionada || "Clase Reservada";

    if (!Array.isArray(currentUser.reservas)) {
        currentUser.reservas = [];
    }

    if (currentUser.reservas.includes(reserva)) {
        alert("Ya tienes una reserva para esta clase en este horario.");
        closePopup();
        return;
    }

    currentUser.reservas.push(reserva);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(u => u.usuario === currentUser.usuario);

    if (userIndex !== -1) {
        users[userIndex].reservas = currentUser.reservas;
        localStorage.setItem('users', JSON.stringify(users));
    }

    alert("¡Clase reservada con éxito!");
    closePopup();
}

function cancelSelectedClass() {
    const selector = document.getElementById('reserva-selector');
    if (!selector) return;

    currentUser.reservas.splice(selector.value, 1);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(u => u.usuario === currentUser.usuario);

    if (userIndex !== -1) {
        users[userIndex].reservas = currentUser.reservas;
        localStorage.setItem('users', JSON.stringify(users));
    }

    alert("Reserva cancelada correctamente.");
    location.reload();
}

function acquireSubscription(event, subTitle) {
    if (event) event.preventDefault();

    if (!currentUser) {
        alert("Debes iniciar sesión para poder adquirir una suscripción.");
        window.location.href = './login.html';
        return;
    }

    if (currentUser.suscripcion && currentUser.suscripcion !== 'Ninguna activa') {
        alert("Ya tienes una suscripción. Cancela la actual primero.");
        return;
    }

    currentUser.suscripcion = subTitle;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(u => u.usuario === currentUser.usuario);

    if (userIndex !== -1) {
        users[userIndex].suscripcion = subTitle;
        localStorage.setItem('users', JSON.stringify(users));
    }

    alert(`¡Has adquirido la suscripción ${subTitle} con éxito!`);
}

function togglePopup() {
    const popup = document.getElementById('popup-overlay');
    if (popup) popup.classList.toggle('active');
}

function cancelSubscription(event) {
    if (event) event.preventDefault();
    if (!currentUser) return;

    currentUser.suscripcion = 'Ninguna activa';
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(u => u.usuario === currentUser.usuario);

    if (userIndex !== -1) {
        users[userIndex].suscripcion = 'Ninguna activa';
        localStorage.setItem('users', JSON.stringify(users));
    }

    alert("¡Tu suscripción ha sido cancelada con éxito!");
    location.reload();
}

function initMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.querySelector(".header-btns-row");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }
}