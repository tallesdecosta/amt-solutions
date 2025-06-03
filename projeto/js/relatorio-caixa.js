async function pesquisar() {

    
    res = await fetch(`../php/api/dfc.php?inicio=${document.getElementById('inicio').value}&fim=${document.getElementById('fim').value}`, {
        method: "GET"
    });

    return await res.json();

}

async function pesquisarDespesa() {

    
  res = await fetch(`../php/api/despesa.php?inicio=${document.getElementById('inicio').value}&fim=${document.getElementById('fim').value}`, {
        method: "GET"
    });

    return await res.json();

}

 async function mostrarDfc() {

    tbody = document.getElementById('report-body');
    data = await pesquisar();

    // limpar tbody.
    tbody.innerHTML=''; 

    caixa = []
    vendas = []
      
    // separar as entradas em entrada d caixa e vendas.
    for (entrada in data.entradas.detalhes) 
    {

        if (data.entradas.detalhes[entrada].origem == "caixa") {

            caixa.push(data.entradas.detalhes[entrada]);
                

        }  else {

            vendas.push(data.entradas.detalhes[entrada]);

        }


    }

    headerVendas = document.createElement("tr");
    titleVendas = document.createElement("th");
    titleVendas.textContent = "Venda de produtos"
    headerVendas.appendChild(titleVendas);
    tbody.appendChild(headerVendas);

    for (entrada in vendas) 
    {

        linha = document.createElement('tr');
        valor = parseFloat(vendas[entrada].valor);

        titulo = document.createElement('td'); 
        titulo.textContent = 'Venda';
        tipo = document.createElement('td'); 
        tipo.textContent = 'Entrada (+)';
        valorText = document.createElement('td'); 

        valorText.textContent = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '');

        linha.appendChild(titulo);
        linha.appendChild(tipo);
        linha.appendChild(valorText);
        document.getElementById('report-body').appendChild(linha);


    }

    headerCaixa = document.createElement("tr");
    titleCaixa = document.createElement("th");
    titleCaixa.textContent = "Entrada de caixa";
    headerCaixa.appendChild(titleCaixa);
    tbody.appendChild(headerCaixa);

    
    for (entrada in caixa) 
    {

        linha = document.createElement('tr');
        valor = parseFloat(caixa[entrada].valor);

        titulo = document.createElement('td'); 
        titulo.textContent = 'Entrada de caixa';
        tipo = document.createElement('td'); 
        tipo.textContent = 'Entrada (+)';
        valorText = document.createElement('td'); 

        valorText.textContent = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '');

        linha.appendChild(titulo);
        linha.appendChild(tipo);
        linha.appendChild(valorText);
        document.getElementById('report-body').appendChild(linha);


    }
      
      mostrarDespesa();


  }


 

  async function mostrarDespesa() {

    data = await pesquisarDespesa();

    tbody = document.getElementById('report-body');

    headerDespesas = document.createElement("tr");
    titleDespesas = document.createElement("th");
    titleDespesas.textContent = "Despesas"
    headerDespesas.appendChild(titleDespesas);
    tbody.appendChild(headerDespesas);
      

      for (i in data) {

            linha = document.createElement('tr');
            valor = 0;


            

            titulo = document.createElement('td'); 
            titulo.textContent = data[i].descritivo;
            tipo = document.createElement('td'); 
            tipo.textContent = "Saída (-)";
            valor = document.createElement('td'); 
            valor.textContent = parseFloat(data[i].valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '');
            linha.appendChild(titulo)
            linha.appendChild(tipo)
            linha.appendChild(valor)
            document.getElementById('report-body').appendChild(linha);

          
    }
  }

async function pesquisarSalvo(id) {

    
    res = await fetch(`../php/api/dfc.php?inicio=${document.getElementById(id).getAttribute("data-inicio")}&fim=${document.getElementById(id).getAttribute('data-fim')}`, {
        method: "GET"
    });

    return await res.json();

}

async function mostrarDfcSalvo(id) {

    data = await pesquisarSalvo(id);


    
    tbody = document.getElementById('report-body');

    // limpar tbody.
    tbody.innerHTML=''; 

    caixa = []
    vendas = []
      
    // separar as entradas em entrada d caixa e vendas.
    for (entrada in data.entradas.detalhes) 
    {

        if (data.entradas.detalhes[entrada].origem == "caixa") {

            caixa.push(data.entradas.detalhes[entrada]);
                

        }  else {

            vendas.push(data.entradas.detalhes[entrada]);

        }


    }

    headerVendas = document.createElement("tr");
    titleVendas = document.createElement("th");
    titleVendas.textContent = "Venda de produtos"
    headerVendas.appendChild(titleVendas);
    tbody.appendChild(headerVendas);

    for (entrada in vendas) 
    {

        linha = document.createElement('tr');
        valor = parseFloat(vendas[entrada].valor);

        titulo = document.createElement('td'); 
        titulo.textContent = 'Venda';
        tipo = document.createElement('td'); 
        tipo.textContent = 'Entrada (+)';
        valorText = document.createElement('td'); 

        valorText.textContent = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '');

        linha.appendChild(titulo);
        linha.appendChild(tipo);
        linha.appendChild(valorText);
        document.getElementById('report-body').appendChild(linha);


    }

    headerCaixa = document.createElement("tr");
    titleCaixa = document.createElement("th");
    titleCaixa.textContent = "Entrada de caixa";
    headerCaixa.appendChild(titleCaixa);
    tbody.appendChild(headerCaixa);

    
    for (entrada in caixa) 
    {

        linha = document.createElement('tr');
        valor = parseFloat(caixa[entrada].valor);

        titulo = document.createElement('td'); 
        titulo.textContent = 'Entrada de caixa';
        tipo = document.createElement('td'); 
        tipo.textContent = 'Entrada (+)';
        valorText = document.createElement('td'); 

        valorText.textContent = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '');

        linha.appendChild(titulo);
        linha.appendChild(tipo);
        linha.appendChild(valorText);
        document.getElementById('report-body').appendChild(linha);


    }
      
      mostrarDespesa();


  }

    




async function getDfcs() {

    res = await fetch("../php/api/dfcSalvo.php", {
        method: "GET"
    });

    if (res.redirected) {
    window.location.href = res.url;
    return;
  }

    data = await res.json();
    

    for (i in data) {

        wrapper = document.getElementById('saved-reports');

        div = document.createElement('div');

        btn = document.createElement('button');
        btnDelete = document.createElement('button');
        btn.style.borderRadius = '10px';
        btn.style.padding = '4px';
        btnDelete.setAttribute("id", data[i].id_dfc);
        btnDelete.textContent = '- Apagar';
        btnDelete.style.backgroundColor = "red";
        btnDelete.style.color = "white";
        btnDelete.style.fontWeight = "bold";
        btnDelete.style.border = "1px solid red";
        btnDelete.style.padding = "4px";
        btnDelete.style.borderRadius = '10px';
        btn.textContent = data[i].titulo;
        btn.setAttribute("data-inicio", data[i].dataInicio);
        btn.setAttribute("data-fim", data[i].dataFinal);
        btn.setAttribute("id", data[i].id_dfc);
        btn.style.marginRight = "10px";


        div.appendChild(btn);
        div.appendChild(btnDelete);

        btn.addEventListener('click', function() {
            mostrarDfcSalvo(this.id);
            document.getElementById('inicio').value = this.getAttribute("data-inicio")
            document.getElementById('fim').value = this.getAttribute("data-fim")
          });

          btnDelete.addEventListener('click', function() {
            deletarDfcSalvo(this.id);
          });

        wrapper.appendChild(div);


    }
    
}

async function saveDfc() {

    body = new URLSearchParams();
    body.append("titulo", prompt("Insira o título do DFC a ser salvo."))
    body.append("data-fim", document.getElementById('fim').value)
    body.append("data-inicio", document.getElementById('inicio').value)
    
    res = await fetch("../php/api/dfc.php", {

        method: "POST",
        credentials: "include",
        body: body

    });

    data = await res.json();

    if (data.status == 'ok') {

        location.reload();
    } else {

        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.",1)
    }



}

async function deletarDfcSalvo(id) {


    res = await fetch(`../php/api/dfc.php?id=${id}`,{ 
        method: "DELETE"
    }
    )

    data = await res.json();

    if (data.status == 'ok') {

        location.reload();
    } else {

        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.",1)
    }
    
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

