<?php
 
class Firebase {
 
    // sending push message to single user by firebase reg id
    public function sendTo($to, $title, $message, $mPushNotification) {
        $notification = array('title' =>$title , 'body' => $message, 'sound'=>'Default', 'badge'=> 1);
        $fields = array(
            'to' => $to,
            'data' => $mPushNotification,
            'notification' => $notification,
        );
        return $this->sendPushNotification($fields);
    }
 
    // Sending message to a topic by topic name
    public function sendToTopic($to, $title, $message, $mPushNotification) {
        $notification = array('title' =>$title , 'body' => $message, 'sound'=>'Default', 'badge'=> 1);
        $fields = array(
            'to' => '/topics/' . $to,
            'data' => $mPushNotification,
            'notification' => $notification,
        );
        return $this->sendPushNotification($fields);
    }
 
    // sending push message to multiple users by firebase registration ids
    public function sendMultiple($registration_ids, $message) {
        $fields = array(
            'registration_id' => $registration_ids,
            'data' => $message,
        );
 
        return $this->sendPushNotification($fields);
    }
 
    // function makes curl request to firebase servers
    private function sendPushNotification($fields) {
         
        require_once __DIR__ . '/Config.php';
 
        // Set POST variables
        $url = 'https://fcm.googleapis.com/fcm/send';
 
        $headers = array(
            'Authorization: key=' . FIREBASE_API_KEY,
            'Content-Type: application/json'
        );
        // Open connection
        $ch = curl_init();
 
        // Set the url, number of POST vars, POST data
        curl_setopt($ch, CURLOPT_URL, $url);
 
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 
        // Disabling SSL Certificate support temporarly
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
 
        // Execute post
        $result = curl_exec($ch);
        if ($result === FALSE) {
            die('Curl failed: ' . curl_error($ch));
        }
 
        // Close connection
        curl_close($ch);
 
        return $result;
    }
}
?>