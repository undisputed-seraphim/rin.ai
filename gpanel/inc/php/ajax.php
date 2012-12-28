<?php
session_start();
if( !isset( $_SESSION['gpanel_login'] ) )
	exit();

if( !isset( $_GET['action'] ) )
	exit();

include_once( '../../config.php' );
g::init();

switch( $_GET['action'] ) {
	case "role":
		break;
}

?>