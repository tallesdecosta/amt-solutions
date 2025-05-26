// Funções gerais

document.getElementById("btn-divInsumo").addEventListener("click", () => {
  document.querySelector(".cadastroInsumo").classList.toggle("esconder");
});

document.getElementById("btn-divLote").addEventListener("click", () => {
  document.querySelector(".cadastroLote").classList.toggle("esconder");
});

function limparCampos(){
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
}

function habilitarCampos(){
  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoItem select').forEach(select => select.removeAttribute('disabled'));
}

function habilitarCamposLote() {
  document.querySelectorAll('.descricaoLote input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoLote select').forEach(select => select.removeAttribute('disabled'));
}

// Cadastro Insumos

function chamarPHP() {
  const filtro = document.getElementById('inputPesquisa').value;
  let url = `../php/insumo.php?filtro=${filtro}`;

  fetch(url)
    .then(resposta => {
      if (!resposta.ok) throw new Error('Erro no servidor');
      return resposta.json();
    })
    .then(dados => {
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
    })
    .catch(error => console.error('Erro:', error));
}

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

document.getElementById('btn-salvar').addEventListener('click', () => {
  let itemNome = document.getElementById("nome").value;
  let itemClassificacao = document.getElementById("classificacao").value;
  let itemQntMinima = document.getElementById("qntMinima").value;
  let itemInspReceb = document.getElementById("inspReceb").value;
  let itemLocalizacao = document.getElementById("localizacao").value;
  let itemQuantidadeTotal = document.getElementById("quantidadeTotal").value;

  if (window.adicionandoNovo && itemNome && itemClassificacao && itemQntMinima && itemInspReceb && itemLocalizacao && itemQuantidadeTotal) {
    const novoItem = {
      nome: itemNome,
      classificacao: itemClassificacao,
      qntMinima: itemQntMinima,
      inspReceb: itemInspReceb,
      localizacao: itemLocalizacao,
      quantidadeTotal: itemQuantidadeTotal
    };

    fetch('../php/insumo.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoItem)
    })
      .then(res => res.json())
      .then(res => {
        alert('Inserido com sucesso!');
        chamarPHP();
        mostrarLotes();
        limparCampos();
        window.adicionandoNovo = false;
        window.itemSelecionado = null;
      })
      .catch(err => console.error('Erro ao inserir:', err));
  }
  else if (window.itemSelecionado && itemNome && itemClassificacao && itemQntMinima && itemInspReceb && itemLocalizacao && itemQuantidadeTotal) {
    const dadosAtualizados = {
      id: window.itemSelecionado.id_insumo,
      nome: itemNome,
      classificacao: itemClassificacao,
      qntMinima: itemQntMinima,
      inspReceb: itemInspReceb,
      localizacao: itemLocalizacao,
      quantidadeTotal: itemQuantidadeTotal
    };

    fetch('../php/insumo.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados)
    })
      .then(res => res.json())
      .then(res => {
        alert('Salvo com sucesso!');
        chamarPHP();
        mostrarLotes();
        limparCampos();
        window.itemSelecionado = null;
      })
      .catch(err => console.error('Erro ao salvar:', err));
  } else {
    alert("Todos os campos do formulário são obrigatórios!");
  }
});

document.getElementById('btn-deletar').addEventListener('click', () => {
  if (!window.itemSelecionado) {
    alert('Selecione um item antes.');
    return;
  }

  if (!confirm('Tem certeza que deseja excluir este item?')) return;

  fetch(`../php/insumo.php?id=${window.itemSelecionado.id_insumo}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(res => {
      alert('Excluído com sucesso!');
      chamarPHP();
      mostrarLotes();
      limparCampos();
      window.itemSelecionado = null;
    })
    .catch(err => console.error('Erro ao deletar:', err));
});

// Lotes

function mostrarLotes(idInsumo = null) {
  let url = '../php/insumoLote.php';
  if (idInsumo) {
    url += `?id_insumo=${idInsumo}`;
  }

  fetch(url)
    .then(resposta => {
      if (!resposta.ok) throw new Error('Erro ao buscar lotes');
      return resposta.json();
    })
    .then(lotes => {
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
    })
    .catch(erro => console.error('Erro ao carregar lotes:', erro));
}

document.getElementById("btn-adicionarLote").addEventListener("click", () => {
  window.adicionandoLote = true;
  window.itemSelecionado = null;
  limparCampos();
  habilitarCamposLote();
})

document.getElementById("btn-editarLote").addEventListener('click', () => {
  if(!window.loteSelecionado){
    alert('Selecione um lote para editar');
    return;
  }
  habilitarCamposLote(); 
  window.adicionandoLote = false;
});

document.getElementById('btn-salvarLote').addEventListener('click', () => {
  let loteInsumo = document.getElementById("id_insumo").value;
  let loteLote = document.getElementById("lote").value;
  let loteVencimento = document.getElementById("vencimento").value;
  let loteFornecedor = document.getElementById("fornecedor").value;
  let loteQuantidade = document.getElementById("quantidade").value;

  if(window.adicionandoLote && loteInsumo && loteLote && loteVencimento && loteFornecedor && loteQuantidade){
    const novoLote = {
      id_insumo: loteInsumo,
      lote: loteLote,
      vencimento: loteVencimento,
      fornecedor: loteFornecedor,
      quantidade: loteQuantidade
    };

    fetch('../php/insumoLote.php', {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(novoLote)
    })
      .then(res => res.json())
      .then(res => {
        alert('Lote inserido com sucesso!');
        chamarPHP();
        limparCampos();
        window.adicionandoLote = false;
        window.loteSelecionado = null;
      })
      .catch(err => console.error('Erro ao inserir o lote:', err));
  }
  else if (window.loteSelecionado && loteInsumo && loteLote && loteVencimento && loteFornecedor && loteQuantidade) {
    const loteAtualizado = {
      id: window.loteSelecionado.id_Lote,
      id_insumo: loteInsumo,
      lote: loteLote,
      vencimento: loteVencimento,
      fornecedor: loteFornecedor,
      quantidade: loteQuantidade
    };

    fetch('../php/insumoLote.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loteAtualizado)
    })
      .then(res => res.json())
      .then(res => {
        alert('Lote salvo com sucesso!');
        chamarPHP();
        limparCampos();
        window.loteSelecionado = null;
      })
      .catch(err => console.error('Erro ao salvar lote:', err));
  } else {
    alert("Todos os campos do formulário são obrigatórios!");
  }
});

document.getElementById('btn-deletarLote').addEventListener('click', () => {
  if(!window.loteSelecionado){
    alert('Selecione um lote antes!');
    return;
  }

  if(!confirm('Tem certeza que deseja excluir este lote?')) return;

  fetch(`../php/insumoLote.php?id=${window.loteSelecionado.id_Lote}`,{
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