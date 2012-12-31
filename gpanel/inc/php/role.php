<?php

class role {
	public static $roles = array(
		"gPanel Manager" => array( "r_LOGIN", "r_MANAGE" ),
		"Orientation Viewer" => array( "r_LOGIN", "r_ORI_VIEW" ),
		"root" => array( "r_ALL" )
	);
	/* permission heirarchy; parent permissions grant all children */
	public static $permissions = array(
		"r_ALL" => array( "text" => "g/all" ),
		"r_LOGIN" => array( "text" => "g/login" ),
		"r_MANAGE" => array( "text" => "g/manage" ),
		"r_ORI_VIEW" => array( "text" => "g/ori/view" )
	);

	/* check if user has role or is granted child role, add 'true' to check for specific role only */
	public static function check( $role = "r_ALL", $direct = false ) {
		if( $direct === true )
			return role::has_role( array( $role, "r_ALL" ) );
			
		switch( $role ) {
			/* gpanel roles */
			case "r_ALL":
				return role::has_role( array( "r_ALL" ) );
			case "r_LOGIN":
				return role::has_role( array( "r_LOGIN", "r_ALL" ) );
			case "r_VIEW":
				return role::has_role( array( "r_VIEW", "r_ALL" ) );
			case "r_MANAGE":
				return role::has_role( array( "r_MANAGE", "r_ALL" ) );
				
			/* orientation roles */
			case "r_ORI_ALL":
				return role::has_role( array( "r_ORI_ALL", "r_ALL" ) );
			case "r_ORI_VIEW":
				return role::has_role( array( "r_ORI_VIEW", "r_ORI_ALL", "r_ALL" ) );
			case "r_ORI_TRACK":
				return role::has_role( array( "r_ORI_TRACK", "r_ORI_ALL", "r_ALL" ) );
			case "r_ORI_MANAGE":
				return role::has_role( array( "r_ORI_MANAGE", "r_ORI_ALL", "r_ALL" ) );
			case "r_ORI_RESET":
				return role::has_role( array( "r_ORI_RESET", "r_ORI_MANAGE", "r_ORI_ALL", "r_ALL" ) );
				
			/* risk roles */
			case "r_RISK_ALL":
				return role::has_role( array( "r_RISK_ALL", "r_ALL" ) );
			case "r_RISK_VIEW":
				return role::has_role( array( "r_RISK_VIEW", "r_RISK_ALL", "r_ALL" ) );
			case "r_RISK_TRACK":
				return role::has_role( array( "r_RISK_TRACK", "r_RISK_ALL", "r_ALL" ) );
			case "r_RISK_RESET":
				return role::has_role( array( "r_RISK_RESET", "r_RISK_ALL", "r_ALL" ) );
			
			/* role does not exist */
			default: return false;
		}
	}
	
	/* get roles from database on each page */
	public static function get( $arr = null ) {
		//TODO: add temp roles column for a 'login as'
		$query = g::$db->prepare( 'SELECT temp_roles, roles FROM gpanel_users WHERE username = ?' );
		if( !$query )
			return "";
			
		$username = "";

		if( isset( $_SESSION['gpanel_login'] ) ) {
			if( isset( $_SESSION['gpanel_login']["success"] ) )
				if( isset( $_SESSION['gpanel_login']["success"]["username"] ) )
					$username = $_SESSION['gpanel_login']["success"]["username"];
		} else
			$username = $arr["success"]["username"];

		$result = $query->execute( array( array( "s" => $username ) ) );
		if( !$result )
			return "";
			
		g::$roles_obtained = true;
		if( $result )
			if( count( $result->data ) > 0 ) {
				if( $result->data[0]["temp_roles"] !== null ) {
					g::$temp_roled = true;
					return $result->data[0]["temp_roles"];
				}
				return $result->data[0]["roles"];
			}
		return "";
	}
	
	/* actually check database role string for logged in user */
	public static function has_role( $roles ) {
		$user_roles = explode( ",", g::$roles );
		if( is_array( $roles ) ) {
			foreach( $roles as $role )
				if( in_array( @role::$permissions[$role]["text"], $user_roles ) )
					return true;
		}
		else if( in_array( @role::$permissions[$roles]["text"], $user_roles ) )
			return true;
		return false;
	}
	
	/* add role to a user */ 
	public static function add_role() {
	}
	
	/* delete role from a user */
	public static function del_role() {
	}
}

?>