async function iniciar() {

    despesas = await pesquisarDespesas();

    tiposDespesa = await pesquisarTiposDespesas();

    atualizarTiposDespesas(tiposDespesa);

    atualizarDespesas(despesas);


}

async function pesquisarDespesas() {

    inicio = '2025-01-01';
    fim = '2025-12-31';

    res = await fetch(`../php/api/despesa.php?inicio=${inicio}&fim=${fim}`, {
        method: "GET"
    });

    data = await res.json();

    return data;

}

async function pesquisarTiposDespesas() {

    res = await fetch('../php/api/tipo_despesa.php', {
        method: "GET"
    });

    data = await res.json();

    return data;

}

function atualizarResumo(data) {

    valor = 0;

    for (despesa in despesas) {

        valor += parseFloat(despesas[despesa].valor);

    };

    document.getElementById('resumo').textContent = `R$${valor.toFixed(2).replace('.', ',')}`;

}

function atualizarDespesas(despesas) {

    containerFechadas = document.getElementById('despesas-fechadas');
    containerAbertas = document.getElementById('despesas-abertas');
    countAbertas = 1;
    countFechadas = 1;

    for (despesa in despesas) {

        linha = document.createElement('tr');

        if (countAbertas % 2 != 0 && despesas[despesa].estaPago == '0') {

            linha.style.backgroundColor = '#F2F2F2';

        } else if (countFechadas % 2 != 0 && despesas[despesa].estaPago == '1') {
            linha.style.backgroundColor = '#F2F2F2';
        }

        colaborador = document.createElement('button');
        colaborador.textContent = despesas[despesa].nome;
        colaborador.setAttribute('td-id', despesas[despesa].id_despesa);
        colaborador_td = document.createElement('td');
        colaborador_td.appendChild(colaborador);

        descritivo = document.createElement('button');
        descritivo.textContent = despesas[despesa].descritivo;
        descritivo.setAttribute('td-id', despesas[despesa].id_despesa);
        descritivo_td = document.createElement('td');
        descritivo_td.appendChild(descritivo);

        valor = document.createElement('button');
        valor.textContent = despesas[despesa].valor;
        valor.setAttribute('td-id', despesas[despesa].id_despesa);
        valor_td = document.createElement('td');
        valor_td.appendChild(valor);

        dataInicio = document.createElement('button');
        dataInicio.textContent = despesas[despesa].dataInicio;
        dataInicio.setAttribute('td-id', despesas[despesa].id_despesa);
        dataInicio_td = document.createElement('td');
        dataInicio_td.appendChild(dataInicio);
        
        linha.appendChild(colaborador_td);
        linha.appendChild(dataInicio_td);
        linha.appendChild(descritivo_td);
        linha.appendChild(valor_td);
        

        if (despesas[despesa].estaPago == '0') {
            containerAbertas.appendChild(linha);
            countAbertas += 1;


        } else {

            containerFechadas.appendChild(linha);
            countFechadas += 1;
        }
        

    };

}

function atualizarTiposDespesas(despesas) {

    container = document.getElementById('tipos-despesas');
    count = 1;

    for (despesa in despesas) {

        linha = document.createElement('div');

        if (count % 2 != 0) {

            linha.style.backgroundColor = '#F2F2F2';

        }

        btn = document.createElement('button');
        btn.textContent = despesas[despesa].nome;
        btn.setAttribute('td-id', despesas[despesa].id_despesa)

        linha.appendChild(btn);

        container.appendChild(linha);
        count += 1;

    };
}