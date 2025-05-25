async function validar() {

    const inicio = document.getElementById('data-inicio');

    if (!inicio.checkValidity()) {

        inicio.reportValidity(); 
        return;

    }

    const fim = document.getElementById('data-fim');


    if (!fim.checkValidity()) {

        fim.reportValidity(); 
        return;

    }

    await atualizarRelatorio();
}

async function atualizarRelatorio() {
    
    const inicio = document.getElementById('data-inicio').value;
    const fim = document.getElementById('data-fim').value;

    data = (await fetch(`../php/metricas.php?dataInicio=${inicio}&dataFim=${fim}`, {
        method: "GET",
        credentials: "include"
    }));
    data = await data.json();

    console.log(data[0]);

    const ticketMedio = document.getElementById('ticket_medio_valor');
    ticketMedio.textContent = parseFloat(data[0].ticket_medio).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        }).replace(/\s/g, '');

    const volumeVendas = document.getElementById('volume_vendas');
    volumeVendas.textContent = data[1].total_comandas;

}