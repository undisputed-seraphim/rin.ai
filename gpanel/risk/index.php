<?php
session_start();
include_once( '../config.php' );

g::init( "risk" ) or die( "Database connection unsucessful." );
( g::login() && g::access( r_ORIENTATION_VIEW ) ) or header( "Location: ".WEB_ROOT );

g::start_content( "Global Admin Panel", "gPanel - Risk" );

/* content goes here, html is already inside the <div id="content"> */

g::end_content();
?>