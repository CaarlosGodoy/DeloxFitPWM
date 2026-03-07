let currentUser = JSON.parse(localStorage.getItem('currentUser'));

document.addEventListener('DOMContentLoaded', async function() {
    await loadStructure();
    loadDynamicContent();
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

    header.appendChild(await getTemplate('templates/header.html'));
    footer.appendChild(await getTemplate('templates/footer.html'));

    loadHeaderVariableBtn();
}

function loadHeaderVariableBtn() {
    let nav = document.querySelector('header nav');
    if (nav) {
        let authBtn = currentUser
            ? `<li><a href="./accountInformation.html" class="btn-header">MY ACCOUNT</a></li>`
            : `<li><a href="./login.html" class="btn-header">REGISTRATION</a></li>`;
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
        'index.html': 'home'
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
        console.error('Error:', error);
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