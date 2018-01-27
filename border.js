var borderCSS = '5px solid ';

function changeBorder(isHunting, on, off) {
	if((isHunting && (on == "")) ||
		(!isHunting && (off == "")))
		document.body.style.border = '';
	else
		document.body.style.border = borderCSS + (isHunting ? on : off);
}


browser.runtime.onMessage.addListener((msg) => {
	if(msg.command == "border")
		changeBorder(msg.isHunting, msg.on, msg.off);
});