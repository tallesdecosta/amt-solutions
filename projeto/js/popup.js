// Função para iniciar a animação da barra de progresso
export function startProgressBar() {

    let progressBar = document.getElementById("progressBarFilled");
    let fecha = document.getElementById("fechaCard");
    let card = document.getElementById('fundoCard')

    card.style.display = 'flex'

    width = 0;
    let duration = 4; // Duração em segundos
    let interval = 100; // Intervalo de atualização em milissegundos

    let increment = (100 / (duration * 1000 / interval)); // Incremento por intervalo

    let intervalId = setInterval(() => {
        width += increment;
        progressBar.style.width = width + "%";

        if (width >= 100) {
            clearInterval(intervalId);

            card.style.display = 'none'
        }
    }, interval);

    fecha.addEventListener("click", () =>{
        card.style.display = 'none'
    } )
}
