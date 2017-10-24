<!doctype>
<?php
	session_start();
	
	$nav = "";
	require_once("php/header.php");
	require_once("php/logo.php");

	if(isset($_SESSION['typed_pin']) && $_SESSION['typed_pin'] == $_SESSION['pin']) {
		$pinAreaDisplay = "none"; 
		$optionAreaDisplay = "inline-block";
		
	} else {
		?><script>document.getElementById("logout").innerHTML = "";</script><?php
	}
	
?>
<html>
	<head>
		<link rel="stylesheet" href="css/style.css">
		<style>
			.button {
				background-color: #4CAF50; /* Green */
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
			
			.button {
				background-color: white; 
				color: black; 
				border: 2px solid #f44336;
			}

			.button:hover {
				background-color: #f44336;
				color: white;
			}

		</style>
	</head>	
	<body>
		<?php 
			
		?>
		<h2>Shops</h2>
		<div>
			<table id="place_option" align="center" style="table-layout: fixed" class="radioButtons collapseBorder">
				
			</table>
			<button type="button" class="button" id="place_confirm">Go</button>
		</div>
		
		<script src="https://code.jquery.com/jquery-3.2.1.js"></script>
		<script src="https://www.gstatic.com/firebasejs/4.3.1/firebase.js"></script>
		<script src="js/firebase_init.js"></script>
		<script>
			$(document).ready(function() {
				$('#place_confirm').click(function() {
					var shop_data = $("input[type=radio][name=place]:checked").val();
					var arr = shop_data.split("/");
					$.post("php/setShopId.php", {"shop_id": arr[0], "pin": arr[1]}, function(data) {
						window.open("php/pinPage.php", "_top");
					});
				});
			});
		
			window.onload = init;
			function init() {
				var ref = firebase.database().ref();
				var shop_data_ref = ref.child("shop_data");
				shop_data_ref.on("child_added", function(snap) {
					setRadioButton(snap.val().name, snap.key, snap.val().pin);
				});
			}
			function setRadioButton(val, key, pin) {
				$("#place_option").append("<tr><td><label>" + val + "</label></td><td><input type='radio' name='place' value='" + key + "/" + pin + "'></td></tr>");
			}
		</script>
	</body>
</html>