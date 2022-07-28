<?php
error_reporting(0);

//$con = mysqli_connect($servername, $username, $password, $dbname);
$con = mysqli_connect('localhost', 'faizanan_root', 'Faizan_90', 'faizanan_faizan');

if (isset($_REQUEST['sender_id'])) {

    //getting the request values 
    $sender_id = $_REQUEST['sender_id'];
    $sender_num = $_REQUEST['sender_num'];
    $receiver_num = $_REQUEST['receiver_num'];
    $msg_text = $_REQUEST['msg_text'];
    $msg_type = $_REQUEST['msg_type'];
    $msg_content = $_REQUEST['msg_content'];
    $msg_date = $_REQUEST['msg_date'];
    $msg_status = $_REQUEST['msg_status'];
    //creating an sql query 
    $query = "INSERT INTO tbl_chat (sender_id, sender_num, receiver_num, msg_text, msg_type, msg_content, msg_date, msg_status) VALUES ('$sender_id','$sender_num','$receiver_num','$msg_text','$msg_type','$msg_content','$msg_date','$msg_status')";
    if ($con->query($query) === TRUE) {
        echo 'success';
    } else {
        echo 'failure';
    }
    $con->close();
} else {
    echo 'missing parameters';
}
