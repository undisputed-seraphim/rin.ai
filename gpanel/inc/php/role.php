<?php

define( "r_ALL", "g/all" );
define( "r_ORIENTATION_ALL", "g/orientation/all" );
define( "r_ORIENTATION_VIEW", "g/orientation/view" );
define( "r_ORIENTATION_TRACK", "g/orientation/track" );
define( "r_ORIENTATION_RESET", "g/orientation/reset" );

define( "r_RISK_ALL", "g/risk/all" );
define( "r_RISK_VIEW", "g/risk/view" );
define( "r_RISK_TRACK", "g/risk/track" );
define( "r_RISK_RESET", "g/risk/reset" );

class role {
	public static function check( $role = r_ALL ) {
		/* add roles here, with all roles that grant said role in an array together,
			example: r_ORIENTATION_VIEW is granted by r_ORIENTATION_VIEW, r_ORIENTATION_ALL, and r_ALL roles */
		switch( $role ) {
			case r_ALL:
				return role::has_roles( array( r_ALL ) );
			case r_ORIENTATION_ALL:
				return role::has_roles( array( r_ORIENTATION_ALL, r_ALL ) );
			case r_ORIENTATION_VIEW:
				return role::has_roles( array( r_ORIENTATION_VIEW, r_ORIENTATION_ALL, r_ALL ) );
			case r_ORIENTATION_TRACK:
				return role::has_roles( array( r_ORIENTATION_TRACK, r_ORIENTATION_ALL, r_ALL ) );
			case r_ORIENTATION_RESET:
				return role::has_roles( array( r_ORIENTATION_RESET, r_ORIENTATION_ALL, r_ALL ) );
				
			case r_RISK_ALL:
				return role::has_roles( array( r_RISK_ALL, r_ALL ) );
			case r_RISK_VIEW:
				return role::has_roles( array( r_RISK_VIEW, r_RISK_ALL, r_ALL ) );
			case r_RISK_TRACK:
				return role::has_roles( array( r_RISK_TRACK, r_RISK_ALL, r_ALL ) );
			case r_RISK_RESET:
				return role::has_roles( array( r_RISK_RESET, r_RISK_ALL, r_ALL ) );
		}
	}
	
	/* actually check database role string for logged in user */
	public static function has_roles( $roles ) {
		$query = "select roles from ______ where username = username";
		$result = "g/all,split,with,commas";
		$user_roles = explode( ",", $result );
		if( is_array( $roles ) )
			foreach( $roles as $role )
				if( in_array( $role, $user_roles ) )
					return true;
		if( in_array( $roles, $user_roles ) )
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