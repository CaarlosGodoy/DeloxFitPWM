let isLoggedIn = true;

async function xLuIncludeFile() {
    let z = document.getElementsByTagName("*");

    for (let i = 0; i < z.length; i++) {
        if (z[i].getAttribute("data-xlu-include-file")) {
            let a = z[i].cloneNode(false);
            let file = z[i].getAttribute("data-xlu-include-file");

            try {
                let response = await fetch(file);
                if (response.ok) {

                    let content = await response.text();

                    if (file.includes("faqs.html")) {
                        let pregunta = z[i].getAttribute("data-pregunta") || "";
                        let respuesta = z[i].getAttribute("data-respuesta") || "";

                        content = content.replace("__TITULO__", pregunta)
                            .replace("__CONTENIDO__", respuesta);
                    }

                    if (file.includes("header.html")) {
                        let buttonHTML = isLoggedIn
                            ? '<li><a href="accountInformation.html" class="btn-header">MI CUENTA</a></li>'
                            : '<li><a href="login.html" class="btn-header">INSCRIPCIÓN</a></li>';

                        content = content.replace("{{authButton}}", buttonHTML);
                    }

                    if (file === "article-template.html") {
                        let articleData = {
                            title: z[i].getAttribute("data-title"),
                            subtitle: z[i].getAttribute("data-subtitle"),
                            date: z[i].getAttribute("data-date"),
                            displayDate: z[i].getAttribute("data-display-date"),
                            content: z[i].getAttribute("data-content"),
                            image: z[i].getAttribute("data-image"),
                            imageCaption: z[i].getAttribute("data-image-caption")
                        };

                        content = content.replace(/{{title}}/g, articleData.title)
                            .replace(/{{subtitle}}/g, articleData.subtitle)
                            .replace(/{{date}}/g, articleData.date)
                            .replace(/{{displayDate}}/g, articleData.displayDate)
                            .replace(/{{content}}/g, articleData.content)
                            .replace(/{{image}}/g, articleData.image || '')
                            .replace(/{{imageCaption}}/g, articleData.imageCaption || '');
                    }


                    a.removeAttribute("data-xlu-include-file");
                    a.innerHTML = content;
                    z[i].parentNode.replaceChild(a, z[i]);
                    xLuIncludeFile();
                }
            } catch (error) {
                console.error("Error fetching file:", error);
            }

            return;
        }
    }
}