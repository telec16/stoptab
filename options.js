var DEBUG=false;

function errorCatcher(e){
	if(DEBUG){
		var out="";
		for (var i in e) {
			out += i + ": " + e[i] + "\n";
		}
		console.log("error: "+out);
	}
}

function saveOptions(e) {
  e.preventDefault();
  
  var save = {
    border_off: document.querySelector("#border_off").checked,
    color_off: document.querySelector("#color_off").value,
	
    border_on: document.querySelector("#border_on").checked,
    color_on: document.querySelector("#color_on").value,
	
    empty_tab: document.querySelector("#empty_tab").checked
  };
  
  browser.storage.local.set(save);
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#border_off").checked = result.border_off,
    document.querySelector("#color_off").value = result.color_off || "20fb00",
	
    document.querySelector("#border_on").checked = result.border_on,
    document.querySelector("#color_on").value = result.color_on || "fb0010",
	
    document.querySelector("#empty_tab").checked = result.empty_tab
  }

  var getting = browser.storage.local.get();
  getting.then(setCurrentChoice, errorCatcher);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);