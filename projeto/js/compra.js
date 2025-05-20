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
  
    let url = `../php/compra.php?filtro=${filtro}`;
  
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
            <td>${item.id_pedido}</td>
            <td>${item.nome_insumo}</td>
            <td>${item.nome_usuario}</td>
            <td>${item.dataEmissao}</td>
            <td>${item.pedido_status}</td>
            <td>${item.qntComprar}</td>
          `;
  
          linha.addEventListener('click', () => {
            window.itemSelecionado = item;
            window.adicionandoNovo = false;
  
            document.getElementById('id_insumo').value = item.id_insumo || '';
            document.getElementById('id_usuario').value = item.id_usuario || '';
            document.getElementById('dataEmissao').value = item.dataEmissao || '';
            document.getElementById('pedido_status').value = item.pedido_status || '';
            document.getElementById('qntComprar').value = item.qntComprar || '';
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
  
// Botão ADICIONAR
document.getElementById('btn-adicionar').addEventListener('click', () => {
  window.adicionandoNovo = true;
  window.itemSelecionado = null;
  limparCampos();
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
  let itemInsumo = document.getElementById('id_insumo').value;
  let itemUsuario = document.getElementById('id_usuario').value;
  let itemDataEmissao = document.getElementById('dataEmissao').value;
  let itemPedido_status = document.getElementById('pedido_status').value;
  let itemQntComprar = document.getElementById('qntComprar').value;
  let itemObservacao = document.getElementById('observacao').value;

  if (window.adicionandoNovo && itemInsumo !="" && itemUsuario !="" && itemDataEmissao !="" && itemPedido_status !="" && itemQntComprar !="") {
    const novoItem = {
      id_insumo: itemInsumo,
      id_usuario: itemUsuario,
      dataEmissao: itemDataEmissao,
      pedido_status: itemPedido_status,
      qntComprar: itemQntComprar,
      observacao: itemObservacao
    };

    fetch('../php/compra.php', {
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
    else if (window.itemSelecionado && itemInsumo !="" && itemUsuario !="" && itemDataEmissao !="" && itemPedido_status !="" && itemQntComprar !="") {
      const dadosAtualizados = {
        id: window.itemSelecionado.id_pedido,
        id_insumo: itemInsumo,
        id_usuario: itemUsuario,
        dataEmissao: itemDataEmissao,
        pedido_status: itemPedido_status,
        qntComprar: itemQntComprar,
        observacao: itemObservacao
      };
  
      fetch('../php/compra.php', {
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
    }else{
      alert("Com exceção do campo 'Observação', o preenchimento dos demais campos é obrigatório.");
    }
});
  
// Botão DELETAR
document.getElementById('btn-deletar').addEventListener('click', () => {
  if (!window.itemSelecionado) {
    alert('Selecione um item antes.');
    return;
  }

  if (!confirm('Tem certeza que deseja excluir este item?')) return;

  fetch(`../php/compra.php?id=${window.itemSelecionado.id_pedido}`, {
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

// Carregar usuários
fetch('../php/get_usuarios.php')
  .then(response => response.json())
  .then(data => {
    const selectUsuario = document.getElementById('id_usuario');
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id_usuario;
      option.textContent = item.nome;
      selectUsuario.appendChild(option);
    });
  });
window.onload = chamarPHP;
