// Funções gerais

document.getElementById("btn-divProduto").addEventListener("click", () => {
  document.querySelector(".cadastroProduto").classList.toggle("esconder");
});

document.getElementById("btn-divLote").addEventListener("click", () => {
  document.querySelector(".cadastroLote").classList.toggle("esconder");
});

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

  const btnAlergia = document.querySelectorAll("#btn-adicionarAlergia");
  btnAlergia.forEach(btnAlergia => {
    btnAlergia.value = '';
    btnAlergia.setAttribute('disabled', true);
  });

  const btnInsumo = document.querySelectorAll("#btn-adicionarInsumo");
  btnInsumo.forEach(btnInsumo => {
    btnInsumo.value = '';
    btnInsumo.setAttribute('disabled', true);
  });

  const tbody = document.getElementById("tabela-lote-corpo");
  tbody.innerHTML = ""; 

  const pictureImage = document.querySelector('.picture_image');
  const pictureImageTxt = 'Choose an image';
  pictureImage.innerHTML = pictureImageTxt;

  const pictureLabel = document.querySelector('.picture');
  pictureLabel.style.backgroundColor = '#ddd';
  pictureLabel.style.border = '2px dashed #aaa';

  document.querySelectorAll("#span").forEach(span => {span.style.display = "none";});
  document.querySelectorAll("#spanL").forEach(spanL => {spanL.style.display = "none";}); 
}

function habilitarCampos(){
  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoItem select').forEach(select => select.removeAttribute('disabled'));
  document.querySelectorAll("#span").forEach(span => {span.style.display = "";});
  document.querySelectorAll("#btn-adicionarAlergia").forEach(btnAlergia => btnAlergia.removeAttribute('disabled'));

  document.querySelectorAll('#lista-insumos .insumo-item').forEach(item => {
    item.querySelector('.insumo-select').disabled = false;
    item.querySelector('.lote-insumo-select').disabled = false;
    item.querySelector('.quantidade-insumo').disabled = false;
    item.querySelector('button').disabled = false;
  });

  document.querySelectorAll('#lista-alergias .insumo-alergia').forEach(item => {
    item.querySelector('.alergia-select').disabled = false;
    item.querySelector('button').disabled = false;
  });

}

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
}

// Cadastro Produtos

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

async function chamarPHP() {
  try {
    const filtro = document.getElementById('inputPesquisa').value;
    const url = `../php/produto.php?filtro=${encodeURIComponent(filtro)}`;
    
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error('Erro no servidor');
    
    const dados = await resposta.json();
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
        <td>${item.quantidadeTotal}</td>
        <td>${item.qntMinima}</td>
      `;
      
      linha.addEventListener('click', () => {
        window.itemSelecionado = item;
        window.adicionandoNovo = false;
        
        document.getElementById('nome').value = item.nome || '';
        document.getElementById('categoria').value = item.categoria || '';
        document.getElementById('qntMinima').value = item.qntMinima || '';
        document.getElementById('valor').value = item.valor || '';
        document.getElementById('localizacao').value = item.localizacao || '';
        document.getElementById('quantidadeTotal').value = item.quantidadeTotal || '';
        
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
        mostrarLotes(item.id_produto);
      });
      
      tbody.appendChild(linha);
    });
    
    limparCampos();
  } catch (error) {
    console.error('Erro:', error);
  }
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

// Botão SALVAR
document.getElementById('btn-salvar').addEventListener('click', async () => {
  try {
    let itemNome = document.getElementById("nome").value;
    let itemCategoria = document.getElementById("categoria").value;
    let itemQntMinima = document.getElementById("qntMinima").value;
    let itemValor = document.getElementById("valor").value;
    let itemLocalizacao = document.getElementById("localizacao").value;
    let itemQuantidadeTotal = document.getElementById("quantidadeTotal").value;

    const alergias = [];
    let camposIncompletos2 = false;

    document.querySelectorAll('.insumo-alergia').forEach(item => {
      const alergia = item.querySelector('.alergia-select').value;

      if (!alergia) {
        camposIncompletos2 = true;
      } else {
        alergias.push({
          id_alergia: parseInt(alergia)
        });
      }
    });

    if (
      (window.adicionandoNovo || window.itemSelecionado) &&
      itemNome && itemCategoria && itemQntMinima &&
      itemValor && itemValor !== 'R$ ' && itemLocalizacao
    ) {
      const imagemFile = await getImagem();

      const dados = {
        nome: itemNome,
        categoria: itemCategoria,
        qntMinima: itemQntMinima,
        valor: itemValor,
        localizacao: itemLocalizacao,
        quantidadeTotal: itemQuantidadeTotal
      };

      if (window.adicionandoNovo) {
        dados.imagem = imagemFile;
      } else if (imagemFile) {
        dados.imagem = imagemFile;
        dados.id = window.itemSelecionado.id_produto;
      } else {
        dados.id = window.itemSelecionado.id_produto;
      }

      const resposta = await fetch('../php/produto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      const resJson = await resposta.json();

      alert(window.adicionandoNovo ? 'Inserido com sucesso!' : 'Salvo com sucesso!');

      if (!camposIncompletos2) {
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

      chamarPHP();
      mostrarLotes();
      limparCampos();
      window.adicionandoNovo = false;
      window.itemSelecionado = null;
      window.location.reload()

    } else {
      alert("Todos os campos do formulário são obrigatórios!");
    }
  } catch (err) {
    console.error('Erro ao salvar:', err);
  }
});

// Botão DELETAR
document.getElementById('btn-deletar').addEventListener('click', async () => {
  try {
    if (!window.itemSelecionado) {
      alert('Selecione um item antes.');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    const resposta = await fetch(`../php/produto.php?id=${window.itemSelecionado.id_produto}`, {
      method: 'DELETE'
    });

    const resJson = await resposta.json();

    alert('Excluído com sucesso!');
    chamarPHP();
    mostrarLotes();
    limparCampos();
    window.itemSelecionado = null;
  } catch (err) {
    console.error('Erro ao deletar:', err);
  }
});

// Lotes
async function mostrarLotes(idProduto = null) {
  try {
    let url = '../php/produtoLote.php';
    if (idProduto) {
      url += `?id_produto=${idProduto}`;
    }

    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error('Erro ao buscar lotes');
    const lotes = await resposta.json();

    const tbody = document.querySelector('#tabela-lote-corpo');
    tbody.innerHTML = '';

    if (!Array.isArray(lotes)) {
      console.error('Resposta inválida do servidor:', lotes);
      return;
    }

    lotes.forEach((lote, index) => {
      const linha = document.createElement('tr');
      const classe = (index % 2 === 0) ? 'linhaWhiteLote' : 'linhaGrayLote';
      linha.classList.add(classe);

      linha.innerHTML = `
        <td>${lote.id_Lote}</td>
        <td>${lote.lote}</td>
        <td>${lote.vencimento}</td>
        <td>${lote.fornecedor}</td>
        <td>${lote.quantidade}</td>
      `;
      linha.addEventListener('click', () => {
        window.loteSelecionado = lote;
        window.adicionandoLote = false;
        document.getElementById('id_produto').value = lote.id_produto;
        document.getElementById('lote').value = lote.lote;
        document.getElementById('vencimento').value = lote.vencimento;
        document.getElementById('fornecedor').value = lote.fornecedor;
        document.getElementById('quantidade').value = lote.quantidade;

        carregarInsumosVinculados(lote.id_Lote);
      });
      tbody.appendChild(linha);
    });

  } catch (erro) {
    console.error('Erro ao carregar lotes:', erro);
  }
}


// Função para buscar e mostrar insumos vinculados ao lote
async function carregarInsumosVinculados(idLote) {
  try {
    const url2 = `../php/produtoLoteInsumos.php?id_lote=${idLote}`;
    const resposta = await fetch(url2);
    if (!resposta.ok) throw new Error('Erro ao buscar insumos dos lotes');

    const insumos = await resposta.json();

    const container = document.getElementById('lista-insumos');
    container.innerHTML = '';

    if (!Array.isArray(insumos)) {
      console.error('Resposta inválida dos insumos:', insumos);
      return;
    }

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
        <button type="button" onclick="removerInsumo(this)" disabled>Remover</button>
      `;
      container.appendChild(div);
    });
  } catch (erro) {
    console.error('Erro ao carregar insumos vinculados:', erro);
  }
}

async function carregarAlergiasVinculadas(idProduto) {
  try {
    const resposta = await fetch(`../php/produtoAlergia.php?id_produto=${idProduto}`);
    if (!resposta.ok) throw new Error('Erro ao buscar alergias vinculadas');

    const alergias = await resposta.json();

    const container = document.getElementById('lista-alergias');
    container.innerHTML = '';

    if (!Array.isArray(alergias)) {
      console.error('Resposta inválida das alergias:', alergias);
      return;
    }

    alergias.forEach(alergia => {
      const div = document.createElement('div');
      div.classList.add('insumo-alergia');

      div.innerHTML = `
        <select class="alergia-select" disabled>
          <option value="${alergia.id_alergia}" selected>${alergia.nome}</option>
        </select>
        <button type="button" onclick="removerAlergias(this)" disabled>Remover</button>
      `;

      container.appendChild(div);
    });
  } catch (erro) {
    console.error('Erro ao carregar alergias vinculadas:', erro);
  }
}

document.getElementById("btn-adicionarLote").addEventListener("click", () => {
  window.adicionandoLote = true;
  window.itemSelecionado = null;
  limparCampos();
  habilitarCamposLote();
})

document.getElementById("btn-editarLote").addEventListener('click', () => {
  if (!window.loteSelecionado) {
    alert('Selecione um lote para editar');
    return;
  }
  habilitarCamposLote();
  window.adicionandoLote = false;
});

document.getElementById('btn-salvarLote').addEventListener('click', async () => {
  let loteProduto = document.getElementById("id_produto").value;
  let loteLote = document.getElementById("lote").value;
  let loteVencimento = document.getElementById("vencimento").value;
  let loteFornecedor = document.getElementById("fornecedor").value;
  let loteQuantidade = document.getElementById("quantidade").value;

  if (!loteProduto || !loteLote || !loteVencimento || !loteFornecedor || !loteQuantidade) {
    alert("Preencha todos os campos do lote do produto.");
    return;
  }

  const loteData = {
    id_produto: loteProduto,
    lote: loteLote,
    vencimento: loteVencimento,
    fornecedor: loteFornecedor,
    quantidade: loteQuantidade
  };

  const insumos = [];
  let camposIncompletos = false;

  document.querySelectorAll('.insumo-item').forEach(item => {
    const id_insumo = item.querySelector('.insumo-select').value;
    const id_loteInsumo = item.querySelector('.lote-insumo-select').value;
    const quantidade = item.querySelector('.quantidade-insumo').value;

    if ((id_insumo || id_loteInsumo || quantidade) && (!id_insumo || !id_loteInsumo || !quantidade)) {
      camposIncompletos = true;
    } else if (id_insumo && id_loteInsumo && quantidade) {
      insumos.push({
        id_insumoLote: id_loteInsumo,
        id_insumo,
        quantidade
      });
    }
  });

  if (camposIncompletos) {
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

      chamarPHP();
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

      chamarPHP();
      limparCampos();
      window.loteSelecionado = null;
    }
  } catch (err) {
    console.error('Erro ao salvar lote:', err);
    alert('Erro ao salvar lote. Veja o console para detalhes.');
  }
});

document.getElementById('btn-deletarLote').addEventListener('click', async () => {
  if(!window.loteSelecionado){
    alert('Selecione um lote antes!');
    return;
  }

  if(!confirm('Tem certeza que deseja excluir este lote?')) return;

  try {
    const res = await fetch(`../php/produtoLote.php?id=${window.loteSelecionado.id_Lote}`, {
      method: 'DELETE'
    });
    const resJson = await res.json();

    alert('Lote excluído com sucesso!');
    chamarPHP();
    limparCampos();
    window.loteSelecionado = null;
  } catch(err) {
    console.error('Erro ao deletar o lote:', err);
    alert('Erro ao deletar o lote. Veja o console para detalhes.');
  }
});

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
    <button type="button" onclick="removerInsumo(this)">Remover</button>
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

document.getElementById("btn-adicionarAlergia").addEventListener("click", async () => {
  try {
    const container = document.getElementById('lista-alergias');

    const div = document.createElement('div');
    div.classList.add('insumo-alergia');

    div.innerHTML = `
      <select class="alergia-select">
        <option value="">Selecione uma alergia</option>
      </select>
      <button type="button" onclick="removerAlergias(this)">Remover</button>
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

// Carregar produtos
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

window.onload = chamarPHP;