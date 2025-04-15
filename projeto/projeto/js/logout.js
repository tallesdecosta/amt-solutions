async function logout() { 

    await fetch('../php/logout.php', {
        method: "GET",
        credentials: "include"
    }); 
    location.reload();
}