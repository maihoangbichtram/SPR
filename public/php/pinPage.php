<!doctype html>
<?php
	session_start();
	
	
	$pinAreaDisplay = "inline";
	$optionAreaDisplay = "none";
	
	$nav = "TYOAJANSEUNTA";
	
	require_once("header.php");
	require_once("logo.php");
	
	if(!isset($_SESSION['shop_id'])) {
		header("Location: ../index.php");
	} else {
		if(isset($_SESSION['typed_pin']) && $_SESSION['typed_pin'] == $_SESSION['pin']) {
			$pinAreaDisplay = "none"; 
			$optionAreaDisplay = "inline-block";
			
		} else {
			?><script>document.getElementById("logout").innerHTML = "";</script><?php
		}
	
?>

<html>
	<head>
		<meta charset="utf-8">
		<title>TYÖAJANSEURANTA</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="../css/style.css">
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
		
		<style>
			.ui.label {
			  display: inline-block;
			  line-height: 1;
			  vertical-align: baseline;
			  margin: 0em 0.14285714em;
			  background-color: red;
			  background-image: none;
			  padding: 0.5833em 0.833em;
			  color: rgba(0, 0, 0, 0.6);
			  text-transform: none;
			  font-weight: bold;
			  border: 0px solid transparent;
			  border-radius: 0.28571429rem;
			  -webkit-transition: background 0.1s ease;
			  transition: background 0.1s ease;
			}


			/* Link */

			.ui.input {
			  position: relative;
			  font-weight: normal;
			  font-style: normal;
			  display: -webkit-inline-box;
			  display: -ms-inline-flexbox;
			  display: inline-flex;
			  color: rgba(0, 0, 0, 0.87);
			}
			.ui.input input {
			  margin: 0em;
			  max-width: 100%;
			  -webkit-box-flex: 1;
				  -ms-flex: 1 0 auto;
					  flex: 1 0 auto;
			  outline: none;
			  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
			  text-align: center;
			  line-height: 1.21428571em;
			  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
			  padding: 0.67857143em 1em;
			  background: #FFFFFF;
			  border: 1px solid red;
			  color: rgba(0, 0, 0, 0.87);
			  border-radius: 0.28571429rem;
			  -webkit-transition: box-shadow 0.1s ease, border-color 0.1s ease;
			  transition: box-shadow 0.1s ease, border-color 0.1s ease;
			  box-shadow: none;
			}

			/*--------------------
				  Placeholder
			---------------------*/


			/* browsers require these rules separate */
			.ui.input input::-webkit-input-placeholder {
			  color: rgba(191, 191, 191, 0.87);
			}
			.ui.input input::-moz-placeholder {
			  color: rgba(191, 191, 191, 0.87);
			}
			.ui.input input:-ms-input-placeholder {
			  color: rgba(191, 191, 191, 0.87);
			}
			.ui.labeled.input > .label {
			  -webkit-box-flex: 0;
				  -ms-flex: 0 0 auto;
					  flex: 0 0 auto;
			  margin: 0;
			  font-size: 1em;
			}
			.ui.labeled.input > .label:not(.corner) {
			  padding-top: 0.78571429em;
			  padding-bottom: 0.78571429em;
			}

			/* Regular Label on Left */
			.ui.labeled.input:not([class*="corner labeled"]) .label:first-child {
			  border-top-right-radius: 0px;
			  border-bottom-right-radius: 0px;
			}
			.ui.labeled.input:not([class*="corner labeled"]) .label:first-child + input {
			  border-top-left-radius: 0px;
			  border-bottom-left-radius: 0px;
			  border-left-color: transparent;
			}
			.ui.labeled.input:not([class*="corner labeled"]) .label:first-child + input:focus {
			  border-left-color: #85B7D9;
			}

			/* Regular Label on Right */
			.ui[class*="right labeled"].input input {
			  border-top-right-radius: 0px !important;
			  border-bottom-right-radius: 0px !important;
			  border-right-color: transparent !important;
			}
			.ui[class*="right labeled"].input input + .label {
			  border-top-left-radius: 0px;
			  border-bottom-left-radius: 0px;
			}
			.ui[class*="right labeled"].input input:focus {
			  border-right-color: #85B7D9 !important;
			}

			/* Corner Label */
			.ui.labeled.input .corner.label {
			  top: 1px;
			  right: 1px;
			  font-size: 0.64285714em;
			  border-radius: 0em 0.28571429rem 0em 0em;
			}

			/* Spacing with corner label */
			.ui[class*="corner labeled"]:not([class*="left corner labeled"]).labeled.input input {
			  padding-right: 2.5em !important;
			}
			.ui[class*="corner labeled"].icon.input:not([class*="left corner labeled"]) > input {
			  padding-right: 3.25em !important;
			}
			.ui[class*="corner labeled"].icon.input:not([class*="left corner labeled"]) > .icon {
			  margin-right: 1.25em;
			}
		</style>
	</head>
	
	<body style="display: block;">
		<h2>SPR Työajanseunta</h2>
		<div class="container">
		<div class="modal fade" id="ntfModal" role="dialog">
			<div class="modal-dialog modal-sm">

			  <div class="modal-content">
				<div class="modal-header">
				  <button type="button" class="close" data-dismiss="modal">&times;</button>
				  <h4 class="modal-title">Message</h4>
				</div>
				<div class="modal-body">
					<p id="ntfMessage" align="center" style="font-size: 20px"></p>
				</div>
				
				
				  <button type="button" id="ntfModalDismiss" class="btn btn-default" data-dismiss="modal" style="display:none;">OK</button>
				
			  </div>
			</div>
		  </div>
		  
		 <div class="modal fade" id="confirmLogoutModal" role="dialog">
			<div class="modal-dialog modal-sm">

			  <div class="modal-content">
				<div class="modal-header">
				  <button type="button" class="close" data-dismiss="modal">&times;</button>
				  <h4 class="modal-title">Message</h4>
				</div>
				<div class="modal-body">
				  <p id="confirm_body" align="center" style="font-size: 16px">Are you sure you want to log out all employees now?</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger btn-default pull-left"  style="background-color: #FC4848" data-dismiss="modal">Cancel</button>
				  <button type="button" id="logoutConfirm" class="btn btn-default" data-dismiss="modal" >OK</button>
				</div>
			  </div>
			</div>
		  </div>
		  
		  <div class="modal fade" id="confirmCleanupModal" role="dialog">
			<div class="modal-dialog modal-sm">

			  <div class="modal-content">
				<div class="modal-header">
				  <button type="button" class="close" data-dismiss="modal">&times;</button>
				  <h4 class="modal-title">Message</h4>
				</div>
				<div class="modal-body">
				  <p id="confirm_body" align="center" style="font-size: 16px">Are you sure you want to clean up/delete all log events?</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger btn-default pull-left"  style="background-color: #FC4848" data-dismiss="modal">Cancel</button>
				  <button type="button" id="cleanupConfirm" class="btn btn-default" data-dismiss="modal" >OK</button>
				</div>
			  </div>
			</div>
		  </div>
		</div>

		<div id="pinArea" style="display:<?php echo $pinAreaDisplay; ?>">
			<p style="font-size: 16px; margin-top: 18px;">Kirjaudu sisään:</p>
			<div class="ui labeled input" align="center" >
				
			  <div class="ui label" align="center" >
				PIN
			  </div>
			  <input id="pinInput" type="text" placeholder="PIN" style="font-size: 14px" >
			</div>
		</div>
		
		<div id="optionArea" style="display:<?php echo $optionAreaDisplay; ?>">
			<p style="font-size: 16px; margin-top: 18px;">Valitse toiminto:</p>
			<table class="noBorder center noBackground">
				<tr>
					<td class="tdPadding"><button type="button" class="dropbtn functionButton" id="employeeLabel">Hallitse työtekijöktä</button></td>
					<td class="tdPadding"><button type="button" class="dropbtn functionButton" id="reportLabel">Luo<br> Raportti</button></td>
				</tr>
				<tr>
					<td class="tdPadding"><button type="button" class="dropbtn functionButton" id="logoutEmployee">Log out <br>all employees</button></td>
					<td class="tdPadding"><button type="button" class="dropbtn functionButton" id="deleteLogs">Clean up <br>all log events</button></td>
				</tr>
				<!--<tr>
					<td colspan="2"><button type="button" class="dropbtn functionButton" id="">Change Password</button></td>
				</tr>-->
			</table>
		</div>
		</div>
		<button type="button" id="ntfModalClick" data-toggle='modal' data-target='#ntfModal' style="display:none;">Modal</button>
		<button type="button" id="logoutModalClick" data-toggle='modal' data-target='#confirmLogoutModal' style="display:none;">Modal</button>
		<button type="button" id="cleanupModalClick" data-toggle='modal' data-target='#confirmCleanupModal' style="display:none;">Modal</button>
		
		<script> var shop_id = '<?php echo $_SESSION['shop_id'];?>' </script>
		<script src="https://code.jquery.com/jquery-3.2.1.js"></script>
		<script src="https://www.gstatic.com/firebasejs/4.3.1/firebase.js"></script>
		<script src="../js/firebase_init.js"></script>
		<script src="../js/firebase_ref.js"></script>
		<script src="../js/index.js"></script>
		
	</body>
</html>
	<?php } ?>