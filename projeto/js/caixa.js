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

    if (element1 != 0 && (element2 != '' && element2 != false)) {
        response = await registrarop(element1, "abrir", element2)

        for (i in response) {

            if (response.response = 200) {

                let h1 = document.querySelector('h1').innerText

                alert('A operação de ' + h1 + ' foi realizada com sucesso!')

                window.location.href = '../html/moduloVendas.html'
            } else {
                console.log("Erro: " + response.erro)
                alert(response.response)
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
    let element3 = document.getElementById("obs").value

    if (element1 != 0) {
        response = await registrarop(element1, "fechar", element2, element3)

        for (i in response) {

            if (response.response = 200) {

                let h1 = document.querySelector('h1').innerText

                alert('A operação de ' + h1 + ' foi realizada com sucesso!')

                window.location.href = '../html/moduloVendas.html'
            } else {
                console.log("Erro: " + response.erro)
            }
        }
    } else if (element1 == 0) {
        let h1 = document.querySelector('h1').innerText

        alert('Para salvar a ' + h1 + ' é preciso preencher o campo "Responsável"')
    }
}



async function registrarop(dado1, ope, dado2, dado3) {

    let list = { "resp": dado1, "op": ope, "valor": dado2, "obs": dado3 }

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

async function valorAtual() {

    if (window.location.href == 'http://localhost/projeto/html/fechaCaixa.html') {

        element1 = document.getElementById('valorAtual')

        data = await registrarop(null, "valorAtual", null, null)

        if (data) {

            for (i in data) {

                if (data[i].erro) {

                    console.log("Erro: "+data[i].erro)
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

valorAtual()

async function valorDinheiro() {

    if (window.location.href == 'http://localhost/projeto/html/fechaCaixa.html') {

        element = document.getElementById('valorDinheiro')

        data = await registrarop(null, "valorDinheiro", null, null)


        if (data) {

            let sum = 0

            for (i in data) {
                if(data[i].erro){
                    console.log("Erro: "+data[i].erro)
                    alert(data[i].response)
                }else{
                    sum += parseFloat(data[i].valor)
                }
            }

            let valor1 = sum.toFixed(2)
            let valor2 = valor1.replace(".", ",")
            element.innerText = "R$ " + valor2
        }
    }

}
valorDinheiro()