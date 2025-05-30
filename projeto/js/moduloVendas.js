async function verificarCaixa() {

    list = { "op": "verificar" }

    data = await fetch("../php/caixa.php", {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
    })

    if (data) {
        return data.json()
    }
}

async function alterarModulo() {

    response = await verificarCaixa()

    let modulo = document.getElementById("func2")

    if (response) {
        if (response.erro) {
            console.log("Erro: " + response.erro)
            alert(response.response)
        } else {
            if (response.valor_final == null) {

                modulo.addEventListener('click', () => {
                    window.location.href = '../html/fechaCaixa.html'
                })

                let icon = '<i class="bi bi-door-closed"></i>'

                let p = '<p>Fechar caixa</p>'

                modulo.innerHTML = icon + p

            } else {

                modulo.addEventListener('click', () => {
                    window.location.href = '../html/abrirCaixa.html'
                })

                let icon = '<i class="bi bi-door-open"></i>'

                let p = '<p>Abrir caixa</p>'

                modulo.innerHTML = icon + p

            }
        }
    }


}

alterarModulo()

// Função para iniciar a animação da barra de progresso
function startProgressBar() {

    let progressBar = document.getElementById("progressBarFilled");
    let fecha = document.getElementById("fechaCard");
    let card = document.getElementById('fundoCard')

    width = 0;
    let duration = 4; // Duração em segundos
    let interval = 100; // Intervalo de atualização em milissegundos

    let increment = (100 / (duration * 1000 / interval)); // Incremento por intervalo

    let intervalId = setInterval(() => {
        width += increment;
        progressBar.style.width = width + "%";

        if (width >= 100) {
            clearInterval(intervalId);

            card.style.display = 'none'
        }
    }, interval);

    fecha.addEventListener("click", () =>{
        card.style.display = 'none'
    } )
}

// Iniciar a barra de progresso assim que a página carregar
startProgressBar();