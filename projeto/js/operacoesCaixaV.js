async function retornarCaixa() {

    try {
        list = { "op": "caixa" }

        data = await fetch("../php/caixa.php", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(list)
        })

        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`)
        } else {
            return await data.json()
        }
    } catch (erro) {
        console.log("Erro ao buscar API: " + erro)
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.",1)
    }

    

    
}

async function inserirCaixa() {

    response = await retornarCaixa();

    if (response) {

        if (response.erro) {
            console.log("Erro: " + response.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.",1)
        } else {

            let tbody = document.getElementById('tbody')

            for (i in response) {

                let tr = '<tr id="trcaixa' + response[i].id_op + '"></tr>'

                let { dia, mes, ano } = extrairData(response[i].hora_final);





                td1 = '<td>' + dia + "/" + mes + "/" + ano + '</td>'
                td2 = '<td>' + response[i].nome_op + '</td>'
                td3 = '<td>' + response[i].nome + '</td>'

                valor1 = parseFloat(response[i].valor_ini)
                valor2 = valor1.toFixed(2)
                valor3 = valor2.replace(".", ",")

                td4 = '<td>R$ ' + valor3 + '</td>'

                valor1 = parseFloat(response[i].valor_final)
                valor2 = valor1.toFixed(2)
                valor3 = valor2.replace(".", ",")

                td5 = '<td>R$ ' + valor3 + '</td>'

                tbody.innerHTML += tr

                tr = document.getElementById('trcaixa' + response[i].id_op)

                tr.innerHTML = td1 + td2 + td3 + td4 + td5
            }
        }
    }
}

inserirCaixa()

function extrairData(dataString) {
    const data = new Date(dataString);

    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();

    return { dia, mes, ano };
}




function alerta(icone, cor, text, nBotoes) {

    let icones = ['bi bi-cone-striped', 'bi bi-check-circle-fill', 'bi bi-exclamation-diamond-fill'] // 0 = cone, 1 = check, 2 = alert

    let cores = ['#d0ae3f', '#73df77', '#ebeb31', '#dd3f3f']// 0 = laranja, 1 = verder, 2 = amarelo, 3 = vermelho

    let alerta = document.getElementById('alertaPadrão')

    alerta.style.display = 'flex'

    let p = document.getElementById('pAlerta')
    let i = document.getElementById('iconeAlerta')

    i.className = icones[icone]
    i.style.color = `${cores[cor]}`
    p.innerText = text

    if (nBotoes == 2) {

        let botoes = document.getElementById('botoesAlerta')

        but1 = '<button class="but1" id="confirmAlerta">Confirmar</button>'
        but2 = '<button class="but2" id="cancelAlerta">Cancelar</button>'

        botoes.innerHtml = but1 + but2

        botoes.style.justifyContent = 'center'

        let cancel = document.getElementById('cancelAlerta')

        cancel.addEventListener("click", () => {
            alerta.style.display = 'none'

        })

    } else if (nBotoes == 1) {

        let botoes = document.getElementById('botoesAlerta')

        but1 = '<button class="but1" id="confirmAlerta">Confirmar</button>'

        botoes.innerHTML = but1

        botoes.style.justifyContent = 'end'

        but1 = document.getElementById("confirmAlerta")

        but1.innerText = 'OK'

        but1.addEventListener("click", () => {
            alerta.style.display = 'none'

        })
    }

}
