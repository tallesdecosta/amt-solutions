async function iniciar() {

    despesas = await pesquisarDespesas();

    tiposDespesa = await pesquisarTiposDespesas();

    atualizarTiposDespesas(tiposDespesa);
    atualizarResumo(despesas);
    atualizarDespesas(despesas);


}

async function pesquisarDespesas() {

const hoje = new Date();
const diasAtras = 90;

const data90DiasAtras = new Date();
data90DiasAtras.setDate(hoje.getDate() - diasAtras);

    inicio = formatarData(data90DiasAtras);
    fim = formatarData(hoje);

    res = await fetch(`../php/api/despesa.php?inicio=${inicio}&fim=${fim}`, {
        method: "GET"
    });

    data = await res.json();

    return data;

}

function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // +1 porque janeiro é 0
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
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
            linha.setAttribute('par', true);
        } else {
            linha.setAttribute('par', false);
        }

        linha.addEventListener('mouseover', function () {

            this.style.backgroundColor = '#A6A6A6';
            this.style.cursor = 'pointer';

        })

        linha.addEventListener('mouseleave', function () {
            if (this.getAttribute('par') == 'true') {

                linha.style.backgroundColor = '#F2F2F2';
                
            } else {
                this.style.backgroundColor = 'transparent';
            }
            this.style.cursor = 'default';
            
            
        })
        linha.style.display = 'flex';
        linha.style.justifyContent = 'space-around';
        linha.style.width = '100%';


        if (countAbertas % 2 != 0 && despesas[despesa].estaPago == '0') {

            linha.style.backgroundColor = '#F2F2F2';

        } else if (countFechadas % 2 != 0 && despesas[despesa].estaPago == '1') {
            linha.style.backgroundColor = '#F2F2F2';
        }
        linha.setAttribute('td-id', despesas[despesa].id_tipo_despesa);
        colaborador = document.createElement('p');
        colaborador.textContent = despesas[despesa].nome;
        colaborador.setAttribute('td-id', despesas[despesa].id_despesa);
        colaborador_td = document.createElement('td');
        colaborador_td.appendChild(colaborador);

        descritivo = document.createElement('p');
        descritivo.textContent = despesas[despesa].descritivo;
        descritivo.setAttribute('td-id', despesas[despesa].id_despesa);
        descritivo_td = document.createElement('td');
        descritivo_td.appendChild(descritivo);

        valor = document.createElement('p');
        valor.textContent = despesas[despesa].valor;
        valor.setAttribute('td-id', despesas[despesa].id_despesa);
        valor_td = document.createElement('td');
        valor_td.appendChild(valor);

        dataInicio = document.createElement('p');
        dataInicio.textContent = despesas[despesa].dataInicio;
        dataInicio.setAttribute('td-id', despesas[despesa].id_despesa);
        dataInicio_td = document.createElement('td');
        dataInicio_td.appendChild(dataInicio);
        
        linha.appendChild(colaborador_td);
        linha.appendChild(descritivo_td);
        linha.appendChild(valor_td);
        linha.appendChild(dataInicio_td);

        

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
        btn.setAttribute('td-id', despesas[despesa].id_tipo_despesa);
        btn.addEventListener('click', function()  {
            id = this.getAttribute('td-id');
            despesasFechadas = document.getElementById('despesas-fechadas').children;
            despesasAbertas = document.getElementById('despesas-abertas').children;

            for (i of despesasFechadas) {
                

                if (i.getAttribute('td-id') != id) {

                    i.style.display = 'none';
                } else {
                    i.style.display = '';

                }

                
                

            }

            for (i of despesasAbertas) {
                console.log(i.getAttribute('td-id'), id)
                if (parseInt(i.getAttribute('td-id')) != id) {
                    i.style.display = 'none';
                } else {
                    i.style.display = '';

                }

                    
            }

        });

        linha.appendChild(btn);

        container.appendChild(linha);
        count += 1;

    };
}

async function addDespesa() {

    body = new URLSearchParams();

    body.append('descritivo', prompt('Descritivo da despesa:'));
    body.append('valor', parseFloat(prompt('Valor da despesa:')));
    body.append('dataInicio', prompt('Data de início da despesa (ANO-MÊS-DIA, eg. 2025-05-02):'));
    body.append('dataVencimento', prompt('Data de vencimento da despesa (ANO-MÊS-DIA, eg. 2025-05-02):'));
    body.append('tipo_despesa', parseInt(prompt('Insira o id do tipo da despesa (provisório):')));

    res = await fetch('../php/api/despesa.php', {
        method: 'POST',
        body: body,
        credentials: "include"
    });

    res = await res.json();

    if (res.status = 'ok') {
        window.location.reload();
    } else {
        alert("Houve erro ao criar a despesa, favor comunicar ao suporte.")
    }

    
}

async function addTipoDespesa() {

    body = new URLSearchParams();
    body.append('nome', prompt('Nome do tipo de despesa:'));

    res = await fetch('../php/api/tipo_despesa.php', {
        method: "POST",
        body: body
    });

    res = await res.json();



    if (res.status = 'ok') {
        window.location.reload();
    } else {
        alert("Houve erro ao criar o tipo de despesa, favor comunicar ao suporte.")
    }

}