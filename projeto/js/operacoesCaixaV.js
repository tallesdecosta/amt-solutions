async function retornarCaixa() {

    list = { "op": "caixa" }

    data = await fetch("../php/caixa.php", {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
    })

    return data.json()
}

async function inserirCaixa() {

    response = await retornarCaixa();

    if (response) {

        if (response.erro) {
            console.log("Erro: " + response.erro)
            alert(response.response)
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