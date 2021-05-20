//Defines buttons
const keywordbtn=document.getElementById("keywordbutton");
const sitebtn=document.getElementById("sitebutton");
const ftbtn=document.getElementById("filetypebutton");
const savebutton=document.getElementById("save-button");
const rstbutton=document.getElementById("reset-button");
const dateafter=document.getElementById("dateAfter");
const datebefore=document.getElementById("dateBefore");
const q="https://www.google.com/search?q=";
//init storage
init();
/*
Creates specific storage area for stored queries
Creates a listener for each button.
*/
function init(){	
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
		buildquery();
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
		buildquery();
	});
	//retrieves the entered filtype and adds it to the types list
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
		buildquery();
	});
	dateafter.addEventListener("input",()=>{
		buildquery();
	});
	datebefore.addEventListener("input",()=>{
		buildquery();
	});
	//resets the form
	rstbutton.addEventListener("click",()=>{
		clearAll();
	});
	//saves the query in local storage as a key/value pair
	//Key = query / Value = URL
	savebutton.addEventListener("click",()=>{
		var exp=document.getElementById("query-preview").innerText;
		var expurl=buildSearchURL(exp);
		var storeIt={};
		storeIt[exp]={
			expression:exp,
			url:expurl
		};
		browser.storage.local.set(storeIt);
		clearAll();		
	});
	
	updateList();
	browser.storage.onChanged.addListener(updateList);
}

/*
Builds a query based on the user's entries. 
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
	var str4="";
	if (dateafter.value != "") {str4=" after:"+dateafter.value;}
	var str5="";
	if (datebefore.value != "") {str5=" before:"+datebefore.value;}
	var str=str1+" "+str2+" "+str3+str4+str5;
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
	document.getElementById("kwAnd").checked=false;
	dateafter.value="jj/mm/aaaa";
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
			var displayNode=document.createElement("A");
			displayNode.setAttribute("href",storageList[i].url);
			displayNode.setAttribute("target","_blank");
			displayNode.innerText=storageList[i].expression;


			var deleteNode=document.createElement("BUTTON");
			deleteNode.setAttribute("class","deleteBtn");
			deleteNode.innerText="Delete";
			//adds a lisener to the delete buttons
			deleteNode.addEventListener("click",deleteLine);

			var liNode=document.createElement("LI");
			liNode.appendChild(displayNode);
			liNode.appendChild(deleteNode);
			qlist.appendChild(liNode);
		}
	});
}
function buildSearchURL(str){
	str=encodeURIComponent(str);
	str=str.replace(/%20/g,"+");
	str=q+str;
	return str;
}
function deleteLine(e){
	str=e.target.previousSibling.innerText;
	browser.storage.local.remove(str);
}