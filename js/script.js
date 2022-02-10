let loadHtmlFile = (href) => {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

let enterRoom = () => {
    const nameInput = document.querySelector('#enter-name-input').value
    const mainElement = document.querySelector('main') 

    let request = axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants',
        {name: nameInput})

    request.then(() => mainElement.innerHTML=`${loadHtmlFile('../chat.html')}`)
    request.catch(() => {
        let errorMessage = document.querySelector('#error-message')
        errorMessage.innerHTML = 'Esse nome ja esta em uso :('
    })
}

