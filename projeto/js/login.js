btnEntrar = document.getElementById('btn-entrar');

btnEntrar.addEventListener('click', async () => {

    try {
    if (!document.getElementById('username').checkValidity()) {

        document.getElementById('username').reportValidity(); 
        return;

    }

    if (!document.getElementById('senha').checkValidity()) {

        document.getElementById('senha').reportValidity(); 
        return;

    }

            user = document.getElementById('username').value;
            senha = document.getElementById('senha').value;
            body = new URLSearchParams();
            body.append("user", user);
            body.append("senha", senha);

            data = await fetch("../php/login.php", {

                method: "POST",
                body: body

            });


            if (!data.ok) {
                throw new Error(`HTTP Error! Status: ${data.status}`)

            }

            data = await data.json();

            if (data.correto) {

                window.location = "startPage.html";
                
            } else if (data.correto == false) {

                alert("Senha ou usuário incorretos. Por favor, tente novamente e, caso necessite de troca, converse com seu administrador.")
                

            }
        
    } catch (error) {

        alert("Ocorreu um problema na comunicação com nosso servidor interno. Por favor, aguarde alguns minutos e entre em contato com o suporte caso o problema persista.")
        console.log(error)
        
    }

    
});