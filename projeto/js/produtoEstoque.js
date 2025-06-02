// --------------- Funções relacionadas ao cadastro do LOTE --------------- //

// Receber dados do cadastro de lotes
async function mostrarLotes(){
  const filtro = document.getElementById('inputPesquisa').value;
  const url = `../php/produtoLote.php?filtro=${encodeURIComponent(filtro)}`;
  
  try {
    const resposta = await fetch(url);

    if(!resposta.ok){
      throw new Error(`HTTP error! status: ${resposta.status}`);
    }else{
      return resposta.json();
    }
  }catch(erro){
    console.log("Erro ao buscar API: " + erro);
    alert("Estamos passando por problemas de conexão, por favor tente novamente mais tarde");
  }
}

// Tratativa dos dados dos lotes
async function tratarRespostaLotes(idProduto){
  lotes = await mostrarLotes(idProduto);

  if(lotes){
    if(lotes.erro){
      alert(lotes.resposta);
      console.log("Erro: " + lotes.erro);
    }else{
      const tbody = document.querySelector('#tabela-lote-corpo');
      tbody.innerHTML = '';

      lotes.forEach((lote, index) => {
        // Insere linha com os dados na tabela tbody
        const linha = document.createElement('tr');
        
        // Verifica se o lote está vencido
        const hoje = new Date();
        const dataVencimento = new Date(lote.vencimento);
        const estaVencido = dataVencimento < hoje;
        
        const classe = (index % 2 === 0) ? 'linhaWhiteLote' : 'linhaGrayLote';
        linha.classList.add(classe);

        // Adiciona a classe de vencido
        if (estaVencido) {
          linha.classList.add('vencido');
        }

        linha.innerHTML = `
          <td>${lote.id_Lote}</td>
          <td>${lote.nome_produto}</td>
          <td>${lote.lote}</td>
          <td>${lote.vencimento}</td>
          <td>${lote.fornecedor}</td>
          <td>${lote.quantidade}</td>
        `;
        // Mostra os dados do cadastro ao clicar na linha
        linha.addEventListener('click', () => {
          window.loteSelecionado = lote;
          window.adicionandoLote = false;
          document.getElementById('id_produto').value = lote.id_produto;
          document.getElementById('lote').value = lote.lote;
          document.getElementById('vencimento').value = lote.vencimento;
          document.getElementById('fornecedor').value = lote.fornecedor;
          document.getElementById('quantidade').value = lote.quantidade;

          carregarInsumosVinculados(lote.id_Lote);
          tratarInsumosVinculados(lote.id_Lote);
        });
        tbody.appendChild(linha);
      });
    }
  }
}

// Botão salvar LOTE method POST e PUT
async function btnSalvarLote(){
  if (!validarCampos()) return;
  // Pegar os valores dos campos do cadastro de Lote
  let id_produto = document.getElementById("id_produto").value;
  let lote = document.getElementById("lote").value;
  let vencimento = document.getElementById("vencimento").value;
  let fornecedor = document.getElementById("fornecedor").value;
  let quantidade = document.getElementById("quantidade").value;

  // Verifica se todos os campos estão preenchidos
  if (!id_produto || !lote || !vencimento || !fornecedor || !quantidade) {
    alert("Preencha todos os campos do lote do produto.");
    return;
  }

  // Dados que serão enviados para o PHP
  
  const loteData = {
    id_produto,
    lote,
    vencimento,
    fornecedor,
    quantidade
  };

  const insumos = [];
  let naoInsumo = false;

  // Verifica se tem insumos no cadastro do lote, caso tenha, adiciona na lista insumos
  document.querySelectorAll('.insumo-item').forEach(item => {
    const id_insumo = item.querySelector('.insumo-select').value;
    const id_loteInsumo = item.querySelector('.lote-insumo-select').value;
    const quantidade = item.querySelector('.quantidade-insumo').value;

    if ((id_insumo || id_loteInsumo || quantidade) && (!id_insumo || !id_loteInsumo || !quantidade)) {
      naoInsumo = true;
    } else if (id_insumo && id_loteInsumo && quantidade) {
      insumos.push({
        id_insumoLote: id_loteInsumo,
        id_insumo,
        quantidade
      });
    }
  });

  if (naoInsumo) {
    alert("Preencha corretamente os campos dos insumos adicionados.");
    return;
  }

  try {
    if (window.adicionandoLote) {
      // Criar novo lote
      const resLote = await fetch('../php/produtoLote.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loteData)
      });
      const resJson = await resLote.json();

      if (!resJson.id_Lote) {
        alert('Erro ao inserir lote: ' + (resJson.erro || 'Resposta inesperada'));
        return;
      }
      alert('Lote inserido com sucesso!');

      if (insumos.length > 0) {
        // Só envia insumos se tiver algum preenchido
        const resInsumos = await fetch('../php/produtoLoteInsumos.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_produtoLote: resJson.id_Lote,
            insumos: insumos
          })
        });
        const resInsumosJson = await resInsumos.json();
        console.log('Insumos salvos com sucesso:', resInsumosJson);
      }

      tratarRespostaLotes();
      limparCampos();
      window.adicionandoLote = false;
      window.loteSelecionado = null;
      window.location.reload()

    } else {
      // Editar lote existente
      if (!window.loteSelecionado || !window.loteSelecionado.id_Lote) {
        alert("Nenhum lote selecionado para edição.");
        return;
      }

      loteData.id_Lote = window.loteSelecionado.id_Lote;

      const resLote = await fetch('../php/produtoLote.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loteData)
      });
      const resJson = await resLote.json();

      if (resJson.status !== 'sucesso') {
        alert('Erro ao atualizar lote: ' + (resJson.erro || 'Resposta inesperada'));
        return;
      }
      alert('Lote atualizado com sucesso!');

      const resInsumos = await fetch('../php/produtoLoteInsumos.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_produtoLote: loteData.id_Lote,
          insumos: insumos,
          insumosRemovidos: Array.from(window.insumosRemovidos || [])
        })
      });
      const resInsumosJson = await resInsumos.json();
      console.log('Insumos atualizados com sucesso:', resInsumosJson);

      tratarRespostaLotes();
      limparCampos();
      window.loteSelecionado = null;
    }
  } catch (err) {
    console.error('Erro ao salvar lote:', err);
    alert('Erro ao salvar lote. Veja o console para detalhes.');
  }

}

// Receber dados do insumo cadastrado no lote do produto
async function carregarInsumosVinculados(idLote){
  try {
    const resposta = await fetch(`../php/produtoLoteInsumos.php?id_lote=${idLote}`);

    if(!resposta.ok){
      throw new Error(`HTTP error! status: ${resposta.status}`);
    }else{
      return resposta.json();
    }
  }catch(erro){
    console.log("Erro ao buscar API: " + erro);
    alert("Estamos passando por problemas de conexão, por favor tente novamente mais tarde");
  }
}

// Tratativa dos dados dos insumos do lote do produto
async function tratarInsumosVinculados(idLote){
  insumos = await carregarInsumosVinculados(idLote);

  if(insumos){
    if(insumos.erro){
      alert(insumos.resposta);
      console.log("Erro: " + insumos.erro);
    }else{
      const container = document.getElementById('lista-insumos');
      container.innerHTML = '';

      insumos.forEach(insumo => {
        const div = document.createElement('div');
        div.classList.add('insumo-item');

        div.innerHTML = `
          <span id="spanL" style="display: none">*</span>
          <select class="insumo-select" disabled>
            <option value="${insumo.id_insumo}" selected>${insumo.nome}</option>
          </select>
          <span id="spanL" style="display: none">*</span>
          <select class="lote-insumo-select" disabled>
            <option value="${insumo.id_Lote}" selected>Lote: ${insumo.lote} | Qtd: ${insumo.quantidade}</option>
          </select>
          <span id="spanL" style="display: none">*</span>
          <input type="number" class="quantidade-insumo" value="${insumo.quantidade_utilizada}" min="0" step="0.01" disabled>
          <button type="button" class="buttonPadrao btnRemoverInsumo" onclick="removerInsumo(this)" style="display: none;">Remover</button>
        `;
        container.appendChild(div);
      });
    }
  }
}

// --------------- Botões div cadastro LOTE --------------- //

// Botão Deletar
async function btnDeletarLote() {
  // Verificar se algum item foi selecionado
  if(!window.loteSelecionado){
    alert('Selecione um lote antes!');
    return;
  }

  // Confirmação se deseja deletar
  if(!confirm('Tem certeza que deseja excluir este lote?')) return;

  try {
    const res = await fetch(`../php/produtoLote.php?id=${window.loteSelecionado.id_Lote}`, {
      method: 'DELETE'
    });
    const resJson = await res.json();

    if (resJson.status === 'sucesso') {
      alert('Lote excluído com sucesso!');
      tratarRespostaLotes();
      limparCampos();
      window.loteSelecionado = null;
    } else {
      alert(resJson.mensagem || 'Erro ao deletar o lote.');
    }
  } catch(err) {
    console.error('Erro ao deletar o lote:', err);
    alert('Erro ao deletar o lote. Veja o console para detalhes.');
  }
};

// Botão ADICIONAR
document.getElementById("btn-adicionarLote").addEventListener("click", () => {
  window.adicionandoLote = true;
  window.itemSelecionado = null;
  limparCampos();
  habilitarCamposLote();
})

// Botão EDITAR
document.getElementById("btn-editarLote").addEventListener('click', () => {
  if (!window.loteSelecionado) {
    alert('Selecione um lote para editar');
    return;
  }
  habilitarCamposLote();
  window.adicionandoLote = false;
});

// Botão adicionar Insumo
document.getElementById("btn-adicionarInsumo").addEventListener("click", async () => {
  const container = document.getElementById('lista-insumos');

  const div = document.createElement('div');
  div.classList.add('insumo-item');

  div.innerHTML = `
    <span id="spanL" style="display: none">*</span>
    <select class="insumo-select">
      <option value="">Selecione um insumo</option>
    </select>
    <span id="spanL" style="display: none">*</span>
    <select class="lote-insumo-select">
      <option value="">Selecione um lote</option>
    </select>
    <span id="spanL" style="display: none">*</span>
    <input type="number" class="quantidade-insumo" placeholder="Quantidade Utilizada" min="0" step="0.01">
    <button type="button" class="buttonPadrao btnRemoverInsumo" onclick="removerInsumo(this)">Remover</button>
  `;

  container.appendChild(div);
  habilitarCamposLote();
  const selectInsumo = div.querySelector('.insumo-select');
  const selectLote = div.querySelector('.lote-insumo-select');

  try {
    const response = await fetch('../php/get_insumos.php');
    const data = await response.json();

    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id_insumo;
      option.textContent = item.nome;
      selectInsumo.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar insumos:", error);
  }

  selectInsumo.addEventListener('change', async () => {
    const idInsumo = selectInsumo.value;

    // Limpar o select de lote
    selectLote.innerHTML = '<option value="">Selecione um lote</option>';

    if (!idInsumo) return;

    try {
      const response = await fetch(`../php/get_insumoLote.php?id_insumo=${idInsumo}`);
      const lotes = await response.json();

      lotes.forEach(lote => {
        const option = document.createElement('option');
        option.value = lote.id_Lote;
        option.textContent = `Lote: ${lote.lote} | Qtd: ${lote.quantidade}`;
        selectLote.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar lotes:", error);
    }
  });

});

function removerInsumo(botao) {
  if (window.loteSelecionado && window.loteSelecionado.id_Lote) {
    const insumoItem = botao.closest('.insumo-item');
    const id_insumoLote = insumoItem.querySelector('.lote-insumo-select').value;

    if (!window.insumosRemovidos) {
      window.insumosRemovidos = new Set();
    }

    if (id_insumoLote) {
      window.insumosRemovidos.add(id_insumoLote);
      console.log('Insumo marcado para remoção:', id_insumoLote);
    }
  }

  // Remove do DOM
  botao.parentElement.remove();
}

// --------------- Funções gerais --------------- //

//Botão pesquisa
document.getElementById('buttonPesquisa').addEventListener('click', () => {
  tratarRespostaLotes();
  limparCampos();
});

// Função limpar campos
function limparCampos(){
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

  const btnInsumo = document.querySelectorAll("#btn-adicionarInsumo");
  btnInsumo.forEach(btnInsumo => {
    btnInsumo.value = '';
    btnInsumo.setAttribute('disabled', true);
  });

  const tbody = document.getElementById("tabela-lote-corpo");
  tbody.innerHTML = ""; 

  document.querySelectorAll("#spanL").forEach(spanL => {spanL.style.display = "none";}); 
  document.getElementById('btn-adicionarInsumo').style.display = 'none';
  document.getElementById('btn-salvarLote').style.display = 'none';
}

// Função habilita campos div cadastro lote
function habilitarCamposLote() {
  document.querySelectorAll('.descricaoLote input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoLote select').forEach(select => select.removeAttribute('disabled'));
  document.querySelectorAll("#spanL").forEach(spanL => {spanL.style.display = "";});
  document.querySelectorAll("#btn-adicionarInsumo").forEach(btnInsumo => btnInsumo.removeAttribute('disabled'));

  document.querySelectorAll('#lista-insumos .insumo-item').forEach(item => {
    item.querySelector('.insumo-select').disabled = false;
    item.querySelector('.lote-insumo-select').disabled = false;
    item.querySelector('.quantidade-insumo').disabled = false;
    item.querySelector('button').disabled = false;
  });
  document.getElementById('btn-adicionarInsumo').style.display = 'block';
  document.getElementById('btn-salvarLote').style.display = 'block';
  document.querySelectorAll('.btnRemoverInsumo').forEach(btn => {
    btn.style.display = 'block';
  });
}

function validarCampos() {
  const camposObrigatorios = ['id_produto', 'lote', 'vencimento', 'fornecedor', 'quantidade'];
  for (let i = 0; i < camposObrigatorios.length; i++) {
    const campo = document.getElementById(camposObrigatorios[i]);
    if (!campo.value) {
      alert("Todos os campos do formulário são obrigatórios!");
      campo.reportValidity(); 
      campo.focus();
      return false;
    }
  }
  return true;
}

// Carregar lista de produtos
fetch('../php/get_produtos.php')
  .then(response => response.json())
  .then(data => {
    const selectProduto = document.getElementById('id_produto');
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id_produto;
      option.textContent = item.nome;
      selectProduto.appendChild(option);
      
      console.log("Executado produtos");
    });
  });


window.onload = tratarRespostaLotes;