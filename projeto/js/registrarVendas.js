// Função para limpar os campos da comanda

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
    let element12 = document.getElementById('dataemiss')

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
    element11.innerHTML = ''
    element12.innerHTML = ''

    element7.style.opacity = '0.7'


}

semcomanda();


// Botão para criar nova comanada

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
    let element12 = document.getElementById('dataemiss')

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
    element12.innerHTML = ''

    element7.style.opacity = '1'
}

// Botao para salvar a comanda chamando o (registrovenda)

async function salvarcmd() {

    let campo = document.getElementById("numcomanda")
    let element1 = document.getElementById("numcomanda").value
    let element2 = document.getElementById("hidvenda")
    let element3 = document.getElementById("dataemiss")

    if (element1 == '' || element1 == false || element1 < 0) {
        campo.setCustomValidity("Para prosseguir insira o nº da comanda")
        campo.reportValidity()
        return;

    } else {

        let data = await registrovenda("insert", "", "venda", "");

        if (data) {

            if (data.erro) {
                console.log("Erro: " + data.erro)
                alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
            } else {

                for (i in data) {

                    if (data.resposta == 200) {

                        if (data.first == true) {

                            let numcmd = document.getElementById('numcomanda')

                            numcmd.disabled = true

                            element2.value = element1

                            element3.innerText = data.hora

                            console.log(data.hora)

                            startProgressBar()
                        } else {

                            let numcmd = document.getElementById('numcomanda')

                            numcmd.disabled = true

                            element2.value = element1

                            startProgressBar()

                        }

                    } else if (data.resposta == 1) {
                        campo.setCustomValidity("Já existe uma comanda com este número")
                        campo.reportValidity()
                        return;
                    }
                }
            }
        }

        adccmdativas()

    }
}

// ============     Função async para conectar com o vendas ==============

async function cmdativas(op, filtro, tabela, id) {

    try {

        list = { "op": op, "filtro": filtro, "tabela": tabela, "id": id }

        let data = await fetch("../php/vendas.php", {
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

// Função para adcionar comanda ativas na listinha do lado


async function adccmdativas() {

    let resultado = await cmdativas("select", "all", "venda", "");

    let tbody = document.getElementById('tbodycmd');

    tbody.innerHTML = ''

    let x = 1;

    if (resultado) {

        if (resultado.erro) {
            console.log("Erro :" + resultado.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)

        } else {

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
    }




}

adccmdativas()


// Função async que registra a venda e os produtos quando salva

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


    try {

        data = await fetch("../php/vendas.php", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'plain/text'
            },
            body: JSON.stringify(cont)
        })
        if (!data.ok) {

            throw new Error(`HTTP error! status: ${data.status}`);
        } else {


            if (data) {
                return await data.json()
            }
        }
    } catch (erro) {
        console.log("Erro ao buscar API: " + erro)
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }


}



// Função que abre o popup para adicionar os produtos na comanda

async function abrirprods() {
    let element = document.getElementById('fundopreto');
    element.style.display = 'flex'

    let resultado = await verprodutos();

    let prod = document.getElementById('tbody');

    prod.innerHTML = ''

    if (resultado) {

        if (resultado.erro) {
            console.log(resultado.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        } else {
            for (i in resultado) {

                let idprod = resultado[i].id_produto
                let nome = resultado[i].nome
                let valor = resultado[i].valor


                estruturaprod(idprod, nome, valor)

            }
        }
    }

    let salvar = document.getElementById('adcbut')

    salvar.addEventListener('click', function () {

        let valores = []

        let rows = document.querySelectorAll("#tbody tr");

        let tbody = document.getElementById('tbodyitens')

        rows.forEach(row => {

            let checkbox = row.querySelector("input[type='checkbox']");
            let qntd = row.querySelector("input[type='number']").value;
            let id = row.querySelector("input[type='hidden']").value
            let prod = row.querySelector("#nomeprod" + id)
            let valorprod = row.querySelector("#valorprod" + id).innerText


            let v1 = valorprod.replace(",", ".");
            let v2 = v1.substring(3);
            let valor1 = parseFloat(v2)
            let valor2 = parseFloat(qntd)
            let valorfinal = valor1 * valor2

            let subtotal = valorfinal.toFixed(2)
            let subtotal2 = subtotal.replace(".", ",")



            let tr = '<tr id="lineitem' + id + '"> </tr>'
            let icon1 = '<td class="tdicon" id="tdiconexc' + id + '"><i class="bi bi-trash exc" onclick="deletaritem(' + id + ')" ></i></td>'

            let icon2 = '<td class="tdicon" id="tdiconedit' + id + '"><i class="bi bi-pen edit" onclick= "editarqnt(' + id + ')"></i></i></td>'

            if (checkbox && qntd) {
                if ((checkbox.checked) && (qntd.value != 0 && qntd > 0)) {

                    let qnt = ' <td class="qnt" id="qntitem' + id + '">' + qntd + '</td> '
                    let nome = '<td onclick="abrirprod(' + id + ')" class="nomeprod" id="nomeitem' + id + '">' + prod.innerText + '</td>'
                    let valor = '<td class="valoritem" id="valoritem' + id + '">R$ ' + subtotal2 + '</td>'
                    let hidden = ' <input type="hidden" name="hidden' + id + '" id="' + id + '" value="' + id + '"> '

                    if (document.getElementById("lineitem" + id)) {

                        line = document.getElementById("lineitem" + id)
                        line.innerHTML = icon1 + icon2 + qnt + nome + valor + hidden

                    } else {
                        tbody.innerHTML += tr
                        line = document.getElementById("lineitem" + id)
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

// Função que calcula o valor total da comanda

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

// Botão cancelar que fecha o popup dos produtos

function cancelar() {
    let element = document.getElementById('fundopreto');
    element.style.display = 'none'
    let tbody = document.getElementById('tbody');
    tbody.innerHTML = '<tbody id="tbody"> </tbody>'
}

// Função async que retorna os produtos

async function verprodutos() {


    try {
        list = { "filtro": "all" }

        data = await fetch("../php/verproduto.php", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(list)
        })
        if (!data.ok) {

            throw new Error(`HTTP error! status: ${data.status}`);
        } else {

            if (data) {
                return await data.json()
            }
        }
    } catch (erro) {
        console.log("Erro ao buscar API: " + erro)
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }


}

// Função que fecha o popup de visualizar produto da comanda

function fecharprod() {
    let element = document.getElementById('fundopreto2');

    element.style.display = 'none';
}

// Função para abrir o popup de visualizar produto da comanda

async function abrirprod(id) {

    let element = document.getElementById('fundopreto2');

    element.style.display = 'flex';

    let element1 = document.getElementById('nomedoprod')
    let element2 = document.getElementById('classprod')
    let element3 = document.getElementById('ingredientesprod')
    let element4 = document.getElementById('alergiasprod')

    element1.innerHTML = ''
    element2.innerHTML = ''
    element3.innerHTML = ''
    element4.innerHTML = ''


    response = await retornarProd("produto", id)

    if (response) {

        if (response.erro) {
            console.log("Erro: " + reponse.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        } else {

            for (i in response) {
                element1.innerHTML = '<p class="p2" id="nomedoprod">' + response[i].nome + '</p>'
                element2.innerHTML = '<p class="p2">' + response[i].categoria + '</p>'
            }
        }
    }

    response = await retornarProd("alergia", id)

    if (response) {

        if (response.erro) {
            console.log("Erro: " + reponse.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        } else {

            for (i in response) {
                element4.innerHTML += '<p>* Contém ' + response[i].alergia + '</p>'

            }
        }
    }

    response = await retornarProd("insumo", id)

    if (response) {

        if (response.erro) {
            console.log("Erro: " + reponse.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        } else {

            for (i in response) {
                element3.innerHTML += '<p>* ' + response[i].nome + '</p>'

            }
        }
    }


}

// Função async para retornar o produto clicado e alergias

async function retornarProd(filtro, id) {


    try {
        list = { "filtro": filtro, "id": id }

        data = await fetch("../php/verproduto.php", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(list)
        })
        if (!data.ok) {

            throw new Error(`HTTP error! status: ${data.status}`);
        } else {
            if (data) {
                return await data.json()
            }
        }
    } catch (erro) {
        console.log("Erro ao buscar API: " + erro)
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }




}

// Função do botao para finalizar a comanda


async function finalizar() {

    let formpag = document.getElementById('formpag').value
    let element = document.getElementById('numcomanda').value
    let valor = document.getElementById('valorTotal').innerText

    let campo = document.getElementById('formpag')


    let valor1 = valor.replace(",", ".")
    let valor2 = parseFloat(valor1)

    if (formpag != 0) {

        let result = await finalizarcmd(element, formpag, valor2);

        if (result.erro) {
            console.log("Erro: " + result.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        } else {
            semcomanda()
            adccmdativas()
            startProgressBar()
        }
    } else {
        campo.setCustomValidity('Para prosseguir selecione a forma de pagamento.')
        campo.reportValidity();
    }


}

// Função async que finaliza a comanda

async function finalizarcmd(num, forma, valor) {


    try {

        list = { "finalizar": num, "formpag": forma, "valor": valor }

        let data = await fetch("../php/vendas.php", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(list)
        })

        if (!data.ok) {

            throw new Error(`HTTP error! status: ${data.status}`);
        } else {

            if (data) {
                return await data.json()
            }
        }
    } catch (erro) {
        console.log("Erro ao buscar API: " + erro)
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }




}

// Função quando clica na comanda do lado aparecer os dados na comanda principal

async function visucmd(x) {

    let id = document.getElementById('hiddcmd' + x).value

    let result = await cmdativas("select", "one", "venda", id)

    let element11 = document.getElementById('numerocmd')

    criarcomd()

    if (result) {

        if (result.erro) {
            console.log("Erro :" + result.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        } else {

            for (i in result) {

                let element1 = document.getElementById('numcomanda')
                let element2 = document.getElementById('nocliente')
                let element3 = document.getElementById('formpag')
                let element4 = document.getElementById('dataemiss')

                element1.value = result[i].numComanda

                document.getElementById('hidvenda').value = element1.value

                element2.value = result[i].nomeCliente

                element1.disabled = true

                // let data_americana = result[i].data_emissao;
                // let data_brasileira = data_americana.split('-').reverse().join('/');

                element4.innerText = result[i].data_emissao

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





    }

    let result2 = await cmdativas("select", "one", "venda_produto", id)

    if (result2) {

        if (result2.erro) {
            console.log("Erro :" + result2.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        } else {

            for (i in result2) {

                let tbody = document.getElementById('tbodyitens');

                let tr = '<tr id="lineitem' + result2[i].id_produto + '"> </tr>'

                let icon1 = '<td class="tdicon" id="tdiconexc' + result2[i].id_produto + '"><i class="bi bi-trash exc" id="icondel' + result2[i].id_produto + '" onclick="deletaritem(' + result2[i].id_produto + ')"></i></td>'

                let icon2 = '<td class="tdicon" id="tdiconedit' + result2[i].id_produto + '"><i class="bi bi-pen edit" onclick= "editarqnt(' + result2[i].id_produto + ')"></i></i></td>'


                let qnt = ' <td class="qnt" id="qntitem' + result2[i].id_produto + '">' + result2[i].qntd + '</td> '
                let nome = '<td onclick="abrirprod(' + result2[i].id_produto + ')" class="nomeprod" id="nomeitem' + result2[i].id_produto + '">' + result2[i].nome + '</td>'

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
    }



    valorTotal()
}

// Função para deletar item da lista da comanda

function deletaritem(id) {

    alerta(2, 2, "Tem excluir que deseja deletar este item?", 2)

    document.getElementById("confirmAlerta").addEventListener("click", () => {

        let trash = document.getElementById('tdiconexc' + id)

        let alerta = document.getElementById('alertaPadrão')

        alerta.style.display = 'none'

        let elementoPai = trash.parentNode;

        elementoPai.remove()

        valorTotal()
    })



}

// Função para editar a quantidade dos itens

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

    element.innerHTML = ' <input type="number" name="inpqnt' + id + '" id="inpqnt' + id + '" required> '

    elementos.forEach(elemento => {

        elemento.style.visibility = 'hidden'
    });

    element2.innerHTML = ' <i class="bi bi-plus-circle-fill cancitem" onclick="cancelqnt(' + id + ',' + valorantigo + ')"></i> '

    element3.innerHTML = ' <i class="bi bi-check-circle-fill checkitem" onclick="setqnt(' + id + ',' + valorProd + ')"></i> '

    element2.style.visibility = 'visible'

    element3.style.visibility = 'visible'



    let item1 = document.getElementById('nocliente')
    let item2 = document.getElementById('formpag')
    let item3 = document.getElementById('btnsalvar1')
    let item4 = document.getElementById('btnsalvar2')
    let item5 = document.getElementById('butadc')
    let item6 = document.getElementById('divtrash')
    let item7 = document.getElementById('criarcmd')

    item1.disabled = true
    item2.disabled = true
    item3.disabled = true
    item4.disabled = true
    item5.disabled = true
    item6.disabled = true
    item7.disabled = true
    item7.style.opacity = '50%'

}

// Função para alterar o subtotal e o valortotal qnd edita a quantidade do item

function setqnt(id, valorProd) {

    let inp = document.getElementById('inpqnt' + id).value

    let campo = document.getElementById('inpqnt' + id)

    let element = document.getElementById('qntitem' + id)

    let valor = document.getElementById('valoritem' + id)

    if ((inp != 'e') && (inp > 0) && (inp != null || inp != '')) {

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

        let item1 = document.getElementById('nocliente')
        let item2 = document.getElementById('formpag')
        let item3 = document.getElementById('btnsalvar1')
        let item4 = document.getElementById('btnsalvar2')
        let item5 = document.getElementById('butadc')
        let item6 = document.getElementById('divtrash')
        let item7 = document.getElementById('criarcmd')

        item1.disabled = false
        item2.disabled = false
        item3.disabled = false
        item4.disabled = false
        item5.disabled = false
        item6.disabled = false
        item7.disabled = false
        item7.style.opacity = '100%'

        valorTotal()

    } else {
        campo.setCustomValidity("Este campo precisa ser preenchido com um número positivo.")
        campo.reportValidity()
    }
}

// funcão quando clica para cancelar a edição de quantidade de itens

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

    let item1 = document.getElementById('nocliente')
    let item2 = document.getElementById('formpag')
    let item3 = document.getElementById('btnsalvar1')
    let item4 = document.getElementById('btnsalvar2')
    let item5 = document.getElementById('butadc')
    let item6 = document.getElementById('divtrash')
    let item7 = document.getElementById('criarcmd')

    item1.disabled = false
    item2.disabled = false
    item3.disabled = false
    item4.disabled = false
    item5.disabled = false
    item6.disabled = false
    item7.disabled = false
    item7.style.opacity = '100%'

}


// Função para mudar o numero da comanda 

function numcmd() {
    let element = document.getElementById('numerocmd')
    let element2 = document.getElementById('numcomanda').value

    element.innerHTML = element2


}

// Função para deletar a comanda


async function deletarcmd(num) {


    try {

        list = { "op": "delete", "filtro": "one", "tabela": "venda", "id": num }

        let data = await fetch("../php/vendas.php", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(list)
        })

        if (!data.ok) {

            throw new Error(`HTTP error! status: ${data.status}`);
        } else {
            if (data) {
                return await data.json()
            }
        }
    } catch (erro) {
        console.log("Erro ao buscar API: " + erro)
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }


}

// Função async para deletar a comanda

async function resDeletarCmd() {

    let numcmd = document.getElementById('numcomanda').value

    if (numcmd == '') {
        semcomanda()

    } else {

        alerta(2, 2, "Tem certeza que deseja deletar esta comanda?", 2)

        let confirm = document.getElementById('confirmAlerta')

        confirm.addEventListener("click", async () => {

            let response = await deletarcmd(numcmd)

            if (response) {

                if (response.erro) {
                    console.log("Erro :" + response.erro)
                    alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)

                } else {
                    for (i in response) {

                        if (response[i] == 200) {

                            let alerta = document.getElementById('alertaPadrão')

                            alerta.style.display = 'none'

                            semcomanda()
                            adccmdativas()
                            startProgressBar()
                        }
                    }
                }
            }
        })

    }

}

// Função para filtrar comandas na listinha do lado

async function filtrarcmd() {

    let filtro = document.getElementById('filtrocmd').value

    if (filtro != '' || filtro != false) {

        let response = await consultarcmd(filtro)

        if (response) {

            if (response.erro) {
                console.log("Erro :" + response.erro)
                alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
            } else {
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



        }
    } else {
        adccmdativas()
    }




}

// Função async para retornar a comanda filtrada

async function consultarcmd(filtro) {


    try {
        let values = { "filtro": "uma comanda", "id": filtro }

        let data = await fetch("../php/vendas.php", {

            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        })
        if (!data.ok) {

            throw new Error(`HTTP error! status: ${data.status}`);
        } else {
            if (data) {
                return await data.json()
            }
        }
    } catch (erro) {
        console.log("Erro ao buscar API: " + erro)
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }

}



// Função para ver filtrar o produto no popup de adcionar produtos

async function consultarprod(id) {

    try {
        let values = { "filtro": "one", "id": id }

        let data = await fetch("../php/verproduto.php", {

            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        })
        if (!data.ok) {

            throw new Error(`HTTP error! status: ${data.status}`);
        } else {
            if (data) {
                return await data.json()
            }
        }
    } catch (erro) {
        console.log("Erro ao buscar API: " + erro)
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }




}



// Função asyn que retorna o produto filtrado

async function filtrarprod() {

    let filtro = document.getElementById('filtroprod').value

    let prod = document.getElementById('tbody');

    if (filtro != '' || filtro != false) {

        let response = await consultarprod(filtro)

        if (response.erro) {
            console.log("Erro :" + response.erro)
            alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        } else {
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
        }


    } else {

        prod.innerHTML = ''

        abrirprods()
    }




}

// Função com a estrutura da tabela de produtos do popup

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

// Função com a estrutura da listinha de comandas ativas

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





















// Função para iniciar a animação da barra de progresso
function startProgressBar() {

    let progressBar = document.getElementById("progressBarFilled");
    // let fecha = document.getElementById("fechaCard");
    let card = document.getElementById('fundoCard')

    card.style.display = 'flex'

    width = 0;
    let duration = 4; // Duração em segundos
    let interval = 100; // Intervalo de atualização em milissegundos

    let increment = (100 / (duration * 1000 / interval)); // Incremento por intervalo

    let intervalId = setInterval(() => {
        width += increment;
        progressBar.style.width = width + "%";

        if (width >= 100) {
            clearInterval(intervalId);

            card.style.display = 'none'
        }
    }, interval);

    card.addEventListener("click", () => {
        card.style.display = 'none'
    })
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