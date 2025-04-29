async function buscarfunc() {
     let data = await fetch("../php/entradaDeCaixa.php",{

        method: "GET",
        credentials: "include",
     })

     if(data){
        return await data.json()
     }
}

async function adcfunc() {

    let select = document.getElementById('respon')

    let response = await buscarfunc()

    if(response){

        for(i in response){

            let opt = ' <option value="'+ response[i].id_usuario +'">'+ response[i].nome +'</option> '

            select.innerHTML += opt
        }
    }

    select.value = 0;

    console.log(select.value)
    
}



async function salvar() {
    let element1 = document.getElementById("respon").value
    let element2 = document.getElementById("valor").value
    let element3 = document.getElementById("obs").value 

    if(element1 != 0){
        response = await registrarop(element1, element2, element3)

        for (i in response) {
    
            if (response.result = 200) {
                alert("A operação de entrada de caixa foi realizada com sucesso!")
    
                window.location.href = '../html/moduloVendas.html'
            } else if (response.result = 0) {
                console.log("Encontramos problemas no servidor, Pedimos que tente novamente mais tarde")
            }
        }
    }else if(element1 == 0){
        alert('Para salvar a entrada de caixa é preciso preencher o campo "Responsável"')
    }

    
}

async function registrarop(dado1, dado2, dado3) {

    let list = { "resp": dado1, "nome": "Entrada de caixa", "valor": dado2, "obs": dado3 }

    let data = await fetch("../php/entradaDeCaixa.php", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(list)
    })

    if (data) {
        return await data.json()
    }
}



async function verifacess() {

    let user = document.getElementById('usuario').value
    let pass = document.getElementById('senha').value

    if ((user != '' && user != false) && (pass != '' && user != false)) {
        
        let response = await validaracess(user,pass)

        if(response){
            if(response.acesso == 'autorizado'){
                let element = document.getElementById('verifacess')

                element.style.display = 'none'

                adcfunc()

            }else{
                alert("Para acessar o módulo de Entrada de Caixa a conta deve conter privilegio de gestor")
            }
        }

    } else {
        alert("O login precisa conter o Username e a Senha do usuário")
    }

}


async function validaracess(user,senha) {
    
    let values = {"user":user, "senha": senha}

    let data = await fetch("../php/entradaDeCaixa.php",{

        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)

    })

    if(data){
        return data.json()
    }

}

function voltar(){
    window.location.href = '../html/moduloVendas.html'
}