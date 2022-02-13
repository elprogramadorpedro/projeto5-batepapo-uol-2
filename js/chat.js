let chatUsername                //name of the current chat user        
let selectedRecipientEl         //element referencing selected recipient in sidebar

let selectedVisibilityEl        //element referencing 'publico' or 'reservadamente' in sidebar
let visibilityType = "message"  //visibility type used to post message

let inputEl                     //element referencing message text input

function startChat(username){
    chatUsername = username
    loadMessages()
    loadParticipants()
    addMessageInputEventListener()

    loop(maintainConnection, 5000)
    loop(loadMessages, 3000)
    loop(loadParticipants, 20000)

    selectedVisibilityEl = document.getElementById('public_visibility')
}

let createMessage = function(message){
    const messageEl = document.createElement('div')
            messageEl.classList.add('message')
            messageEl.setAttribute('data-identifier', "message")

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
        })
        console.log('Messages loaded')
    })
    promise.catch((err) => console.log(err))
}

function createParticipant(name){
    const newParticipant = document.createElement('div') 
    newParticipant.classList.add('sidebar__item')
    newParticipant.onclick = function(){selectContact(this)}
    newParticipant.setAttribute('data-identifier', "participant")
    newParticipant.innerHTML = `
        <ion-icon name="person-circle"></ion-icon>
        <h3>${name}</h3>
        <ion-icon class="sidebar__item__check" name="checkmark"></ion-icon>
    ` 
    return newParticipant
}

function loadParticipants(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
    promise.then((participants) => {

        const sidebarParticipants = document.querySelector('.sidebar__participants')
        sidebarParticipants.innerHTML = ''

        selectedRecipientEl = createParticipant('Todos')
        sidebarParticipants.appendChild(selectedRecipientEl)

        participants.data.forEach(participant => {
            const newParticipant = createParticipant(participant.name)
            checkItem(newParticipant)
            sidebarParticipants.appendChild(newParticipant)
        })
        console.log('Participants loaded')
    })
    promise.catch((err) => console.log(err))
}

function maintainConnection(){ 
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status',
        {name: chatUsername})

    promise.then(console.log('Connection maintained'))
    promise.catch(err => console.log(err))
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
    if(selectedRecipientEl == currentParticipant) return
    checkItem(selectedRecipientEl)
    checkItem(currentParticipant)
    selectedRecipientEl = currentParticipant
}

function selectVisibility(currentVisibility){
    if(selectedVisibilityEl === currentVisibility) return
    checkItem(selectedVisibilityEl)
    checkItem(currentVisibility)
    selectedVisibilityEl = currentVisibility
    visibilityType = (visibilityType === "message") ? "private_message" : "message" 
}


async function sendMessage(){
    const reveiver = await selectedRecipientEl.querySelector('h3').textContent
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',
    {
        from: chatUsername,
        to: reveiver,
        text: inputEl.value,
        type: visibilityType
    })

    promise.then(() => {
        console.log('message sent')
        loadMessages()
    })

    promise.catch(err => {
        console.log(err)
        window.location.reload()
    })   
}

async function addMessageInputEventListener(){
    inputEl = await document.querySelector('#input_message')

    //Add 'Enter' keypress event listener to send message 'input'
    inputEl.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {                       // Number 13 is the "Enter" key on the keyboard          
        event.preventDefault();                          // Cancel the default action, if needed       
        sendMessage(); 
        }
    });
}
