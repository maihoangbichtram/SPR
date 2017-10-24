<!doctype>
<?php
	require_once("parentPath.php");
	$pinpage = " >> <label id='pinpage' class='header'>TYOAJANSEUNTA</label>";
	$navigation = ($nav != "")? (($nav == "TYOAJANSEUNTA")? $pinpage : $pinpage . " >> " . $nav) : "";
	
?>
<html>
	<head>
		<meta charset="utf-8">
		<style>
			span#logout {
				display: block;
				width: 100%;
				height: 0px;
				
			}
			header {
				padding: 15px;
				color: white;
				background: red;
				font-weight: bold;
				text-align: left;
				font-size: 16px;
			}
		</style>
		<script src="https://code.jquery.com/jquery-3.2.1.js"></script>
		<script>
		var path = '<?php echo PARENT_PATH; ?>';
		$(document).ready(function() {
			
			$("#logout").click(function() {
				console.log("clicked");
				$.post(path + "/spr/public/php/logout.php", {}, function() {
					window.open(path + "/spr/public/index.php", "_top");
				});
			});
			$("#pinpage").click(function() {
				window.open(path + "/spr/public/php/pinPage.php","_top");
			});
			$("#homepage").click(function() {
				window.open(path + "/spr/public/index.php","_top");
			});
		});
		</script>
	</head>
	<body>
		<header>
						<span align="right" id="logout"><label class="header">LOGOUT</label></span>
			
			<span align="left">> <label id="homepage" class="header">PAASIVU</label><?php echo $navigation;?></span>
		</header>
	</body>
</html>