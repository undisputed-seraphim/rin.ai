<?php

/* permission heirarchy; parent permissions grant all children */
define( "r_ALL", "g/all" );
	define( "r_LOGIN", "g/login" );										//can login to gpanel
	define( "r_VIEW", "g/view" );
	define( "r_MANAGE", "g/manage" );

	define( "r_ORIENTATION_ALL", "g/orientation/all" );
		define( "r_ORIENTATION_VIEW", "g/orientation/view" );
		define( "r_ORIENTATION_TRACK", "g/orientation/track" );
		define( "r_ORIENTATION_MANAGE", "g/orientation/manage" );
			define( "r_ORIENTATION_RESET", "g/orientation/reset" );

	define( "r_RISK_ALL", "g/risk/all" );
		define( "r_RISK_VIEW", "g/risk/view" );
		define( "r_RISK_TRACK", "g/risk/track" );
		define( "r_RISK_RESET", "g/risk/reset" );

class role {
	/* check if user has role or is granted child role, add 'true' to check for specific role only */
	public static function check( $role = r_ALL, $direct = false ) {
		if( $direct === true )
			return role::has_role( array( $role, r_ALL ) );
			
		switch( $role ) {
			/* gpanel roles */
			case r_ALL:
				return role::has_role( array( r_ALL ) );
			case r_LOGIN:
				return role::has_role( array( r_LOGIN, r_ALL ) );
			case r_VIEW:
				return role::has_role( array( r_VIEW, r_ALL ) );
			case r_MANAGE:
				return role::has_role( array( r_MANAGE, r_ALL ) );
				
			/* orientation roles */
			case r_ORIENTATION_ALL:
				return role::has_role( array( r_ORIENTATION_ALL, r_ALL ) );
			case r_ORIENTATION_VIEW:
				return role::has_role( array( r_ORIENTATION_VIEW, r_ORIENTATION_ALL, r_ALL ) );
			case r_ORIENTATION_TRACK:
				return role::has_role( array( r_ORIENTATION_TRACK, r_ORIENTATION_ALL, r_ALL ) );
			case r_ORIENTATION_MANAGE:
				return role::has_role( array( r_ORIENTATION_MANAGE, r_ORIENTATION_ALL, r_ALL ) );
			case r_ORIENTATION_RESET:
				return role::has_role( array( r_ORIENTATION_RESET, r_ORIENTATION_MANAGE, r_ORIENTATION_ALL, r_ALL ) );
				
			/* risk roles */
			case r_RISK_ALL:
				return role::has_role( array( r_RISK_ALL, r_ALL ) );
			case r_RISK_VIEW:
				return role::has_role( array( r_RISK_VIEW, r_RISK_ALL, r_ALL ) );
			case r_RISK_TRACK:
				return role::has_role( array( r_RISK_TRACK, r_RISK_ALL, r_ALL ) );
			case r_RISK_RESET:
				return role::has_role( array( r_RISK_RESET, r_RISK_ALL, r_ALL ) );
			
			/* role does not exist */
			default: return false;
		}
	}
	
	/* get roles from database on each page */
	public static function get() {
		//TODO: add temp roles column for a 'login as'
		$query = "select roles from ______ where username = username";
		$result = "g/all";
		return $result;
	}
	
	/* actually check database role string for logged in user */
	public static function has_role( $roles ) {
		$user_roles = explode( ",", g::$roles );
		if( is_array( $roles ) )
			foreach( $roles as $role )
				if( in_array( $role, $user_roles ) )
					return true;
		else if( in_array( $roles, $user_roles ) )
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