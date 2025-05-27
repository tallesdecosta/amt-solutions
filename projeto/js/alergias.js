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

  document.querySelectorAll("#span").forEach(span => {span.style.display = "none";});
}

function habilitarCampos(){
  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoItem select').forEach(select => select.removeAttribute('disabled'));
  document.querySelectorAll('.observacaoItem textarea').forEach(textarea => textarea.removeAttribute('disabled'));
  document.querySelectorAll("#span").forEach(span => {span.style.display = "";});
}

async function chamarPHP(){
  const filtro = document.getElementById('inputPesquisa').value;
  let url = `../php/alergias.php?filtro=${filtro}`;
    try{
      const resposta = await fetch(url);
      const dados = await resposta.json();

      const tbody = document.getElementById('tabela-corpo');
      tbody.innerHTML = '';

      dados.forEach((item, index) => {
        const linha = document.createElement('tr');
        linha.classList.add(index % 2 === 0 ? 'linhaWhite' : 'linhaGray');

        linha.innerHTML = `
          <td>${item.id_alergia}</td>
          <td>${item.nome}</td>
        `;

        linha.addEventListener('click', async function() {
          window.itemSelecionado = item;
          window.adicionandoNovo = false;
          document.getElementById('nome').value = item.nome || '';
          document.getElementById('observacao').value = item.observacao || '';

        });
        tbody.appendChild(linha);
      })
      limparCampos();
    }catch(erro){
      console.error('Erro:', erro);
    }
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

document.getElementById('btn-salvar').addEventListener('click', async function(){
  let itemNome = document.getElementById('nome').value;
  let itemObservacao = document.getElementById('observacao').value;

  if(itemNome === ''){
    alert("O campo 'nome' é obrigatório.");
    this.removeAttributeNS;
  }

  if(window.adicionandoNovo){
    try{
      const resposta = await fetch('../php/alergias.php', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          nome: itemNome,
          observacao: itemObservacao
        })
      });

      const resultado = await resposta.json();
      alert('Inserido com sucesso!');
      chamarPHP();
      limparCampos();
      window.adicionandoNovo = false;
      window.itemSelecionado = null;
    }catch(erro){
      console.error('Erro:', erro);
    }
  }else if(window.itemSelecionado){

    try{
      const resposta = await fetch('../php/alergias.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id_alergia: window.itemSelecionado.id_alergia,
          nome: itemNome,
          observacao: itemObservacao
        })
      });

      const resultado = await resposta.json();
      alert('Salvo com sucesso!');
      chamarPHP();
      limparCampos();
      window.itemSelecionado = null;

    }catch(erro){
      console.error('Erro:', erro);
    }
  }
});

document.getElementById('btn-deletar').addEventListener('click', async function(){
  if(!window.itemSelecionado){
    alert('Selecione um item antes.');
    return;
  }

  if(!confirm('Tem certeza que deseja excluir este item?')) return;

  try{
    const resposta = await fetch(`../php/alergias.php?id=${window.itemSelecionado.id_alergia}`,{
      method: 'DELETE'
    })

    const resultado = await resposta.json();
    alert('Excluido com sucesso!');
    chamarPHP();
    limparCampos();
    window.itemSelecionado = null;

  }catch(erro){
    console.error('Erro:', erro);
  }

});

window.onload = chamarPHP;
