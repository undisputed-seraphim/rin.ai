<?php

define( "DB_HOST", "localhost" );
define( "DB_USER", "moodle" );
define( "DB_PASS", "moodle" );
define( "DB_NAME", "moodle" );

define( "ROOT", $_SERVER[ 'DOCUMENT_ROOT' ].'gpanel/' );
define( "WEB_ROOT", 'http://'.$_SERVER[ 'HTTP_HOST' ].'/gpanel/' );
include_once( ROOT.'inc/php/gpanel.php' );

?>