<?php
//error_reporting(0);

//$con = mysqli_connect($servername, $username, $password, $dbname);
$con = mysqli_connect('localhost', 'faizanan_root', 'Faizan_90', 'faizanan_faizan');

if (isset($_REQUEST['sender_id'])) {
    $sender_id = $_REQUEST['sender_id'];
    $sender_num = $_REQUEST['sender_num'];
    $msg_id = $_REQUEST['msg_id'];

    $sth = mysqli_query($con, "SELECT * FROM tbl_chat WHERE sender_num = $sender_num AND sender_id = $sender_id AND id > $msg_id ");
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    $last_arr = array('chatfilter'=>'0','chat'=>$rows);
    print json_encode($last_arr);
    $con->close();
} else {
    echo 'missing parameters';
}
