async function verUsuarios() {

    res = await fetch('../php/api/usuario.php', {

        method: "GET",
        credentials: "include"

    });

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

    attBtn.setAttribute('id_usuario', a.getAttribute('id'));

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
    body.append("admin", admin.value);

    data = await fetch("../php/api/usuario.php", {

        method: "POST",
        body: body

    });

    if (data.ok) {

        location.reload();

    }
}

async function deleteUser(btn) {

    res = await fetch(`../php/api/usuario.php?id=${btn.getAttribute('id')}`, {

        method: "DELETE",
        credentials: "include"

    });
    location.reload();
}
