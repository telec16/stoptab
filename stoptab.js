var DEBUG=false;

var isHunting = false;
var startTabsId = [];

function notify(title, content){
	browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/stoptab-48.png"),
    "title": title,
    "message": content
	});
}

function errorCatcher(e){
	if(DEBUG){
		var out="";
		for (var i in e) {
			out += i + ": " + e[i] + "\n";
		}
		console.log("error: "+out);
	}
}

function updateIcon(tab) {
	browser.browserAction.setIcon({
		path: isHunting ? {
		  48: "icons/hunting-48.png"
		} : {
		  48: "icons/stoptab-48.png"
		},
		tabId: tab.id
	})
	.catch(errorCatcher);
	
	browser.browserAction.setTitle({
		title: isHunting ? 'Hunting mode on !' : 'Stop Tab',
		tabId: tab.id
	})
	.catch(errorCatcher); 
}


function updateTabList(tabs) {

	function updateTab(tabs) {
		startTabsId = [];
		for(let tab of tabs){
			startTabsId.push(tab.id);
			//notify("Stop Tab", `Updating '${tab.id}' id.`);
		}
	}

	var gettingAllTabs = browser.tabs.query({});
	gettingAllTabs.then(updateTab);
}

function toggleHunting() {
	isHunting = !isHunting;
	
	if(isHunting){
		notify("Stop Tab", "Hunting mode on !");
		updateTabList();
	}
	updateGUI()
}


function updateGUI(tabs) {

	function updateTab(tabs) {
		
		
		for(let tab of tabs){
			//notify("Stop Tab", `Updating '${tab.id}' id.`);
			
			updateIcon(tab);
			browser.tabs.sendMessage(tab.id, {
				command: isHunting
			})
			.catch(errorCatcher);
			
			if(!startTabsId.includes(tab.id) && isHunting)
				browser.tabs.remove(tab.id)
				.catch(errorCatcher);
		}
	}

	var gettingAllTabs = browser.tabs.query({/*active: true, currentWindow: true*/});
	gettingAllTabs.then(updateTab);
}


// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateGUI);

// listen to tab switching
browser.tabs.onActivated.addListener(updateGUI);

// listen for window switching
browser.windows.onFocusChanged.addListener(updateGUI);

// listen for click
browser.browserAction.onClicked.addListener(toggleHunting);

// update when the extension loads initially
updateGUI();
