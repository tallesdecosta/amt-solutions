// --------------- Funções relacionadas ao cadastro do LOTE --------------- //

// Receber dados do cadastro de lotes
async function mostrarLotes() {

  const filtro = document.getElementById('inputPesquisa').value;
  const url = `../php/insumoLote.php?filtro=${encodeURIComponent(filtro)}`;

  try {
    const resposta = await fetch(url);

    if (resposta.redirected) {
    window.location.href = resposta.url;
    return;
  }

    if (!resposta.ok) {
      throw new Error(`HTTP error! status: ${resposta.status}`);
    } else {
      return resposta.json();
    }
  } catch (erro) {
    console.log("Erro ao buscar API: " + erro);
    alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
  }
};

// Tratativa dos dados dos lotes
async function tratarRespostaLotes(idInsumo) {
  lotes = await mostrarLotes(idInsumo);

  if (lotes) {

    if (lotes.erro) {
      alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
      console.log("Erro: " + lotes.erro);
    } else {

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
async function btnSalvarLote() {
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
  if (!window.adicionandoLote && window.loteSelecionado) {
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
      alerta(1, 1, "Lote inserido com sucesso!", 1)

    } else {
      alerta(1, 1, "Lote salvo com sucesso!", 1)

    }

    document.getElementById('confirmAlerta').addEventListener("click", () => {
      tratarRespostaLotes();
      limparCampos();
      window.location.reload()
      window.adicionandoLote = false;
      window.loteSelecionado = null;
    })




  } catch (erro) {
    console.error('Erro ao buscar API: ' + erro);
    alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
  }
};

// Botão deletar
async function btnDeletarLote() {
  // Verificar se algum item foi selecionado
  if (!window.loteSelecionado) {
    alerta(2, 2, "Selecione um item para excluir", 1)
    return;
  }

  // Confirmação se deseja deletar
  alerta(0, 0, "Tem certeza que deseja excluir este lote?", 1)

  document.getElementById('confirmAlerta').addEventListener("click", async () => {
    try {
      const resposta = await fetch(`../php/insumoLote.php?id=${window.loteSelecionado.id_Lote}`, {
        method: 'DELETE'
      });

      const resultado = await resposta.json();

      if (resultado.status === 'sucesso') {
        alerta(1, 1, "Estoque excluido com sucesso!", 1)
        tratarRespostaLotes();
        limparCampos();
        window.loteSelecionado = null;
      } else {
        alerta(2, 3, "Erro ao deletar o lote.", 1)
      }
    } catch (erro) {
      console.error('Erro ao buscar API: ' + erro);
      alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }
  })


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
    alerta(2, 2, "Selecione um item para editar.", 1)
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




function alerta(icone, cor, text, nBotoes) {

  let icones = ['bi bi-cone-striped', 'bi bi-check-circle-fill', 'bi bi-exclamation-diamond-fill'] // 0 = cone, 1 = check, 2 = alert

  let cores = ['#d0ae3f', '#73df77', '#ebeb31', '#dd3f3f']// 0 = laranja, 1 = verder, 2 = amarelo, 3 = vermelho

  let alerta = document.getElementById('alertaPadrão')

  let body = document.querySelector('body')

  body.style.overflow = 'hidden'

  alerta.style.display = 'flex'

  let p = document.getElementById('pAlerta')
  let i = document.getElementById('iconeAlerta')

  i.className = icones[icone]
  i.style.color = `${cores[cor]}`
  p.innerText = text

  if (nBotoes == 2) {

    let botoes = document.getElementById('botoesAlerta')

    but1 = '<button class="but1" id="confirmAlerta">Confirmar</button>'
    but2 = '<button class="but2" id="cancelAlerta">Cancelar</button>'

    botoes.innerHtml = but1 + but2

    botoes.style.justifyContent = 'center'

    let cancel = document.getElementById('cancelAlerta')

    cancel.addEventListener("click", () => {

      alerta.style.display = 'none'

      body.style.overflow = 'auto'

    })

  } else if (nBotoes == 1) {

    let botoes = document.getElementById('botoesAlerta')

    but1 = '<button class="but1" id="confirmAlerta">Confirmar</button>'

    botoes.innerHTML = but1

    botoes.style.justifyContent = 'end'

    but1 = document.getElementById("confirmAlerta")

    but1.innerText = 'OK'

    but1.addEventListener("click", () => {

      alerta.style.display = 'none'

      body.style.overflow = 'auto'

    })
  }

}