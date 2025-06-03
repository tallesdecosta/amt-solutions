// --------------- Funções relacionadas ao cadastro do INSUMO --------------- //

// Receber dados do cadastro de insumos
async function chamarPHP() {
  const filtro = document.getElementById('inputPesquisa').value;
  let url = `../php/insumo.php?filtro=${filtro}`;

  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error(`HTTP error! status: ${resposta.status}`)
    } else {
      return resposta.json();
    }

  } catch (erro) {
    console.log("Erro ao buscar API: " + erro);
    alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
  }
}

// Tratativa dos dados dos insumos
async function tratarResposta() {
  dados = await chamarPHP();

  if (dados) {

    if (dados.erro) {
      alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
      console.log("Erro: " + dados.erro);
    } else {

      const tbody = document.getElementById('tabela-corpo');
      tbody.innerHTML = '';

      dados.forEach((item, index) => {

        // Insere linha com os dados na tabela tbody
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

        // Mostra os dados do cadastro ao clicar na linha
        linha.addEventListener('click', () => {
          window.itemSelecionado = item;
          window.adicionandoNovo = false;
          document.getElementById('nome').value = item.nome || '';
          document.getElementById('classificacao').value = item.classificacao || '';
          document.getElementById('qntMinima').value = item.qntMinima || '';
          document.getElementById('inspReceb').value = item.inspReceb || '';
          document.getElementById('localizacao').value = item.localizacao || '';
          document.getElementById('quantidadeTotal').textContent = item.quantidadeTotal || '';
        })
        tbody.appendChild(linha);
      });
      limparCampos();
    }
  }
};

// Botão salvar method POST
async function btnSalvar() {
  if (!validarCampos()) return;
  // Pegar os valores dos campos do cadastro
  const nome = document.getElementById("nome").value;
  const classificacao = document.getElementById("classificacao").value;
  const qntMinima = document.getElementById("qntMinima").value;
  const inspReceb = document.getElementById("inspReceb").value;
  const localizacao = document.getElementById("localizacao").value;

  // Dados que serão enviados para o PHP
  let dadosEnviar = {
    nome,
    classificacao,
    qntMinima,
    inspReceb,
    localizacao
  };

  // Verificar se o usuário selecionou o botão adicionar ou editar
  if (!window.adicionandoNovo && window.itemSelecionado) {
    // Se o usuário selecionou o botão editar, então o id do insumo será incluido em dadosEnviar. 
    dadosEnviar.id = window.itemSelecionado.id_insumo;
  };

  try {
    const response = await fetch("../php/insumo.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosEnviar)
    })

    const resultado = await response.json();

    if (window.adicionandoNovo) {
      alerta(1, 1, "Inserido com sucesso!", 1)
    } else {
      alerta(1, 1, "Salvo com sucesso!", 1)
    }

    document.getElementById("confirmAlerta").addEventListener("click", async () => {
      tratarResposta();
      limparCampos();
      window.adicionandoNovo = false;
      window.itemSelecionado = null;
      window.location.reload();
    })



  } catch (erro) {
    console.error('Erro ao buscar API: ' + erro);
    alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
  }
};

// Botão deletar
async function btnDeletar() {
  // Verificar se algum item foi selecionado
  if (!window.itemSelecionado) {
    alerta(2, 2, "Selecione um item para excluir", 1)
    return;
  }

  // Confirmação se deseja deletar
  alerta(2, 2, "Tem certeza que deseja excluir este item?", 2)

  document.getElementById("confirmAlerta").addEventListener("click", async () => {
    try {
      const resposta = await fetch(`../php/insumo.php?id=${window.itemSelecionado.id_insumo}`, {
        method: 'DELETE'
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        (0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        return;
      }

      alerta(1, 1, "Excluído com sucesso!", 1)
      tratarResposta();
      limparCampos();
      window.itemSelecionado = null;

    } catch (erro) {
      console.error('Erro ao buscar API: ' + erro);
      alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
    }
  })
};

// --------------- Botões div cadastro INSUMO --------------- //

// Botão  habilitaadicionar cadastro insumo
document.getElementById('btn-adicionar').addEventListener('click', () => {
  window.adicionandoNovo = true;
  window.itemSelecionado = null;
  limparCampos();
  habilitarCampos();
});

// Botão habilita editar cadastro insumo
document.getElementById('btn-editar').addEventListener('click', () => {
  if (!window.itemSelecionado) {
    alerta(2, 2, "Selecione um item para editar", 1)
    return;
  }
  habilitarCampos();
  window.adicionandoNovo = false;
});

// --------------- Funções gerais --------------- //

// Botão Pesquisa 
document.getElementById('buttonPesquisa').addEventListener('click', async () => {
  tratarResposta();
  limparCampos();
});

// Função limpar campos
function limparCampos() {
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

  document.getElementById('quantidadeTotal').textContent = "";

  document.querySelectorAll("#span").forEach(span => { span.style.display = "none"; });
  document.getElementById('btn-salvar').style.display = 'none';
}

// Função habilita campos div cadastro insumo
function habilitarCampos() {
  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoItem select').forEach(select => select.removeAttribute('disabled'));
  document.querySelectorAll("#span").forEach(span => { span.style.display = ""; });
  document.getElementById('btn-salvar').style.display = 'block';
}

// Função validarCampos
function validarCampos() {
  const camposObrigatorios = ['nome', 'classificacao', 'qntMinima', 'inspReceb', 'localizacao'];
  for (let i = 0; i < camposObrigatorios.length; i++) {
    const campo = document.getElementById(camposObrigatorios[i]);
    if (!campo.value) {
      alerta(2, 2, "Todos os campos do formulário são obrigatórios!", 1);
      campo.reportValidity();
      campo.focus();
      return false;
    }
  }
  return true;
}







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