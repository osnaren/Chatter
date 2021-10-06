var exit = document.getElementById("exiter");
exit.addEventListener('mousedown', (evt) => {
    console.log(name);
    window.close();
});


$('#msgin').on("keydown", () => {
    socket.emit("typing", {
        isTyping: inputField.value.length > 0,
        nick: usrName,
        name: myname,
    });
});

$('#msgin').on("keyup", () => {
    socket.emit("typing", {
        isTyping: false,
        nick: usrName,
        name: myname,
    });
});

window.onload = (event) => {
    $("#msgin").focus();
};