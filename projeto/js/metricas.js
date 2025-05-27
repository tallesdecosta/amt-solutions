document.addEventListener("DOMContentLoaded", async () => {
    // Pega a data de hoje
    const hoje = new Date();

    // Pega a data de 3 meses atrás
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(hoje.getMonth() - 3);

    // Formata as datas como "YYYY-MM-DD"
    const formatarData = (data) => data.toISOString().split("T")[0];

    const dataInicio = formatarData(tresMesesAtras);
    const dataFim = formatarData(hoje);

    try {

        const resposta = await fetch(`../php/metricas.php?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
            method: "GET",
            credentials: "include"
        });

        const dados = await resposta.json();
        await atualizarRelatorio(dados);

    } catch (erro) {

        console.error("Erro ao buscar métricas:", erro);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    // Data de hoje
    const hoje = new Date();

    // Data de 7 dias atrás
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(hoje.getDate() - 7);

    // Formata como "YYYY-MM-DD"
    const formatarData = (data) => data.toISOString().split("T")[0];

    const dataInicio = formatarData(umaSemanaAtras);
    const dataFim = formatarData(hoje);

    try {
        const resposta = await fetch(`../php/metricas.php?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
            method: "GET",
            credentials: "include"
        });

        const dados = await resposta.json();
        await atualizarSemanal(dados);
    } catch (erro) {
        console.error("Erro ao buscar métricas:", erro);
    }
});

async function atualizarSemanal(data) {
    
}

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

    data = (await fetch(`../php/metricas.php?dataInicio=${inicio.value}&dataFim=${fim.value}`, {
        method: "GET",
        credentials: "include"
    }));
    
    data = await data.json();

    await atualizarRelatorio(data);


    
}

async function atualizarRelatorio(data) {

    console.log(data);

    const ticketMedio = document.getElementById('ticket_medio_valor');
    ticketMedio.textContent = parseFloat(data.ticket_medio.atual).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        }).replace(/\s/g, '');

    const volumeVendas = document.getElementById('volume_vendas');
    const volumeVendasPassado = document.getElementById('passado_vendas');
    volumeVendas.textContent = data.volume_vendas.atual;
    volumeVendasPassado.textContent =  `${data.volume_vendas.crescimento}% vs período anterior`;

    const margemLucro = document.getElementById('margem_lucro');
    if(parseFloat(data.margem_lucro.atual) < -1000) {

        margemLucro.textContent = "-1000%";
    } else {
        margemLucro.textContent = `${parseFloat(data.margem_lucro.atual).toFixed(2)}%`;
    }

    const lucroReal = document.getElementById('lucro_real');
    lucroReal.textContent = parseFloat(data.lucro_real.atual).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        }).replace(/\s/g, '');

    const lucroRealPassado = document.getElementById('passado_lucro');
    lucroRealPassado.textContent =  `${data.lucro_real.crescimento}% vs período anterior`;

    const receita = document.getElementById('receita_periodo');
    receita.textContent = parseFloat(data.receita.atual).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        }).replace(/\s/g, '');
    
    

}