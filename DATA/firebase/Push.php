<?php 

class Push {
    //notification title
    private $title;

    //notification message 
    private $message;

    //notification type
    private $type;

    //initializing values in this constructor
    function __construct($title, $message, $type) {
         $this->title = $title;
         $this->message = $message;
         $this->type = $type; 
    }
    
    //getting the push notification
    public function getPush() {
        $res = array();
        $res['data']['title'] = $this->title;
        $res['data']['message'] = $this->message;
        $res['data']['type'] = $this->type;
        //$res['data']['timestamp'] =  date('Y-m-d H:i:s');
        return $res;
    }
 
}