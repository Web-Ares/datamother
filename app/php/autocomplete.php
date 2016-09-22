<?php

$val = $_GET['value'];

    $json_data = '[{
        "caption": "simple text1",
        "gameId": "igame_casino1"
    },
    {
        "caption": "simple text2",
        "gameId": "igame_casino2"
    },
    {
        "caption": "simple text3",
        "gameId": "igame_casino3"
    },
    {
        "caption": "simple text4",
        "gameId": "igame_casino4"
    },
    {
        "caption": "simple text5",
        "gameId": "igame_casino5"
    }
    ]';


$json_data = str_replace("\r\n",'',$json_data);
$json_data = str_replace("\n",'',$json_data);
echo $json_data;
exit;
?>
