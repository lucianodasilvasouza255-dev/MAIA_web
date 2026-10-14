
const campoMensagem = document.getElementById("mensagem");
const botaoEnviar = document.getElementById("enviar");
const chat = document.querySelector(".chat-container");
const areaMensagens = document.getElementById("area-mensagens");
const areaDigitacao = document.querySelector(".area-digitacao");

function adicionarMensagem(texto, tipo) {
    const mensagem = document.createElement("div");

    mensagem.classList.add("mensagem", tipo);
    mensagem.textContent = texto;

    areaMensagens.appendChild(mensagem);
    areaMensagens.scrollTop = areaMensagens.scrollHeight;

    return mensagem;
}

async function enviarMensagem() {
    const texto = campoMensagem.value.trim();

    if (!texto) return;

    adicionarMensagem(texto, "usuario");

    campoMensagem.value = "";
    campoMensagem.disabled = true;
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "...";

    
const carregando = adicionarMensagem("", "maia");

carregando.classList.add("digitando");
carregando.setAttribute("aria-label", "A MAIA está pensando");

carregando.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
`;


    try {
        const resposta = await fetch(
            "http://127.0.0.1:8000/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mensagem: texto
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.detail || "Não consegui responder."
            );
        }

        carregando.textContent = dados.resposta;

    } catch (erro) {
        carregando.textContent =
            "Ops! Não consegui me conectar ao meu cérebro. " +
            "Confira se a API está funcionando. 💜";

        console.error("Erro ao conversar com a MAIA:", erro);

    } finally {
        campoMensagem.disabled = false;
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = "Enviar";
        campoMensagem.focus();
    }
}

botaoEnviar.addEventListener("click", enviarMensagem);

campoMensagem.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        enviarMensagem();
    }
});
