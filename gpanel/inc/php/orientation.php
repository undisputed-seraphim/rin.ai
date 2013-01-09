<?php
/* defines for orientation vars */
define( "ORI_PASS_LIMIT", 70.00 );
define( "ORI_RESULT_LIMIT", 100 );
//add defines for: course name in moodle shell

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
			
			/* see if orientation_attempts table exists */
			$check = @mysqli_query( ori::$db->conn, 'show tables like "orientation_attempts"' );
			$exists = $check->num_rows > 0 ? true : false;
		
			/* if not exists, setup the orientation table */
			if( !$exists )
				if( !ori::setup_db() )
					g::log( "db", "orientation table creation failed." );
		}
		
		if( !ori::$db->connected )
			g::log( "db", "Connection to orientation database failed: ".@mysqli_connect_error() );
			
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
		
		$html = '<input class="rfloat" id="export" type="button" value="Export to Excel" name="export" />';
		$html .= '<p class="title">Results<span class="note">obtained in '.$results->exec_time.' ms</span></p>';
		$html .= '<div class="spacer">&nbsp;</div>';
		$init = true;
		
		foreach( $results->data as $i => $data ) {
			$tmp = explode( "-|-", $data["items"] );
			$items = array();
			foreach( $tmp as $i ) {
				$it = explode( "||", $i );
				
				if( !isset( $items[$it[0]] ) )
					$items[$it[0]] = array();
				$items[$it[0]][] = $it;
			}
			
			$sec = '<div class="section"><div class="section_title"><label>'.$data["fullname"].'</label>';
			$sec .= '</div><div class="section_body';
			$sec .= $init ? '">' : ' hidden">';
			$sec .= '<div class="~|~|PASSFAIL|~|~">';
			$sec .= '<p class="subtitle">Moodle<span class="note">~|~|STATUS|~|~</span></p>';
			$sec .= '<table class="results">';
			$init = false;
			$incomplete = 0;
			$grade = 0;
			
			foreach( ori::$items as $i => $item ) {
				if( $i === 0 )
					$sec .= '<tr><th>Item</th><th>Grade</th><th>Last Modified</th></tr>';
				
				if( isset( $items[ $item ] ) ) {
					foreach( $items[$item] as $it ) {
						$sec .= '<tr class="'.( ($i+1) % 2 === 0 ? "even" : "odd" ).'"><td>'.$item.'</td>';
						$sec .= '<td>'.$it[1].'</td><td>'.$it[3].'</td>';
						if( !is_numeric( $it[1] ) )
							$incomplete = 1;
						else $grade += $it[1];
						$sec .= '</tr>';
					}
				} else {
					$sec .= '<tr class="'.( ($i+1) % 2 === 0 ? "even" : "odd" ).'"><td>'.$item.'</td>';
					$sec .= '<td colspan="2">No Entry</td>';
					$incomplete = 1;
					$sec .= '</tr>';
				}
			}
			
			$sec .= '</table></div>';
			$grade /= count( ori::$items );
			
			/* set the note for the entry as complete or incomplete */
			$sec = $incomplete ?	str_replace( "~|~|STATUS|~|~", "incomplete", $sec ) :
									str_replace( "~|~|STATUS|~|~", "complete", $sec );
									
			/* set the color for the sidebar based on pass/fail ( if complete ) */
			if( !$incomplete ) {
				$sec = $grade >= ORI_PASS_LIMIT ?	str_replace( "~|~|PASSFAIL|~|~", "pass", $sec ) :
													str_replace( "~|~|PASSFAIL|~|~", "fail", $sec );
			} else $sec = str_replace( "~|~|PASSFAIL|~|~", "blank", $sec );
				
			$sec .= '</div></div>';
			
			$html .= $sec;
		}
		
		return $html;
	}
	
	/* get entries based on what fields the user asked for */
	public static function get_attempts( $fields, $params ) {				
		$q = ori::construct_main_query( $fields );
		$moodle_query = ori::$db->prepare( $q ) or die( mysqli_error( ori::$db->conn ) );
		
		if( !$moodle_query )
			return '<div class="center">No Results</div>';

		$results = $moodle_query->execute( array_merge( $params, $params ) );		
		return ori::print_results( $results );
		print_r( $results );
	}
	
	public static function construct_main_query( $fields ) {
		$items = "";
		foreach( ori::$items as $i => $item ) {
			if( $i !== 0 )
				$items .= ' OR ';
			$items .= 'itemname = "'.$item.'"';
		}
		
		$q = 'SELECT g.userid, u.username, CONCAT( u.firstname, " ", u.lastname ) AS "fullname", '.
				'(SELECT GROUP_CONCAT( '.
					'CONCAT( '.
						'IFNULL( ii.itemname, "No Name" ), "||", '.
						'IFNULL( gg.finalgrade, "RESET" ), "||", '.
						'IFNULL( gg.timecreated, "Null" ), "||", '.
						'IFNULL( DATE_FORMAT( FROM_UNIXTIME( gg.timemodified ), "%W, %M %d, %Y, %h:%i %p" ), "Null" ) ) '.
						'ORDER BY itemname SEPARATOR "-|-" ) '.
				  	'FROM mdl_grade_grades gg '.
						'JOIN mdl_grade_items ii on ii.id = gg.itemid '.
					'WHERE gg.userid = g.userid './/AND ( '.$items.' ) '.
					'GROUP BY userid ) as items '.
			'FROM mdl_grade_grades g '.
				'JOIN mdl_user u ON u.id = g.userid '.
			'GROUP BY userid';
		return $q;
		
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
		
		/* syphon */
		$q .= ')';
		return $q;
		
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