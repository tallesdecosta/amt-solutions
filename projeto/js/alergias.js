function limparCampos(){
  const inputs = document.querySelectorAll('.descricaoItem input');
  const select = document.querySelectorAll('.descricaoItem select');
  const textarea = document.querySelectorAll('.observacaoItem textarea');

  inputs.forEach(inputs => {
    inputs.value = '';
    inputs.setAttribute('disabled', true);
  });

  select.forEach(select => {
      select.value = '';
      select.setAttribute('disabled', true);
  });
  
  textarea.forEach(textarea => {
    textarea.value = '';
    textarea.setAttribute('disabled', true);
  });
}

function habilitarCampos(){
  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoItem select').forEach(select => select.removeAttribute('disabled'));
  document.querySelectorAll('.observacaoItem textarea').forEach(textarea => textarea.removeAttribute('disabled'));
}

function chamarPHP() {
  const filtro = document.getElementById('inputPesquisa').value;
  let url = `../php/alergias.php?filtro=${filtro}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Erro no servidor');
      return res.json();
    })
    .then(dados => {
      const tbody = document.getElementById('tabela-corpo');
      tbody.innerHTML = '';

      dados.forEach((item, index) => {
        const linha = document.createElement('tr');
        linha.classList.add(index % 2 === 0 ? 'linhaWhite' : 'linhaGray');

        linha.innerHTML = `
          <td>${item.id_alergia}</td>
          <td>${item.nome}</td>
        `;

        linha.addEventListener('click', () => {
          window.itemSelecionado = item;
          window.adicionandoNovo = false;
          document.getElementById('nome').value = item.nome || '';
          document.getElementById('observacao').value = item.observacao || '';
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
  let itemNome = document.getElementById('nome').value;
  let itemObservacao = document.getElementById('observacao').value;

  if (itemNome === "") {
    alert("O campo 'Nome' é obrigatório.");
    return;
  }

  const payload = {
    nome: itemNome,
    observacao: itemObservacao
  };

  if (window.adicionandoNovo) {
    fetch('../php/alergias.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
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
  } else if (window.itemSelecionado) {
    payload.id_alergia = window.itemSelecionado.id_alergia;

    fetch('../php/alergias.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
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

document.getElementById('btn-deletar').addEventListener('click', () => {
  if (!window.itemSelecionado) {
    alert('Selecione um item antes.');
    return;
  }

  if (!confirm('Tem certeza que deseja excluir este item?')) return;

  fetch(`../php/alergias.php?id=${window.itemSelecionado.id_alergia}`, {
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
