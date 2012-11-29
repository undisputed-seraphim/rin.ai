<?php
/* 'global' class with static functions that manage every aspect of the gpanel */
class g {
	public static function login( ) {
		$pub = '1b6453892473a467d07372d45eb05abc2031647a';
	}
	
	public static function session( $var, $val ) {
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
}

?>