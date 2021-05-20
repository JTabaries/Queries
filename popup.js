const managerBtn=document.getElementById("openManager");
const helpBtn=document.getElementById("openHelp");
//open help panel
helpBtn.addEventListener("click",()=>{
	displayHelp();
});
//open main panel
managerBtn.addEventListener("click",()=>{
	displayMainPanel();
});
function displayHelp(){
	var createData = {
  	type: "detached_panel",
  	url: "main/localhelp.html",
  	width: 800,
  	height: 600
	};
	var creating = browser.windows.create(createData);
}
function displayMainPanel(){
	var createMain={
		//type: "detached_panel",
		index:0,
		active: true,
		url: "main/panel.html"
	};
	var m=browser.tabs.create(createMain);
}