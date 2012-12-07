<?php
include_once( ROOT.'inc/php/db.php' );
include_once( ROOT.'inc/php/role.php' );

/* 'global' class with static functions that manage every aspect of the gpanel */
class g {
	public static $db = "";
	public static $app = "";
	public static $roles = "";
	public static $nav = "";
	
	/* initialize the app / db connection */
	public static function init( $app = "home" ) {
		g::$app = strtolower( $app );
		g::$nav = array(
		array( "text" => "Home", "url" => WEB_ROOT."index.php", "access" => "", "nodes" => array(
			array( "text" => "Manage Users", "url" => WEB_ROOT."index.php", "access" => r_MANAGE ),
			array( "text" => "Orientation", "url" => WEB_ROOT."orientation/", "access" => r_ORIENTATION_VIEW, "nodes" => array(
				array( "text" => "View Attempts", "url" => WEB_ROOT."orientation/view.php", "access" => r_ORIENTATION_VIEW ),
				array( "text" => "Track Attempts", "url" => WEB_ROOT."orientation/track.php", "access" => r_ORIENTATION_TRACK ),
				array( "text" => "Reset Attempts", "url" => WEB_ROOT."orientation/reset.php", "access" => r_ORIENTATION_RESET )
			) ),
			array( "text" => "Risk", "url" => WEB_ROOT."risk/", "access" => r_RISK_VIEW, "nodes" => array(
				array( "text" => "View Attempts", "url" => WEB_ROOT."risk/view.php", "access" => r_RISK_VIEW ),
				array( "text" => "Track Attempts", "url" => WEB_ROOT."risk/track.php", "access" => r_RISK_TRACK ),
				array( "text" => "Reset Attempts", "url" => WEB_ROOT."risk/reset.php", "access" => r_RISK_RESET )
			) )
		) ) );
		g::$db = new db( DB_HOST, DB_USER, DB_PASS, DB_NAME );
		//g::$db->set_log_info( "insert into logs values ( )", array( "s" => " );
		return g::$db->connected;
	}
	
	/* redirect user to login page and hold in session page they tried to go to */
	public static function redirect( $loc = "" ) {
		if( $loc === "" )
			$loc = "Location: ".WEB_ROOT;
			
		if( !g::login() )
			g::session( "gpanel_redirect", 'Location: http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'] );
			
		header( $loc );
	}
	
	/* interface functions for db */
	public static function prepare( $query = "", $params = array(), $now = false, $log = false ) {
		return g::$db->prepare( $query, $params, $now, $log );
	}
	
	/* if $first is true, attempting to login, else check if logged in */
	public static function login( $first = "" ) {
		/* if no value passed, perform login check of session */
		if( $first === "" ) {
			if( is_array( g::session( "gpanel_login" ) ) )
				if( array_key_exists( "success", g::session( "gpanel_login" ) ) ) {
					g::$roles = role::get();
					return true;
				}
			return false;
		}
		
		if( isset( $_POST[ 'e' ] ) ) {
			/* decode submitted session */
			include_once( ROOT.'inc/php/middleman.php' );
			$res = json_decode( g::session( "ecpiuser" ), true );
			if( array_key_exists( "error", $res ) )
				return false;
		
			/* check if they have any roles, else deny */
			if( array_key_exists( "success", $res ) ) {
				g::$roles = role::get();
				if( !role::check( r_LOGIN ) )
					return false;
				g::session( "gpanel_login", $res );
				if( isset( $_SESSION['gpanel_redirect'] ) ) {
					$loc = g::session( "gpanel_redirect" );
					g::session( "gpanel_redirect", "" );
					g::redirect( $loc );
				}
				return true;
			}
		}
		return false;
	}
	
	/* return the string under the title of the page in upper right */
	public static function login_string() {
		if( g::login() ) {
			$name = g::session( "gpanel_login" );
			$name = $name["success"]["surname"].", ".$name["success"]["fname"];
			return 'Welcome '.$name.' ( <a href="'.WEB_ROOT.'inc/php/logout.php">logout</a> )';
		}
		return 'You are not logged in.';
	}
	
	/* check if user has access to a permission type */
	public static function access( $role ) {
		if( !g::login() )
			return false;
		//TODO: add role checking here, rest of app will use this function to check if user can get here
		return role::check( $role );
	}
	
	/* echo string if access level is met */
	public static function secure_print( $role, $str = "" ) {
		if( g::access( $role ) || $role === "" )
			echo $str;
		echo "";
	}
	
	/* print results to a table from a query_result object, specifying which columns to show */
	public static function print_results( $result = null, $cols = array() ) {
		if( !$result )
			return false;
			
		if( count( $cols ) === 0 )
			$cols = $result->fields;
			
		$html = '<table class="results">';
		if( count( $result->data ) > 0 ) {
			for( $i = 0; $i < count( $result->data ); $i++ ) {
				$cur = $result->data[$i];
				if( $i === 0 ) {
					$html .= '<thead><tr>';
					foreach( $cur as $k => $v )
						if( in_array( $k, $cols ) )
							$html .= '<th><label>'.$k.'</label></th>';
					$html .= '</tr></thead>';
				}
				$html .= '<tr>';
				foreach( $cur as $k => $v )
					if( in_array( $k, $cols ) )
						$html .= '<td class="'.(($i+1) % 2 == 0 ? "even" : "odd").'">'.$v.'</td>';
				$html .= '</tr>';
			}
		} else {
			$html .= '<tr><th>No Results</th></tr>';
		}
		$html .= '</table>';
		echo $html;
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
	
	/* print head, header, nav */
	public static function start_content( $title = "Global Admin Panel", $page = "gPanel" ) {
		g::print_head( $title );
		g::print_header( $page );
		g::print_nav();
	}
	
	/* print footer and closing content */
	public static function end_content() { g::print_footer(); }
		
	/* helper html functions */
	public static function print_head( $title = "Global Admin Panel" ) {
		echo
'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link href="'.WEB_ROOT.'inc/css/gpanel.css" title="gpanel_css" rel="stylesheet" />
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
	
	/* loop through nav elements recursively to print navigation */
	public static function nav_loop( $nav ) {
		if( array_key_exists( "nodes", $nav ) ) {
			g::secure_print( $nav["access"], '<div><label class="heading"><a href="'.$nav["url"].'">'.$nav["text"].'</a></label>' );
			g::secure_print( $nav["access"], '<blockquote'.(g::$app == strtolower( $nav["text"] ) || $nav["text"] == "Home" ? '' : ' class="hidden"').'>' );
			foreach( $nav["nodes"] as $cur )
				g::nav_loop( $cur );
			g::secure_print( $nav["access"], '</blockquote></div>' );
		} else {
			$cur = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'] == $nav["url"] ? ' class="current"' : '';
			g::secure_print( $nav["access"], '<div><label><a href="'.$nav["url"].'"'.$cur.'>'.$nav["text"].'</a></label></div>' );
		}
	}
	
	/* print header with a parameter for current app */
	public static function print_nav() {
		echo '<div id="nav">';
		g::nav_loop( g::$nav[0] );
		echo '</div><div id="content">';
	}
	
	public static function print_footer() {
		echo
		'</div>
	    <div id="footer">
        	<label><a href="http://ecpionline.com" target="_blank">Moodle</a> |
            	<a href="http://ecpicollege.com" target="_blank">Student Portal</a> |
				<a href="http://olexams.ecpi.net" target="_blank">Online Entrance Exams</a> |
				<a href="http://olorientation.ecpi.net" target="_blank">Online Orientation</a><br/>
            (C) '.COPYRIGHT.' ECPI University</label>
        </div>
    </div>
</div>
<script type="text/javascript" src="'.WEB_ROOT.'inc/js/gpanel.js"></script>
</body>
</html>';
	}
}

?>