<?php
session_start();
include_once( '../config.php' );

g::init() or die( "Database connection unsucessful." );
g::login() or header( "Location: ".WEB_ROOT );

g::print_head( "Global Admin Panel" );
g::print_header( "gPanel - Orientation" );
g::print_nav( "orientation" );

g::print_footer();
?>