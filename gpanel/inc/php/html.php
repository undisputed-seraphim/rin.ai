<?php
/* classes to keep track of html items */
class html {
	public static function table_from_result( $results = array(), $cols = array() ) {
		$table = new table();
		$table->from_result( $results, $cols );
		return $table;
	}
}

class table {
	public  $row_count,
			$col_count,
			$cols;
			
	private $exec_time = "";
			
	public function __construct() {}
	
	/* create table from a query_result object */
	public function from_result( $results = array(), $cols = array() ) {
		$this->exec_time = $results->exec_time;
		$tolower = create_function( '$a', 'return strtolower( $a );' );
		$fields = array_map( $tolower, $results->fields );
		
		if( count( $cols ) === 0 )
			$cols = $fields;
			
		else
			foreach( $cols as $i => $col )
				if( !in_array( $col, $fields ) )
					array_splice( $cols, $i, 1 );

		foreach( $results->data as $i => $result ) {
			$this->row_count++;
			foreach( $result as $k => $v ) {
				if( $i === 0 ) {
					if( in_array( strtolower( $k ), $cols ) ) {
						$this->col_count++;
						$this->cols[$k] = array();
					}
				}
				if( in_array( strtolower( $k ), $cols ) )
					$this->cols[$k][] = $v;				
			}
		}
	}
	
	/* add a column along with enough data to fill row height */
	public function add_col( $name = "No Name", $data = array() ) {
		$cols[$name] = $data;
	}

	/* return the html of the table, with attr attributes */
	public function html( $attr = array() ) {
		if( $this->col_count === 0 || $this->row_count === 0 )
			return '<table><tr><td>No Results</td></tr></table>';
			
		$html = '<table';
		foreach( $attr as $prop => $val )
			$html .= ' '.$prop.'="'.$val.'"';
		$html .= '>';
		
		for( $i = 0; $i < $this->row_count; $i++ ) {
			$html .= '<tr>';
			if( $i === 0 ) {
				$html .= '<thead>';
				foreach( $this->cols as $k => $v )
					$html .= '<th>'.ucwords( strtolower( $k ) ).'</th>';
				$html .= '</thead></tr><tr>';
			}
			foreach( $this->cols as $k => $v ) {
				$html .= '<td class="'.(($i+1) % 2 == 0 ? "even" : "odd").'">'.$v[$i].'</td>';
			}
			$html .= '</tr>';
		}
		$html .= '<tr><td class="time" colspan="'.$this->col_count.'">results obtained in '.$this->exec_time.' ms</td></tr>';
		$html .= '</table>';
		return $html;
	}
}