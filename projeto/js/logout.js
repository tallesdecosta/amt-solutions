async function logout() { 

    if(confirm("Deseja mesmo sair?")) {
        await fetch('../php/logout.php', {
            method: "GET",
            credentials: "include"
        }); 
        location.reload();

    } 
    
}