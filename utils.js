var DEBUG=false;

export function notify(title, content){
	browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/stoptab-48.png"),
    "title": title,
    "message": content
	});
}

export function errorCatcher(e){
	if(DEBUG){
		var out="";
		for (var i in e) {
			out += i + ": " + e[i] + "\n";
		}
		console.log("error: "+out);
	}
}