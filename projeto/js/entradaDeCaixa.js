async function salvar() {
    let element1 = document.getElementById("respon").value
    let element2 = document.getElementById("valor").value
    let element3 = document.getElementById("obs").value

    response = await registrarop(element1, element2, element3)

    for (i in response) {

        if (response.result = 200) {
            alert("A operação de entrada de caixa foi realizada com sucesso!")

            window.location.href = '../html/moduloVendas.html'
        } else if (response.result = 0) {
            console.log("Encontramos problemas no servidor, Pedimos que tente novamente mais tarde")
        }
    }
}

async function registrarop(dado1, dado2, dado3) {

    let list = { "resp": dado1, "valor": dado2, "obs": dado3 }

    let data = await fetch("../php/entradaDeCaixa.php", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(list)
    })

    if (data) {
        return await data.json()
    }
}