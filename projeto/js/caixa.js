async function buscarfunc() {
    try {

        let data = await fetch("../php/caixa.php", {

            method: "GET",
            credentials: "include",
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

async function adcfunc() {

    let select = document.getElementById('respon')

    let response = await buscarfunc()

    if (response) {

        if (response.erro) {
            console.log("Erro :" + resultado.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.",1)

        } else {

            for (i in response) {

                let opt = ' <option value="' + response[i].id_usuario + '">' + response[i].nome + '</option> '

                select.innerHTML += opt
            }

            select.value = 0;
        }
    }

}

adcfunc()

async function abrir() {
    let element1 = document.getElementById("respon").value
    let element2 = document.getElementById("valor").value
    let campo1 = document.getElementById("respon")
    let campo2 = document.getElementById("valor")

    if (element1 != 0 && (element2 != '' && element2 != null)) {

        response = await registrarop(element1, "abrir", element2)

        if (response) {
            if (response.erro) {
                console.log("Erro :" + resultado.erro)
                alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.",1)

            } else {

                for (i in response) {

                    if (response.response = 200) {

                        alerta(1,1,"Abertura de caixa realizado com sucesso!",1)

                        document.getElementById("confirmAlerta").addEventListener("click", () =>{
                             window.location.href = '../html/moduloVendas.html'
                        })
                        
                    } else {
                        console.log("Erro: " + response.erro)
                        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.",1)
                    }
                }
            }
        }

    } else if (element1 == 0) {
        campo1.setCustomValidity('Para prosseguir selecione um responsável.')
        campo1.reportValidity()

    } else if (element2 == '' || element2 == null) {
        campo2.reportValidity()
    }
}

async function fechar() {

    let element1 = document.getElementById("respon").value
    let element2 = document.getElementById("valor").value
    let element3 = document.getElementById("obs").value
    let campo1 = document.getElementById("respon")
    let campo2 = document.getElementById("valor")
    let campo3 = document.getElementById("obs")

    if (element1 != 0 && (element2 != '' && element2 != false)) {
        response = await registrarop(element1, "fechar", element2, element3)

        if (response) {

            if (response.erro) {
                console.log("Erro :" + resultado.erro)
                alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.",1)

            } else {

                for (i in response) {

                    if (response.response = 200) {

                        alerta(1,1,"Fechamento de caixa realizado com sucesso!",1)

                        document.getElementById("confirmAlerta").addEventListener("click", () =>{
                             window.location.href = '../html/moduloVendas.html'
                        })
                       
                    } else {
                        console.log("Erro: " + response.erro)
                    }
                }
            }
        }

    } else if (element1 == 0) {
        campo1.setCustomValidity('Para prosseguir selecione um responsável.')
        campo1.reportValidity()

    } else if (element2 == '' || element2 == null) {
        campo2.reportValidity()
    // } else if (element3 == '' || element3 == null) {
    //     campo3.setCustomValidity('Para prosseguir insira um comentpario.')
    //     campo3.reportValidity()
    }
}



async function registrarop(dado1, ope, dado2, dado3) {

    try {

        let list = { "resp": dado1, "op": ope, "valor": dado2, "obs": dado3 }

        let data = await fetch("../php/caixa.php", {
            method: "POST",
            credentials: "include",
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

function voltar() {
    window.location.href = '../html/moduloVendas.html'
}

async function valorAtual() {

    if (window.location.href == 'http://localhost/projeto/html/fechaCaixa.html') {

        element1 = document.getElementById('valorAtual')

        data = await registrarop(null, "valorAtual", null, null)

        if (data) {

            if (data.erro) {
                console.log("Erro :" + resultado.erro)
                alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.",1)
            } else {

                for (i in data) {

                    if (data[i].erro) {

                        console.log("Erro: " + data[i].erro)
                        alert(data[i].response)

                    } else {
                        let valor = parseFloat((data[i].valor_final))
                        let valorFinal = valor.toFixed(2)

                        let valorFinal2 = valorFinal.replace(".", ",")

                        element1.innerText = "R$ " + valorFinal2
                    }
                }

            }
        }
    }

}

valorAtual()

async function valorDinheiro() {

    if (window.location.href == 'http://localhost/projeto/html/fechaCaixa.html') {

        element = document.getElementById('valorDinheiro')

        data = await registrarop(null, "valorDinheiro", null, null)


        if (data) {

            if (data.erro) {
                console.log("Erro :" + resultado.erro)
                alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.",1)

            } else {

                let sum = 0

                for (i in data) {
                    if (data[i].erro) {
                        console.log("Erro: " + data[i].erro)
                        alert(data[i].response)
                    } else {
                        sum += parseFloat(data[i].valor)
                    }
                }

                let valor1 = sum.toFixed(2)
                let valor2 = valor1.replace(".", ",")
                element.innerText = "R$ " + valor2
            }


        }
    }

}
valorDinheiro()





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




