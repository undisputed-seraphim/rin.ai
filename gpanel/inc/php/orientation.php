<?php
/* 'orientation' class with static functions that manage every aspect of orientation part of gpanel */
class ori {
	public static $db = "";
	public static $items = array();
	
	public static function init() {
		ori::$db = new db( ORI_DB_HOST, ORI_DB_USER, ORI_DB_PASS, ORI_DB_NAME );
		
		/* grab item names for orientation items in moodle */
		if( ori::$db->ready ) {
			ori::$items = array(
				"1. Take the Survey Now",
				"2. Test Your Knowledge",
				"3. Discussion Forum: Introduce Yourself! - Required",
				"4. Assignment - Required"
			);
		}
		
		return ori::$db->connected;
	}
	
	/* build table from query_result object */
	public static function table_from_results( $results ) {
		if( count( $results->data ) === 0 )
			return '<table class="results"><tr><td>No Results</td></tr></table>';
		
		/* sort the results by unique student id (username) */
		$res = $results->group_by( "? [ ? ]", array( "fullname", "username" ) );
		if( !$res )
			return '<table class="results"><tr><td>No Results</td></tr></table>';
		$html = '<p class="time">obtained in '.$results->exec_time.' ms</p>';
		$init = true;
		/* build the html sections per student */
		foreach( $res as $student => $data ) {
			$html .= '<div class="section_title">'.$student.'</div><div class="section';
			$html .= $init ? '">' : ' hidden">';
			$init = false;
			$html .= '<table class="results">';
			foreach( ori::$items as $i => $item ) {
				if( $i === 0 )
					$html .= '<tr><th>Item</th><th>Grade</th><th>Last Modified</th></tr>';

				$html .= '<tr class="'.( ($i+1) % 2 === 0 ? "even" : "odd" ).'"><td>'.$item.'</td>';
				$tmp = $results->get( "item", $item, $data );
				if( $tmp )
					foreach( $tmp as $t )
						$html .= '<td>'.$t["grades"].'</td><td>'.$t["timemodified"].'</td>';
				else {
					$html .= '<td colspan="2">No Entry</td>';
				}
				$html .= '</tr>';
			}
			$html .= '</table></div>';
		}
		return $html;
	}
	
	/* get entries based on what fields the user asked for */
	public static function get_moodle_attempt( $fields, $params ) {
		print_r( $params );
		$q = 'SELECT g.userid, u.username, concat(u.firstname, " ", u.lastname) AS "fullname", '.
				'u.email, i.itemname AS item, i.itemtype AS itemtype, '.
				'g.finalgrade AS grades, g.timecreated, '.
				'DATE_FORMAT( FROM_UNIXTIME( g.timemodified ), "%W, %M %d, %Y, %h:%i %p" ) as timemodified '.
			'FROM mdl_grade_grades g '.
				'JOIN mdl_user u ON u.id = g.userid '.
				'JOIN mdl_grade_items i ON g.itemid = i.id '.
				'JOIN mdl_course c ON i.courseid = c.id '.
			'WHERE c.fullname = "ECPI Online Student Orientation" AND i.itemtype != "category" ';
	
		/* modify query based on which values where chosen */

		foreach( $fields as $field )
			switch( $field ) {
				case "username": $q .= 'AND u.username = ? '; break;
				case "firstname": $q .= 'AND u.firstname = ? '; break;
			}
	
		$q .= 'ORDER BY u.lastname, item DESC LIMIT 100';

		$query = ori::$db->prepare( $q );
		if( !$query )
			return false;

		return $query->execute( $params );
	}
}

class attempt {
	public function __construct() {
	}
}

?>