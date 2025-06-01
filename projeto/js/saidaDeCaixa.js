async function buscarfunc() {

    try {
        let data = await fetch("../php/operacao.php", {

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
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }


}

async function adcfunc() {

    let select = document.getElementById('respon')

    let response = await buscarfunc()

    if (response) {
        if (response.erro) {
            console.log("Erro: " + response.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        } else {

            for (i in response) {

                let opt = ' <option value="' + response[i].id_usuario + '">' + response[i].nome + '</option> '

                select.innerHTML += opt
            }
        }
    }
}



async function salvar() {

    let nome = document.getElementById("operacao").innerText
    let element1 = document.getElementById("respon").value
    let element2 = document.getElementById("valor").value
    let element3 = document.getElementById("obs").value
    let campo1 = document.getElementById("respon")
    let campo2 = document.getElementById("valor")
    let campo3 = document.getElementById("obs")


    if (element1 != 0 && (element2 != '' && element2 != null && element2 != 0) && (element3 != '' && element3 != null)) {

        if (nome == 'Entrada de caixa') {
            nome = 'Entrada'

        } else if (nome == 'Saída de caixa') {

            nome = 'Saida'

            if (element2 > 0) {
                element2 = element2 * (-1)
            }

        }


        response = await registrarop(element1, element2, element3, nome)

        if (response) {

            if (response.erro) {
                console.log("Erro: " + response.erro)
                alert(response.response)
            } else {

                if (response.result == null) {
                    alerta(3, 3, "Não é possivel realizar a saída sem registro de operações no caixa. Por favor realize uma entrada de caixa inicial ou fechamento de caixa", 1)
                } else if (response.result == false) {
                    alerta(3, 3, "Não é possivel realizar uma saída maior que o valor atual do caixa", 1)
                }else{
                    alerta(1,1,"Saída de caixa realizada com sucesso !",1)

                    document.getElementById("confirmAlerta").addEventListener("click", () =>{
                        window.location.href = '../html/moduloVendas.html'
                    })

                    

                }

            }
        }


    } else if (element1 == 0) {
        campo1.setCustomValidity('Para prosseguir selecione um responsável.')
        campo1.reportValidity()

    } else if (element2 == '' || element2 == null || element2 == 0) {

        campo2.reportValidity()

    } else if (element3 == '' || element3 == null) {
        campo3.setCustomValidity('Para prosseguir adicione um comentário.')
        campo3.reportValidity()
    }


}

async function registrarop(dado1, dado2, dado3, dado4) {

    try {
        let list = { "resp": dado1, "op": "saida", "nome": dado4, "valor": dado2, "obs": dado3 }

        let data = await fetch("../php/operacao.php", {
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
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }
}



async function verifacess() {

    let user = document.getElementById('usuario').value
    let pass = document.getElementById('senha').value
    let campo1 = document.getElementById('usuario')
    let campo2 = document.getElementById('senha')

    if ((user != '' && user != false) && (pass != '' && user != false)) {

        let response = await validaracess(user, pass)

        if (response) {
            if (response.erro) {
                console.log("Erro: " + response.erro)
                alerta(0, 0, 'Estamos com problemas de conexão, por favor tente novamente mais tarde.', 1)

                document.getElementById("confirmAlerta").addEventListener("click", () => {
                    window.location.href = '../html/moduloVendas.html'
                })

            } else if (response.acesso == 'autorizado') {
                let element = document.getElementById('verifacess')

                element.style.display = 'none'

                adcfunc()

            } else if (response.acesso = 'negado') {
                let h1 = document.querySelector('h1').innerText

                alerta(2, 2, 'Para acessar a funcionalidade de ' + h1 + ' a conta deve conter privilegio de gestor', 1)

                document.getElementById("confirmAlerta").addEventListener("click", () => {

                    let alerta = document.getElementById('alertaPadrão')
                    alerta.style.display = 'none'
                })
            }
        }

    } else if (user == '' || user == null) {
        campo1.reportValidity()
    } else if (pass == '' || pass == null) {
        campo2.reportValidity()
    }

}


async function validaracess(user, senha) {

    try {
        let values = { "user": user, "senha": senha }

        let data = await fetch("../php/operacao.php", {

            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)

        })

        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`)
        } else {
            return await data.json()
        }
    } catch (erro) {
        console.log("Erro ao buscar API: " + erro)
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }

}

function voltar() {
    window.location.href = '../html/moduloVendas.html'
}



function alerta(icone, cor, text, nBotoes) {

    let icones = ['bi bi-cone-striped', 'bi bi-check-circle-fill', 'bi bi-exclamation-diamond-fill','bi bi-x-circle-fill'] // 0 = cone, 1 = check, 2 = alert, 3 = X

    let cores = ['#d0ae3f', '#73df77', '#ebeb31', '#dd3f3f']// 0 = laranja, 1 = verde, 2 = amarelo, 3 = vermelho

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