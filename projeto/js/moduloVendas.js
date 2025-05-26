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

    if (response.valor_final == null) {

        modulo.addEventListener('click',() =>{
            window.location.href = '../html/fechaCaixa.html'
        })

        let icon = '<i class="bi bi-door-closed"></i>'

        let p = '<p>Fechar caixa</p>'

        modulo.innerHTML = icon + p

    } else {

        modulo.addEventListener('click',() =>{
            window.location.href = '../html/abrirCaixa.html'
        })

        let icon = '<i class="bi bi-door-open"></i>'

        let p = '<p>Abrir caixa</p>'

        modulo.innerHTML = icon + p

    }
}

alterarModulo()