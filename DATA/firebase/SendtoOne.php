<?php

//importing required files 

require_once 'Firebase.php';
require_once 'Push.php'; 


$response = array(); 

	//hecking the required params 
	if(isset($_REQUEST['title']) and isset($_REQUEST['message']) ){
                //and isset($_GET['email'])
		//creating a new push
		$push = null; 
		$push = new Push(
			$_REQUEST['title'],
			$_REQUEST['message'],
			$_REQUEST['type']
		);

		//getting the push from push object
		$mPushNotification = $push->getPush(); 


		//creating firebase class object 
		$firebase = new Firebase(); 

		//sending push notification and displaying result 
		$firebaseSuccess = $firebase->sendTo($_REQUEST['token'], $_REQUEST['title'],$_REQUEST['message'],$mPushNotification);
	}else{
		$response['error']=true;
		$response['message']='Parameters missing';
	}

$pushStatus = json_encode($response);

?>

<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
		<title>TieHearts Push Notification</title>
		<meta name="robots" content="noindex,nofollow"/>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script>
		$(function(){
			$("textarea").val("");
		});
		function checkTextLen(){
			if($.trim($("#title").val()).length == 0){
				alert("Please enter title");
				return false;
			} else if($.trim($("#message").val()).length == 0){
				alert("Please enter message");
				return false;
			}else{
				return true;
			}
		}
		</script>
		<style>
			@import url('https://fonts.googleapis.com/css?family=Roboto:400,700');
			*{
			box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			}
			body{
			font-family: 'Roboto', sans-serif;
			margin:0;
			padding:0;
			background-color:#31419a;
			}
			h1{
			color:#FFFFFF;
			font-size:22px;
			margin-bottom:20px;
			font-family: 'Roboto:700', sans-serif;
			font-weight:normal;
			}
			div#formdiv{
			text-align: center;
			background-color: #3990CA;
			border: 2px solid #3F51B5;
			padding: 10px;
			}
			p#status{
			text-align: center;
			color:#FFFFFF;
			background-color: #3F51B5;
			border: 2px solid #3F51B5;
			padding: 10px;
			font-size:12px;
			margin:0;
			word-break: break-all;
			}
			.message{
			border-radius:4px;
			-webkit-border-radius:4px;
			margin-bottom: 10px;			
			text-align: left;
			padding: 10px;
			font-size: 20px;
			width: 60%;
			border: none;
			font-family: 'Roboto', sans-serif;
			resize:none;
			}
			.submitbtn{
			background-color: #FFC107;
			padding: 10px 20px;
			cursor: pointer;
			color: #674437;
			border:none;
			border-radius:4px;
			-webkit-border-radius:4px;
			font-weight: bold;
			font-size:18px;
			-webkit-appearance:none;
   			-moz-appearance:none;
   			appearance:none;
			}
			.submitbtn:hover{
			background-color: #ffd659;
			color: #ca3d09;
			}
			
			@media all and (max-width: 600px){
			.submitbtn{
			width:100%;
			font-size:14px;
			}
			h1{
			font-size:18px;
			}
			.message{
			font-size: 16px;
			font-family: 'Roboto:700', sans-serif;
			width:100%;
			}
			}
			 
		</style>
	</head>
	<body>
		<div class="maincontainer">
			<div id="formdiv">
			<h1>TieHearts Push Notification</h1>
			<form action="SendtoOne.php" onSubmit="return checkTextLen()">
				<input type="text" name="title" class="message" id="title" placeholder="Title" /><br />
				<textarea rows="5" name="message" class="message" id="message" cols="45" placeholder="Message"></textarea><br />
				<input type="text" name="token" class="message" id="token" placeholder="Firebase Token" /><br />
				<input type="text" name="type" class="message" id="type" placeholder="Message Type" /><br /><br/>
				<input type="submit" class="submitbtn" value="Send Notification" />
			</form>
			</div>
			<p id="status">
			<?php if (!empty($firebaseSuccess)) {
				echo $firebaseSuccess;
			} else {
				echo $pushStatus;
			} ?>
			</p>
		</div>
    </body>
</html>