

async function pesquisar() {

    
    res = await fetch(`../php/api/dfc.php?inicio=${document.getElementById('inicio').value}&fim=${document.getElementById('fim').value}`, {
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