var makeItGreen = '';//'5px solid green';
var makeItRed = '5px solid red';

function notify(title, content){
	browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/stoptab-48.png"),
    "title": title,
    "message": content
	});
}

function changeBorder(isHunting) {
	document.body.style.border = ((isHunting==true) ? makeItRed : makeItGreen);
}


browser.runtime.onMessage.addListener((message) => {
	changeBorder(message.command);
});


