const socket = io();

const inputField = document.querySelector("#msgin");
const messageForm = document.querySelector("#ch-form");
const messageBox = document.querySelector("#messages");
const fallback = document.querySelector("#typing");

let usrName = "";
let myname = "";

codname = {};

/**
 * @desc Initialize User
 * @param user {String} Username
 */
const newUserConnected = (user) => {
    usrName = `User${Math.floor(Math.random() * 1000000)}`;
    myname = user;
    socket.emit("new user", {usrName, myname});
};

/**
 * @desc To Append Message to Chat
 * @param user {String} UserId
 * @param message {String} Message by user
 * @param name {String} Username
 */
const addNewMessage = ({user, message, name}) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", {hour: "numeric", minute: "numeric"});

    const receivedMsg = `
                        <li class="out">
                            <div class="chat-img">
                                <img alt="Avtar" src="https://bootdey.com/img/Content/avatar/avatar1.png">
                            </div>
                            <div class="chat-body">
                                <div class="chat-message">
                                    <h5>${name} <span class="time_date">${formattedTime}</span> </h5>
                                    <p>${message}</p>
                                </div>
                            </div>
                        </li>`;

    const myMsg = `
                        <li class="in">
                            <div class="chat-img">
                                <img alt="Avtar" src="https://bootdey.com/img/Content/avatar/avatar6.png">
                            </div>
                            <div class="chat-body">
                                <div class="chat-message">
                                    <h5>${name} <span class="time_date">${formattedTime}</span> </h5>
                                    <p>${message}</p>
                                </div>
                            </div>
                        </li>`;

    messageBox.innerHTML += user === usrName ? myMsg : receivedMsg;
};

/**
 * @desc Prevent default submit and Redirect to Socket
 */
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inputField.value) {
        return;
    }
    ////console.log(inputField.value);
    socket.emit("user message", {
        message: inputField.value,
        nick: usrName,
        name: myname,
    });

    inputField.value = "";
});

// When an user disconnects
socket.on("user disconnected", function (usrName) {
    document.querySelector(`.${usrName}-userlist`).remove();
});

// When an user sends a message
socket.on("user message", function (data) {
    //console.log(data);
    addNewMessage({user: data.nick, message: data.message, name: data.name});
});

// When new user is created
socket.on("chatusr", function (msg) {
    codname[usrName] = msg;
    //console.log("server", codname);
});

// When an user types
socket.on("typing", function (data) {
    const {isTyping, nick, name} = data;

    if (!isTyping) {
        fallback.innerHTML = "";
        return;
    }
    //console.log(name);
    fallback.innerHTML = `${name} is typing...`;
});
