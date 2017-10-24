<?php
	session_start();
	if(!isset($_SESSION['typed_pin']) || $_SESSION['typed_pin'] != $_SESSION['pin']) {
		header("Location: ../index.php");
	} else {
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="../css/style.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	</head>
	<body>
		<?php 
			$nav = "TYÖNTEKIJÄT";
			require_once("header.php");
			require_once("logo.php");
		?>
		<h2>TYÖNTEKIJÄT</h2>
		<div class="container">

		  <!-- Modal -->
		  <div class="modal fade" id="myModal" role="dialog">
			<div class="modal-dialog modal-sm">

			  <div class="modal-content">
				<div class="modal-header">
				  <button type="button" class="close" data-dismiss="modal">&times;</button>
				  <h4 class="modal-title">Vaihda Tagi</h4>
				</div>
				<div class="modal-body">
					<label>New Tag Id</label>
					<input type="text" id="tag_id" size="30" autofocus class="centerText inputLine" placeholder="Tag Id">
				</div>
				<div class="modal-footer">
					<button type="button" id="cancelId" class="btn btn-danger btn-default pull-left"  style="background-color: #FC4848" data-dismiss="modal">
							Cancel
					</button>
					<button type="button" id="change_id_confirm" class="btn btn-default" data-dismiss="modal">OK</button>
				</div>
			  </div>
			</div>
		  </div>
		  
		  <!-- Modal -->
		  <div class="modal fade" id="myDeleteModal" role="dialog">
			<div class="modal-dialog modal-sm">
			  <div class="modal-content">
				<div class="modal-header">
				  <button type="button" class="close" data-dismiss="modal">&times;</button>
				  <h4 class="modal-title">Poista</h4>
				</div>
				<div class="modal-body">
				  <table id="delete_modal" align="center">
						<tr>
							<td id="delete_modal_1"></td>
							<td id="delete_modal_2"></td>
						<tr>
				  </table>
				</div>
				
				  <button type="button" id="delete_close" class="btn btn-default" data-dismiss="modal" onclick="" style="display:none;">Close</button>
				
			  </div>
			</div>
		  </div>
		  
		  <div class="modal fade" id="confirmModal" role="dialog">
			<div class="modal-dialog modal-sm">

			  <div class="modal-content">
				<div class="modal-header">
				  <button type="button" class="close" data-dismiss="modal">&times;</button>
				  <h4 class="modal-title">Poista</h4>
				</div>
				<div class="modal-body">
				  <p id="confirm_body" align="center" style="font-size: 16px"></p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger btn-default pull-left"  style="background-color: #FC4848"data-dismiss="modal">Cancel</button>
				  <button type="button" id="delete_button" class="btn btn-default" data-dismiss="modal" >OK</button>
				</div>
			  </div>
			</div>
		  </div>
		  
		  <div class="modal fade" id="messageModal" role="dialog">
			<div class="modal-dialog modal-sm">

			  <div class="modal-content">
				<div class="modal-header">
				  <button type="button" class="close" data-dismiss="modal">&times;</button>
				  <h4 class="modal-title">ERROR</h4>
				</div>
				<div class="modal-body">
					<p id="messPara" align="center" style="font-size: 20px"></p>
				</div>
				<div class="modal-footer">
					
				  <button type="button" id="messageModalClick" class="btn btn-default" data-dismiss="modal">OK</button>
				</div>
			  </div>
			</div>
		  </div>
		  
		  <div class="modal fade" id="addPerson" role="dialog">
			<div class="modal-dialog modal-sm">

			  <div class="modal-content">
				<div class="modal-header">
				  <button type="button" class="close" data-dismiss="modal">&times;</button>
				  <h4 class="modal-title">Add person</h4>
				</div>
				<div class="modal-body">
					<table id="addPersonTable" class="center noBorder">
						<tr>
							<td class="smallTd">Name</td>
							<td><input type="text" id="newPersonName" size="30" autofocus class="inputLine"></td>
						</tr>
						<tr>
							<td class="smallTd">SSN</td>
							<td><input type="text" id="newPersonSSN" size="30" autofocus class="inputLine"></td>
						</tr>
						<tr>
							<td class="smallTd">Tag Id</td>
							<td><input type="text" id="newPersonId" size="30" autofocus class="inputLine"></td>
						</tr>
					</table>
				</div>
				<div class="modal-footer">
					<button type="button" id="addPersonClick" class="btn btn-default" onclick="addPerson();">OK</button>
					<button type="button" id="addPersonClick2" class="btn btn-default" data-dismiss="modal" style="display:none;"></button>
				</div>
			  </div>
			</div>
		  </div>
		</div>
		
		<table id="employee_table" class="center marginTopEmployee">
			<thead>
				<tr>
					<th colspan="3" class="noBorder"><button id="addPersonBtt" type="button" class="dropbtn" data-toggle='modal' data-target='#addPerson'>Add person</button></th>
				</tr>
				<tr>
					<th>NIMI</th>
					<th>TAG-ID</th>
					<th></th>
				</tr>
			</thead>
			<tbody id="table_body" class="table_body">
				
			</tbody>
		</table>
		
		<!--Virtual button-->
		<button type="button" id="modalClick" data-toggle='modal' data-target='#myDeleteModal' style="display:none;">Close</button>
		<button type="button" id="confirmModalBut" data-toggle='modal' data-target='#confirmModal' style="display:none;"></button>
		<button type="button" id="messModalClick" data-toggle='modal' data-target='#messageModal' style="display:none;"></button>

		
		<!--script-->
		<script> var shop_id = '<?php echo $_SESSION['shop_id'];?>' </script>
		<script src="https://www.gstatic.com/firebasejs/4.3.1/firebase.js"></script>
		<script src="../js/firebase_init.js"></script>
		<script src="../js/firebase_ref.js"></script>
		<script src="https://code.jquery.com/jquery-3.2.1.js"></script>
		<script src="../js/script.js"></script>
		<script>
			$("#cancelId").click(function() {
				$("#tag_id").val("");
			});
			
			$("#addPersonBtt").click(function() {
				$("#addPersonTable").find("input")
					.each(function() {
						$(this).val("");
						$(this).css("border-bottom", "2px solid red");
						$(this).keypress(function(event) {
							
							if(event.which != 13)
								$(this).css("border", "none");
							
						});
					});
			});
			
			$("#addPersonTable input").keypress(function(e) {
				if(e.keyCode == 13) {
					//addPerson();
					$("#addPersonClick").click();
				}
			});
			
			$("#tag_id").keypress(function(event) {
				$(this).css("border", "none");
				if(event.which == 13)
					$("#change_id_confirm").click();
			});
		</script>
		
	</body>
</html>
	<?php } ?>