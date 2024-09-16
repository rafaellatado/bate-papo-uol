apiCode = 'ebdb8d22-6694-4e9f-bd37-66d8ace89a2e';

let userName = '';
let onlineUsers = [];
let messages = [];
let messagesHistory = [];
let msgToWhom = 'Todos';
let publicOrReservedMsg = 'message';
let publicOrReservedMsgPt = 'público';
let hasScrolled = false;
let isMenuOpen = false;
let lastMessageTimestamp = '';
userLogin();

/* Setup to hide the right menu when the user clicks elsewhere */
document.addEventListener('click', handleClickOutside);
document.querySelector('.menu-button').addEventListener('click', toggleMenu);

function userLogin() {

  userName = prompt('Digite seu nome: ');

  getMessages();
  getParticipants();

  const promise = axios.post(`https://mock-api.driven.com.br/api/v6/uol/participants/${apiCode}`, { name: userName })

  promise.then((response) => {
    console.log(`Response status: ${response.status}`);

    setInterval(() => {
      axios.post(`https://mock-api.driven.com.br/api/v6/uol/status/${apiCode}`, { name: userName })
        .then((response) => {
          /* console.log(`Status update: ${response.status}`); */
        })
        .catch((err) => {
          console.error('An error occurred when sending the status: ', err)
        })
    }, 5000);

  }).catch((err) => {

    if (err.response.status === 400) {
      alert('Another online user is already using this name. Please, choose another one.')
      userLogin();
    } else {
      console.error('An unexpected error occurred: ', err);
    }

  });

}

function getParticipants() {

  function fetchParticipants() {
    axios.get(`https://mock-api.driven.com.br/api/v6/uol/participants/${apiCode}`)
    .then((response) => {

      /* console.log('getParticipants response: ', response) */

      onlineUsers = [];
      for (i = 0; i < response.data.length; i++) {
        onlineUsers.push(response.data[i].name);
      }

      /* The user doesn't enter his online users list. This list is primarily to create buttons */
      onlineUsers = onlineUsers.filter(onlineUser => onlineUser !== userName);

      /* console.log('onlineUsers: ', onlineUsers) */

      /* Create a list of buttons for each online participant */
      const buttonContainer = document.querySelector('.to');
      const firstChild = buttonContainer.firstElementChild;

      /* Clear the container while preserving the first child, which is associated with the button 'Todos' */
      Array.from(buttonContainer.children).forEach(child => {
        if (child !== firstChild) {
          child.remove();
        }
      });

      const checkIconTodos = document.querySelector('.to.first').lastElementChild;
      const checkIconPublic = document.querySelector('.public-or-private.first').lastElementChild;
      const checkIconReserved = document.querySelector('.public-or-private.second').lastElementChild;
      const msgBellowRightHere = document.querySelector('.p-below-msg-box');

      if (!onlineUsers.includes(msgToWhom)) {
        publicOrReservedMsg = 'message';
        publicOrReservedMsgPt = 'público'
        msgToWhom = 'Todos';

        msgBellowRightHere.innerHTML = `
          Enviando para ${msgToWhom} (${publicOrReservedMsgPt})
        `;

        if(checkIconTodos.classList.contains('hidden-icon')) {
          checkIconTodos.classList.remove('hidden-icon');
        }

        if(checkIconPublic.classList.contains('hidden-icon')) {
          checkIconPublic.classList.remove('hidden-icon');
        }

        if(!checkIconReserved.classList.contains('hidden-icon')) {
          checkIconReserved.classList.add('hidden-icon');
        }
      }

      if (onlineUsers.length > 0) {

        for (i = 0; i < onlineUsers.length; i++) {

          let newIcon = document.createElement('ion-icon');
          newIcon.setAttribute('name', 'person-circle');
          newIcon.className = 'new-icon';

          let iconButton = document.createElement('button');
          iconButton.appendChild(newIcon);

          /* newButton.onclick = messageToWhom(onlineUsers[i]; */
          iconButton.onclick = (function(user) {
            return function() {
              messageToWhom(this, user);
            };
          })(onlineUsers[i]);

          let newButton = document.createElement('button');
          newButton.textContent = onlineUsers[i];
          newButton.className = 'new-user';

          /* newButton.onclick = messageToWhom(onlineUsers[i]; */
          newButton.onclick = (function(user) {
            return function() {
              messageToWhom(this, user);
            };
          })(onlineUsers[i]);

          let newButtonContainer = document.createElement('div');
          newButtonContainer.className = 'check-container';
          newButtonContainer.append(iconButton, newButton);

          checkIcon = document.createElement('ion-icon');
          checkIcon.setAttribute('name', 'checkmark-sharp');

          /* We need an 'if' here to check if the user is currently selected. If it is we don't create it with the class 'hidden-icon */
          if (onlineUsers[i] === msgToWhom) {
            checkIcon.className = 'check-icon';
          }
          else {
            checkIcon.className = 'check-icon hidden-icon';
          }
          
          let onlineUser = document.createElement('div');
          onlineUser.className = 'to first';
          onlineUser.append(newButtonContainer, checkIcon);

          buttonContainer.appendChild(onlineUser);

        }
      }

    }).catch((err) => {
      console.error('getParticipants error: ', err);
    })
  };

  fetchParticipants();

  setInterval(fetchParticipants, 10000);

}

function messageToWhom(button, toWhom) {

  if (publicOrReservedMsg === 'private_message' && msgToWhom !== 'Todos' && toWhom === 'Todos') {
    alert("Você não pode enviar uma mensagem privada para 'Todos'.");
    return;
  }

  const parentDiv = button.closest('.to');
  const checkIcon = parentDiv.lastElementChild;
  const msgBellowRightHere = document.querySelector('.p-below-msg-box');

  if (checkIcon && checkIcon.classList.contains('hidden-icon')) {

    msgToWhom = toWhom;
    
    msgBellowRightHere.innerHTML = `
      Enviando para ${msgToWhom} (${publicOrReservedMsgPt})
    `;
    
    console.log('messageToWhom: ', msgToWhom);

    const parentOfParents = document.querySelector('.to:not(.first)');
    const previousCheckIcon = parentOfParents ? parentOfParents.querySelector('.check-icon:not(.hidden-icon)') : null;

    if (previousCheckIcon) {
      previousCheckIcon.classList.add('hidden-icon');
    }

    checkIcon.classList.remove('hidden-icon');
  }
  else {
    return;
  }
}

function publicOrReserved(button, msg) {

  if (publicOrReservedMsg === 'message' && msgToWhom === 'Todos' && msg === 'private_message') {
    alert("Você não pode enviar uma mensagem privada para 'Todos'.");
    return;
  }

  const parentDiv = button.closest('.public-or-private');
  const checkIcon = parentDiv.lastElementChild;
  const msgBellowRightHere = document.querySelector('.p-below-msg-box');

  if (checkIcon.classList.contains('hidden-icon')) {

    publicOrReservedMsg = msg;

    if (msg === 'message') {
      publicOrReservedMsgPt = 'público';
    }
    else if (msg === 'private_message') {
      publicOrReservedMsgPt = 'reservadamente';
    }

    msgBellowRightHere.innerHTML = `
      Enviando para ${msgToWhom} (${publicOrReservedMsgPt})
      `;

    const parentOfParents = document.querySelector('.public-or-private');
    previousCheckIcon = parentOfParents.querySelector('.check-icon:not(.hidden-icon)');

    previousCheckIcon.classList.add('hidden-icon');

    checkIcon.classList.remove('hidden-icon')
  }
  else {
    return;
  }
} 

function getMessages() {
  function fetchMessages() {
    axios.get(`https://mock-api.driven.com.br/api/v6/uol/messages/${apiCode}`)
      .then((response) => {

        /* Storing the previous last message timestamp */
        const previousLastMessageTimestamp = lastMessageTimestamp;

        /* Updating messages and messagesHistory */
        messages = [];
        document.querySelector('.messagesContainer').innerHTML = '';
        for (i = 0; i < response.data.length; i++) {
          const message = {
            time: response.data[i].time,
            from: response.data[i].from,
            to: response.data[i].to,
            text: response.data[i].text,
            type: response.data[i].type
          };
          messages.push(message);
          messagesHistory.push(message);
        }

        if (messagesHistory.length > 200) {
          messagesHistory = messagesHistory.slice(-200);
        }

        /* Updating the last message timestamp */
        if (messagesHistory.length > 0) {
          lastMessageTimestamp = messagesHistory[messagesHistory.length - 1].time;
        }

        showMessages();

        /* Checking if there are new messages and scroll if necessary */
        if (previousLastMessageTimestamp !== lastMessageTimestamp) {
          const lastMessage = document.querySelector('.messagesContainer li:last-child');
          if (lastMessage) {
            lastMessage.scrollIntoView();
          }
        }

      }).catch((err) => {
        console.error('getMessages error: ', err);
      });
  }

  fetchMessages();
  setInterval(fetchMessages, 3000);
}

function showMessages() {
  const ul = document.querySelector('.messagesContainer');
  ul.innerHTML = '';

  let filteredMessages = messages.filter(message => 
    message.type === 'message' || message.type === 'status' || 
    (message.type === 'private_message' && (message.from === userName || message.to === userName))
  );

  for (let i = 0; i < filteredMessages.length; i++) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span style="color: black">${filteredMessages[i].time}</span> 
      <strong>${filteredMessages[i].from}</strong> para 
      <strong>${filteredMessages[i].to}: </strong>
      ${filteredMessages[i].text}`;
    
    if (filteredMessages[i].type === 'status') {
      li.className = 'status-msg';
    } else if (filteredMessages[i].type === 'private_message') {
      li.className = 'private-msg';
    } else {
      li.className = 'normal-msg';
    }

    ul.appendChild(li);
  }
}

function sendMessage(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input');
  const message = input.value;

  axios.post(`https://mock-api.driven.com.br/api/v6/uol/messages/${apiCode}`, {
    	from: userName,
	    to: msgToWhom,
	    text: message,
	    type: publicOrReservedMsg 
  })
    .then((response) => {
      /* console.log('sendMessages response: ', response) */

      input.value = '';
      getMessages()

    }).catch((err) => {
      console.error(err)
      window.location.reload();
    })
}

function toggleMenu(e) {

  if (e) {
    e.stopPropagation();
  }

  const toggleButtons = document.querySelector('.default-buttons');
  const body = document.body; 
  const grayBg = document.querySelector('.content-transparency');

  if (isMenuOpen) {
    toggleButtons.classList.remove('show-default-buttons');
    body.classList.remove('pointer-cursor');  
    grayBg.classList.remove('transparency-visibility');
    isMenuOpen = false;

  } else {
    toggleButtons.classList.add('show-default-buttons');
    body.classList.add('pointer-cursor');  
    grayBg.classList.add('transparency-visibility');
    isMenuOpen = true;
  }
}

function handleClickOutside(e) {
  const toggleButtons = document.querySelector('.default-buttons');
  const menuButton = document.querySelector('.menu-button');

  if (isMenuOpen && !toggleButtons.contains(e.target) && e.target !== menuButton) {
    toggleMenu(); 
  }
}
