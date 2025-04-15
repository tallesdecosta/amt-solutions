function semcomanda() {
    let element1 = document.getElementById('numcomanda')
    let element2 = document.getElementById('nocliente')
    let element3 = document.getElementById('formpag')
    let element4 = document.getElementById('btnsalvar1')
    let element5 = document.getElementById('btnsalvar2')
    let element6 = document.getElementById('adc1')
    let element7 = document.getElementById('fundovendas')

    element1.disabled = true
    element2.disabled = true
    element3.disabled = true
    element4.disabled = true
    element5.disabled = true

    element6.onclick = null

    element7.style.opacity = '0.7'
}

semcomanda();

function criarcomd() {
    let element1 = document.getElementById('numcomanda')
    let element2 = document.getElementById('nocliente')
    let element3 = document.getElementById('formpag')
    let element4 = document.getElementById('btnsalvar1')
    let element5 = document.getElementById('btnsalvar2')
    let element6 = document.getElementById('adc1')
    let element7 = document.getElementById('fundovendas')

    element1.disabled = false
    element2.disabled = false
    element3.disabled = false
    element4.disabled = false
    element5.disabled = false

    element1.value = ''
    element2.value = ''
    element3.value = ''

    element7.style.opacity = '1'



    element6.addEventListener("click", function () {
        abrirprods()
    })
}



async function salvarcmd() {
    let element1 = document.getElementById("numcomanda")

    if (element1.value == '' || element1.value == false) {
        alert("A comanda deve conter um número!")
    } else {
        await registrovenda();


    }
}

async function cmdativas() {
    data1 = await fetch("../php/vendas.php", {
        method: "GET",
        credentials: "include",
    })

    if(data1){
        return JSON.stringify(data1)
    }else{
        return "Deu ruim no comandas ativas js"
    }
}

async function adccmdativas() {

    let resultado = await cmdativas();

    let tbody = document.getElementById('tbodycmd');

    let x = 1;

    for (i in resultado) {

        tbody.innerHTML += '<tr id="trcmd'+ x +'" onclick="abrircmd('+ resultado[i].id +')"> </tr>'

        let tr = document.getElementById('trcmd'+x)

        let ncmd = '<td id="numcmd'+ x +'"> ' + resultado[i].numComanda + '  </td>'

        let ncliente = '<td id="nocmd'+ x +'">'+ resultado[i].nomeCliente +'</td>'

        let dataemiss = '<td id="datacmd'+ x +'">'+ resultado[i].data_emissao +'</td>'

        tr.innerHTML += ncmd + ncliente + dataemiss

        x++
    }
}


adccmdativas()

async function registrovenda() {

    let ncmd = document.getElementById('numcomanda').value
    let ncliente = document.getElementById('nocliente').value
    let dataemiss = document.getElementById('dataemiss').innerText
    let select = document.getElementById('formpag')
    let formpag = select.options[select.selectedIndex].value;

    const rows = document.querySelectorAll("#tbodyitens tr");

    let tbody = document.getElementById('tbodyitens')

    cont = { "numcmd": ncmd , "ncliente": ncliente, "dataemiss": dataemiss, "formpag": formpag  }

    x = 1;

    rows.forEach(row => {

        let hidd = row.querySelector("input[type='hidden']").value
        let qntd = 1

        if (hidd && qntd) {

            cont["valor"+x] = hidd

            cont["qnt"+x] = qntd
            
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
        return await data
    }else{
        return "Deu ruim nas vendas"
    }
}





async function abrirprods() {
    let element = document.getElementById('fundopreto');
    element.style.display = 'flex'

    let resultado = await verprodutos();

    let prod = document.getElementById('tbody');


    for (i in resultado) {

        prod.innerHTML += '<tr class="tritem" id="linha' + (resultado[i].id_produto) + '"></tr>'

        let tr = document.getElementById('linha' + resultado[i].id_produto)

        let check = '<td class="check"> <input type="checkbox" name="" id="check' + resultado[i].id_produto + '" > </td>'

        let id = '<td class="id"> ' + resultado[i].id_produto + ' </td>'

        let nome = '<td class="prod" id="nomeprod' + resultado[i].id_produto + '"> ' + resultado[i].nome + ' </td>'

        let qnt = '<td class="qntd"> <input type="number" name="qnt' + resultado[i].id_produto + '" id="qnt' + resultado[i].id_produto + '" min="1"> </td>'

        let hidd = ' <input type="hidden" name="hidden' + resultado[i].id_produto + '" id="hidd' + resultado[i].id_produto + '" value="' + resultado[i].id_produto + '"> '

        tr.innerHTML += check + id + nome + qnt + hidd;

    }

    let salvar = document.getElementById('adcbut')

    salvar.addEventListener('click', function () {


        const rows = document.querySelectorAll("#tbody tr");

        let tbody = document.getElementById('tbodyitens')

        rows.forEach(row => {
            let checkbox = row.querySelector("input[type='checkbox']");
            let qntd = row.querySelector("input[type='number']");
            let hidd = row.querySelector("input[type='hidden']").value
            let prod = row.querySelector("#nomeprod" + hidd)

            let tr = '<tr id="lineitem' + hidd + '"> </tr>'
            let icon1 = '<td class="tdicon" id="tdiconexc' + hidd + '"><i class="bi bi-trash exc"></i></td>'
            let icon2 = '<td class="tdicon" id="tdiconedit' + hidd + '"><i class="bi bi-pen edit"></i></i></td>'

            if (checkbox && qntd) {
                if ((checkbox.checked) && (qntd.value != 0 && qntd.value > 0)) {

                    let qnt = ' <td class="qnt" id="qntitem' + hidd + '">' + qntd.value + '</td> '
                    let nome = '<td onclick="abrirprod()" class="nomeprod" id="nomeitem' + hidd + '">' + prod.innerText + '</td>'
                    let valor = '<td id="valoritem' + hidd + '">R$ 24,90</td>'
                    let hidden = ' <input type="hidden" name="hidden' + hidd + '" id="' + hidd + '" value="' + hidd + '"> '

                    tbody.innerHTML += tr
                    porra = document.getElementById("lineitem" + hidd)
                    porra.innerHTML = icon1 + icon2 + qnt + nome + valor + hidden


                }
            }

            cancelar()

        })

    })

}



function cancelar() {
    let element = document.getElementById('fundopreto');
    element.style.display = 'none'
    let tbody = document.getElementById('tbody');
    tbody.innerHTML = '<tbody id="tbody"> </tbody>'
}

async function verprodutos() {
    data = await fetch("../php/verproduto.php", {
        method: "POST",
        credentials: "include"
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