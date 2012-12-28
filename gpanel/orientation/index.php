<?php
session_start();
include_once( '../config.php' );

g::init( "orientation" ) or die( "Database connection unsucessful." );
( g::login() && g::access( "r_ORI_VIEW" ) ) or header( "Location: ".WEB_ROOT );

$db = new db( ORI_DB_HOST, ORI_DB_USER, ORI_DB_PASS, ORI_DB_NAME );
$db->connected or die( "Could not connect to orientation database." );

g::start_content( "Global Admin Panel", "gPanel - Orientation" );
/* content goes here, html is already inside the <div id="content"> */

g::end_content();
?>