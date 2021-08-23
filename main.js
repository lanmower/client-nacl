const chatForm = document.querySelector('.messages--send');
const chatMessages = document.querySelector('.messages--received');
const roomName = document.querySelector('.channel--name');
const userList = document.querySelector('.members');

const { username, room } = { username:'anon', room:'General'};

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements[0].value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements[0].value = '';
  e.target.elements[0].focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
  <div class="text">
    <b class="meta">${message.username} </b><span>${message.time}</span>
    ${message.text}
  </div>`;
  document.querySelector('.messages--received').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
