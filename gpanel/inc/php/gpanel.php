<?php
include_once( ROOT.'inc/php/db.php' );

/* 'global' class with static functions that manage every aspect of the gpanel */
class g {
	public static $db = "";
	
	public static function init() {
		g::$db = new db( DB_HOST, DB_USER, DB_PASS, DB_NAME );
		return g::$db->connected;
	}
	
	/* interface functions for db */
	public static function prepare( $query = "", $params = array(), $now = false ) {
		return g::$db->prepare( $query, $params, $now );
	}
	
	/* if $first is true, attempting to login, else check if logged in */
	public static function login( $first = "" ) {
		/* if no value passed, perform login check of session */
		if( $first === "" ) {
			if( is_array( g::session( "gpanel_login" ) ) )
				if( array_key_exists( "success", g::session( "gpanel_login" ) ) )
					return true;
		}
		
		if( isset( $_POST[ 'e' ] ) ) {
			/* decode submitted session */
			include_once( ROOT.'inc/php/middleman.php' );
			$res = json_decode( g::session( "ecpiuser" ), true );
			if( array_key_exists( "error", $res ) )
				return false;
		
			/* check if they have any roles, else deny */
			if( array_key_exists( "success", $res ) ) {
				g::session( "gpanel_login", $res );
				return true;
			}
		}
		return false;
	}
	
	public static function login_string() {
		if( g::login() )
			return 'Welcome #name ( <a href="'.WEB_ROOT.'inc/php/logout.php">logout</a> )';
		return 'You are not logged in.';
	}
	
	public static function session( $var = null, $val = null ) {
		if( $var === null )
			return "";
			
		if( $val === null )
			return isset( $_SESSION[ $var ] ) ? $_SESSION[ $var ] : "";

		if( $val === "" ) {
			unset( $_SESSION[ $var ] );
			return "";
		}
			
		$_SESSION[ $var ] = $val;
	}
	
	/* helper html functions */
	public static function print_head( $title = "Global Admin Panel" ) {
		echo
'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link href="inc/css/gpanel.css" title="gpanel_css" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>'.$title.'</title>
</head>
<body>
<div id="main">';
	}
	
	public static function print_header( $page = "gPanel" ) {
		echo
	'<div id="header">
    	<div class="line">
        	<div class="left_af">
	        	<img src="http://ecpicollege.com/logos/ECPI_Logo_200px.png" alt="ECPI University" />
            </div>
            <div class="right_af">
	            <label class="title">'.$page.'</label><br />
            	<label>'.g::login_string().'</label>
            </div>
        </div>
    </div>
    <div id="page">';
	}
	
	public static function print_nav() {
		echo
		'<div id="nav">
    		<ul type="disc">
        	<li>Testing a list</li>
        		<ul type="disc">
	            <li>And nested items for</li>
    	        <li>The nav</li>
        	    </ul>
	        </ul>
    	</div>
    	<div id="content">';
	}
	
	public static function print_footer() {
		echo
		'</div>
	    <div id="footer">
        	<label><a href="http://ecpionline.com" target="_blank">Moodle</a> |
            	<a href="http://ecpicollege.com" target="_blank">Student Portal</a> |
				<a href="http://olexams.ecpi.net" target="_blank">Online Entrance Exams</a> |
				<a href="http://olorientation.ecpi.net" target="_blank">Online Orientation</a><br/>
            (C) 2012 ECPI University</label>
        </div>
    </div>
</div>
</body>
</html>';
	}
}

?>