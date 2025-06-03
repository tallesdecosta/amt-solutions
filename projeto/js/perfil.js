async function getInfo() {

    
        

    res = await fetch("../php/perfil-info.php", {
        method: "GET",
        credentials: "include"
    });

    if (res.redirected) {
    window.location.href = res.url;
    return;
  }

    data = await res.json();

    document.getElementById('p1').textContent = data.cargo;
    document.getElementById('p2').textContent = data.nome;

}

document.addEventListener("DOMContentLoaded", getInfo())