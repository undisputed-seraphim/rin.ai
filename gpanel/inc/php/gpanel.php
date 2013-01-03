<?php
include_once( ROOT.'inc/php/db.php' );
include_once( ROOT.'inc/php/html.php' );
include_once( ROOT.'inc/php/role.php' );

/* 'global' class with static functions that manage every aspect of the gpanel */
class g {
	public static $db = "";
	public static $app = "";
	public static $temp_roled = false;
	public static $roles = "";
	public static $roles_obtained = false;
	public static $nav = "";
	public static $javascript = "";
	
	/* initialize the app / db connection */
	public static function init( $app = "home" ) {
		g::$app = strtolower( $app );
		g::$nav = array(
		array( "text" => "Home", "url" => WEB_ROOT."index.php", "access" => "", "nodes" => array(
			array( "text" => "Manage Users", "url" => WEB_ROOT."manage.php", "access" => "r_MANAGE" ),
			array( "text" => "Orientation", "url" => WEB_ROOT."orientation/", "access" => "r_ORI_VIEW", "nodes" => array(
				array( "text" => "View Attempts", "url" => WEB_ROOT."orientation/view.php", "access" => "r_ORI_VIEW" ),
				array( "text" => "Track Attempts", "url" => WEB_ROOT."orientation/track.php", "access" => "r_ORI_TRACK" ),
				array( "text" => "Reset Attempts", "url" => WEB_ROOT."orientation/reset.php", "access" => "r_ORI_RESET" )
			) ),
			array( "text" => "Risk", "url" => WEB_ROOT."risk/", "access" => "r_RISK_VIEW", "nodes" => array(
				array( "text" => "View Attempts", "url" => WEB_ROOT."risk/view.php", "access" => "r_RISK_VIEW" ),
				array( "text" => "Track Attempts", "url" => WEB_ROOT."risk/track.php", "access" => "r_RISK_TRACK" ),
				array( "text" => "Reset Attempts", "url" => WEB_ROOT."risk/reset.php", "access" => "r_RISK_RESET" )
			) )
		) ) );
		
		/* if inside an application, initialize that application */
		$appinit = true;
		if( strtolower( $app ) == "orientation" ) {
			include_once( ROOT.'inc/php/orientation.php' );
			$appinit = ori::init();
		} else if( strtolower( $app ) == "risk" ) {
			//include_once( ROOT.'inc/php/risk.php' );
			//$appinit = risk::init();
		}
		
		g::$db = new db( DB_HOST, DB_USER, DB_PASS, DB_NAME );
		if( !g::$db->connected )
			g::log( "db", "Connection to gpanel database failed: ".g::db_error(g::$db,true) );
		else {
			/* see if users table exists */
			$check = g::$db->query( 'show tables like "gpanel_users"' );
			$exists = $check->rows > 0 ? true : false;
		
			/* if not exists, setup the orientation table */
			if( !$exists )
				if( !g::setup_db() )
					g::log( "db", "gpanel_users table creation failed." );
		}
			
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
	
	/* setup database first time */
	public static function setup_db() {
		$q =	'CREATE TABLE IF NOT EXISTS gpanel_users ('.
					'id BIGINT(10) NOT NULL AUTO_INCREMENT, '.
					'username VARCHAR(50) UNIQUE NOT NULL, '.
					'firstname VARCHAR(100), '.
					'lastname VARCHAR(100), '.
					'email VARCHAR(100), '.
					'roles VARCHAR(200), '.
					'temp_roles VARCHAR(200), '.
					'timecreated BIGINT(10), '.
					'lastlogin BIGINT(10), '.
					'locked INT(1), '.
					'PRIMARY KEY (id)'.
				') ENGINE = InnoDB';
		
		$query = g::$db->prepare( $q );
		if( !$query )
			return false;
		$result = $query->execute();
		if( !$result )
			return false;

		$q = 	'INSERT INTO gpanel_users ( username, roles, timecreated ) VALUES ('.
					'"johall", "g/all", UNIX_TIMESTAMP() ), ("sdrake", "g/all", UNIX_TIMESTAMP() )';
		$query = g::$db->prepare( $q );
		if( $query )
			$result = $query->execute();
		
		return true;
	}
	
	public static function db_error( $link, $connect = false ) {
		if( $link->mysqli ) {
			if( $connect )
				return @mysqli_connect_error();
			else
				return @mysqli_error( $link->conn );
		} else
			return @mysql_error( $link->conn );
	}
	
	/* log something in one of the log files */
	public static function log( $type = "system", $text = "N/A" ) {
		$file = fopen( ROOT."logs/".$type.".log.php", "a" );
		if( !$file )
			return;
			
		$date = date( "Y-m-d g:i:s A\t\t" );
		fwrite( $file, $date.$text."\t\t".$_SERVER["REMOTE_ADDR"]."\n" );
		fclose( $file );
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
					if( !g::$roles_obtained )
						g::$roles = role::get();
					return true;
				}
			return false;
		}
		
		if( isset( $_POST[ 'e' ] ) ) {
			/* decode submitted session */
			include_once( ROOT.'inc/php/middleman.php' );
			$res = json_decode( g::session( "ecpiuser" ), true );

			/* ldap login failed */
			if( array_key_exists( "error", $res ) ) {
				g::log( "login", "LOGIN FAIL\t\t".g::post_string("c") );
				return false;
			}

			/* ldap login successful */
			if( array_key_exists( "success", $res ) ) {
				$check = g::$db->prepare( 'select * from gpanel_users where username = ?' );
				if( !$check )
					return false;
				$result = $check->execute( array( array( "s" => $res["success"]["username"] ) ) );
				if( !$result )
					return false;

				/* user was not added to the gpanel_users table */
				if( count( $result->data ) === 0 ) {
					g::log( "login", "LOGIN NOT ADDED\t\t".g::post_string("c") );
					return false;
				}
				
				/* user account was locked */
				if( $result->data[0]["locked"] !== null ) {
					g::log( "login", "LOGIN LOCKED\t\t".g::post_string("c") );
					return false;
				}
				
				/* user was added to gpanel_users but not given the ability to login */
				g::$roles = role::get( $res );
				if( !role::check( "r_LOGIN" ) ) {
					g::log( "login", "LOGIN NOT GIVEN\t\t".g::post_string("c") );
					return false;
				}
				
				/* user was added and can log in */
				g::session( "gpanel_login", $res );
				g::log( "login", "LOGIN SUCCESS\t\t".g::post_string("c") );
				$q = 'UPDATE gpanel_users SET lastlogin = UNIX_TIMESTAMP(), temp_roles = NULL where username = ?';
				$query = g::$db->prepare( $q );
				$result = $query->execute( array( array( "s" => g::clean_post_string("c") ) ) );
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
			$revert = "";
			if( g::$temp_roled )
				$revert = ' | <a href="'.WEB_ROOT.'inc/php/revert.php">revert role</a>';
			return 'Welcome '.$name.' ( <a href="'.WEB_ROOT.'inc/php/logout.php">logout</a>'.$revert.' )';
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
	
	/* print out a nice box thing for various purposes, notices, warnings, alerts, etc */
	public static function heads_up( $type = "alert", $str = "This is an alert." ) {
		$res = '<table class="headsup '.$type.'"><tr>';
		
		switch( strtolower( $type ) ) {
			case "alert": case "notice": $symbol = "!"; break;
			case "good": case "success": $symbol = "&#x2713;"; break;
			case "bad": case "error": $symbol = "&#x2717;"; break;
			case "desc": $symbol = ""; break;
			default: $symbol = "?"; break;
		}
		
		$res .= '<td class="left" title="'.ucwords( $type ).'"><label>'.$symbol.'</label></td>'.
			'<td class="right"><label>'.$str.'</label></td>'.
		'</tr></table>';
		
		return $res;
	}
	
	/* make a toast window appear after the page loads, with a message */
	public static function toast( $type = "alert", $str = "This is some toast." ) {
		g::$javascript .= 'toast( "'.$type.'", "'.$str.'" );'."\n";
	}
	
	/* get clean_data'd post_string */
	public static function clean_post_string( $name = "" ) {
		return g::clean_data( g::post_string( $name ) );
	}
	
	/* get the value of a post string or return empty string */
	public static function post_string( $name = "" ) {
		if( $name === "" )
			return "";
		if( !g::post_not_empty( $name ) )
			return "";
		return trim( $_POST[$name] );
	}
	
	/* function for adding posted search fields and data to arrays */
	public static function add_post_data( &$fields = null, &$params = null, $data = null ) {
		if( $fields === null || $params === null || $data === null )
			return false;
		if( is_array( $data ) ) {
			foreach( $data as $d ) {
				if( g::post_not_empty( $d ) ) {
					$fields[] = $d;
					$params[] = array( "s" => trim( g::clean_data( $_POST[$d] ) ) );
				}
			}
			return true;
		}
		if( gettype( $data ) === "string" )
			if( g::post_not_empty( $data ) ) {
				$fields[] = $data;
				$params[] = array( "s" => trim( g::clean_data( $_POST[$data] ) ) );
			}
		return true;
	}
	
	/* return 1 or 0 if post var is set or not */
	public static function post_b( $name = "" ) {
		if( isset( $_POST[$name] ) )
			return 1;
		return 0;
	}
	
	/* ensure post is not empty */
	public static function post_not_empty( $name = "" ) {
		if( !isset( $_POST[$name] ) )
			return false;
		if( gettype( $_POST[$name] ) !== "string" )
			return false;
		if( trim( $_POST[$name] ) === "" )
			return false;
		return true;
	}
	
	/* return 1 or 0 if session var is set or not */
	public static function session_b( $name ) {
		if( isset( $_POST[$name] ) )
			return 1;
		return 0;
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
	
	/* use this function for ANY AND ALL data printed from user input */
	public static function clean_data( $str = "" ) { return g::$db->clean_string( $str ); }
	
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
        	<div class="lalign lfloat">
	        	<img src="http://ecpicollege.com/logos/ECPI_Logo_200px.png" alt="ECPI University" />
            </div>
            <div class="ralign rfloat">
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
<script type="text/javascript">'.g::$javascript.'</script>
</body>
</html>';
	}
	
	public static function add_user( $post = "" ) {
		if( !g::post_not_empty( $post ) )
			return false;
		
		$check = g::$db->prepare( 'select * from gpanel_users where username = ?' );
		$result = $check->execute( array( array( "s" => g::clean_post_string( "username" ) ) ) );
		if( count( $result->data ) > 0 )
			return false;
		
		$roles = array();
		switch( $_POST['as'] ) {
			case "custom":
				if( isset( $_POST["r_ALL"] ) ) $roles[] = role::$permissions["r_ALL"]["text"];
				if( isset( $_POST["r_LOGIN"] ) ) $roles[] = role::$permissions["r_LOGIN"]["text"];
				if( isset( $_POST["r_MANAGE"] ) ) $roles[] = role::$permissions["r_MANAGE"]["text"];
				break;
			default: 
				$roles = role::$roles[$_POST['as']];
				break;
		}
		
		$r = implode( ",", $roles );
		$q = 'INSERT INTO gpanel_users ( username, roles, timecreated ) VALUES ('.
				'?, "'.$r.'", UNIX_TIMESTAMP() )';
		$query = g::$db->prepare( $q );
		$result = $query->execute( array( array( "s" => g::clean_post_string( "username" ) ) ) );
		if( !$result )
			return false;
		return true;
	}
	
	public static function get_user_roles( $name = "" ) {
		if( !g::post_not_empty( $name ) )
			return false;

		$html = '<div class="spacer">&nbsp;</div><div class="content">';
		$check = g::$db->prepare( 'select * from gpanel_users where username = ?' );
		if( !$check )
			return false;

		$result = $check->execute( array( array( "s" => g::clean_post_string( $name ) ) ) );
		if( !$result )
			return false;
		
		if( !count( $result->data ) > 0 )
			return false;
		
		foreach( role::$permissions as $role => $v ) {
			$html .= '<div>'.$role.' '.$v["text"].'</div>';
		}
		
		$html .= $result->data[0]["roles"].'</div>';
		return $html;
	}
}

?>