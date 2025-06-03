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

        alerta(2, 2, "Senha ou usuário incorretos. Por favor, tente novamente e, caso necessite de troca, converse com seu administrador.", 1)
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

            alerta(2, 2, "Senha ou usuário incorretos. Por favor, tente novamente e, caso necessite de troca, converse com seu administrador.", 1)
            
        }
    }
});






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