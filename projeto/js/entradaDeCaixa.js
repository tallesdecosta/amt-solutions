async function buscarfunc() {
    let data = await fetch("../php/operacao.php", {

        method: "GET",
        credentials: "include",
    })

    if (data) {
        return await data.json()
    }
}

async function adcfunc() {

    let select = document.getElementById('respon')

    let response = await buscarfunc()

    if (response) {
        if (response.erro) {
            console.log("Erro: " + response.erro)
            alert(response.response)
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

    if (element1 != 0 && (element2 != '' && element2 != null) && (element3 != '' && element3 != null)) {

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

                for (i in response) {

                    if (response.result = 200) {

                        let h1 = document.querySelector('h1').innerText

                        alert('A operação de ' + h1 + ' foi realizada com sucesso!')

                        window.location.href = '../html/moduloVendas.html'

                    }
                }

            }
        }


    } else {
        let h1 = document.querySelector('h1').innerText

        alert('Para salvar a ' + h1 + ' é preciso preencher todos os campos')
    }


}

async function registrarop(dado1, dado2, dado3, dado4) {

    let list = { "resp": dado1, "op": "insert", "nome": dado4, "valor": dado2, "obs": dado3 }

    let data = await fetch("../php/operacao.php", {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
    })

    if (data) {
        return await data.json()
    }
}



async function verifacess() {

    let user = document.getElementById('usuario').value
    let pass = document.getElementById('senha').value

    if ((user != '' && user != false) && (pass != '' && user != false)) {

        let response = await validaracess(user, pass)

        if (response) {
            if (response.erro) {
                console.log("Erro: " + response.erro)
                alert(response.response)
            } else if (response.acesso == 'autorizado') {
                let element = document.getElementById('verifacess')

                element.style.display = 'none'

                adcfunc()

            } else if (response.acesso = 'negado') {
                let h1 = document.querySelector('h1').innerText

                alert('Para acessar o módulo de ' + h1 + ' a conta deve conter privilegio de gestor')
            }
        }

    } else {
        alert("O login precisa conter o Username e a Senha do usuário")
    }

}


async function validaracess(user, senha) {

    let values = { "user": user, "senha": senha }

    let data = await fetch("../php/operacao.php", {

        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)

    })

    if (data) {
        return data.json()
    }

}

function voltar() {
    window.location.href = '../html/moduloVendas.html'
}