// --------------- Configuração IMAGEM --------------- //

const inputFile = document.querySelector('#picture_input');
const pictureImage = document.querySelector('.picture_image');
const pictureLabel = document.querySelector('.picture');
const pictureImgPreview = document.getElementById('picture_img');
const pictureImageTxt = 'Choose an image';

// Inicializa com texto
pictureImage.innerHTML = pictureImageTxt;

// Quando carregar a página, só se tiver src, mostrar imagem
if(pictureImgPreview.src && pictureImgPreview.src !== window.location.href) {
  pictureImage.innerHTML = '';
  pictureImage.appendChild(pictureImgPreview);
}

inputFile.addEventListener('change', function(e) {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener('load', function(e) {
      // Limpa o texto e mostra a imagem com o src do arquivo
      pictureImage.innerHTML = '';
      pictureImgPreview.src = e.target.result;
      pictureImage.appendChild(pictureImgPreview);
    });

    reader.readAsDataURL(file);
  } else {
    // Se não tiver arquivo, mostra o texto e esconde a imagem
    pictureImage.innerHTML = pictureImageTxt;
    pictureImgPreview.src = '';
  }
});

// Função getImagem
function getImagem() {
  const file = inputFile.files[0];
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }
  });
}

// --------------- Funções relacionadas ao cadastro do PRODUTO --------------- //

// Receber dados do cadastro de produtos
async function chamarPHP(){
  const filtro = document.getElementById('inputPesquisa').value;
  const url = `../php/produto.php?filtro=${encodeURIComponent(filtro)}`;

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
};

// Tratativa dos dados dos produtos
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
          <td>${item.id_produto}</td>
          <td>${item.nome}</td>
          <td>${item.categoria}</td>
          <td>R$ ${item.valor}</td>
          <td>${item.quantidadeTotal}</td>
          <td>${item.qntMinima}</td>
        `;

        // Mostra os dados do cadastro ao clicar na linha
        linha.addEventListener('click', () => {
          window.itemSelecionado = item;
          window.adicionandoNovo = false;

          document.getElementById('nome').value = item.nome || '';
          document.getElementById('categoria').value = item.categoria || '';
          document.getElementById('qntMinima').value = item.qntMinima || '';
          document.getElementById('valor').value = item.valor || '';
          document.getElementById('localizacao').value = item.localizacao || '';
          document.getElementById('quantidadeTotal').textContent = item.quantidadeTotal || '';

          // Atualiza imagem
          if (pictureImgPreview) {
            if (item.imagem) {
              pictureImgPreview.src = `../img/${item.imagem}`;
              pictureImage.innerHTML = '';
              pictureImage.appendChild(pictureImgPreview);
              pictureLabel.style.backgroundColor = 'transparent';
              pictureLabel.style.border = 'none';
            } else {
              pictureImage.innerHTML = pictureImageTxt;
              pictureImgPreview.src = '';
              pictureLabel.style.backgroundColor = '#ddd';
              pictureLabel.style.border = '2px dashed #aaa';
            }
          }

          carregarAlergiasVinculadas(item.id_produto);
          tratarAlergiasVinculadar(item.id_produto);
        });

        tbody.appendChild(linha);
      });

      limparCampos();
    }
  }
};

// Botão salvar PRODUTO method POST
async function btnSalvar(){
  if (!validarCampos()) return;
  // Pegar os valores dos campos do cadastro
  let nome = document.getElementById("nome").value;
  let categoria = document.getElementById("categoria").value;
  let qntMinima = document.getElementById("qntMinima").value;
  let valor = document.getElementById("valor").value;
  let localizacao = document.getElementById("localizacao").value;

  // Dados que serão enviados para o PHP
  const dadosEnviar = {
    nome,
    categoria,
    qntMinima,
    valor,
    localizacao
  }

  // Cria a lista de alergias
  const alergias = [];

  let naoAlergia = false;

  // Verifica se tem alergias no cadastro do produto, caso tenha, adiciona na lista alergias
  document.querySelectorAll('.insumo-alergia').forEach(item => {
    const alergia = item.querySelector('.alergia-select').value;
    if (!alergia) {
      naoAlergia = true;
    } else {
      alergias.push({
        id_alergia: parseInt(alergia)
      });
    }
  });

  // Verifica se é para adicionar ou editar e se os campos estão preenchidos
  if(window.adicionandoNovo || window.itemSelecionado){
    
    const imagemFile = await getImagem();

    // Verificar se é adicionar item ou editar item + Validação de imagem
    if(window.adicionandoNovo){
      // Adcionado imagem em dadosEnviar para novos produtos
      dadosEnviar.imagem = imagemFile;
    }else if(imagemFile){
      // Caso selecionar um item, e esse item tenha imagem, irá carregar a imagem e adicionar em dadosEnviar para method UPDATE
      dadosEnviar.imagem = imagemFile;
      dadosEnviar.id = window.itemSelecionado.id_produto;
    }else{
      // Caso selecionar um item, e esse item NÃO tenha imagem, irá adicionar apenas o ID em dadosEnviar para method UPDATE
      dadosEnviar.id = window.itemSelecionado.id_produto;
    }
  }

  try{
    // Envia os dados para o PHP
    const resposta = await fetch('../php/produto.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosEnviar)
    });

    const resJson = await resposta.json();

    alert(window.adicionandoNovo ? 'Inserido com sucesso!' : 'Salvo com sucesso!');

    // Caso tenha alergia, será enviado para o PHP produtoAlergia, vinculando alergia e produto no BD
    if(!naoAlergia){
      const alergiasResposta = await fetch('../php/produtoAlergia.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_produto: window.adicionandoNovo ? resJson.id_produto : window.itemSelecionado.id_produto,
          alergias: alergias
        })
      });

      const text = await alergiasResposta.text();
      try {
        const json = JSON.parse(text);
        console.log(window.adicionandoNovo ? "Alergias salvas:" : "Alergias atualizadas:", json);
      } catch (e) {
        console.error("Erro ao converter resposta JSON:", e, text);
      }
    }

    tratarResposta();
    limparCampos();
    window.adicionandoNovo = false;
    window.itemSelecionado = null;
    window.location.reload()

  }catch(erro){
    console.error('Erro ao buscar API: ' + erro);
    alert("Estamos passando por problemas de conexão, por favor tente novamente mais tarde.");
  }
}

// Receber dados do cadastro de produtos ALERGIAS
async function carregarAlergiasVinculadas(idProduto){
  try {
    const resposta = await fetch(`../php/produtoAlergia.php?id_produto=${idProduto}`);
    
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

// Tratativa dos dados dos produtos ALERGIAS
async function tratarAlergiasVinculadar(idProduto){
  alergias = await carregarAlergiasVinculadas(idProduto);

  if(alergias){
    if(alergias.erro){
      alert(alergias.resposta);
      console.log("Erro: " + alergias.erro);
    }else{
      const container = document.getElementById('lista-alergias');
      container.innerHTML = '';

      alergias.forEach(alergia => {
        const div = document.createElement('div');
        div.classList.add('insumo-alergia');
        
        div.innerHTML = `
          <select class="alergia-select" disabled>
            <option value="${alergia.id_alergia}" selected>${alergia.nome}</option>
          </select>
          <button type="button" class="buttonPadrao btnRemoverAlergia" onclick="removerAlergias(this)" style="display: none;">Remover</button>
        `;
        container.appendChild(div);
      });
    }
  }
}

// --------------- Botões div cadastro PRODUTO --------------- //

// Botão Deletar
async function btnDeletar(){
  // Verificar se algum item foi selecionado
  if (!window.itemSelecionado) {
      alert('Selecione um item antes.');
      return;
  }
    
  // Confirmação se deseja deletar
  if (!confirm('Tem certeza que deseja excluir este item?')) return;
  
  try{
    const resposta = await fetch(`../php/produto.php?id=${window.itemSelecionado.id_produto}`, {
      method: 'DELETE'
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert(resultado.erro || "Erro ao deletar produto.");
      return;
    }

    alert("Produto deletado com sucesso!");
    tratarResposta();
    limparCampos();
    window.adicionandoNovo = false;
    window.itemSelecionado = null;
  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    alert("Erro ao deletar o produto. Tente novamente.");
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

document.getElementById("btn-adicionarAlergia").addEventListener("click", async () => {
  try {
    const container = document.getElementById('lista-alergias');

    const div = document.createElement('div');
    div.classList.add('insumo-alergia');

    div.innerHTML = `
      <select class="alergia-select">
        <option value="">Selecione uma alergia</option>
      </select>
      <button type="button" class="buttonPadrao btnRemoverAlergia" onclick="removerAlergias(this)">Remover</button>
    `;

    container.appendChild(div);

    const selectAlergia = div.querySelector('.alergia-select');

    // Carrega a lista de alergias no select 
    const response = await fetch('../php/get_alergias.php');
    if (!response.ok) throw new Error('Erro ao buscar alergias');

    const data = await response.json();

    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id_alergia;
      option.textContent = item.nome;
      selectAlergia.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar alergias:', error);
    alert('Erro ao carregar alergias. Tente novamente.');
  }
});

function removerAlergias(botao) {
  if (window.itemSelecionado && window.itemSelecionado.id_produto) {
    const alergiaItem = botao.closest('.insumo-alergia');
    const idAlergia = alergiaItem.querySelector('.alergia-select').value;

    if (!window.alergiasRemovidas) {
      window.alergiasRemovidas = new Set();
    }

    if (idAlergia) {
      window.alergiasRemovidas.add(parseInt(idAlergia));
      console.log('Alergia marcada para remoção:', idAlergia);
    }
  }

  // Remove do DOM
  botao.parentElement.remove();
}

// --------------- Funções gerais --------------- //

//Botão pesquisa
document.getElementById('buttonPesquisa').addEventListener('click', () => {
  tratarResposta();
  limparCampos();
});

// Função limpar campos
function limparCampos(){
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

  const btnAlergia = document.querySelectorAll("#btn-adicionarAlergia");
  btnAlergia.forEach(btnAlergia => {
    btnAlergia.value = '';
    btnAlergia.setAttribute('disabled', true);
  });

  const pictureImage = document.querySelector('.picture_image');
  const pictureImageTxt = 'Choose an image';
  pictureImage.innerHTML = pictureImageTxt;

  const pictureLabel = document.querySelector('.picture');
  pictureLabel.style.backgroundColor = '#ddd';
  pictureLabel.style.border = '2px dashed #aaa';

  document.querySelectorAll("#span").forEach(span => {span.style.display = "none";});
  document.querySelectorAll("#spanL").forEach(spanL => {spanL.style.display = "none";}); 

  document.getElementById('quantidadeTotal').textContent = "";
  
  document.getElementById('btn-adicionarAlergia').style.display = 'none';
  document.getElementById('btn-salvar').style.display = 'none';
  document.querySelectorAll('.btnRemoverAlergia').forEach(btn => {
      btn.style.display = 'none';
    });
}

// Função habilita campos div cadastro PRODUTO
function habilitarCampos(){
    document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
    document.querySelectorAll('.descricaoItem select').forEach(select => select.removeAttribute('disabled'));
    document.querySelectorAll("#span").forEach(span => {span.style.display = "";});
    document.querySelectorAll("#btn-adicionarAlergia").forEach(btnAlergia => btnAlergia.removeAttribute('disabled'));

    document.getElementById('btn-adicionarAlergia').style.display = 'block';
    document.getElementById('btn-salvar').style.display = 'block';
    document.querySelectorAll('.btnRemoverAlergia').forEach(btn => {
      btn.style.display = 'block';
    });

    document.querySelectorAll('#lista-alergias .insumo-alergia').forEach(item => {
      item.querySelector('.alergia-select').disabled = false;
      item.querySelector('button').disabled = false;
    });

}

function validarCampos() {
  const camposObrigatorios = ['nome', 'categoria', 'qntMinima', 'valor', 'localizacao'];
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

window.onload = tratarResposta;