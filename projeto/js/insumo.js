// Funções gerais

document.getElementById("btn-divInsumo").addEventListener("click", () => {
  document.querySelector(".cadastroInsumo").classList.toggle("esconder");
});

document.getElementById("btn-divLote").addEventListener("click", () => {
  document.querySelector(".cadastroLote").classList.toggle("esconder");
});

function limparCampos() {
  const inputs = document.querySelectorAll('.descricaoItem input');
  inputs.forEach(input => {
    input.value = '';
    input.setAttribute('disabled', true);
  });

  const selects = document.querySelectorAll('.descricaoItem select');
  selects.forEach(select => {
    select.value = '';
    select.setAttribute('disabled', true);
  });

  const inputsLotes = document.querySelectorAll('.descricaoLote input');
  inputsLotes.forEach(input => {
    input.value = '';
    input.setAttribute('disabled', true);
  });

  const selectsLotes = document.querySelectorAll('.descricaoLote select');
  selectsLotes.forEach(select => {
    select.value = '';
    select.setAttribute('disabled', true);
  });

  const tbody = document.getElementById("tabela-lote-corpo");
  tbody.innerHTML = "";
  document.querySelectorAll("#span").forEach(span => { span.style.display = "none"; });
  document.querySelectorAll("#spanL").forEach(spanL => { spanL.style.display = "none"; });
}

function habilitarCampos() {
  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoItem select').forEach(select => select.removeAttribute('disabled'));
  document.querySelectorAll("#span").forEach(span => { span.style.display = ""; });
}

function habilitarCamposLote() {
  document.querySelectorAll('.descricaoLote input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoLote select').forEach(select => select.removeAttribute('disabled'));
  document.querySelectorAll("#spanL").forEach(spanL => { spanL.style.display = ""; });
}

// Cadastro Insumos

async function chamarPHP() {
  const filtro = document.getElementById('inputPesquisa').value;
  let url = `../php/insumo.php?filtro=${filtro}`;

  try {
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error('Erro no servidor');

    const dados = await resposta.json();

    const tbody = document.getElementById('tabela-corpo');
    tbody.innerHTML = '';

    dados.forEach((item, index) => {
      const linha = document.createElement('tr');
      const classe = (index % 2 === 0) ? 'linhaWhite' : 'linhaGray';
      linha.classList.add(classe);

      linha.innerHTML = `
        <td>${item.id_insumo}</td>
        <td>${item.nome}</td>
        <td>${item.classificacao}</td>
        <td>${item.quantidadeTotal}</td>
        <td>${item.qntMinima}</td>
      `;

      linha.addEventListener('click', () => {
        window.itemSelecionado = item;
        window.adicionandoNovo = false;

        document.getElementById('nome').value = item.nome || '';
        document.getElementById('classificacao').value = item.classificacao || '';
        document.getElementById('qntMinima').value = item.qntMinima || '';
        document.getElementById('inspReceb').value = item.inspReceb || '';
        document.getElementById('localizacao').value = item.localizacao || '';
        document.getElementById('quantidadeTotal').value = item.quantidadeTotal || '';

        mostrarLotes(item.id_insumo);
      });

      tbody.appendChild(linha);
    });

    limparCampos();
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao buscar os insumos. Verifique se o servidor está online.');
  }
}

document.getElementById('btn-salvar').addEventListener('click', async () => {
  const nome = document.getElementById("nome").value;
  const classificacao = document.getElementById("classificacao").value;
  const qntMinima = document.getElementById("qntMinima").value;
  const inspReceb = document.getElementById("inspReceb").value;
  const localizacao = document.getElementById("localizacao").value;
  const quantidadeTotal = document.getElementById("quantidadeTotal").value;

  if (!nome || !classificacao || !qntMinima || !inspReceb || !localizacao) {
    alert("Todos os campos do formulário são obrigatórios!");
    return;
  }

  const url = '../php/insumo.php';
  const metodo = 'POST';
  const headers = { 'Content-Type': 'application/json' };

  let dadosEnviar = {
    nome,
    classificacao,
    qntMinima,
    inspReceb,
    localizacao,
    quantidadeTotal
  };

  if (!window.adicionandoNovo && window.itemSelecionado) {
    dadosEnviar.id = window.itemSelecionado.id_insumo;
  }

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: headers,
      body: JSON.stringify(dadosEnviar)
    });

    const resultado = await resposta.json();

    if (window.adicionandoNovo) {
      alert('Inserido com sucesso!');
    } else {
      alert('Salvo com sucesso!');
    }

    chamarPHP();
    mostrarLotes();
    limparCampos();

    window.adicionandoNovo = false;
    window.itemSelecionado = null;

    window.location.reload()

  } catch (erro) {
    console.error('Erro na requisição:', erro);
    alert('Erro ao salvar o insumo. Verifique sua conexão com o servidor.');
  }
});

document.getElementById('btn-deletar').addEventListener('click', async () => {
  if (!window.itemSelecionado) {
    alert('Selecione um item antes.');
    return;
  }

  if (!confirm('Tem certeza que deseja excluir este item?')) return;

  try {
    const resposta = await fetch(`../php/insumo.php?id=${window.itemSelecionado.id_insumo}`, {
      method: 'DELETE'
    });

    const resultado = await resposta.json();

    alert('Excluído com sucesso!');
    chamarPHP();
    mostrarLotes();
    limparCampos();
    window.itemSelecionado = null;

  } catch (erro) {
    console.error('Erro ao deletar:', erro);
    alert('Erro ao excluir o insumo. Verifique sua conexão com o servidor.');
  }
});


document.getElementById('buttonPesquisa').addEventListener('click', () => {
  chamarPHP();
  limparCampos();
});

document.getElementById('btn-adicionar').addEventListener('click', () => {
  window.adicionandoNovo = true;
  window.itemSelecionado = null;
  limparCampos();
  habilitarCampos();
});

document.getElementById('btn-editar').addEventListener('click', () => {
  if (!window.itemSelecionado) {
    alert('Selecione um item para editar');
    return;
  }
  habilitarCampos();
  window.adicionandoNovo = false;
});

// Lotes

async function mostrarLotes(idInsumo = null) {
  try {
    let url = '../php/insumoLote.php';
    if (idInsumo) {
      url += `?id_insumo=${idInsumo}`;
    }

    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error('Erro ao buscar lotes');

    const lotes = await resposta.json();

    const tbody = document.querySelector('#tabela-lote-corpo');
    tbody.innerHTML = '';

    if (!Array.isArray(lotes)) {
      console.error('Resposta inválida do servidor:', lotes);
      return;
    }

    lotes.forEach((lote, index) => {
      const linha = document.createElement('tr');
      const classe = (index % 2 === 0) ? 'linhaWhiteLote' : 'linhaGrayLote';
      linha.classList.add(classe);

      linha.innerHTML = `
        <td>${lote.id_Lote}</td>
        <td>${lote.lote}</td>
        <td>${lote.vencimento}</td>
        <td>${lote.fornecedor}</td>
        <td>${lote.quantidade}</td>
      `;

      linha.addEventListener('click', () => {
        window.loteSelecionado = lote;
        window.adicionandoLote = false;
        document.getElementById('id_insumo').value = lote.id_insumo;
        document.getElementById('lote').value = lote.lote;
        document.getElementById('vencimento').value = lote.vencimento;
        document.getElementById('fornecedor').value = lote.fornecedor;
        document.getElementById('quantidade').value = lote.quantidade;
      });

      tbody.appendChild(linha);
    });

  } catch (erro) {
    console.error('Erro ao carregar lotes:', erro);
  }
}

document.getElementById('btn-salvarLote').addEventListener('click', async () => {
  const loteInsumo = document.getElementById("id_insumo").value.trim();
  const loteLote = document.getElementById("lote").value.trim();
  const loteVencimento = document.getElementById("vencimento").value.trim();
  const loteFornecedor = document.getElementById("fornecedor").value.trim();
  const loteQuantidade = document.getElementById("quantidade").value.trim();

  if (!loteInsumo || !loteLote || !loteVencimento || !loteFornecedor || !loteQuantidade) {
    alert("Todos os campos do formulário são obrigatórios!");
    return;
  }

  try {
    let bodyData;

    if (window.adicionandoLote) {
      bodyData = {
        id_insumo: loteInsumo,
        lote: loteLote,
        vencimento: loteVencimento,
        fornecedor: loteFornecedor,
        quantidade: loteQuantidade
      };
    } else if (window.loteSelecionado) {
      bodyData = {
        id: window.loteSelecionado.id_Lote,
        id_insumo: loteInsumo,
        lote: loteLote,
        vencimento: loteVencimento,
        fornecedor: loteFornecedor,
        quantidade: loteQuantidade
      };
    } else {
      alert("Nenhum lote selecionado para atualização!");
      return;
    }

    const resposta = await fetch('../php/insumoLote.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    if (!resposta.ok) throw new Error('Erro na resposta do servidor');

    const res = await resposta.json();

    if (window.adicionandoLote) {
      alert('Lote inserido com sucesso!');
      window.adicionandoLote = false;
    } else {
      alert('Lote salvo com sucesso!');
      window.loteSelecionado = null;
    }

    chamarPHP();
    limparCampos();

    window.location.reload()

  } catch (err) {
    console.error('Erro ao salvar o lote:', err);
  }
});


document.getElementById('btn-deletarLote').addEventListener('click', () => {
  if (!window.loteSelecionado) {
    alert('Selecione um lote antes!');
    return;
  }

  if (!confirm('Tem certeza que deseja excluir este lote?')) return;

  fetch(`../php/insumoLote.php?id=${window.loteSelecionado.id_Lote}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(res => {
      alert('Lote excluído com sucesso!');
      chamarPHP();
      limparCampos();
      window.loteSelecionado = null;
    })
    .catch(err => console.erro('Erro ao deletar o lote:', err));
});

document.getElementById("btn-adicionarLote").addEventListener("click", () => {
  window.adicionandoLote = true;
  window.itemSelecionado = null;
  limparCampos();
  habilitarCamposLote();
})

document.getElementById("btn-editarLote").addEventListener('click', () => {
  if (!window.loteSelecionado) {
    alert('Selecione um lote para editar');
    return;
  }
  habilitarCamposLote();
  window.adicionandoLote = false;
});

// Carregar insumos
fetch('../php/get_insumos.php')
  .then(response => response.json())
  .then(data => {
    const selectInsumo = document.getElementById('id_insumo');
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id_insumo;
      option.textContent = item.nome;
      selectInsumo.appendChild(option);
    });
  });