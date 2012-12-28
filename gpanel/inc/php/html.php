<?php
/* classes to create html elements */
class html {
	public static function select( $attr = array(), $opts = array() ) {
		$html = "<select";
		foreach( $attr as $k => $v )
			$html .= ' '.$k.'="'.$v.'"';
		$html .= '>';
		
		foreach( $opts as $opt ) {
			@($val = $opt["value"]) || @($val = $opt["text"]) || ($val = "");
			@($text = $opt["text"]) || @($text = $opt["value"]) || ($text = "");
			$html .= '<option value="'.$val.'"';
			if( isset( $attr[ "name" ] ) )
				if( isset( $_POST[$attr["name"]] ) )
					if( $_POST[$attr["name"]] == strval( $val ) )
						$html .= ' selected="selected"';
			$html .= '>'.$text.'</option>';
		}
		
		$html .= '</select>';
		return $html;
	}
	
	public static function checkbox( $attr = array(), $submit = null, $default = false ) {
		$html = "<input";
		foreach( $attr as $k => $v )
			$html .= ' '.$k.'="'.$v.'"';
		$html .= ' type="checkbox" value="1"';
			
		if( $submit !== null )
			if( isset( $_POST[$submit] ) && isset( $attr["name"] ) ) {
				if( isset( $_POST[$attr["name"]] ) )
					if( $_POST[$attr["name"]] === "1" )
						$html .= ' checked="checked"';
			} else if( !isset( $_POST[$submit] ) && $default === true )
				$html .= ' checked="checked"';
				
		$html .= ' />';
		return $html;
	}
}