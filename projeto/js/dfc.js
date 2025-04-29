

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

    data = await pesquisar();


    while (document.getElementById('report-wrapper').firstChild && document.getElementById('report-wrapper').childElementCount != 1) {

        document.getElementById('report-wrapper').removeChild(document.getElementById('report-wrapper').lastChild);

    }

    linha = document.createElement('div');
    valor = 0;

    for (item in data) {
        
        valor += parseFloat(data[item].total_valor);
        console.log(data[item].total_valor);

    }

    titulo = document.createElement('p'); 
    titulo.textContent = 'Recebimento de clientes';
    tipo = document.createElement('p'); 
    tipo.textContent = 'Entrada (+)';
    valorText = document.createElement('p'); 
    valorText.textContent = `R$${valor.toFixed(2)}`;
    valorText.textContent = valorText.textContent.replace(".", ",");
    linha.appendChild(titulo);
    linha.appendChild(tipo);
    linha.appendChild(valorText);
    linha.style.display = "flex";
    linha.style.gap = "30px";
    document.getElementById('report-wrapper').appendChild(linha);


}

async function mostrarDespesa() {

    data = await pesquisarDespesa();
    

    for (i in data) {

        linha = document.createElement('div');
        valor = 0;


        
        valor = parseFloat(data[i].valor);
        console.log(data[i].valor);

        titulo = document.createElement('p'); 
    titulo.textContent = data[i].descritivo;
    tipo = document.createElement('p'); 
    tipo.textContent = 'Saída (-)';
    valorText = document.createElement('p'); 
    valorText.textContent = `R$${valor.toFixed(2)}`;
    valorText.textContent = valorText.textContent.replace(".", ",");
    linha.appendChild(titulo);
    linha.appendChild(tipo);
    linha.appendChild(valorText);
    linha.style.display = "flex";
    linha.style.gap = "30px";
    document.getElementById('report-wrapper').appendChild(linha);

        
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

    while (document.getElementById('report-wrapper').firstChild && document.getElementById('report-wrapper').childElementCount != 1) {

        document.getElementById('report-wrapper').removeChild(document.getElementById('report-wrapper').lastChild);

    }

    linha = document.createElement('div');
    valor = 0;

    for (item in data) {
        
        valor += parseFloat(data[item].total_valor);
        console.log(data[item].total_valor);

    }

    titulo = document.createElement('p'); 
    titulo.textContent = 'Recebimento de clientes';
    tipo = document.createElement('p'); 
    tipo.textContent = 'Entrada (+)';
    valorText = document.createElement('p'); 
    valorText.textContent = `R$${valor.toFixed(2)}`;
    valorText.textContent = valorText.textContent.replace(".", ",");
    linha.appendChild(titulo);
    linha.appendChild(tipo);
    linha.appendChild(valorText);
    linha.style.display = "flex";
    linha.style.gap = "30px";
    document.getElementById('report-wrapper').appendChild(linha);


}


async function getDfcs() {

    res = await fetch("../php/api/dfcSalvo.php", {
        method: "GET"
    });

    data = await res.json();

    for (i in data) {

        wrapper = document.getElementById('saved-reports');

        div = document.createElement('div');

        btn = document.createElement('button');
        btnDelete = document.createElement('button');
        btnDelete.setAttribute("id", data[i].id_dfc);
        btnDelete.textContent = '-';
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

        alert("Erro na inserção.")
    }



}

async function deletarDfcSalvo(id) {


    res = await fetch(`../php/api/dfc.php?id=${encodeURIComponent(id)}`,{ 
        method: "DELETE"
    }
    )

    data = await res.json();

    if (data.status == 'ok') {

        location.reload();
    } else {

        alert("Erro na inserção.")
    }
    
}