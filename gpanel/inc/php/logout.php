<?php
session_start();
include_once( '../../config.php' );
echo $_SESSION['gpanel_login'];
unset( $_SESSION[ 'gpanel_login' ] );
unset( $_SESSION[ 'ecpiuser' ] );
echo WEB_ROOT;
header( 'Location: ../../index.php' );