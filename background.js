browser.browserAction.onClicked.addListener(displayMainPanel);
function displayMainPanel(){
	var createMain={
		//type: "detached_panel",
		index:0,
		active: true,
		url: "main/panel.html"
	};
	var m=browser.tabs.create(createMain);
}