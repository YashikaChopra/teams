// console.log("in chat script")

const socket = io('/')
var messages = document.getElementById('messages')
var textarea = document.getElementById('textarea')
var username = document.getElementById('username')


socket.emit('join-chatRoom', CHATROOM_ID)

// Load messages
socket.on('load msgs', function(docs) {
    for (var i=0; i < docs.length; i++) {
        displayMsg(docs[i]);
    }
});


function displayMsg (data) {
    var message = document.createElement('div');
    message.setAttribute('class', 'chat-message');
    message.textContent = data.name+":  " +data.message;
    messages.appendChild(message);
    messages.insertBefore(message, messages.firstChild);
        
}

// Handle Input
textarea.addEventListener('keydown', function(event){
    if(event.which === 13 && event.shiftKey == false){
        // Emit to server input
        socket.emit('input', {
            name:username.value,
            message:textarea.value
        });

        textarea.value = ''
        event.preventDefault();
    }
})

// Handle output
socket.on('output', function(data){

    console.log("in out" , data);
    console.log(data.length)
    // Build out message div
    var message = document.createElement('div');
    message.setAttribute('class', 'chat-message');
    message.textContent = data.name+ ": " +data.message;
    messages.appendChild(message);
    messages.insertBefore(message, messages.firstChild);
        
});