const nameInputEl = document.querySelector('#enter-name-input')

//Add 'Enter' keypress event listener to enter name 'input'
nameInputEl.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {                        // Number 13 is the "Enter" key on the keyboard          
      event.preventDefault();                          // Cancel the default action, if needed       
      document.querySelector("#input-button").click(); // Trigger the button element with a click
    }
});

function loadHtmlFile(href){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

let enterRoom = () => {
    let request = axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants',
        {name: nameInputEl.value})

    request.then(() => {
        const bodyElement = document.querySelector('body') 
        bodyElement.innerHTML=`${loadHtmlFile('../chat.html')}`
        startChat(nameInputEl.value)
    })
    request.catch((err) => {
        let errorMessage = document.querySelector('#error-message')
        errorMessage.innerHTML = 'Esse nome ja esta em uso :(<br> (ou input invalido)'
    })
}


