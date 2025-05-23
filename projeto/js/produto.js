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

  const tbody = document.getElementById("tabela-lote-corpo");
  tbody.innerHTML = ""; 

  const pictureImage = document.querySelector('.picture_image');
  const pictureImageTxt = 'Choose an image';
  pictureImage.innerHTML = pictureImageTxt;

  const pictureLabel = document.querySelector('.picture');
  pictureLabel.style.backgroundColor = '#ddd';
  pictureLabel.style.border = '2px dashed #aaa';
  
}

function habilitarCampos(){
  document.querySelectorAll('.descricaoItem input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoItem select').forEach(select => select.removeAttribute('disabled'));
}

function habilitarCamposLote() {
  document.querySelectorAll('.descricaoLote input').forEach(input => input.removeAttribute('disabled'));
  document.querySelectorAll('.descricaoLote select').forEach(select => select.removeAttribute('disabled'));
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

          mostrarLotes(item.id_produto);
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
document.getElementById('btn-salvar').addEventListener('click', () => {
  let itemNome = document.getElementById("nome").value;
  let itemCategoria = document.getElementById("categoria").value;
  let itemQntMinima = document.getElementById("qntMinima").value;
  let itemValor = document.getElementById("valor").value;
  let itemLocalizacao = document.getElementById("localizacao").value;
  let itemQuantidadeTotal = document.getElementById("quantidadeTotal").value;

  if (window.adicionandoNovo && itemNome && itemCategoria && itemQntMinima && itemValor && itemValor !== 'R$ ' && itemLocalizacao) {
    getImagem().then(imagemFile => {
      const novoItem = {
        nome: itemNome,
        categoria: itemCategoria,
        qntMinima: itemQntMinima,
        valor: itemValor,
        localizacao: itemLocalizacao,
        quantidadeTotal: itemQuantidadeTotal,
        imagem: imagemFile
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
        mostrarLotes();
        limparCampos();
        window.adicionandoNovo = false;
        window.itemSelecionado = null;
      })
      .catch(err => console.error('Erro ao inserir:', err));
    });

  } else if (window.itemSelecionado && itemNome && itemCategoria && itemQntMinima && itemValor && itemValor !== 'R$ ' && itemLocalizacao) {
    getImagem().then(imagemFile => {
      const dadosAtualizados = {
        id: window.itemSelecionado.id_produto,
        nome: itemNome,
        categoria: itemCategoria,
        qntMinima: itemQntMinima,
        valor: itemValor,
        localizacao: itemLocalizacao,
        quantidadeTotal: itemQuantidadeTotal
      };

      if (imagemFile) {
        dadosAtualizados.imagem = imagemFile;
      }

      fetch('../php/produto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      })
      .then(res => res.json())
      .then(res => {
        alert('Salvo com sucesso!');
        chamarPHP();
        mostrarLotes();
        limparCampos();
        window.itemSelecionado = null;
      })
      .catch(err => console.error('Erro ao salvar:', err));
    });

  } else {
    alert("Todos os campos do formulário são obrigatórios!");
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
    mostrarLotes();
    limparCampos();
    window.itemSelecionado = null;
  })
  .catch(err => console.error('Erro ao deletar:', err));
});


// Lotes

function mostrarLotes(idProduto = null) {
  let url = '../php/produtoLote.php';
  if (idProduto) {
    url += `?id_produto=${idProduto}`;
  }

  fetch(url)
    .then(resposta => {
      if (!resposta.ok) throw new Error('Erro ao buscar lotes');
      return resposta.json();
    })
    .then(lotes => {
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

        });
        tbody.appendChild(linha);
      });
    })
    .catch(erro => console.error('Erro ao carregar lotes:', erro));
}

document.getElementById("btn-adicionarLote").addEventListener("click", () => {
  window.adicionandoLote = true;
  window.itemSelecionado = null;
  limparCampos();
  habilitarCamposLote();
})

document.getElementById("btn-editarLote").addEventListener('click', () => {
  if(!window.loteSelecionado){
    alert('Selecione um lote para editar');
    return;
  }
  habilitarCamposLote(); 
  window.adicionandoLote = false;
});

document.getElementById('btn-salvarLote').addEventListener('click', () => {
  let loteProduto = document.getElementById("id_produto").value;
  let loteLote = document.getElementById("lote").value;
  let loteVencimento = document.getElementById("vencimento").value;
  let loteFornecedor = document.getElementById("fornecedor").value;
  let loteQuantidade = document.getElementById("quantidade").value;

  if(window.adicionandoLote && loteProduto && loteLote && loteVencimento && loteFornecedor && loteQuantidade){
    const novoLote = {
      id_produto: loteProduto,
      lote: loteLote,
      vencimento: loteVencimento,
      fornecedor: loteFornecedor,
      quantidade: loteQuantidade
    };

    fetch('../php/produtoLote.php', {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(novoLote)
    })
      .then(res => res.json())
      .then(res => {
        alert('Lote inserido com sucesso!');
        chamarPHP();
        limparCampos();
        window.adicionandoLote = false;
        window.loteSelecionado = null;
      })
      .catch(err => console.error('Erro ao inserir o lote:', err));
  }
  else if (window.loteSelecionado && loteProduto && loteLote && loteVencimento && loteFornecedor && loteQuantidade) {
    const loteAtualizado = {
      id: window.loteSelecionado.id_Lote,
      id_produto: loteProduto,
      lote: loteLote,
      vencimento: loteVencimento,
      fornecedor: loteFornecedor,
      quantidade: loteQuantidade
    };

    fetch('../php/produtoLote.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loteAtualizado)
    })
      .then(res => res.json())
      .then(res => {
        alert('Lote salvo com sucesso!');
        chamarPHP();
        limparCampos();
        window.loteSelecionado = null;
      })
      .catch(err => console.error('Erro ao salvar lote:', err));
  } else {
    alert("Todos os campos do formulário são obrigatórios!");
  }
});

document.getElementById('btn-deletarLote').addEventListener('click', () => {
  if(!window.loteSelecionado){
    alert('Selecione um lote antes!');
    return;
  }

  if(!confirm('Tem certeza que deseja excluir este lote?')) return;

  fetch(`../php/produtoLote.php?id=${window.loteSelecionado.id_Lote}`,{
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(res => {
      alert('Lote excluído com sucesso!');
      chamarPHP();
      limparCampos();
      window.loteSelecionado = null;
    })
    .catch(err => console.erro('Erro ao deletar o lote:', err));
});

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
    });
  });

window.onload = chamarPHP;
