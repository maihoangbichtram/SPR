var totalEvents = 0;
var timestamps = [];
//var index = 0;
//var total = 0;


function set_persons() {
	var tableBody = document.getElementById("personTableBody");
	tableBody.innerHTML = "";
	
	var cur_id;

	employee_data_ref.on("child_added", snap => {
		var key = snap.key;
		var name = snap.child("name").val();
		var tag_id = snap.child("tag_id").val();
		var old_tag_id = snap.child("old_tag_id").val();
		
		var table = document.getElementById("personTableBody");
		
		var y = document.createElement("tr");
		y.setAttribute("id",key);
		y.setAttribute("onmouseover", "ChangeColor(this, true);");
		y.setAttribute("onmouseout", "ChangeColor(this, false);");
		table.appendChild(y);
		
		var x = document.createElement("TD");
		x.setAttribute("id", tag_id);
		x.setAttribute("onclick", "getTotalIds('"+tag_id+"','" + old_tag_id + "','" + name + "');");
		//x.setAttribute("onclick", "getIds('" + tag_id + "')");
		y.appendChild(x);
		x.innerHTML = name;
	
	});
}

/*function getIds(tag_id) {
	totalEvents = 0;
	index = 1;
	total = 0;
	
	var personDataTable = document.getElementById("data_display");
	personDataTable.style.display = "inline-table";
	
	var dataTableBody = document.getElementById("dataTableBody");
	dataTableBody.innerText = "";
	var x = document.getElementById("nameDisplay");

	var commentsRef = firebase.database().ref().child("employee_data");
	var ids, name;
	commentsRef.orderByChild("tag_id").equalTo(tag_id).once("child_added", function(snap) {
		ids = snap.val().old_tag_id;
		name = snap.val().name;
		x.innerHTML = name;
	});
	var id_arr = [];
	if(ids) {
		//console.log("ABC");
		id_arr = ids.split("|");
	}
	id_arr.push(tag_id);
	
	console.log(id_arr);
	//getNumOfEvents(tag_id, name);
	
	if(id_arr.length == 0) {
		set_total();
		alert("here");
	}
	else
		for(var i = 0; i < id_arr.length; i++) {
			//console.log("here");
			getNumOfEvents(id_arr[i], name);
		}
	
}*/


function getTotalIds(tag_id, old_tag_id, name) {
	var printButton = document.getElementById("printButton");
	printButton.style = "display: inline";
	document.getElementById("totalHour").innerHTML = 0;
	
	document.getElementById("data_display").style.display = "inline-table";
	var dataTableBody = document.getElementById("dataTableBody");
	dataTableBody.innerText = "";
	var x = document.getElementById("nameDisplay");
	x.innerHTML = name;
	
	timestamps = [];
	
	var m = 0;
	
	var id_arr =  (old_tag_id != "") ? old_tag_id.split("|") : [];
	
	id_arr.push(tag_id);
	
	for(var i = 0; i < id_arr.length; i++) {
		
		var curId = id_arr[i];
		
		if(curId != "")
			getNumOfEvents(curId, name, (i == id_arr.length - 1) ? true:false);
		//get_log_events(curId, name);
	}
	
	
	
}

function getNumOfEvents(id, name, state) {
	var log_event_ref = ref.child(authorised_id_path + id + "/log_events");
	log_event_ref.once("value", function(snap) {
			m = snap.numChildren();
			if( m != 0) {
				totalEvents += m;

				get_log_events(id, name, m);
			} 
			
			if(state) {
				if(m == 0)
					document.getElementById("hiddenLink").click();
			}
			log_event_ref.off("value");
	});

}



function get_log_events(tag_id, name, totalEvents) {
	var index = 0;
	
	var totalEvents;
	var id = tag_id;
	var log_event_ref = ref.child(authorised_id_path + id + "/log_events");
	log_event_ref.on("child_added", function(snap) {
		
		if(snap.val() != null) {	
		
			if(timestamps.length % 2 == 0 && snap.val().direction == "in" || timestamps.length % 2 != 0 && snap.val().direction == "out") {
			
					timestamps.push(snap.child("timeStamp").val());
					++index; 
					
					if(timestamps.length % 2 == 0 && timestamps.length != 0) {
							
							set_reportPerson(timestamps.length, timestamps, tag_id, name);
					}
					
				}	
		}
		if(index == totalEvents && totalEvents % 2 == 0 || index == (totalEvents - 1) && totalEvents % 2 != 0) {
			//set_total();
			document.getElementById("hiddenLink").click();
			log_event_ref.off();
		}
	});
	
	
	
}


function set_reportPerson(i, timestamps, tag_id, name) {
		var a = timestamps[i-2] + "";
		var b = timestamps[i - 1] + "";
		
		
		var end_hour = b.substring(8,10);
		var end_min = b.substring(10,12);
		
		var start_hour = a.substring(8,10);
		var start_min = a.substring(10,12);
		
		var daya = a.substring(6,8);
		var montha = a.substring(4,6);
		var yeara = a.substring(0,4);
		
		var dayb = b.substring(6,8);
		var monthb = b.substring(4,6);
		var yearb = b.substring(0,4);
		
		
		if(dayb == daya && monthb == montha && yeara == yearb) {
		var date = "" + yeara + montha + daya;
		var day = daya;
		var month = montha;
		var year = yeara;
		//if(date >= start_date && date <= end_date) {
		
			var total_min = (end_hour * 60 + end_min * 1) - (start_hour * 60 + start_min * 1);
			var hour = total_min/60;
			hour = hour.toFixed(2);
			//total = total + hour * 1;
			
			var table = document.getElementById("dataTableBody");
			
			var y = document.createElement("tr");
			table.appendChild(y);
			
			var x = document.createElement("TD");
			y.appendChild(x);
			var t = document.createTextNode(day + "." + month + "." + year);
			x.appendChild(t);
			
			x = document.createElement("TD");
			y.appendChild(x);
			t = document.createTextNode(start_hour + ":" + start_min);
			x.appendChild(t);
			
			x = document.createElement("TD");
			y.appendChild(x);
			t = document.createTextNode(end_hour + ":" + end_min)
			x.appendChild(t);
			
			x = document.createElement("TD");
			y.appendChild(x);
			t = document.createTextNode(hour);
			x.appendChild(t);
			
			var curTotal = document.getElementById("totalHour").innerHTML;
			var total = curTotal * 1 + hour * 1;
			document.getElementById("totalHour").innerHTML = total;
		}
}

function set_total() {
	var printButton = document.getElementById("printButton");
	printButton.style = "display: inline";
	
	var table = document.getElementById("dataTableBody");
	var y = document.createElement("tr"); 
	table.appendChild(y);
	var x = document.createElement("td");
	y.appendChild(x);
	x.setAttribute("colspan","3");
	x.innerHTML = "Total:";
	x = document.createElement("td");
	y.appendChild(x);
	x.innerHTML = total + " hour(s)";
	document.getElementById("hiddenLink").click();
}

employee_data_ref.on("child_changed", snap => {
			var change = snap.val();
			var tr = document.getElementById(snap.key);
			var td = tr.cells[0];
			td.setAttribute("id", change.tag_id);
			td.setAttribute("onclick", "getTotalIds('"+change.tag_id+"','" + change.old_tag_id + "','" + change.name + "');");
		});
	employee_data_ref.on("child_removed", snap => {
			var tr = document.getElementById(snap.key);
			tr.remove();
		});

