async function buscarHistorico() {

    data = await fetch("../php/vendas.php", {
        method: "GET",
        credentials: "include"
    })

    if (data) {
        return data.json()
    }
}


async function listarVendas() {

    response = await buscarHistorico()

    if (response) {

        if (response.erro) {
            console.log("Erro :" + response.erro)
            alert(response.response)
        } else {
            let tbody = document.getElementById('tbodyVendas')

            tbody.innerHTML = ''

            for (i in response) {

                let tr = '<tr id="trvenda' + response[i].id + '"></tr>'

                tbody.innerHTML += tr

                let td1 = '<td id="data' + response[i].id + '">' + response[i].data_emissao + '</td>'
                let td2 = '<td id="numcmd' + response[i].id + '">' + response[i].numComanda + '</td>'
                let td3 = '<td id="nome' + response[i].id + '">' + response[i].nomeCliente + '</td>'
                let td4 = '<td id="forma' + response[i].id + '">' + response[i].formaPagamento + '</td>'

                let valor1 = parseFloat(response[i].valor)
                let valor2 = valor1.toFixed(2)
                let valor3 = valor2.replace(".", ",")

                let td5 = '<td id="valor' + response[i].id + '">R$ ' + valor3 + '</td>'
                let td6 = '<td><i class="bi bi-file-text" onclick=" visucmd(' + response[i].id + ')"></i></td>'

                tr = document.getElementById('trvenda' + response[i].id)
                tr.innerHTML = td1 + td2 + td3 + td4 + td5 + td6



            }
        }


    }


}

listarVendas()


async function buscarComanda(op, filtro, tabela, id) {

    list = { "op": op, "filtro": filtro, "tabela": tabela, "id": id }

    let data = await fetch("../php/vendas.php", {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
    })

    if (data) {
        return await data.json()
    }

}

async function visucmd(id) {

    let element = document.getElementById('fundoComanda')

    element.style.display = 'flex'

    let tbody = document.getElementById('tbodycmd')

    let element1 = document.getElementById('cliente')
    let element2 = document.getElementById('cmd')
    let element3 = document.getElementById('form')
    let element4 = document.getElementById('datacmd')
    let element5 = document.getElementById('tbodycmd')

    let valor = document.getElementById('pvalor')

    element1.innerHTML = 'Cliente:'
    element2.innerHTML = 'Nº comanda:'
    element3.innerHTML = 'Forma de pagamento:'
    element4.innerHTML = 'Data:'
    element5.innerHTML = ''
    valor.innerHTML = 'R$ '

    let data = await buscarComanda("select", "oneF", "venda", id)

    if (data) {

        if (data.erro) {
            console.log("Erro :" + data.erro)
            alert(data.response)
        } else {

            for (i in data) {

                element1.innerText += " " + data[i].nomeCliente
                element2.innerText += " " + data[i].numComanda
                element3.innerText += " " + data[i].formaPagamento
                element4.innerText += " " + data[i].data_emissao

            }

            let valor1 = parseFloat(data[i].valor)
            let valor2 = valor1.toFixed(2)
            let valor3 = valor2.replace(".", ",")


            valor.innerHTML += " " + valor3
        }

    }



    let data2 = await buscarComanda("select", "oneF", "venda_produto", id)

    if (data2) {

        if (data2.erro) {
            console.log("Erro :" + data2.erro)
            alert(data2.response)
        } else {
            for (i in data2) {

                let tbody = document.getElementById('tbodycmd')

                let tr = '<tr id="tritens' + data2[i].id_produto + '"></tr>'

                tbody.innerHTML += tr

                tr = document.getElementById('tritens' + data2[i].id_produto)

                let td1 = '<td class="nome">' + data2[i].nome + '</td>'
                let td2 = '<td>' + data2[i].qntd + '</td>'

                let valor1 = parseFloat(data2[i].valor)
                let valor2 = valor1.toFixed(2)
                let valor3 = valor2.replace(".", ",")

                let td3 = '<td>R$ ' + valor3 + '</td>'


                tr.innerHTML = td1 + td2 + td3
            }
        }


    }


}


function voltar() {
    let element = document.getElementById('fundoComanda')

    element.style.display = 'none'
}