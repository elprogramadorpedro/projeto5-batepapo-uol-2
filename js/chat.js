let chatUsername
let selectedParticipantEl

let selectedVisibilityEl
let visibilityType = "message"
let inputEl

function startChat(username){
    chatUsername = username
    loadMessages()
    fetchParticipants()
    addMessageEventListener()

    loop(maintainConnection, 5000)
    loop(loadMessages, 3000)
    loop(fetchParticipants, 20000)

    selectedVisibilityEl = document.getElementById('public_visibility')
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

function loadMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')

    promise.then((response) => {
        const chatElement = document.querySelector('.chat-main')
        chatElement.innerHTML = ''

        response.data.forEach(message => {
            if(message.to === chatUsername || message.to === 'Todos')
                chatElement.appendChild(createMessage(message))
            window.scrollTo({top: document.body.scrollHeight});
        }); 
    })
}

function createParticipant(name){
    const newParticipant = document.createElement('div') 
    newParticipant.classList.add('sidebar__item')
    newParticipant.onclick = function(){selectContact(this)}
    newParticipant.innerHTML = `
        <ion-icon name="person-circle"></ion-icon>
        <h3>${name}</h3>
        <ion-icon class="sidebar__item__check" name="checkmark"></ion-icon>
    ` 
    return newParticipant
}

function fetchParticipants(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
    promise.then((participants) => {

        const contatos = document.querySelector('.sidebar__contatos')
        contatos.innerHTML = ''

        selectedParticipantEl = createParticipant('Todos')
        contatos.appendChild(selectedParticipantEl)

        participants.data.forEach(participant => {
            const newParticipant = createParticipant(participant.name)
            checkItem(newParticipant)
            contatos.appendChild(newParticipant)
        })
    })
}

async function maintainConnection(){ 
    try{
        await axios.post(
            'https://mock-api.driven.com.br/api/v4/uol/status',
            {name: chatUsername}
        )
        console.log('Connection maintained')
    }catch(err){
        console.log(err)
    }
}

function toggleSidebar(){
    const sidebar = document.querySelector('sidebar')
    const sidebarBody = sidebar.querySelector('.sidebar__body')
    const sidebarBackground = document.querySelector('.sidebar__background')

    //close sidebar when pressing 'esc'
    document.addEventListener("keyup", function(event) {
    if (event.keyCode === 27) {                // Number 27 is the "esc" key on the keyboard          
          event.preventDefault();              // Cancel the default action, if needed       
          toggleSidebar()
        }
    });

    sidebar.classList.toggle('activated')
    sidebarBody.classList.toggle('activated')
    sidebarBackground.classList.toggle('hidden')
}

function loop(execFunction, interval){
    setInterval(execFunction, interval)
}

let checkItem = (item) => {
    if(item){
        const checkmark = item.querySelector('.sidebar__item__check')
        checkmark.classList.toggle('hidden')
    }
}

function selectContact(currentParticipant){
    if(selectedParticipantEl == currentParticipant) return
    checkItem(selectedParticipantEl)
    checkItem(currentParticipant)
    selectedParticipantEl = currentParticipant
}

function selectVisibility(currentVisibility){
    if(selectedVisibilityEl === currentVisibility) return
    checkItem(selectedVisibilityEl)
    checkItem(currentVisibility)
    selectedVisibilityEl = currentVisibility
    visibilityType = (visibilityType === "message") ? "private_message" : "message" 
}


async function sendMessage(){
    const reveiver = await selectedParticipantEl.querySelector('h3').textContent
    try{
        await axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',
        {
            from: chatUsername,
            to: reveiver,
            text: inputEl.value,
            type: visibilityType
        })
        loadMessages()
    }catch(err){
        window.location.reload()
    }
}

async function addMessageEventListener(){
    inputEl = await document.querySelector('#input_message')

    //Add 'Enter' keypress event listener to send message 'input'
    inputEl.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {                       // Number 13 is the "Enter" key on the keyboard          
        event.preventDefault();                          // Cancel the default action, if needed       
        sendMessage(); 
        }
    });
}
