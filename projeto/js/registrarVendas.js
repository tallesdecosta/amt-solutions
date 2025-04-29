function semcomanda() {
    let element1 = document.getElementById('numcomanda')
    let element2 = document.getElementById('nocliente')
    let element3 = document.getElementById('formpag')
    let element4 = document.getElementById('btnsalvar1')
    let element5 = document.getElementById('btnsalvar2')
    let element6 = document.getElementById('butadc')
    let element7 = document.getElementById('fundovendas')
    let element8 = document.getElementById('divtrash')
    let element9 = document.getElementById('tbodyitens')
    let element10 = document.getElementById('valorTotal')
    let element11 = document.getElementById('numerocmd')

    document.getElementById('hidvenda').value = 0


    element1.value = ''
    element2.value = ''
    element3.value = '0'

    element1.disabled = true
    element2.disabled = true
    element3.disabled = true
    element4.disabled = true
    element5.disabled = true
    element6.disabled = true
    element8.disabled = true

    element9.innerHTML = ''
    element10.innerHTML = ''
    element11.innerHTML = '#'

    element7.style.opacity = '0.7'


}

semcomanda();

function criarcomd() {
    let element1 = document.getElementById('numcomanda')
    let element2 = document.getElementById('nocliente')
    let element3 = document.getElementById('formpag')
    let element4 = document.getElementById('btnsalvar1')
    let element5 = document.getElementById('btnsalvar2')
    let element6 = document.getElementById('butadc')
    let element7 = document.getElementById('fundovendas')
    let element8 = document.getElementById('divtrash')
    let element9 = document.getElementById('tbodyitens')
    let element10 = document.getElementById('valorTotal')
    let element11 = document.getElementById('numerocmd')

    document.getElementById('hidvenda').value = 0

    let select = document.getElementById('formpag')
    let formpag = select.options[select.selectedIndex].value;
    formpag = 0;

    element1.disabled = false
    element2.disabled = false
    element3.disabled = false
    element4.disabled = false
    element5.disabled = false
    element6.disabled = false
    element8.disabled = false

    element1.value = ''
    element2.value = ''
    element3.value = '0'
    element9.innerHTML = ''

    element10.innerHTML = ''
    element11.innerHTML = '#'

    element7.style.opacity = '1'
}



async function salvarcmd() {

    let element1 = document.getElementById("numcomanda")

    if (element1.value == '' || element1.value < 0) {
        alert("A comanda deve conter um número!")
    } else {

        let data = await registrovenda("insert", "", "venda", "");

        if (data) {
            for (i in data) {
                if (data[i] == 200) {
                    let numcmd = document.getElementById('numcomanda')

                    numcmd.disabled = true


                } else if (data.resposta == 1) {
                    alert("Ja existe uma comanda com este número!")
                }
            }
        }

        adccmdativas()

    }
}

async function cmdativas(op, filtro, tabela, id) {

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

async function adccmdativas() {

    let resultado = await cmdativas("select", "all", "venda", "");

    let tbody = document.getElementById('tbodycmd');

    tbody.innerHTML = ''

    let x = 1;

    for (i in resultado) {

        let cmd = resultado[i].numComanda
        let nome = resultado[i].nomeCliente

        
        let data_americana = resultado[i].data_emissao;
        let data_brasileira = data_americana.split('-').reverse().join('/');
        

        let data = data_brasileira
        let id = resultado[i].id

        estruturacmd(x, cmd, nome, data, id)

        x++

    }
}

adccmdativas()


async function registrovenda(op, filtro, tabela, id) {

    let ncmd = document.getElementById('numcomanda').value
    let ncliente = document.getElementById('nocliente').value
    let dataemiss = document.getElementById('dataemiss').innerText
    let select = document.getElementById('formpag')

    let idvenda = document.getElementById('hidvenda').value


    let formpag = select.options[select.selectedIndex].value;

    let rows = document.querySelectorAll("#tbodyitens tr");

    let tbody = document.getElementById('tbodyitens')

    cont = { "op": op, "filtro": filtro, "tabela": tabela, "id": id, "numcmd": ncmd, "ncliente": ncliente, "dataemiss": dataemiss, "formpag": formpag, "id_venda": idvenda }

    x = 1;

    rows.forEach(row => {

        let hidd = row.querySelector("input[type='hidden']").value
        let qntd = row.querySelector(".qnt").innerText

        if (hidd && qntd) {

            cont["valor" + x] = hidd

            cont["qnt" + x] = qntd

            x++
        }

    })

    data = await fetch("../php/vendas.php", {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'plain/text'
        },
        body: JSON.stringify(cont)
    })

    if (data) {
        return await data.json()
    } else {
        return "Deu ruim nas vendas"
    }
}





async function abrirprods() {
    let element = document.getElementById('fundopreto');
    element.style.display = 'flex'

    let resultado = await verprodutos();

    let prod = document.getElementById('tbody');

    prod.innerHTML = ''


    for (i in resultado) {

        let idprod = resultado[i].id_produto
        let nome = resultado[i].nome
        let valor = resultado[i].valor


        estruturaprod(idprod, nome, valor)

    }

    let salvar = document.getElementById('adcbut')

    salvar.addEventListener('click', function () {

        let valores = []

        let rows = document.querySelectorAll("#tbody tr");

        let tbody = document.getElementById('tbodyitens')

        rows.forEach(row => {

            let checkbox = row.querySelector("input[type='checkbox']");
            let qntd = row.querySelector("input[type='number']").value;
            let hidd = row.querySelector("input[type='hidden']").value
            let prod = row.querySelector("#nomeprod" + hidd)
            let valorprod = row.querySelector("#valorprod" + hidd).innerText


            let v1 = valorprod.replace(",", ".");
            let v2 = v1.substring(3);
            let valor1 = parseFloat(v2)
            let valor2 = parseFloat(qntd)
            let valorfinal = valor1 * valor2

            let subtotal = valorfinal.toFixed(2)
            let subtotal2 = subtotal.replace(".", ",")



            let tr = '<tr id="lineitem' + hidd + '"> </tr>'
            let icon1 = '<td class="tdicon" id="tdiconexc' + hidd + '"><i class="bi bi-trash exc" onclick="deletaritem(' + hidd + ')" ></i></td>'

            let icon2 = '<td class="tdicon" id="tdiconedit' + hidd + '"><i class="bi bi-pen edit" onclick= "editarqnt(' + hidd + ')"></i></i></td>'

            if (checkbox && qntd) {
                if ((checkbox.checked) && (qntd.value != 0 && qntd > 0)) {

                    let qnt = ' <td class="qnt" id="qntitem' + hidd + '">' + qntd + '</td> '
                    let nome = '<td onclick="abrirprod()" class="nomeprod" id="nomeitem' + hidd + '">' + prod.innerText + '</td>'
                    let valor = '<td class="valoritem" id="valoritem' + hidd + '">R$ ' + subtotal2 + '</td>'
                    let hidden = ' <input type="hidden" name="hidden' + hidd + '" id="' + hidd + '" value="' + hidd + '"> '

                    if (document.getElementById("lineitem" + hidd)) {

                        line = document.getElementById("lineitem" + hidd)
                        line.innerHTML = icon1 + icon2 + qnt + nome + valor + hidden

                    } else {
                        tbody.innerHTML += tr
                        line = document.getElementById("lineitem" + hidd)
                        line.innerHTML = icon1 + icon2 + qnt + nome + valor + hidden
                    }



                    valores.push(valorfinal)
                }
            }


        })

        cancelar()

        valorTotal()


    })

}

function editarSubTotal() {

}


function valorTotal() {

    let valores = [0]

    let rows = document.querySelectorAll("#tbodyitens tr");

    rows.forEach(row => {

        let valor = row.querySelector(".valoritem").innerText;

        let v1 = valor.substring(3);
        let v2 = v1.replace(",", ".")
        let v3 = parseFloat(v2)

        valores.push(v3)

    })

    let soma = valores.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);

    numeroFormatado = soma.toFixed(2)

    numeroFormatado2 = numeroFormatado.replace(".", ",")

    let element = document.getElementById('valorTotal')

    element.innerHTML = numeroFormatado2
}


function cancelar() {
    let element = document.getElementById('fundopreto');
    element.style.display = 'none'
    let tbody = document.getElementById('tbody');
    tbody.innerHTML = '<tbody id="tbody"> </tbody>'
}

async function verprodutos() {

    list = { "filtro": "all" }

    data = await fetch("../php/verproduto.php", {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
    })
    if (data) {
        return await data.json()
    }
}


function fecharprod() {
    let element = document.getElementById('fundopreto2');

    element.style.display = 'none';
}

function abrirprod() {

    let element = document.getElementById('fundopreto2');

    element.style.display = 'flex';
}


async function finalizar() {

    let formpag = document.getElementById('formpag').value
    let element = document.getElementById('numcomanda').value

    if (formpag != 0) {

        let result = await finalizarcmd(element);

        if (result.response == 200) {
            semcomanda()
            semcomanda()
            adccmdativas()
        } else if (result.response == 0) {
            alert("Erro no servidor")
        }
    } else {
        alert("Não é possível finalizar a comanda sem uma forma de pagamento")
    }


}

async function finalizarcmd(num) {

    list = { "finalizar": num }

    let data = await fetch("../php/vendas.php", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(list)
    })

    if (data) {
        return await data.json()
    }
}



async function visucmd(x) {

    let id = document.getElementById('hiddcmd' + x).value

    let result = await cmdativas("select", "one", "venda", id)

    let element11 = document.getElementById('numerocmd')

    criarcomd()

    if (result) {


        for (i in result) {

            let element1 = document.getElementById('numcomanda')
            let element2 = document.getElementById('nocliente')
            let element3 = document.getElementById('formpag')
            let element4 = document.getElementById('dataemiss')

            element1.value = result[i].numComanda

            document.getElementById('hidvenda').value = element1.value

            element2.value = result[i].nomeCliente

            element1.disabled = true

            let data_americana = result[i].data_emissao;
            let data_brasileira = data_americana.split('-').reverse().join('/');

            element4.innerText = data_brasileira

            element11.innerHTML = result[i].numComanda

            if (result[i].formaPagamento == "") {
                element3.value = "0"
            } else if (result[i].formaPagamento == "Débito") {
                element3.value = "1"
            } else if (result[i].formaPagamento == "Crédito") {
                element3.value = "2"
            } else if (result[i].formaPagamento == "Dinheiro") {
                element3.value = "3"
            } else if (result[i].formaPagamento == "Pix") {
                element3.value = "4"
            }



        }



    }

    let result2 = await cmdativas("select", "one", "venda_produto", id)

    if (result2) {

        for (i in result2) {

            let tbody = document.getElementById('tbodyitens');

            let tr = '<tr id="lineitem' + result2[i].id_produto + '"> </tr>'

            let icon1 = '<td class="tdicon" id="tdiconexc' + result2[i].id_produto + '"><i class="bi bi-trash exc" id="icondel' + result2[i].id_produto + '" onclick="deletaritem(' + result2[i].id_produto + ')"></i></td>'

            let icon2 = '<td class="tdicon" id="tdiconedit' + result2[i].id_produto + '"><i class="bi bi-pen edit" onclick= "editarqnt(' + result2[i].id_produto + ')"></i></i></td>'


            let qnt = ' <td class="qnt" id="qntitem' + result2[i].id_produto + '">' + result2[i].qntd + '</td> '
            let nome = '<td onclick="abrirprod()" class="nomeprod" id="nomeitem' + result2[i].id_produto + '">' + result2[i].nome + '</td>'

            let valorini = parseFloat(result2[i].valor)
            let valor1 = valorini * result2[i].qntd
            let valor2 = valor1.toFixed(2)
            let valor3 = valor2.replace(".", ",")

            let valor = '<td class="valoritem" id="valoritem' + result2[i].id_produto + '">R$ ' + valor3 + '</td>'
            let hidden = ' <input type="hidden" name="hidden' + result2[i].id_produto + '" id="' + result2[i].id_produto + '" value="' + result2[i].id_produto + '"> '

            tbody.innerHTML += tr
            line = document.getElementById("lineitem" + result2[i].id_produto)
            line.innerHTML = icon1 + icon2 + qnt + nome + valor + hidden
        }
    }



    valorTotal()
}

function deletaritem(id) {

    let trash = document.getElementById('tdiconexc' + id)

    let elementoPai = trash.parentNode;

    elementoPai.remove()

    valorTotal()
}

function editarqnt(id) {

    let element = document.getElementById('qntitem' + id)

    let element2 = document.getElementById('tdiconexc' + id)

    let element3 = document.getElementById('tdiconedit' + id)

    let elementos = document.querySelectorAll('.tdicon');

    let valorantigo = document.getElementById('qntitem' + id).innerText

    let valorItem = document.getElementById('valoritem' + id).innerHTML

    let v1 = valorItem.substring(3);
    let v2 = v1.replace(",", ".")
    let v3 = parseFloat(v2)

    let v4 = parseFloat(element.innerHTML)

    let valorProd = (v3 / v4)

    element.innerHTML = ' <input type="number" name="inpqnt' + id + '" id="inpqnt' + id + '"> '

    elementos.forEach(elemento => {

        elemento.style.visibility = 'hidden'
    });

    element2.innerHTML = ' <i class="bi bi-plus-circle-fill cancitem" onclick="cancelqnt(' + id + ',' + valorantigo + ')"></i> '

    element3.innerHTML = ' <i class="bi bi-check-circle-fill checkitem" onclick="setqnt(' + id + ',' + valorProd + ')"></i> '

    element2.style.visibility = 'visible'

    element3.style.visibility = 'visible'




}

function setqnt(id, valorProd) {

    let inp = document.getElementById('inpqnt' + id).value

    let element = document.getElementById('qntitem' + id)

    let valor = document.getElementById('valoritem' + id)

    let valorantigo = document.getElementById('valoritem' + id).innerHTML

    let qntantiga = document.getElementById('qntitem' + id).innerText

    let valorAtual = (valorProd * inp)

    let v1 = valorAtual.toFixed(2)
    let v2 = v1.replace(".", ",")

    valor.innerHTML = "R$ " + v2

    element.innerHTML = inp

    let element2 = document.getElementById('tdiconexc' + id)

    let element3 = document.getElementById('tdiconedit' + id)

    let elementos = document.querySelectorAll('.tdicon');

    element2.innerHTML = '<i class="bi bi-trash exc" id="icondel' + id + '" onclick="deletaritem(' + id + ')"></i>'

    element3.innerHTML = '<i class="bi bi-pen edit" onclick= "editarqnt(' + id + ')"></i>'

    elementos.forEach(elemento => {

        elemento.style.visibility = 'visible'
    });

    valorTotal()



}

function cancelqnt(id, valorantigo) {

    let element = document.getElementById('qntitem' + id)

    element.innerHTML = valorantigo

    let element2 = document.getElementById('tdiconexc' + id)

    let element3 = document.getElementById('tdiconedit' + id)

    let elementos = document.querySelectorAll('.tdicon');

    element2.innerHTML = '<i class="bi bi-trash exc" id="icondel' + id + '" onclick="deletaritem(' + id + ')"></i>'

    element3.innerHTML = '<i class="bi bi-pen edit" onclick= "editarqnt(' + id + ')"></i>'

    elementos.forEach(elemento => {

        elemento.style.visibility = 'visible'
    });

}


function numcmd() {
    let element = document.getElementById('numerocmd')
    let element2 = document.getElementById('numcomanda').value

    element.innerHTML = element2


}

function ativarbotao() {

    let but = document.getElementById('divtrash')

    but.onclick()
}


async function deletarcmd() {

    let numcmd = document.getElementById('numcomanda').value

    if (numcmd == '') {
        semcomanda()
    } else {

        if (confirm("Deseja mesmo sair?")) {

            list = { "op": "delete", "filtro": "one", "tabela": "venda", "id": numcmd }

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
    }
}


async function resDeletarCmd() {

    let response = await deletarcmd()

    if (response) {
        for (i in response) {
            if (response[i] == 200) {
                alert("Comanda deletada!")
                semcomanda()
                adccmdativas()
            }
        }
    }

}



async function filtrarcmd() {

    let filtro = document.getElementById('filtrocmd').value

    if (filtro != '' || filtro != false) {

        let response = await consultarcmd(filtro)

        if (response) {

            let tbody = document.getElementById('tbodycmd');

            tbody.innerHTML = ''

            let x = 1;

            for (i in response) {

                if (response.response == 'none') {

                    tbody.innerHTML = ''

                } else {

                    let cmd = response[i].numComanda
                    let nome = response[i].nomeCliente
                    let data = response[i].data_emissao
                    let id = response[i].id

                    estruturacmd(x, cmd, nome, data, id)

                    x++

                }
            }

        }
    } else {
        adccmdativas()
    }




}



async function consultarcmd(filtro) {

    let values = { "filtro": "uma comanda", "id": filtro }

    let data = await fetch("../php/vendas.php", {

        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
    })

    if (data) {
        return await data.json()
    }
}





async function consultarprod(id) {

    let values = { "filtro": "one", "id": id }

    let data = await fetch("../php/verproduto.php", {

        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
    })

    if (data) {
        return await data.json()
    }
}





async function filtrarprod() {

    let filtro = document.getElementById('filtroprod').value

    let prod = document.getElementById('tbody');

    if (filtro != '' || filtro != false) {

        let response = await consultarprod(filtro)

        if (response) {

            prod.innerHTML = ''

            for (i in response) {

                if (response.response == 'none') {

                    prod.innerHTML = ''

                } else {

                    let idprod = response[i].id_produto
                    let nome = response[i].nome
                    let valor = response[i].valor


                    estruturaprod(idprod, nome, valor)

                }
            }

        }
    } else {

        prod.innerHTML = ''

        abrirprods()
    }




}



function estruturaprod(idprod, nomeprod, valorprod) {

    let prod = document.getElementById('tbody');

    prod.innerHTML += '<tr class="tritem" id="linha' + (idprod) + '"></tr>'

    let tr = document.getElementById('linha' + idprod)

    let check = '<td class="check"> <input type="checkbox" name="" id="check' + idprod + '" > </td>'

    let id = '<td class="id"> ' + idprod + ' </td>'

    let nome = '<td class="prod" id="nomeprod' + idprod + '"> ' + nomeprod + ' </td>'

    let valorini = parseFloat(valorprod)
    let valor2 = valorini.toFixed(2)
    let valor3 = valor2.replace(".", ",")

    let valor = '<td class="valor" id="valorprod' + idprod + '">R$ ' + valor3 + '</td>'



    let qnt = '<td class="qntd"> <input type="number" name="qnt' + idprod + '" id="qnt' + idprod + '" min="1"> </td>'

    let hidd = ' <input type="hidden" name="hidden' + idprod + '" id="hidd' + idprod + '" value="' + idprod + '"> '

    tr.innerHTML += check + id + nome + valor + qnt + hidd;


}


function estruturacmd(x, cmd, nome, data, id) {

    let tbody = document.getElementById('tbodycmd');

    tbody.innerHTML += '<tr id="trcmd' + x + '" onclick="visucmd(' + x + ')"> </tr>'

    let tr = document.getElementById('trcmd' + x)

    let ncmd = '<td id="numcmd' + x + '"> ' + cmd + '  </td>'

    let ncliente = '<td id="nocmd' + x + '">' + nome + '</td>'

    let dataemiss = '<td id="datacmd' + x + '">' + data + '</td>'

    let hidd = '<input type="hidden" name="hiddcmd' + x + '" id="hiddcmd' + x + '" value="' + id + '">'

    tr.innerHTML += ncmd + ncliente + dataemiss + hidd
}