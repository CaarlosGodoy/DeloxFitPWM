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

                if (file.includes("./templates/faqs.html")) {
                    content = content.replace("__TITULO__", el.getAttribute("data-pregunta") || "")
                        .replace("__CONTENIDO__", el.getAttribute("data-respuesta") || "");
                }

                if (file === "article-template.templates") {
                    content = content.replace(/{{title}}/g, el.getAttribute("data-title") || "")
                        .replace(/{{subtitle}}/g, el.getAttribute("data-subtitle") || "")
                        .replace(/{{date}}/g, el.getAttribute("data-date") || "")
                        .replace(/{{displayDate}}/g, el.getAttribute("data-display-date") || "")
                        .replace(/{{content}}/g, el.getAttribute("data-content") || "")
                        .replace(/{{image}}/g, el.getAttribute("data-image") || "")
                        .replace(/{{imageCaption}}/g, el.getAttribute("data-image-caption") || "");
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

async function loadHomePage() {
    try {
        const res = await fetch('./data.json');
        const json = await res.json();

        const homePage = json.data.find(page => page.slug === 'home');

        if (homePage) {
            const pageData = homePage.attributes || homePage;
            const htmlContent = richTextToHTML(pageData.content);
            document.getElementById('main-content').innerHTML = htmlContent;

            xLuIncludeFile();
        }
    } catch (err) {
        console.error(err);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    xLuIncludeFile();
    loadHomePage();
});