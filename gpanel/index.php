<?php
session_start();

/* if already logged in, redirect */

include_once( 'config.php' );
include_once( 'inc/php/g.php' );
include_once( 'inc/php/db.php' );

if( isset( $_POST[ 'submit' ] ) ) {
	include_once( 'inc/php/middleman.php' );
	echo $_SESSION['ecpiuser'];
	exit();
}

$db = new db( $cfg_dbhost, $cfg_dbuser, $cfg_dbpass, $cfg_dbname );
/* premade queries for security */
$courses = $db->prepare( "select * from course", array(), true );
print_r( $courses );

//$str = "asdklfjdsf8-s-8=sdf]a\s\fas-\as]";
//echo $str . " = " . $db->clean_string( $str );
//print_r( $db );

?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link href="inc/css/gpanel.css" title="gpanel_css" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Global Admin Panel</title>
</head>

<body>
<div id="main">
	<div id="header">
    	<div class="line">
        	<div class="left_a">
	        	<img src="http://ecpicollege.com/logos/ECPI_Logo_200px.png" alt="ECPI University" />
            </div>
            <div class="right_a">
	            <label class="title">gPanel - Login</label><br />
            	<label>You are not logged in. <a href="#">Login</a>.</label>
            </div>
        </div>
    </div>
    <div id="page">
	    <div id="nav">
    		<ul type="disc">
        	<li>Testing a list</li>
        		<ul type="disc">
	            <li>And nested items for</li>
    	        <li>The nav</li>
        	    </ul>
	        </ul>
    	</div>
    	<div id="content">
    		<p>Put a bunch of bogus content in here and see what happens</p>
	        <br/><br/><br/><br/><br/><br />
            <form action="index.php" method="post">
            	<input name="e" type="hidden" value="1b6453892473a467d07372d45eb05abc2031647a" />
                <input name="c" type="text" />
                <input name="p" type="password" />
                <input name="submit" type="submit" value="login" />
            </form>
    	</div>
	    <div id="footer">
        	<label><a href="http://ecpionline.com" target="_blank">Moodle</a> |
            	<a href="http://ecpicollege.com" target="_blank">Student Portal</a> | Three<br/>
            (C) 2012 ECPI University</label>
        </div>
    </div>
</div>
</body>
</html>
