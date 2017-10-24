var pinAccess;
$(window).on("load", function() {
	$.post("getPin.php", {}, function(data) {
		pinAccess = data;
	} );
});
	
var typed_pin;
$( "#pinInput" ).on("change keyup paste click", function() {
	var value = $(this).val();
	
	if(value == pinAccess) {
		document.getElementById("logout").innerHTML = "<label class='header'>LOGOUT</label>";
		typed_pin = value;
		$("#optionArea").css("display", "inline");
		$("#pinArea").css("display", "none");
		$.post("setSession.php", {"typed_pin": typed_pin }, function() {

		});
	}
	
});

$("#employeeLabel").click(function() {
	window.open("employee.php", "_top");
});

$("#reportLabel").click(function() {
	window.open("report.php", "_top");
	
});

$("#logoutEmployee").click(function() {
	$("#logoutModalClick").click();
});

$("#logoutConfirm").click(function() {
	getNumOfEvent();
});

$("#deleteLogs").click(function() {
	$("#cleanupModalClick").click();
});

$("#cleanupConfirm").click(function() {
	getNumOfAuthId();
});

function getNumOfEvent() {
	authorised_id_ref.orderByChild("actual_state").equalTo("in").once("value", function(snap) {
		var num = snap.numChildren();
		logOutEmployee(num);
		authorised_id_ref.off("value");
	});
}

function getNumOfAuthId(num) {
	authorised_id_ref.once("value", function(snap) {
		var num = snap.numChildren();
		cleanupLogs(num);
		authorised_id_ref.off("value");
	});
}

function cleanupLogs(num) {
	var falseIn = [];
	var index = 0;
	var post_data = {
		log_events: ""
	}; 
	if(num != 0)
		authorised_id_ref.on("child_added", function(snap) {
			var newPostKey = authorised_id_ref.child(snap.key);
			
			if(!snap.val().is_actual && snap.val().actual_state == 'out') {
				newPostKey.remove();
				
			} else if(snap.val().actual_state == 'out')
				newPostKey.update(post_data);
				//console.log('abc');
			else {
					/*post_data = {
						actual_state: 'in',
						is_actual: snap.val().is_actual,
						log_events
					};*/
					if(!snap.val().is_actual) {
						falseIn.push(snap.key);
						//console.log('here');
					}
					getNumOfLogs(snap.key);
			}
			index++;
			if(index >= num) {
				authorised_id_ref.off('child_added');
				getNumOfEmployees(falseIn);
				//console.log('Here');
			}
		});
	document.getElementById("ntfModalClick").click();
	$('#ntfMessage').html('All logs has been cleaned up.');
	setTimeout(offModal, 1000);
}

function getNumOfEmployees(arr) {
	employee_data_ref.once('value', snap=> {
		var num = snap.numChildren();
		deleteOldIds(num, arr);
		employee_data_ref.off('value');
	});
}

function deleteOldIds(num, arr) {
	var index = 0;
	var post_data;
	employee_data_ref.on('child_added', snap => {
		var newPostKey = ref.child(employee_data_path + snap.key);
		
		if(arr.length != 0 && snap.val().old_tag_id != "") {
			var oldIds = snap.val().old_tag_id.split("|");
			//console.log(arr);
			if(arr.indexOf(oldIds[oldIds.length - 1]) != -1)
				post_data = {
					old_tag_id: oldIds[oldIds.length - 1]
				};
		} else 
			post_data = {
				old_tag_id: ""
			};
		newPostKey.update(post_data);
		index++;
		if(index == num)
			employee_data_ref.off('child_added');
	});
}

function getNumOfLogs(id) {
	var logRef = ref.child(authorised_id_path + id + "/log_events");
	logRef.once('value', function(snap) {
		var num = snap.numChildren();
		updateLastLog(num,id);
		logRef.off('value');
	});
}

function updateLastLog(num,id) {
	var index = 0;
	var path = authorised_id_path + id + "/log_events";
	var logRef = ref.child(path);
	if(num != 0)
		logRef.on('child_added', snap => {
			index++;
			if(index < num) {
				var val = snap.val();
				var removeRef = ref.child(path + '/' + snap.key);
				removeRef.remove();
			} else 
				logRef.off('child_added');
		});
}

function getTimeStamp(val) {
	 var now = new Date();
	 
	 var date = [ now.getFullYear(), now.getMonth() + 1, now.getDate()];
	 
	 for ( var i = 1; i < 3; i++ ) {
		if ( date[i] < 10 ) {
			date[i] = "0" + date[i];
		}
	  }
	  
	  var dateStamp = date.join("");
	  
	  if(val == "dateStamp")
		  return dateStamp;
	 
	 var time = [ now.getHours(), now.getMinutes()];
	 for ( var i = 0; i < 2; i++ ) {
		if ( time[i] < 10 ) {
		  time[i] = "0" + time[i];
		}
	  }
	  
	  if(val == "timeStamp")
		return dateStamp + time.join("");
	
	var second = now.getMilliseconds();
	if(val == "secondStamp")
		return second;
}

function logOutEmployee(num) {
	//console.log("here");
	var timeStamp = getTimeStamp("timeStamp");
	var dateStamp = getTimeStamp("dateStamp");
	var sec = getTimeStamp("secondStamp");
	var postData = {
		dateStamp: dateStamp * 1,
		direction: "out",
		timeStamp: "" + timeStamp
	};
	
	var i = 0;
	
	var statusPost = {
		actual_state: "out"
	};
	
	if(num != 0)
		authorised_id_ref.orderByChild("actual_state").equalTo("in").on("child_added", snap => {
			if(snap.val().is_actual) {
				var newKey = timeStamp + "" + sec;
				updates = {};
				updates[authorised_id_path + snap.key + "/log_events/" + newKey] = postData;
				ref.update(updates);
				
				var newPostKey = authorised_id_ref.child(snap.key);
				newPostKey.once("value", function(snapshot) {
					if(snapshot.val() == null)
						console.log("Does not exist");
					else 
						newPostKey.update(statusPost);
				});
			}
			
			++i;
			if(i >= num)
				authorised_id_ref.off("child_added");
		});
	document.getElementById("ntfModalClick").click();
	$('#ntfMessage').html('All employess has been logged out.');
	setTimeout(offModal, 1000);
}

function offModal() {
	document.getElementById("ntfModalDismiss").click();
}

