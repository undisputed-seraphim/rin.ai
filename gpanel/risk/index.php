<?php
session_start();
include_once( '../config.php' );

g::init() or die( "Database connection unsucessful." );
g::login() or header( "Location: ".WEB_ROOT );

g::print_head( "Global Admin Panel" );
g::print_header( "gPanel - Risk" );
g::print_nav( "risk" );

g::print_footer();
?>