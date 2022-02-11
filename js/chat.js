let chatUsername

function startChat(username){
    chatUsername = username
    loadMessages()
    messageLoop()
    maintainConnection()
}

let createMessage = function(message){
    const messageEl = document.createElement('div')
            messageEl.classList.add('message')

            messageEl.innerHTML = `
                <span class="message__time">(${message.time})</span>
                <strong>${message.from} </strong>
            `

            if(message.type === "private_message"){
                messageEl.innerHTML += ' reservadamente '
                messageEl.classList.add('message__private')
            }  
            if(message.type !== "status"){
                messageEl.innerHTML += ` para <strong>${message.to}</strong>: `
            }else{
                messageEl.classList.add('message__status')
            }
            messageEl.innerHTML += ` <p>${message.text}</p>`
    return messageEl
}

function messageLoop(){
    setInterval(loadMessages, 3000)
}

function loadMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')

    promise.then((response) => {
        console.debug(response)
        const chatElement = document.querySelector('.chat-main')
        chatElement.innerHTML = ''

        response.data.forEach(message => {
            if(message.to === chatUsername || message.to === 'Todos')
                chatElement.appendChild(createMessage(message))
            window.scrollTo({top: document.body.scrollHeight});
        }); 
    })
}

function maintainConnection(){
    setInterval(() => {
        try{
            const promise = axios.post(
                'https://mock-api.driven.com.br/api/v4/uol/status',
                {name: chatUsername})
            promise.then(console.log('Connection maintained'))
        }catch(err){}
    }, 5000)
}