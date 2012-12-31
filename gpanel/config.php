<?php

define( "DB_HOST", "localhost" );
define( "DB_USER", "moodle" );
define( "DB_PASS", "moodle" );
define( "DB_NAME", "moodle" );

define( "ORI_DB_HOST", "10.10.6.134" );
define( "ORI_DB_USER", "orientation" );
define( "ORI_DB_PASS", "!Passw0rd01" );
define( "ORI_DB_NAME", "orientation" );

define( "COPYRIGHT", "2012" );

define( "ROOT", dirname( __FILE__ ).'/' );
define( "WEB_ROOT", 'http://'.$_SERVER[ 'HTTP_HOST' ].'/musashi/gpanel/' );

include_once( ROOT.'inc/php/gpanel.php' );

?>