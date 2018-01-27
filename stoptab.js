var DEBUG=false;

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


var isHunting = false;
var startTabsId = [];


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
	var color_off = "#fb0010";
	var color_on = "#fb0010";
	var empty_tab = false;
	
	function onGot(result) {
		color_off = result.border_off ? result.color_off : "";
		color_on = result.border_on ? result.color_on : "";
		
		empty_tab = result.empty_tab;
	}


	function updateTab(tabs) {
		
		for(let tab of tabs){
			//notify("Stop Tab", `Updating '${tab.id}' id.`);
			
			updateIcon(tab);
			
			var payload = {
				command: "border",
				isHunting: isHunting,
				on: color_on,
				off: color_off
			};
			browser.tabs.sendMessage(tab.id, payload)
			.catch(errorCatcher);
			
			if(isHunting) {
				if(empty_tab && (tab.url=="about:newtab") && !startTabsId.includes(tab.id))
					startTabsId.push(tab.id);
				
				if((startTabsId.length>0) && !startTabsId.includes(tab.id))
					browser.tabs.remove(tab.id)
					.catch(errorCatcher);
			}
		}
	}
	
	var getting = browser.storage.local.get();
	getting.then(onGot, errorCatcher);

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
