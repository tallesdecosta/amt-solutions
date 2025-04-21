function chamarPHP() {
  const filtro = document.getElementById('inputPesquisa').value;

  let url = `../php/produto.php?filtro=${filtro}`;

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
          <td>${item.id_produto}</td>
          <td>${item.nome}</td>
          <td>${item.categoria}</td>
          <td>R$ ${item.valor}</td>
          <td>${item.quantidade}</td>
          <td>${item.vencimento}</td>
        `;

        linha.addEventListener('click', () => {
          window.itemSelecionado = item;
          window.adicionandoNovo = false;

          document.getElementById('nome').value = item.nome || '';
          document.getElementById('categoria').value = item.categoria || '';
          document.getElementById('valor').value = item.valor ? 'R$ ' + item.valor : 'R$ ';
          document.getElementById('quantidade').value = item.quantidade || '';
          document.getElementById('lote').value = item.lote || '';
          document.getElementById('vencimento').value = item.vencimento || '';
        });

        tbody.appendChild(linha);
      });
    })
    .catch(error => console.error('Erro:', error));
}

document.getElementById('buttonPesquisa').addEventListener('click', chamarPHP);

// Botão ADICIONAR
document.getElementById('btn-adicionar').addEventListener('click', () => {
  window.adicionandoNovo = true;
  window.itemSelecionado = null;

  const campos = ['nome', 'categoria', 'valor', 'quantidade', 'lote', 'vencimento'];
  campos.forEach(id => document.getElementById(id).value = '');

  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
});

// Botão EDITAR
document.getElementById('btn-editar').addEventListener('click', () => {
  if (!window.itemSelecionado) {
    alert('Selecione um item para editar');
    return;
  }
  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
  window.adicionandoNovo = false;
});

// Botão SALVAR
document.getElementById('btn-salvar').addEventListener('click', () => {
  const inputs = document.querySelectorAll('.descricaoItem input');

  // Quando for adicionar
  if (window.adicionandoNovo) {
    const novoItem = {
      nome: inputs[0].value,
      categoria: inputs[1].value,
      valor: inputs[2].value,
      quantidade: inputs[3].value,
      lote: inputs[4].value,
      vencimento: inputs[5].value
    };

    fetch('../php/produto.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoItem)
    })
      .then(res => res.json())
      .then(res => {
        alert('Inserido com sucesso!');
        chamarPHP();

        inputs.forEach(input => {
          input.value = '';
          input.setAttribute('disabled', true);
        });

        window.adicionandoNovo = false;
        window.itemSelecionado = null;
      })
      .catch(err => console.error('Erro ao inserir:', err));
  }
  // Quando for editar
  else if (window.itemSelecionado) {
    const dadosAtualizados = {
      id: window.itemSelecionado.id_produto,
      nome: inputs[0].value,
      categoria: inputs[1].value,
      valor: inputs[2].value,
      quantidade: inputs[3].value,
      lote: inputs[4].value,
      vencimento: inputs[5].value
    };

    fetch('../php/produto.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados)
    })
      .then(res => res.json())
      .then(res => {
        alert('Salvo com sucesso!');
        chamarPHP();

        inputs.forEach(input => {
          input.value = '';
          input.setAttribute('disabled', true);
        });

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

  fetch(`../php/produto.php?id=${window.itemSelecionado.id_produto}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(res => {
      alert('Excluído com sucesso!');
      chamarPHP();

      const inputs = document.querySelectorAll('.descricaoItem input');
      inputs.forEach(input => {
        input.value = '';
        input.setAttribute('disabled', true);
      });

      window.itemSelecionado = null;
    })
    .catch(err => console.error('Erro ao deletar:', err));
});

window.onload = chamarPHP;
