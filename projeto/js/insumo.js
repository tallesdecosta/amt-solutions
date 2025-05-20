function limparCampos(){
  const inputs = document.querySelectorAll('.descricaoItem input');
  inputs.forEach(input => {
    input.value = '';
    input.setAttribute('disabled', true);
  });
}

function habilitarCampos(){
  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
}

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
          <td>${item.quantidade}</td>
          <td>${item.qntMinima}</td>
          <td>${item.vencimento}</td>
        `;

        linha.addEventListener('click', () => {
          window.itemSelecionado = item;
          window.adicionandoNovo = false;

          document.getElementById('nome').value = item.nome || '';
          document.getElementById('classificacao').value = item.classificacao || '';
          document.getElementById('qntMinima').value = item.qntMinima || '';
          document.getElementById('lote').value = item.lote || '';
          document.getElementById('vencimento').value = item.vencimento || '';
          document.getElementById('inspReceb').value = item.inspReceb || '';
          document.getElementById('fornecedor').value = item.fornecedor || '';
          document.getElementById('localizacao').value = item.localizacao || '';
          document.getElementById('quantidade').value = item.quantidade || '';
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

// Botão ADICIONAR
document.getElementById('btn-adicionar').addEventListener('click', () => {
  window.adicionandoNovo = true;
  window.itemSelecionado = null;

  const campos = ['nome', 'classificacao', 'qntMinima', 'lote', 'vencimento', 'inspReceb', 'fornecedor', 'localizacao', 'quantidade'];
  campos.forEach(id => document.getElementById(id).value = '');
  habilitarCampos();
});

// Botão EDITAR
document.getElementById('btn-editar').addEventListener('click', () => {
  if (!window.itemSelecionado) {
    alert('Selecione um item para editar');
    return;
  }
  habilitarCampos();
  window.adicionandoNovo = false;
});

// Botão SALVAR
document.getElementById('btn-salvar').addEventListener('click', () => {
  // Quando for adicionar
  if (window.adicionandoNovo) {
    const novoItem = {
      nome: document.getElementById("nome").value,
      classificacao: document.getElementById("classificacao").value,
      qntMinima: document.getElementById("qntMinima").value,
      lote: document.getElementById("lote").value,
      vencimento: document.getElementById("vencimento").value,
      inspReceb: document.getElementById("inspReceb").value,
      fornecedor: document.getElementById("fornecedor").value,
      localizacao: document.getElementById("localizacao").value,
      quantidade: document.getElementById("quantidade").value
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
        limparCampos();
        window.adicionandoNovo = false;
        window.itemSelecionado = null;
      })
      .catch(err => console.error('Erro ao inserir:', err));
  }
  // Quando for editar
  else if (window.itemSelecionado) {
    const dadosAtualizados = {
      id: window.itemSelecionado.id_insumo,
      nome: document.getElementById("nome").value,
      classificacao: document.getElementById("classificacao").value,
      qntMinima: document.getElementById("qntMinima").value,
      lote: document.getElementById("lote").value,
      vencimento: document.getElementById("vencimento").value,
      inspReceb: document.getElementById("inspReceb").value,
      fornecedor: document.getElementById("fornecedor").value,
      localizacao: document.getElementById("localizacao").value,
      quantidade: document.getElementById("quantidade").value
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
        limparCampos();
        window.itemSelecionado = null;
      })
      .catch(err => console.error('Erro ao salvar:', err));
  }
});

// Botão DELETAR
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
      limparCampos();
      window.itemSelecionado = null;
    })
    .catch(err => console.error('Erro ao deletar:', err));
});

window.onload = chamarPHP;
