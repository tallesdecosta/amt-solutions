async function iniciar() {

    despesas = await pesquisarDespesas();

    atualizarResumo(despesas);

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
    count = 1;

    for (despesa in despesas) {

        linha = document.createElement('div');

        if (count % 2 != 0) {

            linha.style.backgroundColor = '#F2F2F2';

        }

        btn = document.createElement('button');
        btn.textContent = despesas[despesa].descritivo;
        btn.setAttribute('td-id', despesas[despesa].id_despesa)

        linha.appendChild(btn);

        if (despesas[despesa].estaPago == '0') {
            containerAbertas.appendChild(linha);

        } else {

            containerFechadas.appendChild(linha);
        }
        count += 1;

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