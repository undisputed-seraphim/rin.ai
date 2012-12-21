<?php
/* defines for orientation vars */
define( "ORI_PASS_LIMIT", 70.00 );
define( "ORI_RESULT_LIMIT", 100 );

/* 'orientation' class with static functions that manage every aspect of orientation part of gpanel */
class ori {
	public static $db = "";
	public static $limit = ORI_RESULT_LIMIT;
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
				
	/* create the orientation_attempts table, using exact structure of columns from moodle tables */
	public static function setup_db() {
		$q =	'CREATE TABLE IF NOT EXISTS orientation_attempts ('.
					'id BIGINT(10) NOT NULL AUTO_INCREMENT, '.
					'userid BIGINT(10) NOT NULL, '.
					'username VARCHAR(100) NOT NULL, '.
					'firstname VARCHAR(100) NOT NULL, '.
					'lastname VARCHAR(100) NOT NULL, '.
					'email VARCHAR(100) NOT NULL, '.
					'item VARCHAR(255), '.
					'itemtype VARCHAR(30) NOT NULL, '.
					'attempt BIGINT(10) NOT NULL, '.
					'grades DECIMAL(10,5), '.
					'timecreated BIGINT(10), '.
					'timemodified BIGINT(10), '.
					'PRIMARY KEY (id)'.
				') ENGINE = InnoDB';
		
		$query = ori::$db->prepare( $q );
		if( !$query )
			return false;
		
		$result = $query->execute();
		if( !$result )
			return false;

		return true;
	}
	
	public static function split_types( $results, $data ) {
		$res = array();
		$tmp = $results->group_by( "type", $data );
		$res["Current Moodle Attempt"] = $tmp["moodle"];
		if( isset( $tmp["archived"] ) )
			foreach( $tmp["archived"] as $entry ) {
				if( !isset( $res["Attempt ".$entry["attempt"]] ) )
					$res["Attempt ".$entry["attempt"]] = array();
				$res["Attempt ".$entry["attempt"]][] = $entry;
			}
		return $res;
	}
	
	/* build table from query_result object */
	public static function print_results( $results = null ) {
		if( !$results )
			return '<table class="results"><tr><td>No Results</td></tr></table>';

		if( count( $results->data ) === 0 )
			return '<table class="results"><tr><td>No Results</td></tr></table>';
		
		/* sort the results by unique student id (username) */
		$res = $results->group_by( "? [ ? ]", array( "fullname", "username" ) );
		if( !$res )
			return '<table class="results"><tr><td>No Results</td></tr></table>';
			
		$html = '<input class="rfloat" id="export" type="button" value="Export to Excel" name="export" />';
		$html .= '<p class="title">Results<span class="note">obtained in '.$results->exec_time.' ms</span></p>';
		$html .= '~|~|LIMIT|~|~<div class="spacer">&nbsp;</div>';
		$init = true;
		$num = 0;
		/* build the html sections per student */
		foreach( $res as $student => $data ) {
			$num++;
			$html .= '<div class="section"><div class="section_title"><label>'.$student.'</label></div><div class="section_body';
			$html .= $init ? '">' : ' hidden">';
			$init = false;
			
			/* loop through moodle entry, then archived entries */
			$types = ori::split_types( $results, $data );
			$subhtml = "";
			foreach( $types as $type => $tdata ) {
				$incomplete = 0;
				$grade = 0;
				$subhtml .= '<div class="~|~|PASSFAIL|~|~">';
				$subhtml .= '<p class="subtitle">'.$type.'<span class="note">~|~|STATUS|~|~</span></p>';
				$subhtml .= '<table class="results">';
				foreach( ori::$items as $i => $item ) {
					if( $i === 0 )
						$subhtml .= '<tr><th>Item</th><th>Grade</th><th>Last Modified</th></tr>';

					$tmp = $results->get( "item", $item, $tdata );
					if( $tmp )
						foreach( $tmp as $t ) {
							$subhtml .= '<tr class="'.( ($i+1) % 2 === 0 ? "even" : "odd" ).'"><td>'.$item.'</td>';
							$subhtml .= '<td>'.$t["grades"].'</td><td>'.$t["timemodified"].'</td>';
							$grade += $t["grades"];
						}
					else {
						$subhtml .= '<tr class="'.( ($i+1) % 2 === 0 ? "even" : "odd" ).'"><td>'.$item.'</td>';
						$subhtml .= '<td colspan="2">No Entry</td>';
						$incomplete = 1;
					}
					$subhtml .= '</tr>';
					/* grab student's archived entries if any */
				}
				$subhtml .= '</table></div>';
				$grade /= count( ori::$items );
			
				/* set the note for the entry as complete or incomplete */
				$subhtml = $incomplete ?	str_replace( "~|~|STATUS|~|~", "incomplete", $subhtml ) :
											str_replace( "~|~|STATUS|~|~", "complete", $subhtml );
									
				/* set the color for the sidebar based on pass/fail ( if complete ) */
				if( !$incomplete ) {
					$subhtml = $grade >= ORI_PASS_LIMIT ?	str_replace( "~|~|PASSFAIL|~|~", "pass", $subhtml ) :
															str_replace( "~|~|PASSFAIL|~|~", "fail", $subhtml );
				} else $subhtml = str_replace( "~|~|PASSFAIL|~|~", "blank", $subhtml );
			}

			$subhtml .= '</div></div>';
			$html .= $subhtml;
			
			if( $num > ori::$limit ) {
				/* result limit was reached, display message at bottom of results... */
				$html = str_replace( "~|~|LIMIT|~|~", '<div class="spacer">&nbsp;</div>'.g::heads_up( "notice",
					"Number of results exceed limit. Showing the first ".ori::$limit." results." ), $html );
				return $html;
			}
		}
		$html = str_replace( "~|~|LIMIT|~|~", "", $html );
		return $html;
	}
	
	/* get entries based on what fields the user asked for */
	public static function get_attempts( $fields, $params ) {
		/* see if orientation_attempts table exists */
		$check = @mysqli_query( ori::$db->conn, 'show tables like "orientation_attempts"' );
		$exists = $check->num_rows > 0 ? true : false;
		
		/* if not exists, setup the orientation table */
		if( !$exists )
			if( !ori::setup_db() )
				return '<div class="center">Table creation failed.</div>';
				
		$q = ori::construct_main_query( $fields );
		$moodle_query = ori::$db->prepare( $q ) or die( mysqli_error( ori::$db->conn ) );
		
		if( !$moodle_query )
			return '<div class="center">No Results</div>';

		$results = $moodle_query->execute( array_merge( $params, $params ) );		
		return ori::print_results( $results );
	}
	
	public static function construct_main_query( $fields ) {
		$q = '(SELECT g.userid, u.username, CONCAT(u.firstname, " ", u.lastname) AS "fullname", '.
				'u.email, i.itemname AS item, i.itemtype AS itemtype, '.
				'g.finalgrade AS grades, g.timecreated, "moodle" AS type, "current" AS attempt, '.
				'DATE_FORMAT( FROM_UNIXTIME( g.timemodified ), "%W, %M %d, %Y, %h:%i %p" ) AS timemodified '.
			'FROM mdl_grade_grades g '.
				'JOIN mdl_user u ON u.id = g.userid '.
				'JOIN mdl_grade_items i ON g.itemid = i.id '.
				'JOIN mdl_course c ON i.courseid = c.id '.
			'WHERE fullname = "ECPI Online Student Orientation" AND itemtype != "category" ';
		
		/* modify query based on which values where chosen */
		foreach( $fields as $field )
			switch( $field ) {
				case "username": $q .= 'AND u.username = ? '; break;
				case "firstname": $q .= 'AND u.firstname LIKE CONCAT(\'%\', ?, \'%\') '; break;
				case "lastname": $q .= 'AND u.lastname LIKE CONCAT(\'%\', ?, \'%\') '; break;
		}
		
		$q .=	') UNION '.
			'(SELECT userid, username, concat( firstname, " ", lastname ) AS "fullname", '.
					'email, item, itemtype, grades, timecreated, "archived" AS type, attempt, '.
					'DATE_FORMAT( FROM_UNIXTIME( timemodified ), "%W, %M %d, %Y, %h:%i %p" ) AS timemodified '.
				'FROM orientation_attempts '.
				'WHERE 1 = 1 ';
			
		/* modify query based on which values where chosen */
		foreach( $fields as $field )
			switch( $field ) {
				case "username": $q .= 'AND username = ? '; break;
				case "firstname": $q .= 'AND firstname LIKE CONCAT(\'%\', ?, \'%\') '; break;
				case "lastname": $q .= 'AND lastname LIKE CONCAT(\'%\', ?, \'%\') '; break;
		}
		
		$q .= ') ORDER BY username, attempt DESC, item';
		
		return $q;
	}
}
?>