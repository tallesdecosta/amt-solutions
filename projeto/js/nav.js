function aparecertool(id) {

    let x = document.getElementById('tool' + id);

    x.style.visibility = 'visible'
}

function escondertool(id) {

    let x = document.getElementById('tool' + id);

    x.style.visibility = 'hidden'

}


let y = 0;

function abrirperfil() {

    let perfil = document.getElementById('perfil');

    if (y == 0) {

        perfil.style.visibility = 'visible'
        perfil.style.zIndex = '2'

        y = 1;

    } else if (y == 1) {

        perfil.style.visibility = 'hidden'

        y = 0;

}
}