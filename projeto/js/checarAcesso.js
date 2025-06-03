async function checarAcesso(modulo) {

    res = await fetch('../php//api/permissoes.php', {

        method: "GET",
        credentials: "include"

    });

    if (res.redirected) {
    window.location.href = res.url;
    return;
  }


    arr = await res.json()

    for (i in arr) {

        if (i == modulo && arr[i] == 0) {

            window.location = "startPage.html";
        }

    }
}

