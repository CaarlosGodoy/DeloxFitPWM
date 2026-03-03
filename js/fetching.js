let isLoggedIn = false;

function richTextToHTML(richTextArray) {
    if (!richTextArray) return "";
    return richTextArray.map(block => {
        return block.children.map(child => child.text).join("");
    }).join("\n");
}

async function xLuIncludeFile() {
    let elements = document.querySelectorAll("[data-xlu-include-file]");

    for (let i = 0; i < elements.length; i++) {
        let el = elements[i];
        let file = el.getAttribute("data-xlu-include-file");

        try {
            let response = await fetch(file);
            if (response.ok) {
                let content = await response.text();

                if (file.toLowerCase().includes("header")) {
                    let buttonHTML = isLoggedIn
                        ? '<li><a href="./accountInformation.html" class="btn-header">MI CUENTA</a></li>'
                        : '<li><a href="./login.html" class="btn-header">INSCRIPCION</a></li>';
                    content = content.replace("{{authButton}}", buttonHTML);
                }

                if (file.toLowerCase().includes("banner")) {
                    content = content.replace("{{title}}", el.getAttribute("data-title") || "")
                        .replace("{{image}}", el.getAttribute("data-image") || "")
                        .replace("{{link}}", el.getAttribute("data-link") || "#");
                }

                if (file.includes("faqs.html")) {
                    content = content.replace("__TITULO__", el.getAttribute("data-pregunta") || "")
                        .replace("__CONTENIDO__", el.getAttribute("data-respuesta") || "");
                }

                if (file === "./templates/subscription.html") {
                    content = content.replace(/{{title}}/g, el.getAttribute("data-title") || "")
                        .replace(/{{price}}/g, el.getAttribute("data-price") || "");
                }

                el.innerHTML = content;
                el.removeAttribute("data-xlu-include-file");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

async function loadDynamicContent(slug, containerId) {
    try {
        const res = await fetch('/database/static.json');
        const json = await res.json();

        const page = json.data.find(p => p.slug === slug);

        if (page) {
            const html = richTextToHTML(page.content);
            const container = document.getElementById(containerId) || document.querySelector(containerId);
            if (container) {
                container.innerHTML = html;
            }
        }

        xLuIncludeFile();
    } catch (err) {
        console.error(err);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('legalNotice.html')) {
        loadDynamicContent('legal', 'legal-content');
    } else if (path.includes('index.html') || path.endsWith('/')) {
        loadDynamicContent('home', 'main-content');
    } else if (path.includes('subscriptionPage.html')) {
        loadDynamicContent('subs', 'subs-content');
    } else if (path.includes('classesPage.html')) {
        loadDynamicContent('classes', 'classes-content');
    } else if (path.includes('accountInformation.html')) {
        loadDynamicContent('account', 'account-content');
    } else if (path.includes('faqsPage.html')) {
        loadDynamicContent('faqs', 'faqs-content');
    } else {
        xLuIncludeFile();
    }
});