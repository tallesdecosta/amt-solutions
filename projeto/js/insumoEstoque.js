// --------------- Funções relacionadas ao cadastro do LOTE --------------- //

// Receber dados do cadastro de lotes
async function mostrarLotes(){

  const filtro = document.getElementById('inputPesquisa').value;
  const url = `../php/insumoLote.php?filtro=${encodeURIComponent(filtro)}`;

  try{
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
};

// Tratativa dos dados dos lotes
async function tratarRespostaLotes(idInsumo){
  lotes = await mostrarLotes(idInsumo);
    
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

        // Adiciona a classe base (alternância de cor de fundo)
        const classeBase = (index % 2 === 0) ? 'linhaWhiteLote' : 'linhaGrayLote';
        linha.classList.add(classeBase);

        // Adiciona a classe de vencido
        if (estaVencido) {
          linha.classList.add('vencido');
        }
      
        linha.innerHTML = `
          <td>${lote.id_Lote}</td>
          <td>${lote.nome_insumo}</td>
          <td>${lote.lote}</td>
          <td>${lote.vencimento}</td>
          <td>${lote.fornecedor}</td>
          <td>${lote.quantidade}</td>
        `;
      
        // Mostra os dados do cadastro ao clicar na linha
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
    }
  }
}

// Botão salvar LOTE method POST
async function btnSalvarLote(){
  if (!validarCampos()) return;
  
  // Pegar os valores dos campos do cadastro de Lote
  const id_insumo = document.getElementById("id_insumo").value.trim();
  const lote = document.getElementById("lote").value.trim();
  const vencimento = document.getElementById("vencimento").value.trim();
  const fornecedor = document.getElementById("fornecedor").value.trim();
  const quantidade = document.getElementById("quantidade").value.trim();

  // Dados que serão enviados para o PHP
  let bodyData = {
    id_insumo,
    lote,
    vencimento,
    fornecedor,
    quantidade
  }

  // Verificar se o usuário selecionou o botão adicionar ou editar
  if(!window.adicionandoLote && window.loteSelecionado){
    // Se o usuário selecionou o botão editar, então o id do lote será incluido em bodyData. 
    bodyData.id = window.loteSelecionado.id_Lote;
  }

  try {
    const resposta = await fetch('../php/insumoLote.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    const res = await resposta.json();

    if (window.adicionandoLote) {
      alert('Lote inserido com sucesso!');
      
    } else {
      alert('Lote salvo com sucesso!');
      
    }

    tratarRespostaLotes();
    limparCampos();
    window.location.reload()
    window.adicionandoLote = false;
    window.loteSelecionado = null;

  } catch (erro) {
    console.error('Erro ao buscar API: ' + erro);
    alert("Estamos passando por problemas de conexão, por favor tente novamente mais tarde.");
  }
};

// Botão deletar
async function btnDeletarLote(){
  // Verificar se algum item foi selecionado
  if (!window.loteSelecionado) {
    alert('Selecione um lote antes!');
    return;
  }

  // Confirmação se deseja deletar
  if (!confirm('Tem certeza que deseja excluir este lote?')) return;

  try{
    const resposta = await fetch(`../php/insumoLote.php?id=${window.loteSelecionado.id_Lote}`, {
      method: 'DELETE'
    });

    const resultado = await resposta.json();
    
    if (resultado.status === 'sucesso') {
      alert('Lote excluído com sucesso!');
      tratarRespostaLotes();
      limparCampos();
      window.loteSelecionado = null;
    }else{
      alert(resultado.mensagem || 'Erro ao deletar o lote.');
    }
  }catch(erro){
    console.error('Erro ao buscar API: ' + erro);
    alert("Estamos passando por problemas de conexão, por favor tente novamente mais tarde.");
  }
};

// --------------- Botões div cadastro LOTE --------------- //

// Botão habilita adicionar cadastro lote
document.getElementById("btn-adicionarLote").addEventListener("click", () => {
  window.adicionandoLote = true;
  window.itemSelecionado = null;
  limparCampos();
  habilitarCamposLote();
})

// Botão habilita editar cadastro lote
document.getElementById("btn-editarLote").addEventListener('click', () => {
  if (!window.loteSelecionado) {
    alert('Selecione um lote para editar');
    return;
  }
  habilitarCamposLote();
  window.adicionandoLote = false;
});

// --------------- Funções gerais --------------- //

// Botão Pesquisa 
document.getElementById('buttonPesquisa').addEventListener('click', () => {
  tratarRespostaLotes();
  limparCampos();
});

// Função limpar campos
function limparCampos() {
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
  document.querySelectorAll("#spanL").forEach(spanL => { spanL.style.display = "none"; });
  document.getElementById('btn-salvarLote').style.display = 'none';
}

// Função habilita campos div cadastro lote
function habilitarCamposLote() {
  document.querySelectorAll('.descricaoLote input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoLote select').forEach(select => select.removeAttribute('disabled'));
  document.querySelectorAll("#spanL").forEach(spanL => { spanL.style.display = ""; });
  document.getElementById('btn-salvarLote').style.display = 'block';
}

// Função validarCampos
function validarCampos() {
  const camposObrigatorios = ['id_insumo', 'lote', 'vencimento', 'fornecedor', 'quantidade'];
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

// Função carregar Insumos
async function carregarInsumos() {
  try {
    const response = await fetch('../php/get_insumos.php');
    if (!response.ok) throw new Error('Erro ao carregar insumos');
    const data = await response.json();

    const selectInsumo = document.getElementById('id_insumo');
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id_insumo;
      option.textContent = item.nome;
      selectInsumo.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

// Executa as funções para carregar os selects
carregarInsumos();
window.onload = tratarRespostaLotes;