async function podeAcessar(ref) {

    res = await fetch('../php//api/permissoes.php', {

        method: "GET",
        credentials: "include"

    });

    modulo = ref.getAttribute('nome')

    arr = await res.json()

    for (i in arr) {

        if(i == modulo && arr[i] == 1) {
             window.location = `../html/modulo${capitalize(modulo)}.html`
            

        } else if (i == modulo && arr[i] == 0) {

            alert("vish pia sem acesso");
        }

    }
}

function capitalize(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }