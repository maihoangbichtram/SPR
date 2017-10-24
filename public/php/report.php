<?php

	session_start();

	if(!isset($_SESSION['typed_pin']) || $_SESSION['typed_pin'] != $_SESSION['pin']) {
		header("Location: ../index.php");
	} else {
			$nav = "RAPORTIT";
			require_once("header.php");
			require_once("logo.php");
		
?>
<!doctype html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<title>Report Management</title>
		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
		<link rel="stylesheet" href="../css/style.css">
		<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
		<script src="https://code.jquery.com/jquery-3.2.1.js"></script>
		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
		<script>
			function printDiv(id) {
			 var st = " table{table-layout: fixed;width: 80%;background: #E7E7E7;border: 1px solid #C3C3C3;border-collapse: collapse;margin-bottom: 30px;}" +
							"th, td {align-items: center;padding: 8px;text-align: center;border: 1px solid #C3C3C3;}" +			
							"body {text-align: center;}";
			 
			 	document.getElementById("printButton").style.display="none";

			  var html="<html>";
			  html+= "<head><style>"+st+"</style></head>";
			  html+="<body>";
			   html+= document.getElementById(id).innerHTML;
				//console.log(document.getElementById(id).innerHTML);
				html+="</body>";
			   html+="</html>";
				//console.log(html);
			   var printWin = window.open('','','right=0,left=0,top=0,width=100%');
			   printWin.document.write(html);
			   printWin.document.close();
			   printWin.focus();
			   printWin.print();
			   printWin.close();
			   document.getElementById("printButton").style.display="inline-table";
			 }
		
			$(document).ready(function() {
				$( "#datepicker_start" ).datepicker();
				$( "#datepicker_end" ).datepicker();
				
				$("#datepicker_start").on("change", function(){
					$("#datepicker_end").val('');
					//dateChanged();
					//document.getElementById("datepicker_end") = "";
				});
				
				$("#datepicker_end").on("change", function(){
					//dateChanged();
					set_up_dates();
					if(start_date <= end_date)
						//tableSetUp();
						set_up_firebaseDate();
				});
			} );
			
			
			function dateChanged() {
				var printButton = document.getElementById("printButton");
				printButton.style = "display: none";
				var hour_date = document.getElementById("hour_date");
				hour_date.style.display = "none";
			}
			
			$(document).ready(function() {
				var date_choosing = document.getElementById("date_choosing");
					var table = document.getElementById("data_display");
					var printButton = document.getElementById("printButton");
					var hour_date = document.getElementById("hour_date");
					
					
				$('input[type=radio][name=order]').change(function() {
					
					if (this.value == 'by_date') {
						//var tdTitle = document.getElementById("tdTitle");
						//var tdTable = document.getElementById("tdTable");
						//tdTitle.innerHTML = "Valitse Henkilö";
						table.style.display = "none";
						printButton.style = "display: none";
						date_choosing.setAttribute("style", "display:inline-table");
						//tdTable.append(date_choosing);
						
						document.getElementById("datepicker_start").value = "";
						document.getElementById("datepicker_end").value = "";
					} else {
						//document.getElementById("tdTitle").innerHTML = "";
						date_choosing.style = "display:none";
					}
				});
				
				$('input[type=radio][name=order]').change(function() {
					var person_choosing = document.getElementById("person_choosing");
					if (this.value == 'by_person') {
						//var tdTitle = document.getElementById("tdTitle");
						//var tdTable = document.getElementById("tdTable");
						//tdTitle.innerHTML = "Valitse Henkilö";
						hour_date.style.display = "none";
						printButton.style = "display: none";
						set_persons();
						person_choosing.setAttribute("style", "display:inline");
						//tdTable.append(person_choosing);
					} else {
						//document.getElementById("tdTitle").innerHTML = "";
						person_choosing.style = "display:none";
					}
				});
			});
			
			function ChangeColor(tableRow, highLight)
			{
				if (highLight)
				{
				  tableRow.style.backgroundColor = '#BDBDBD';
				}
				else
				{
				  tableRow.style.backgroundColor = '#E7E7E7';
				}
			}
			
			function init() {
				var buttons = document.getElementsByTagName("button");
				for(var i = 0; i < buttons.length; i++)
					buttons[i].onkeypress = buttonHandler;
			}
			
			function buttonHandler(eventObj) {
				if(e.keyCode == 13) {
					var button = eventObj.target;
					console.log(button.id);
				}
			}
			
			window.onload = init;
		</script>
		<style>
			.buttona {
				background-color: #f44336; /* Green */
				border: none;
				color: white;
				padding: 5px 20px;
				text-align: center;
				text-decoration: none;
				display: inline-block;
				font-size: 16px;
				margin: 4px 2px;
				-webkit-transition-duration: 0.4s; /* Safari */
				transition-duration: 0.4s;
				cursor: pointer;
				border-radius: 4px;
			}
			
			.buttona {
				background-color: #f44336; 
				color: #DDDADA; 
				border: 2px solid #f44336;
			}

			.buttona:hover {
				background-color: #f44336;
				color: white;
			}
		</style>
	</head>
	<body>
		
		<h2 style="font-weight: bold;">RAPORTIT</h2>
		<p>Raportointiperuste</p>
		<br>
		
		<div>
			<table id="radioButton" class="noBorder noBackground center">
				<tr>
					<th class="noBorder" align="right">Henkilö
					<input type="radio" id="by_person" name="order" value="by_person"></th>
					<th class="noBorder">Aikaväli
					<input type="radio" id="by_date" name="order" value="by_date"></th>
				</tr>
				
			</table>
		</div>
		
		<!--<form>
			<p style="font-size: 18px">Raportointiperuste</p>
			<table id="radioButtons" class="center radioButtons" style="table-layout: fixed">
				<tr>
					<td><label>Henkilö</label></td>
					<td><input type="radio" id="by_person" name="order" value="by_person"></td>
				</tr>
				<tr>
					<td><label>Aikaväli</label></td>
					<td><input type="radio" id="by_date" name="order" value="by_date"></td>
				</tr>
			</table>
		</form>-->
		
		<div id="person_choosing" style="display:none" align="center">
			<table id="person_list">
				
				<tbody id="personTableBody">
				
				</tbody>
			</table>
		</div>
		
		
		<div id="date_choosing" style="display:none" align="center">
			<table id="datepicker" style="background-color:#FFFFFF" border="0">
				<tr class="noBorder">
					<th>Start date</th>
					
					<th>End date</th>
				</tr>
				<tr class="noBorder">
					<td><input type="text" id="datepicker_start"></td>
					
					<td><input type="text" id="datepicker_end"></td>
				</tr>
			</table>
			<!--<button type="button" id="dateReport" onclick="set_up_dates()">Create</button> -->
		</div>
		<br><button type="button" id="printabc" onclick="test2.html#raportit" style="display:none;">Create report</button>
		<hr>
		
		<div id="raportit" align="center">
			<h3>RAPORTIT</h3>
			<div id="printButton" style="display:none;">
				<button type="button" onclick="printDiv('raportit')" class="buttona" value="Print PDF">Print PDF</button>
			</div>
			
			<div id="byPerson">
			<table id="data_display" align="center" style="display:none" class="marginTop width80">
				<thead>
					<tr><th id="nameDisplay" colspan="4"></th></tr>
					<tr>
						<th>Date</th>
						<th>Start time</th>
						<th>End time</th>
						<th>Work hours</th>
					</tr>
				</thead>
				<tbody id="dataTableBody">
				
				</tbody>
					<tr>
						<td colspan="3">Total:</td>
						<td id="totalHour"></td>
					</tr>
			</table>
			</div>
			
			<div id="byDate" align="center" >
			
			<table id="hour_date" style="display:none" class="marginTop width80">
				<thead>
					<tr>
						<th style="width: 30%"></th>
						<th id="dateDuration" colspan="2"></th>
					</tr>
					<tr>
						<th>Date</th>
						<th>Person</th>
						<th>Work hour</th>
					</tr>
				</thead>
				<tbody id="dateTableBody">
				
				</tbody>
					
			</table>
		</div>
			
		</div>
		<a id="hiddenLink" href="#raportit"></a>
		
		<script> var shop_id = '<?php echo $_SESSION['shop_id'];?>' </script>
		<script src="https://www.gstatic.com/firebasejs/4.3.1/firebase.js"></script>
		<script src="../js/firebase_init.js"></script>
		<script src="../js/firebase_ref.js"></script>
		<script src="../js/byPerson.js"></script>
		<script src="../js/byDate.js"></script>
	</body>
</html>
	<?php } ?>