async function esta_logado() {

    try {

        const response = await fetch('../php/esta_logado.php', {

            method: 'GET',
            credentials: 'include'

        });

        if (response.status === 401) {

            window.location.href = '../html/login.html';

        } else {

            console.log('eba funcionou');

        }

    } catch(error) {

        console.error('Erro de autenticação: ', error);
        

    }

}

esta_logado();