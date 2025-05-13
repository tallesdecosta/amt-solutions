async function buscarfunc() {
    let data = await fetch("../php/caixa.php", {

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

        for (i in response) {

            let opt = ' <option value="' + response[i].id_usuario + '">' + response[i].nome + '</option> '

            select.innerHTML += opt
        }
    }

    select.value = 0;

    console.log(select.value)

}

adcfunc()


async function abrir() {
    let element1 = document.getElementById("respon").value
    let element2 = document.getElementById("valor").value

    if (element1 != 0) {
        response = await registrarop(element1,"abrir", element2)

        for (i in response) {

            if (response.result = 200) {

                let h1 = document.querySelector('h1').innerText

                alert('A operação de ' + h1 + ' foi realizada com sucesso!')

                window.location.href = '../html/moduloVendas.html'
            } else if (response.result = 0) {
                console.log("Encontramos problemas no servidor, Pedimos que tente novamente mais tarde")
            }
        }
    } else if (element1 == 0) {
        let h1 = document.querySelector('h1').innerText

        alert('Para salvar a ' + h1 + ' é preciso preencher o campo "Responsável"')
    }
}

async function fechar() {
    let element1 = document.getElementById("respon").value
    let element2 = document.getElementById("valor").value

    if (element1 != 0) {
        response = await registrarop(element1,"fechar", element2)

        for (i in response) {

            if (response.result = 200) {

                let h1 = document.querySelector('h1').innerText

                alert('A operação de ' + h1 + ' foi realizada com sucesso!')

                window.location.href = '../html/moduloVendas.html'
            } else if (response.result = 0) {
                console.log("Encontramos problemas no servidor, Pedimos que tente novamente mais tarde")
            }
        }
    } else if (element1 == 0) {
        let h1 = document.querySelector('h1').innerText

        alert('Para salvar a ' + h1 + ' é preciso preencher o campo "Responsável"')
    }
}



async function registrarop(dado1,ope, dado2) {

    let list = { "resp": dado1, "op" : ope, "nome": "Entrada de caixa", "valor": dado2}

    let data = await fetch("../php/caixa.php", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(list)
    })

    if (data) {
        return await data.json()
    }
}

function voltar() {
    window.location.href = '../html/moduloVendas.html'
}