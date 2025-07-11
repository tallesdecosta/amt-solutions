async function verUsuarios() {

    res = await fetch('../php/api/usuario.php', {

        method: "GET",
        credentials: "include"

    });

    if (res.redirected) {
    window.location.href = res.url;
    return;
  }

    res = await res.json();

    for (i in res) {


        btn = document.createElement("button");
        btn.classList.add("btn-user");
        btn.textContent = res[i].username;
        btn.id = res[i].id_usuario;
        attBtn = document.getElementById('btn-atualizar');
        deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deletebtn");
        deleteBtn.setAttribute("id", res[i].id_usuario);
        deleteBtn.textContent = '(Deletar)';

        btn.addEventListener('click', function a() {

            getPermissoes(this);

        });

        btn.addEventListener('click', function a() {

            mudarBtnCor(this);

        });

        deleteBtn.addEventListener('click', function a() {

            deleteUser(this);

        });

        btnDiv = document.createElement('div');
        btnDiv.appendChild(btn);
        btnDiv.appendChild(deleteBtn);
        div = document.getElementById('listausers');
        div.appendChild(btnDiv);

    }
}

async function getPermissoes(a) {

    res = await fetch(`../php/api/permissoes.php?id=${a.getAttribute('id')}`, {

        method: "GET",
        credentials: "include"

    });

    if (res.redirected) {
    window.location.href = res.url;
    return;
  }

    attBtn.setAttribute('id_usuario', a.getAttribute('id'));
    document.getElementById('alterar-senha-btn').setAttribute('id_usuario', a.getAttribute('id'));
    

    res = await res.json();

    estoque = document.getElementById('estoque');
    vendas = document.getElementById('vendas');
    financeiro = document.getElementById('financeiro');
    gestao = document.getElementById('gestao');

    estoque.checked = res.estoque === '1';
    vendas.checked = res.vendas === '1';
    financeiro.checked = res.financeiro === '1';
    gestao.checked = res.gestao === '1';

}

async function updatePermissoes(id) {

    estoque = document.getElementById('estoque');
    vendas = document.getElementById('vendas');
    financeiro = document.getElementById('financeiro');
    gestao = document.getElementById('gestao');

    res = await fetch(`../php/api/permissoes.php?id=${id.getAttribute('id_usuario')}&estoque=${estoque.checked ? 1 : 0}&vendas=${vendas.checked ? 1 : 0}&financeiro=${financeiro.checked ? 1 : 0}&gestao=${gestao.checked ? 1 : 0}`, {

        method: "PUT",
        credentials: "include"

    });

    if (res.redirected) {
    window.location.href = res.url;
    return;
  }

    if (res.ok) {

        location.reload();
    }


}

function mudarBtnCor(btn) {
    div = document.getElementById('users');
    for (i in div.childNodes) {

        thisNode = div.childNodes[i];

        if (thisNode.tagName == "BUTTON" && thisNode.id != btn.getAttribute("id")) {

            thisNode.style.fontWeight = "400";
        } else if (thisNode.tagName == "BUTTON" && thisNode.id == btn.getAttribute("id")) {

            thisNode.style.fontWeight = "500";
        }

    }

}

function abrirPopup() {

    popup = document.getElementById('popup');
    popup.style.display = "flex";


}

async function atualizarSenhaPopup() {
    popup = document.getElementById('popup-senha');
    popup.style.display = "flex";
    
}

async function atualizarSenha() {
    body = new URLSearchParams();

        senha = document.getElementById('nova-senha');

        id = document.getElementById("alterar-senha-btn").getAttribute("id_usuario");

        if (!senha.checkValidity()) {

            senha.reportValidity(); 
            return;

        }
    
    try {

        

        body.append("senha", senha.value)
        body.append("id", id)

        res = await fetch(`../php/api/senha.php`, {
            method: "POST",
            body: body
        });

        if (res.redirected) {
    window.location.href = res.url;
    return;
  }

        if (!res.ok) {
            throw new Error(`HTTP ERROR! ${res.status}`);
        } else {
location.reload()
        }

        

    }catch(error) {
        console.log(error)
        alert("Erro no servidor.")
    }


}

function fecharPopupSenha() {

    popup = document.getElementById('popup-senha');
    popup.style.display = "none";


}

function fecharPopup() {

    popup = document.getElementById('popup');
    popup.style.display = "none";


}

async function addUser() {

    nome = document.getElementById('nome');
    user = document.getElementById('user');
    senha = document.getElementById('senha');
    cargo = document.getElementById('cargo');
    contato = document.getElementById('contato');

    if (!nome.checkValidity()) {

        nome.reportValidity(); 
        return;

    }

    if (!user.checkValidity()) {

        user.reportValidity(); 
        return;

    }

    if (!senha.checkValidity()) {

        senha.reportValidity(); 
        return;

    }

    if (!cargo.checkValidity()) {

        cargo.reportValidity(); 
        return;

    }

    if (!contato.checkValidity()) {

        contato.reportValidity(); 
        return;

    }

    estoque = document.getElementById('estoque-novo');
    vendas = document.getElementById('vendas-novo');
    financeiro = document.getElementById('financeiro-novo');
    gestao = document.getElementById('gestao-novo');
    adminValue = document.getElementById('admin');



    estoquePermissao = estoque.checked == true ? 1 : 0;
    vendasPermissao = vendas.checked == true ? 1 : 0;
    financeiroPermissao = financeiro.checked == true ? 1 : 0;
    gestaoPermissao = gestao.checked == true ? 1 : 0;
    admin = adminValue.checked == true ? 1 : 0;

    body = new URLSearchParams();
    body.append("user", user.value);
    body.append("senha", senha.value);
    body.append("nome", nome.value);
    body.append("estoque", estoquePermissao);
    body.append("vendas", vendasPermissao);
    body.append("financeiro", financeiroPermissao);
    body.append("gestao", gestaoPermissao);
    body.append("cargo", cargo.value);
    body.append("contato", contato.value);
    body.append("admin", admin.checked);

    try {

        data = await fetch("../php/api/usuario.php", {

            method: "POST",
            body: body
    
        });
    
        if (!data.ok) {
    
            

            if (data.status == 409) {
                throw new Error(`ÈRRO: esse usuário já existe na base de dados.`)
            } else {
                throw new Error(`ÈRRO: dificuldades em se comunicar com nossa base de dados, tente novamente mais tarde.`)
            }
    
        } else {
            location.reload();
        }

        

    } catch(error) {

        alerta(0, 0, `${error}` ,1)
    }

    
}

async function deleteUser(btn) {

    res = await fetch(`../php/api/usuario.php?id=${btn.getAttribute('id')}`, {

        method: "DELETE",
        credentials: "include"

    });
    location.reload();
}




function alerta(icone, cor, text, nBotoes) {

    let icones = ['bi bi-cone-striped', 'bi bi-check-circle-fill', 'bi bi-exclamation-diamond-fill'] // 0 = cone, 1 = check, 2 = alert

    let cores = ['#d0ae3f', '#73df77', '#ebeb31', '#dd3f3f']// 0 = laranja, 1 = verder, 2 = amarelo, 3 = vermelho

    let alerta = document.getElementById('alertaPadrão')

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

        })
    }

}

