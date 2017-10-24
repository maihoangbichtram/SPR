
window.onload = init;

function init() {
	var input = document.getElementById("tag_id");
	//input.onkeypress = handleKeyPress;
	display_employee_table();
}

function handleKeyPress(e) {
	if(e.keyCode == 13) {
		document.getElementById("change_id_confirm").click();
		return false;
	}
}

function display_employee_table() {
	document.getElementById("table_body").innerHTML = "";
	employee_data_ref.on("child_added", snap => {
		var key = snap.key;
		var name = snap.child("name").val();
		var id = snap.child("tag_id").val();
		var old_id = snap.child("old_tag_id").val();
		
		if(old_id == null)
			old_id = "";
								
		$("#table_body").append("<tr id='" + key + "tr'><td>" + name + "</td><td id='" + key + "'>" + id + "</td>" +
								"<td id='"+key+"_td_button' align='left'></td></tr>");

		var td = document.getElementById(key + "_td_button");
		
		var div = document.createElement("div");
		div.setAttribute("class", key + "dropdown");
		td.appendChild(div);
		
		var button = document.createElement("button");
		button.setAttribute("onclick","myFunction('" + key + "')");
		button.setAttribute("class","dropbtn");
		var t = document.createTextNode("Muokkaa");
		button.appendChild(t);
		div.appendChild(button);
		
		var div1 = document.createElement("div");
		div1.setAttribute("id",key + "myDropdown");
		div1.setAttribute("class", "dropdown-content");
		
		div.appendChild(div1);
		
		var a = document.createElement("a");
		a.setAttribute("id", key + "update_id");
		a.setAttribute("data-toggle","modal");
		a.setAttribute("data-target","#myModal");
		a.setAttribute("onclick",'edit_id_click("update_id(\'' + key + '\',\'' + id + '\',\'' + old_id + '\')")');
		var t = document.createTextNode("Vaihda tagi");
		a.appendChild(t);
		div1.appendChild(a);
		
		a = document.createElement("a");
		a.setAttribute("id", key + "set_modal");
		a.setAttribute("onclick", "set_modal('" + key + "','" + id + "','" + name + "','" + old_id + "')"); 
		var t = document.createTextNode("Poista henkilö/tagi");
		a.appendChild(t);
		div1.appendChild(a);
	});
}
		
function set_modal(curId, tagID, name, old_id) {
	var curRef = employee_data_ref.child(curId);
	curRef.once("value", function(snapshot) {
		if(snapshot.val() == null)
			console.log("Does not exist");
		else {
			tagID = snapshot.val().tag_id;
			name = snapshot.val().name;
		}		
	});
		
	var table = document.getElementById("delete_modal");
	var x = document.getElementById("delete_modal_1");
	x.setAttribute("onclick","remove_confirm('Person','"+name+"','remove_data(\"" + curId + "\",\"" + tagID + "\")')");
	x.innerHTML = "<p><b>Person</b></p><p>" + name + "</p>";
	
	x = document.getElementById("delete_modal_2");
	x.setAttribute("onclick", "remove_confirm('Tag ID','" + tagID + "','remove_id(\"" + curId + "\",\"" + tagID + "\",\"" + old_id + "\")')");
	x.innerHTML = "<p><b>Tag ID</b></p><p>" + tagID + "</p>";
	
	document.getElementById("modalClick").click(); 
}
	
function remove_confirm(title, val, onclick_function) {
	var body_cnf = document.getElementById("confirm_body");
	body_cnf.innerHTML = "<b>"+title + "</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + val;
	var but = document.getElementById("delete_button");
	but.setAttribute("onclick", onclick_function);
	
	document.getElementById("confirmModalBut").click(); 
}


function remove_data(curId, id) {
	var curRef = employee_data_ref.child(curId);
	curRef.once("value", function(snapshot) {
		if(snapshot.val() == null)
			console.log("Does not exist");
		else {
			curRef.remove();
			var actual_state_ref = ref.child(authorised_id_path + id + "/log_events");
			actual_state_ref.once("value", function(snap) {
				if(snap.numChildren() == 0) {
					var curRef2 = authorised_id_ref.child(id);
					curRef2.once("value", function(snapshot) {
						if(snapshot.val() == null)
							console.log("Does not exist");
						else {
							curRef2.remove();
						}
						curRef2.off("value");
					});
				} else {
					setStatus(id, false);
				}
				actual_state_ref.off("value");
			});
		}
		curRef.off("value");
	});
	document.getElementById("delete_close").click();
}

function edit_id_click(click_func) {
	var tag_id = document.getElementById("tag_id");
	tag_id.style = "border-bottom: 2px solid red";
	var confirm_but = document.getElementById("change_id_confirm");
	confirm_but.setAttribute("onclick",click_func);
}

function checkIdDup(newId) {
	var m = 0;
	employee_data_ref.orderByChild("tag_id").equalTo(newId).once("value", function(snap) {
		m = snap.numChildren();
		employee_data_ref.off("value");
	});
	return m;
}





function updateLogEvent(curId, newId) {
	
	var post_data = {
			tag_id: newId
		};
		

	log_event_ref.orderByChild("tag_id").equalTo(curId).once("value").then(function(snap) {
		snap.forEach(function(childSnap) {
				updateAction(post_data, childSnap.key);
				//console.log("one" + ", key = " + childSnap.key);
		});
	});
	
}

function updateAction(post_data, key) {
	var newPostKey = log_event_ref.child(key);
		
		newPostKey.once("value", function(snapshot) {
			if(snapshot.val() == null)
				console.log("Does not exist");
			else 
				newPostKey.update(post_data);
		});	
}

function checkOldId(newId, oldId) {
	var m = oldId.indexOf(newId);
	var sub;
	
	if(m == -1) {
		return oldId;
	}
	var arr = oldId.split("|");
	var oldId = [];
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] != newId && arr[i] != "") {
			oldId.push(arr[i]);
		}
	}
	return oldId.join("|");
	
	/*var bool = true;
	var actual_state_ref = ref.child(authorised_id_path + "002o");
	actual_state_ref.once("child_added", snap => {
		console.log(snap.val());
		return snap.val();
	});*/

}

function getLastOldId(oldId) {
	if(oldId != "") {
		var arr = oldId.split("|");
		return arr[arr.length -1];
	}
	return "";
}

function update_id(key, curId, oldId) {
	var tag_id = document.getElementById("tag_id");
	var new_id = tag_id.value;
	tag_id.value = "";
	var m = checkIdDup(new_id);
	
	
	if(m == 0) {
		var actual_state_ref = ref.child(authorised_id_path + new_id);
		actual_state_ref.once("value", snap => {
			var num = snap.numChildren();
			if(num == 0) {
				var post_data;
				var curRef;
				if(curId != "") 
					curRef = ref.child(authorised_id_path + curId + "/log_events");
				else
					curRef = ref.child(authorised_id_path + "log_events");
				curRef.once("value", function(snap) {
					if(snap.numChildren() == 0) {
						post_data = {
							tag_id: new_id
						};
						if(curId != "") {
							var curRef2 = authorised_id_ref.child(curId);
							curRef2.once("value", function(snapshot) {
								if(snapshot.val() == null)
									console.log("Does not exist");
								else {
									curRef2.remove();
								}
								curRef2.off("value");
							});
						}
						var lastId = getLastOldId(oldId);
						//console.log(lastId);
						if(lastId != "") {
							var actual_state_ref = ref.child(authorised_id_path + lastId);
							var lastIdState = actual_state_ref;
							lastIdState.once("child_added", function(snap) {
								if(snap.val() == "out") {
									newAuthorisedId(new_id, "out");
								} else {
									//console.log(snap.val());
									getNumOfLogs(lastId, new_id);
									//newAuthorisedId(new_id, "in");
								}
								lastIdState.off("child_added");
							});
						} else
							newAuthorisedId(new_id, "out");
					} else {
						 post_data = {
							old_tag_id: checkOldId(new_id, oldId) + "|" + curId,
							tag_id: new_id
						}; 
						var actual_state_ref = ref.child(authorised_id_path + curId);
						actual_state_ref.once("child_added", function(snap) {
							if(snap.val() == "out") {
								newAuthorisedId(new_id, "out");
							} else {
								//console.log(snap.val().actual_state);
								getNumOfLogs(curId, new_id);
								//newAuthorisedId(new_id, "in");
							}
							actual_state_ref.off("child_added");
						});
						setStatus(curId, false);
					}
					var newPostKey = employee_data_ref.child(key);
				
					newPostKey.once("value", function(snapshot) {
						if(snapshot.val() == null)
							console.log("Does not exist");
						else {
							newPostKey.update(post_data);
						}
					curRef.off("value");
				});
				
				newPostKey.off("value");
				});
			} else {
				document.getElementById("messPara").innerHTML = "This ID has been assigned!";
				document.getElementById("messModalClick").click();
			} 
		});
	}
	
	
	//if(m == 0 && n) {
				
		//console.log("cur id = " + curId);
	else {
		document.getElementById("messPara").innerHTML = "This ID has been assigned!";
		document.getElementById("messModalClick").click();
	}
}

function remove_id(key, id, old_id) {
	var post_data = {
		tag_id: ""
	}; 
	var newPostKey = employee_data_ref.child(key);
	newPostKey.once("value", function(snapshot) {
		if(snapshot.val() == null)
			console.log("Does not exist");
		else {
			newPostKey.update(post_data);
			if(id != "") {
			var actual_state_ref = ref.child(authorised_id_path + id + "/log_events");
			actual_state_ref.once("value", function(snap) {
				if(snap.numChildren() != 0) {
					setStatus(id, false);
					post_data = {
						old_tag_id: old_id + "|" + id
					}; 
					newPostKey = employee_data_ref.child(key);
					
					newPostKey.once("value", function(snapshot) {
						if(snapshot.val() == null)
							console.log("Does not exist");
						else {
							newPostKey.update(post_data);
						}
					});
				} else {
					var curRef = authorised_id_ref.child(id);
					curRef.once("value", function(snapshot) {
						if(snapshot.val() == null)
							console.log("Does not exist");
						else {
							curRef.remove();
						}
						curRef.off("value");
					});
				}
				
				
				actual_state_ref.off("value");
			});
			}
			
			document.getElementById("delete_close").click();
		}
		newPostKey.off("value");
	});
}

function myFunction(temp) {
	document.getElementById(temp + "myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

employee_data_ref.on("child_changed", snap => {
	var key = snap.key;
	var name = snap.val().name;
	var id = snap.val().tag_id;
	var old_id = snap.val().old_tag_id;
	
	var td = document.getElementById(key);
	td.innerText = snap.val().tag_id;

	var a = document.getElementById(key + "update_id");
	a.setAttribute("onclick",'edit_id_click("update_id(\'' + key + '\',\'' + id + '\',\'' + old_id + '\')")');
	
	a = document.getElementById(key + "set_modal");
	a.setAttribute("onclick", "set_modal('" + key + "','" + id + "','" + name + "','" + old_id + "')"); 
});

employee_data_ref.on("child_removed", snap => {
	var tr = document.getElementById(snap.key + "tr");
	tr.remove();
});

function addPerson() {
	var name = document.getElementById("newPersonName");
	var ssn = document.getElementById("newPersonSSN");
	var id = document.getElementById("newPersonId");
	
	/*if(name.value == "")
		name.style = "border: 1px solid red;";
	if(ssn.value == "")
		ssn.style = "border: 1px solid red;";*/

	
	if(name.value != "" && ssn.value != "") {
		if(id.value == "") {
			//document.getElementById("addPersonClick").setAttribute("data-dismiss","modal");
			document.getElementById("addPersonClick2").click();
			var postData = {
				name: name.value,
				ssn: ""+ssn.value,
				tag_id: "",
				old_tag_id: ""
			};
			
			var newPostKey = employee_data_ref.push().key;
			var updates = {};
			updates[employee_data_path + newPostKey] = postData;
			ref.update(updates);
		} else {
			
			var actual_state_ref = ref.child(authorised_id_path + id.value);
			actual_state_ref.once("value", function(snap) {
				if(snap.numChildren() == 0) {
					//document.getElementById("addPersonClick").setAttribute("data-dismiss","modal");
					document.getElementById("addPersonClick2").click();
					var postData = {
						name: name.value,
						ssn: ""+ssn.value,
						tag_id: ""+id.value,
						old_tag_id: ""
					};
					
					var newPostKey = employee_data_ref.push().key;
					var updates = {};
					updates[employee_data_path + newPostKey] = postData;
					ref.update(updates);
					
					
					
					
					
					if(id.value != "") {
						newAuthorisedId(id.value, "out");
					}
					name.value = "";
					ssn.value = "";
					id.value = "";
					actual_state_ref.off("value");
				} else {
					id.style = "border-bottom: 2px solid red";
					actual_state_ref.off("value");
				}
			});
			
		}
	}
}

function setStatus(id, stt) {
	var newPostKey = authorised_id_ref.child(id);
	var post_data = {
		is_actual: stt
	}; 
	
	
	newPostKey.once("value", function(snapshot) {
		if(snapshot.val() == null)
			console.log("Does not exist");
		else 
			newPostKey.update(post_data);
		newPostKey.off("value");
	});
}

function updateOldId(new_id, oldId, curId, key) {
	
}

function newAuthorisedId(id, stt) {
	var postData = {
		is_actual: true,
		actual_state: stt,
		log_events: ""
	};
	updates = {};
	updates[authorised_id_path + id] = postData;
	ref.update(updates);
}
	
function getNumOfLogs(id, newId) {
	var logRef = ref.child(authorised_id_path + id + "/log_events");
	logRef.once('value', function(snap) {
		var num = snap.numChildren();
		updateLastLog(num,id, newId);
		logRef.off('value');
	});
}

function updateLastLog(num,id, newId) {
	var index = 0;
	var path = authorised_id_path + id + "/log_events";
	var logRef = ref.child(path);
	if(num != 0) {
		logRef.on('child_added', snap => {
			
			if(index == num - 1) {
				var postData = {
					is_actual: true,
					actual_state: 'in'
				};
				updates = {};
				updates[authorised_id_path + newId] = postData;
				ref.update(updates);
				
				var postData = {
					dateStamp: snap.val().dateStamp,
					direction: snap.val().direction,
					timeStamp: snap.val().timeStamp
				};
				updates = {};
				updates[authorised_id_path + newId +"/log_events/"+snap.key] = postData;
				ref.update(updates);
				
				var removeRef = ref.child(authorised_id_path + id +"/log_events/"+snap.key);
				removeRef.remove();
			} 
			index++;	
			if(index == num) {
				logRef.off('child_added');
			}
		});
		
		var post_data = {
			actual_state: 'out'
		};
		var newPostKey = ref.child(authorised_id_path + id);
		newPostKey.once("value", function(snap) {
			newPostKey.update(post_data);
			//console.log("one" + ", key = " + childSnap.key);
			newPostKey.off('value');
		});
	}
}
	
		
	

