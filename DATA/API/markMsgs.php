<?php
//error_reporting(0);

//$con = mysqli_connect($servername, $username, $password, $dbname);
$con = mysqli_connect('localhost', 'faizanan_root', 'Faizan_90', 'faizanan_faizan');

if (isset($_REQUEST['receiver_num'])) {
    $receiver_num = $_REQUEST['receiver_num'];
    $sender_id = $_REQUEST['sender_id'];
    $status = $_REQUEST['status'];
    $result = '';

    if ($status == 'received') {
        $result = mysqli_query($con, "SELECT COUNT(*) as total FROM tbl_chat WHERE receiver_num = $receiver_num AND msg_status = 0");
    } else if ($status == 'read') {
        $result = mysqli_query($con, "SELECT COUNT(*) as total FROM tbl_chat WHERE receiver_num = $receiver_num AND sender_id = $sender_id AND (msg_status = 0 OR msg_status = 1)");
    }

    $data = mysqli_fetch_assoc($result);

    if ($data['total'] > 0) {
        if ($status == 'received') {
            $update = mysqli_query($con, "UPDATE tbl_chat SET msg_status = 1 WHERE receiver_num = $receiver_num AND msg_status = 0");
            echo 'success';
        } else if ($status == 'read') {
            $update = mysqli_query($con, "UPDATE tbl_chat SET msg_status = 2 WHERE receiver_num = $receiver_num AND sender_id = $sender_id AND (msg_status = 0 OR msg_status = 1)");
            echo 'success';
        } else {
            echo 'failed';
        }
    } else {
        echo 'already updated';
    }
    $con->close();
} else {
    echo 'missing parameters';
}
