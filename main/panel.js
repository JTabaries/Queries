//Defines buttons
const keywordbtn=document.getElementById("keywordbutton");
const sitebtn=document.getElementById("sitebutton");
const ftbtn=document.getElementById("filetypebutton");
const savebutton=document.getElementById("save-button");
const rstbutton=document.getElementById("reset-button");
const dtbutton=document.getElementById("datebutton");
const dateselect=document.getElementById("dateSelect");
const hlp=document.getElementById("help-button");
const contentselect=document.getElementById("contentSelect");
const csbutton=document.getElementById("contentselectbutton");
const q="https://www.google.com/search?q=";
//init storage
init();
/*
Creates specific storage area for stored queries
Creates a listener for each button.
*/
function init(){
	//displays helps page
	hlp.addEventListener("click",()=>{
		displayHelp();
	});
	//Retrieves the entered keyword and adds it to the key words list
	//then clears the form
	keywordbtn.addEventListener("click", ()=>{
		var searchstr=document.getElementById("keywordform").textContent;
		if(searchstr.length > 0){
			var wrp=document.getElementById("keywordWrapper");
			var newnode=document.createElement("P");
			newnode.innerText=searchstr;
			wrp.appendChild(newnode);
		}
		document.getElementById("keywordform").innerText="";
		var queryObject=buildquery();
		displayQueryPreview(queryToString(queryObject));
	});
	//retrieves the entered site and adds it to the sites list
	//then clears the form
    sitebtn.addEventListener("click", ()=>{
		var sitestr=document.getElementById("siteform").textContent;
		if(sitestr.length > 0){
			var wrp=document.getElementById("siteWrapper");
			var newnode=document.createElement("P");
			newnode.innerText=sitestr;
			wrp.appendChild(newnode);
		}
		document.getElementById("siteform").innerText="";
		var queryObject=buildquery();
		displayQueryPreview(queryToString(queryObject));
	});
	//retrieves the entered filtype a+" "+str3nd adds it to the types list
	//then clears the form
	ftbtn.addEventListener("click", ()=>{
		var typestr=document.getElementById("filetypeform").textContent;
		if(typestr.length > 0){
			var wrp=document.getElementById("filetypeWrapper");
			var newnode=document.createElement("P");
			newnode.innerText=typestr;
			wrp.appendChild(newnode);
		}
		document.getElementById("filetypeform").innerText="";
		var queryObject=buildquery();
		displayQueryPreview(queryToString(queryObject));
	});
	csbutton.addEventListener("click",()=>{
		var queryObject=buildquery();
		displayQueryPreview(queryToString(queryObject));
	});
	//displays the date pickers if needed
	dateselect.addEventListener("change", ()=>{
		if(dateselect.value === "twoDates"){
			document.getElementById("datelimits").style.display="block";
		}else{
			document.getElementById("datelimits").style.display="none";
		}
	});
	dtbutton.addEventListener("click",()=>{
		var queryObject=buildquery();
		displayQueryPreview(queryToString(queryObject));
	});
	//saves the query in local storage as a key/value pair
	savebutton.addEventListener("click",()=>{
		var o=buildquery();
		var storeIt={};
		storeIt[queryToString(o)]=o;
		browser.storage.local.set(storeIt);
		clearAll();		
	});
	rstbutton.addEventListener("click",()=>{
		clearAll();
	});
	updateList();
	browser.storage.onChanged.addListener(updateList);
}

/*
Builds and returns a query object based on the user's entries. 
*/
function buildquery(){
	var i;
	//building keyword part
	var keywordlist=document.getElementById("keywordWrapper").childNodes;
	var keywordOperator="OR";
	if(document.getElementById("kwAnd").checked){
		keywordOperator="AND";
	}
	var str1="";
	for(i=0 ; i<keywordlist.length ; i++){
		if(i!=0){str1=str1+" ";}
		str1=str1+keywordlist[i].innerText;
		if(i != keywordlist.length-1){ str1=str1+" "+keywordOperator;}
	}
	if (keywordlist.length>1) {str1="("+str1+")";}
	//building sites part
	var j;
	var sitelist=document.getElementById("siteWrapper").childNodes;
	var str2="";
	for (j=0 ; j<sitelist.length; j++) {
		if (j!=0) {str2=str2+" ";}
		str2=str2+"site:"+sitelist[j].innerText;
		if (j != sitelist.length-1) {str2=str2+" OR";}
	}
	if (sitelist.length>1) {str2="("+str2+")";}
	//building filetype list
	var k;
	var filetypelist=document.getElementById("filetypeWrapper").childNodes;
	var str3="";
	for(k=0;k<filetypelist.length;k++){
		if(k!=0){str3=str3+" ";}
		str3=str3 +"filetype:"+filetypelist[k].innerText;
		if(k!=filetypelist.length-1){str3=str3+" OR";}
	}
	if(filetypelist.length>1){str3="("+str3+")";}
	//building final expression
	var str=str1;
	if(str2.length>0){str=str+" "+str2;}
	if(str3.length>0){str=str+" "+str3;}
	var queryObj={
		base:str,
		date:"",
		tab:""
	};
	switch (dateselect.value) {
		case "none":
			queryObj.date="";
			break;
		case "minusOne":
			queryObj.date="oneDay";
			break;
		case "minusSeven":
			queryObj.date="oneWeek";
			break;
		case "minusThirty":
			queryObj.date="oneMonth";
			break;
		default:
			queryObj.date="";
			if (document.getElementById("dateAfter").value != "") {queryObj.date+=" after:"+document.getElementById("dateAfter").value;}
			if (document.getElementById("dateBefore").value != "") {queryObj.date+=" before:"+document.getElementById("dateBefore").value;}
			break;
	}
	switch(contentselect.value){
		case "news":
			queryObj.tab="inNews";
			break;
		case "images":
			queryObj.tab="inImages";
			break;
		case "videos":
			queryObj.tab="inVideos";
			break;
		case "shopping":
			queryObj.tab="inShopping";
			break;
		case "books":
			queryObj.tab="inBooks";
			break;
		default:
			queryObj.tab="inAllWeb";
			break;
	}
	return queryObj;
}
/*
Returns the concatenated base and date part of the query
*/
function queryToString(query){
	return query.base+" "+query.date+" "+query.tab;

}
/*
Returns the translated query string, as it can be read in the google search input
*/
function queryToFullString(query){
	var tms=Date.now();
	var datePart="";
	switch (query.date) {
		case "":
			datePart="";
			break;
		case "oneDay":
			var newtms=tms-86400000;
			var refdate=new Date(newtms);
			datePart=" after:"+refdate.toISOString().slice(0,10);
			break;
		case "oneWeek":
			var newtms=tms-604800000;
			var refdate=new Date(newtms);
			datePart=" after:"+refdate.toISOString().slice(0,10);
			break;
		case "oneMonth":
			var newtms=tms-2592000000;
			var refdate=new Date(newtms);
			datePart=" after:"+refdate.toISOString().slice(0,10);
			break;
		default:
			datePart=query.date;
			break;
	}
	return query.base+datePart;
}
function displayQueryPreview(str){
	document.getElementById("query-preview").innerText=str;
}
/*
Clears every data entered
*/
function clearAll(){
	document.getElementById("keywordform").innerText="";
	document.getElementById("siteform").innerText="";
	document.getElementById("filetypeform").innerText="";
	document.getElementById("query-preview").innerText="";
	var kww=document.getElementById("keywordWrapper");
	while(kww.hasChildNodes()){
		kww.firstChild.remove();
	}
	var sw=document.getElementById("siteWrapper");
	while(sw.hasChildNodes()){
		sw.firstChild.remove();
	}
	var ftw=document.getElementById("filetypeWrapper");
	while(ftw.hasChildNodes()){
		ftw.firstChild.remove();
	}
	dateselect.selectedIndex = 0;
	contentselect.selectedIndex=0;
	document.getElementById("kwAnd").checked=false;
	document.getElementById("dateAfter").value="jj/mm/aaaa";
	document.getElementById("dateBefore").value="jj/mm/aaaa";
	
}
/*
Updates the queries list
*/
function updateList(){
	var qlist=document.getElementById("stored-queries");
	while(qlist.hasChildNodes()){
		qlist.firstChild.remove();
	}
	browser.storage.local.get().then((results)=>{
		var storageList=Object.values(results);
		var i;
		for(i=0;i<storageList.length;i++){
			var desig=queryToString(storageList[i]);
			var url=buildSearchURL(queryToFullString(storageList[i]));
			switch (storageList[i].tab) {
				case "inNews":
					url=url+"&tbm=nws";
					break;
				case "inImages":
					url=url+"&tbm=isch";
					break;
				case "inVideos":
					url=url+"&tbm=vid";
					break;
				case "inBooks":
					url=url+"&tbm=bks";
					break;
				case "inShopping":
					url=url+"&tbm=shop";
					break;
				default:
					break;
			}
			var displayNode=document.createElement("A");
			displayNode.setAttribute("href",url);
			displayNode.setAttribute("target","_blank");
			displayNode.innerText=desig;


			var deleteNode=document.createElement("BUTTON");
			deleteNode.setAttribute("class","deleteBtn");
			deleteNode.innerText="Delete";
			//adds a lisener to the delete buttons
			deleteNode.addEventListener("click",()=>{
				browser.storage.local.remove(desig);
			});

			var liNode=document.createElement("LI");
			liNode.appendChild(displayNode);
			liNode.appendChild(deleteNode);
			qlist.appendChild(liNode);
		}
	});
}
/*
Builds the correct query URL for google search
*/
function buildSearchURL(str){
	str=encodeURIComponent(str);
	str=str.replace(/%20/g,"+");
	str=q+str;
	return str;
}
/*
Removes the query from storage
*/
function deleteLine(e){
	str=e.target.previousSibling.innerText;
	browser.storage.local.remove(str);
}
function displayHelp(){
	var createData = {
  	type: "detached_panel",
  	url: "localhelp.html",
  	width: 800,
  	height: 600
	};
	var creating = browser.windows.create(createData);
}
