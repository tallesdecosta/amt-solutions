btnEntrar = document.getElementById('btn-entrar');

btnEntrar.addEventListener('click', async () => {

    user = document.getElementById('username').value;
    senha = document.getElementById('senha').value;
    body = new URLSearchParams();
    body.append("user", user);
    body.append("senha", senha);

    data = await fetch("../php/login.php", {

        method: "POST",
        body: body

    });

    if (data.ok) {

        window.location = "startPage.html";

    } else {

        alert("Senha ou usuário incorretos. Por favor, tente novamente e, caso necessite de troca, converse com seu administrador.")
    }
});

form = document.getElementById('form1');

form.addEventListener('keydown', async (event) => {

    if (event.keyCode === 13) {

        user = document.getElementById('username').value;
        senha = document.getElementById('senha').value;
        body = new URLSearchParams();
        body.append("user", user);
        body.append("senha", senha);

        data = await fetch("../php/login.php", {

            method: "POST",
            body: body

        });

        if (data.ok) {

            window.location = "startPage.html";

        } else {

            alert("Senha ou usuário incorretos. Por favor, tente novamente e, caso necessite de troca, converse com seu administrador.")
        }
    }
});