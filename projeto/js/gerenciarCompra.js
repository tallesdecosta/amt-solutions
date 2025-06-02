// --------------- Funções relacionadas a cadastrar pedido de compras --------------- //

// Receber dados do cadastro de pedido de compras
async function chamarPHP(){
  const filtro = document.getElementById('inputPesquisa').value;
  let url = `../php/gerenciarCompra.php?filtro=${(filtro)}`;

  try{
    const resposta = await fetch(url);

    if(!resposta.ok){
      throw new Error(`HTTP error! status: ${resposta.status}`)
    }else{
      return resposta.json();
    }

  }catch(erro){
    console.log("Erro ao buscar API: " + erro);
    alert("Estamos passando por problemas de conexão, por favor tente novamente mais tarde");
  }
}

// Tratativa dos dados do cadastro de pedido de compras
async function tratarResposta(){
  dados = await chamarPHP();

  if(dados){
    if(dados.erro){
      alert(dados.resposta);
      console.log("Erro " + dados.erro);
    }else{
      const tbody = document.getElementById('tabela-corpo');
      tbody.innerHTML = '';

      dados.forEach((item, index) => {

        // Insere linha com os dados na tabela tbody
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

        // Mostra os dados do cadastro ao clicar na linha
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
    }
  }
}

// Botão salvar method POST
async function btnSalvar(){

  if (!validarCampos()) return;
  
  // Pegar os valores dos campos do cadastro
  let id_insumo = document.getElementById('id_insumo').value;
  let id_usuario = document.getElementById('id_usuario').value;
  let dataEmissao = document.getElementById('dataEmissao').value;
  let pedido_status = document.getElementById('pedido_status').value;
  let qntComprar = document.getElementById('qntComprar').value;
  let observacao = document.getElementById('observacao').value;

  // Dados que serão enviados para o PHP
  const dadosEnviar = {
    id_insumo,
    id_usuario,
    dataEmissao,
    pedido_status,
    qntComprar,
    observacao
  };

  // Verificar se o usuário selecionou o botão adicionar ou editar
  if(!window.adicionandoNovo && window.itemSelecionado){
    // Se o usuário selecionou o botão editar, então o id do pedido será incluido em dadosEnviar. 
    dadosEnviar.id = window.itemSelecionado.id_pedido;
  };

  try{
    const resposta = await fetch("../php/gerenciarCompra.php", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dadosEnviar)
    })
    
    const res = await resposta.json();

    if(window.adicionandoNovo){
      alert('Inserido com sucesso!');
      window.adicionandoNovo = false;
    }else{
      alert('Salvo com sucesso!');
    }
    tratarResposta();
    limparCampos();
    window.itemSelecionado = null;
  }catch(erro){
    console.error('Erro ao buscar API: ' + erro);
    alert("Estamos passando por problemas de conexão, por favor tente novamente mais tarde.");
  }

}

// --------------- Botões cadastro pedido de compras --------------- //  

async function btnDeletar(){
  // Verificar se algum item foi selecionado
  if (!window.itemSelecionado) {
    alert('Selecione um item antes.');
    return;
  }

  // Confirmação se deseja deletar
  if (!confirm('Tem certeza que deseja excluir este item?')) return;
  
  try{
    const resposta = await fetch(`../php/gerenciarCompra.php?id=${window.itemSelecionado.id_pedido}`, {
      method: 'DELETE'
    });
    
    const resJson = await resposta.json();

    alert('Excluído com sucesso!');
    tratarResposta();
    limparCampos();
    window.itemSelecionado = null;
  }catch(erro){
    console.error('Erro ao buscar API: ' + erro);
    alert("Estamos passando por problemas de conexão, por favor tente novamente mais tarde.");
  }
  
}

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
  
// --------------- Funções gerais --------------- //

// Botão Pesquisa 
document.getElementById('buttonPesquisa').addEventListener('click', () => {
  chamarPHP();
  limparCampos();
});

// Função limpar campos
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
  document.getElementById('btn-salvar').style.display = 'none';
}

// Função habilita campos
function habilitarCampos(){
  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoItem select').forEach(select => select.removeAttribute('disabled'));
  document.querySelectorAll('.observacaoItem textarea').forEach(textarea => textarea.removeAttribute('disabled'));
  document.querySelectorAll("#span").forEach(span => {span.style.display = "";});
  document.getElementById('btn-salvar').style.display = 'block';
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

// Função validarCampos
function validarCampos() {
  const camposObrigatorios = ['id_insumo', 'id_usuario', 'dataEmissao', 'pedido_status', 'qntComprar'];
  for (let i = 0; i < camposObrigatorios.length; i++) {
    const campo = document.getElementById(camposObrigatorios[i]);
    if (!campo.value) {
      alert("Com exceção do campo 'Observação', o preenchimento dos demais campos é obrigatório.");
      campo.reportValidity(); 
      campo.focus();
      return false;
    }
  }
  return true;
}

// Função carregar Usuários
async function carregarUsuarios() {
  try {
    const response = await fetch('../php/get_usuarios.php');
    if (!response.ok) throw new Error('Erro ao carregar usuários');
    const data = await response.json();

    const selectUsuario = document.getElementById('id_usuario');
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id_usuario;
      option.textContent = item.nome;
      selectUsuario.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

// Executa as funções para carregar os selects
carregarInsumos();
carregarUsuarios();

window.onload = tratarResposta;
