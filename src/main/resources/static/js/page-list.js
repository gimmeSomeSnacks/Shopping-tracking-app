async function getPage() {
    let response = await fetch("http://localhost:8080/list-of-pages", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        alert("Error");
        return;
    }
    
}