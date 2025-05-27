

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
  const dados = await pesquisar();
  const corpoRelatorio = document.getElementById('report-body');
  corpoRelatorio.innerHTML = "";

  // Mapear os dados com os nomes fixos antes de chamar montarGrupo
  const vendas = dados.entradas.detalhes
    .filter(item => item.origem === "venda")
    .map(e => ({
      nome: "Recebimento de clientes",
      valor: parseFloat(e.valor),
      tipo: "Entrada (+)"
    }));

  const outrasEntradas = dados.entradas.detalhes
    .filter(item => item.origem === "caixa")
    .map(e => ({
      nome: "Entrada de caixa",
      valor: parseFloat(e.valor),
      tipo: "Entrada (+)"
    }));

  const saidas = dados.saidas.detalhes
    .map(s => ({
      nome: s.descritivo,
      valor: parseFloat(s.valor),
      tipo: "Saída (-)"
    }));

  montarGrupo("Vendas", vendas, null, corpoRelatorio, true);
  montarGrupo("Entradas de Caixa", outrasEntradas, null, corpoRelatorio, true);
  montarGrupo("Despesas", saidas, null, corpoRelatorio, true);
}


async function mostrarDespesa() {
  const dados = await pesquisarDespesa();
  const grupos = {};

  for (const despesa of dados) {
    const categoria = despesa.macro || 'Outras Despesas';
    if (!grupos[categoria]) grupos[categoria] = [];
    grupos[categoria].push(despesa);
  }

  const corpoRelatorio = document.getElementById('report-body');
  corpoRelatorio.innerHTML = ""; // limpa antes

  for (const categoria in grupos) {
    montarGrupo(categoria, grupos[categoria], "Saída (-)", corpoRelatorio, true);
  }
}

function montarGrupo(titulo, itens, tipo, container, jaTemTipo = false) {
  // Cabeçalho do grupo
  const linhaTitulo = document.createElement('tr');
  const th = document.createElement('th');
  th.colSpan = 3;
  th.textContent = titulo;
  th.style.textAlign = 'left';
  th.style.backgroundColor = '#eee';
  th.style.padding = '10px';
  linhaTitulo.appendChild(th);
  container.appendChild(linhaTitulo);

  let subtotal = 0;

  for (const item of itens) {
    const linha = document.createElement('tr');

    const nome = item.nome || item.descritivo || "Sem descrição";
    const valor = parseFloat(item.valor);

    const tdNome = criarTd(nome);
    const tdTipo = criarTd(jaTemTipo ? (item.tipo || tipo) : tipo);
    const tdValor = criarTd(`R$${valor.toFixed(2).replace('.', ',')}`, 'right');

    linha.append(tdNome, tdTipo, tdValor);
    container.appendChild(linha);

    subtotal += valor;
  }

  // Subtotal do grupo
  const linhaSubtotal = document.createElement('tr');
  const tdSubtotalLabel = document.createElement('td');
  tdSubtotalLabel.colSpan = 2;
  tdSubtotalLabel.textContent = 'Subtotal';

  const tdSubtotalValor = criarTd(`R$${subtotal.toFixed(2).replace('.', ',')}`, 'right', 'bold');

  linhaSubtotal.append(tdSubtotalLabel, tdSubtotalValor);
  container.appendChild(linhaSubtotal);
}

function criarTd(texto, alinhamento = 'left', pesoFonte = 'normal') {
  const td = document.createElement('td');
  td.textContent = texto;
  td.style.textAlign = alinhamento;
  td.style.fontWeight = pesoFonte;
  return td;
}

async function pesquisarSalvo(id) {

    
    res = await fetch(`../php/api/dfc.php?inicio=${document.getElementById(id).getAttribute("data-inicio")}&fim=${document.getElementById(id).getAttribute('data-fim')}`, {
        method: "GET"
    });

    return await res.json();

}

async function mostrarDfcSalvo(id) {
  const dados = await pesquisarSalvo(id);

  const corpoRelatorio = document.getElementById('report-body');
  corpoRelatorio.innerHTML = "";

  
  const vendas = dados.entradas.detalhes
    .filter(item => item.origem === "venda")
    .map(e => ({
      nome: "Recebimento de clientes",
      valor: parseFloat(e.valor),
      tipo: "Entrada (+)"
    }));


    //.map(cria outra array a partir de cada item da ultima)

  const outrasEntradas = dados.entradas.detalhes
    .filter(item => item.origem === "caixa")
    .map(e => ({
      nome: "Entrada de caixa",
      valor: parseFloat(e.valor),
      tipo: "Entrada (+)"
    }));

  const saidas = dados.saidas.detalhes
    .map(s => ({
      nome: s.descritivo,
      valor: parseFloat(s.valor),
      tipo: "Saída (-)"
    }));

  montarGrupo("Vendas", vendas, null, corpoRelatorio, true);
  montarGrupo("Entradas de Caixa", outrasEntradas, null, corpoRelatorio, true);
  montarGrupo("Despesas", saidas, null, corpoRelatorio, true);
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