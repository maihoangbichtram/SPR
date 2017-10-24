var start;
var	end;

var start_day;
var start_month;
var start_year;
var start_date;


var end_day;
var end_month;
var end_year;
var end_date;

var table = document.getElementById("dateTableBody");

var timestamps = [];


function set_up_dates() {

	table.innerHTML = "";
	var arr = [];
	start = document.getElementById("datepicker_start").value;
	end = document.getElementById("datepicker_end").value;
	
	arr = start.split("/");
	start_day = arr[1];
	start_month = arr[0];
	start_year = arr[2];
	start_date = (start_year + start_month + start_day) * 1;

	arr = end.split("/");
	end_day = arr[1];
	end_month = arr[0];
	end_year = arr[2];
	end_date = (end_year + end_month + end_day) * 1;
	
	document.getElementById("printButton").style.display="inline";
	document.getElementById("hour_date").style.display = "inline-table";
}


function tableSetUp() {
	/*var month_diff = end_month - start_month;
	var month = start_month * 1;
	var table = document.getElementById("dateTableBody");*/
	
	var month_diff = end_month - start_month;
	var month = end_month * 1;
	var table = document.getElementById("dateTableBody");
	
	document.getElementById("dateDuration").innerHTML = start_day + "." + start_month + " - " + end_day + "." + end_month + "." + end_year;
	
	for(var i = month_diff; i >= 0; i--, month--) {
		
		
		if(month < 10)
			month = "0" + month;
		
		if(i == month_diff)
			numOfDays = start_day;
		else
			numOfDays = new Date(start_year, month, 0).getDate();
		
		if(i == 0)
			day = end_day * 1;
		else
			day = new Date(start_year, month, 0).getDate();
		
		for(var j = day; j >= 1; j--) {
			if(j < 10)
				j = "0" + j * 1;
			var date_td = j + "/" + month + "/" + start_year;
			var date_tr = "" + start_year + month + j;
		
				var y = document.createElement("tr");
				y.setAttribute("id", date_tr);
				y.style = "display: none";
				
				table.appendChild(y);
			//}
				
			//if(!document.getElementById(date_tr + "date")) {
				
				
				var x = document.createElement("TD");
				x.setAttribute("id", date_tr + "date");
				document.getElementById(date_tr).appendChild(x);
				var t = document.createTextNode(date_td);
				x.appendChild(t);
			//}
			
			//if(!document.getElementById(date_tr + "persons")) {
				/*x = document.createElement("TD");
				x.setAttribute("id", date_tr + "personWorkHour");
				document.getElementById(date_tr).appendChild(x);
				
				
				var smallT = document.createElement("table");
				smallT.setAttribute("id", date_tr + "smallT");
				document.getElementById(date_tr+"personWorkHour").appendChild(smallT);
				
				y = document.createElement("tr");
				//var trs = document.getElementsByTagName("tr");
				//console.log(trs.length);
				smallT.appendChild(y);*/
				
				var x = document.createElement("TD");
				x.setAttribute("id", date_tr + "persons");
				y.appendChild(x);
				
				x = document.createElement("TD");
				x.setAttribute("id", date_tr + "workHours");
				y.appendChild(x);
			//}
		}
	}
	
	/*for(var i = 0; i <= month_diff; i++, month++) {
		if(i == 0)
			day = start_day * 1;
		else
			day = 1;
		
		if(month < 10)
			month = "0" + month;
		
		if(i == month_diff)
			numOfDays = end_day;
		else
			numOfDays = new Date(start_year, month, 0).getDate();
		
		for(var j = day; j <= numOfDays; j++) {
			if(j < 10)
				j = "0" + j * 1;
			var date_td = j + "/" + month + "/" + start_year;
			var date_tr = "" + start_year + month + j;
		
				var y = document.createElement("tr");
				y.setAttribute("id", date_tr);
				y.style = "display: none";
				
				table.appendChild(y);
			//}
				
			//if(!document.getElementById(date_tr + "date")) {
				
				
				var x = document.createElement("TD");
				x.setAttribute("id", date_tr + "date");
				document.getElementById(date_tr).appendChild(x);
				var t = document.createTextNode(date_td);
				x.appendChild(t);
			//}
			
			//if(!document.getElementById(date_tr + "persons")) {
				/*x = document.createElement("TD");
				x.setAttribute("id", date_tr + "personWorkHour");
				document.getElementById(date_tr).appendChild(x);
				
				
				var smallT = document.createElement("table");
				smallT.setAttribute("id", date_tr + "smallT");
				document.getElementById(date_tr+"personWorkHour").appendChild(smallT);
				
				y = document.createElement("tr");
				//var trs = document.getElementsByTagName("tr");
				//console.log(trs.length);
				smallT.appendChild(y);*/
				
				/*var x = document.createElement("TD");
				x.setAttribute("id", date_tr + "persons");
				y.appendChild(x);
				
				x = document.createElement("TD");
				x.setAttribute("id", date_tr + "workHours");
				y.appendChild(x);
			//}
		}
	}*/
	set_up_firebaseDate();
}
	

	

			
			

/*function init() {
	var table = document.getElementById("dateTableBody");
	var y = document.createElement("tr");
	y.setAttribute("id", "20170910" + "tr");
	table.appendChild(y);
	var x = document.createElement("TD");
	x.setAttribute("id", "date");
	document.getElementById(start_date + "tr").appendChild(x);
	var t = document.createTextNode(start);
	x.appendChild(t);
	
	
	x = document.createElement("TD");
	x.setAttribute("id", "persons");
	
	document.getElementById(start_date + "tr").appendChild(x);
	t = document.createTextNode("John: 8.3 hours");
	x.appendChild(t);
	var br = document.createElement("br");
	x.appendChild(br);
	t = document.createTextNode("Mai: 7.5 hours");
	x.appendChild(t);
	
	//document.getElementById("datea").innerHTML = "\<p\>def\</p\>";
	//document.getElementById("datea").innerHTML = "<p>ab</p>";
}*/

function set_up_firebaseDate() {
	var table = document.getElementById("dateTableBody");
	
	document.getElementById("dateDuration").innerHTML = start_day + "." + start_month + " - " + end_day + "." + end_month + "." + end_year;
	var cur_id;

	employee_data_ref.on("child_added", snap => {
		var id = snap.key;
		var name = snap.child("name").val();
		var ssn = snap.child("ssn").val();
		var tag_id = snap.child("tag_id").val();
		var old_tag_id = snap.child("old_tag_id").val();
		getAllIds(tag_id, old_tag_id, name);
	});
}

function getAllIds(tag_id, old_tag_id, name) {
	
	var m = 0;
	timestamps = [];
	
	var id_arr =  (old_tag_id != "") ? old_tag_id.split("|") : [];
	id_arr.push(tag_id);
	
		for(var i = 0; i < id_arr.length; i++) {
			
			var curId = id_arr[i];
			if(curId != "")
				getNumOfEventsDate(curId, name, (i == id_arr.length - 1) ? true:false);
		}
}

function getNumOfEventsDate(id, name, state) {
	var log_event_ref = ref.child(authorised_id_path + id + "/log_events");
	
	log_event_ref.orderByChild("dateStamp").startAt(start_date).endAt(end_date).once("value", function(snap) {
			m = snap.numChildren();
			if( m != 0) {
				get_employee_by_id(id, name, m);
			} 
			
			if(state) {
				if(m == 0)
					document.getElementById("hiddenLink").click();
			}
			log_event_ref.off("value");
	});

}

function get_employee_by_id(tag_id, name, totalEvents) {
	var index = 0;
	
	var id = tag_id;
	
	var log_event_ref = ref.child(authorised_id_path + id + "/log_events");
	
	log_event_ref.orderByChild("dateStamp").startAt(start_date).endAt(end_date).on("child_added", function(snap) {
		//if(snap.val().datestamp >= start_date && snap.val().datestamp <= end_date) {
			if(timestamps.length == 0) {
				//console.log("id = " + tag_id + ", " + name);
				total = 0;
			}
			
			if(snap.val() != null) {	
				//timestamps.push(snap.child("timestamp").val());
				if(timestamps.length % 2 == 0 && snap.val().direction == "in" || timestamps.length % 2 != 0 && snap.val().direction == "out") {
					
					timestamps.push(snap.child("timeStamp").val());
					++index; 
					//console.log(timestamps);
					if(timestamps.length % 2 == 0 && timestamps.length != 0) {
						set_reportDate(timestamps.length, timestamps, tag_id, name);
					}
				}
			}
			if(index == totalEvents && totalEvents % 2 == 0 || index == (totalEvents - 1) && totalEvents % 2 != 0) {
				//set_total();
				document.getElementById("hiddenLink").click();
				log_event_ref.off();
			}
		//}
	});
	
}




function set_reportDate(i, timestamps, tag_id, name) {	
		var a = timestamps[i-2] + "";
		var b = timestamps[i - 1] + "";
		
		var daya = a.substring(6,8);
		var montha = a.substring(4,6);
		var yeara = a.substring(0,4);
		
		var dayb = b.substring(6,8);
		var monthb = b.substring(4,6);
		var yearb = b.substring(0,4);
		
		
		
		if(dayb == daya && monthb == montha && yeara == yearb) {
			var date_td = daya + "/" + montha + "/" + yeara;
			var date = "" + yeara + montha + daya;
			if(date >= start_date && date <= end_date) {
				var total_min = (b.substring(8,10) * 60 + b.substring(10,12) * 1) - (a.substring(8,10) * 60 + a.substring(10,12) * 1);
				var hour = total_min/60;
				hour = hour.toFixed(2);
				total = total + hour * 1;
				
				//tableSetUp(day, month, year);
				var x,y;
				if(!(y = document.getElementById(date))) {
					y = document.createElement("tr");
					y.setAttribute("id", date);
					table.appendChild(y);
				}
				
				if(!(x = document.getElementById(date + "date"))) {
					x = document.createElement("TD");
					x.setAttribute("id", date + "date");
					y.appendChild(x);
					var t = document.createTextNode(date_td);
					x.appendChild(t);
				}
				
				if(!(x = document.getElementById(date + "persons"))) {
					x = document.createElement("TD");
					x.setAttribute("id", date + "persons");
					y.appendChild(x);
				}
				
				
				var p = document.createElement("p");
				p.innerHTML = name;
				x.appendChild(p);
				
				/*var t = document.createTextNode(name);
				x.appendChild(t);
				var br = document.createElement("br");
				x.appendChild(br);
				x.appendChild(br);*/
				
				//var hr = document.createElement("hr");
				
				if(!(x = document.getElementById(date + "workHours"))) {
					x = document.createElement("TD");
					x.setAttribute("id", date + "workHours");
					y.appendChild(x);
				}
				x = document.getElementById(date + "workHours");
				p = document.createElement("p");
				p.innerHTML = hour;
				x.appendChild(p);
				//x.appendChild(hr);
				
				/*var t = document.createTextNode(hour);
				x.appendChild(t);
				var br = document.createElement("br");
				x.appendChild(br);
				x.appendChild(br);*/
				
				//x.setAttribute("id", "persons");
				//document.getElementById(day + "/" + month + "/" + year + "tr").appendChild(x);
				
				//t = document.createTextNode("Mai: 7.5 hours");
				//x.appendChild(t);
				
				//console.log(b.substring(6,8) + "/" + b.substring(4,6) + "/" + b.substring(0,4) + ": " + hour + " hour(s)");
			}
		}

		//document.getElementById("hiddenLink").click();

}



	/*var log_event_ref = ref.child("shop_event/" + shop_id + "/authorised_id/" + id + "/log_events");

log_event_ref.on("child_changed", snap => {
			//get_name(snap.val().tag_id);
		});
	log_event_ref.on("child_removed", snap => {
			
		});*/