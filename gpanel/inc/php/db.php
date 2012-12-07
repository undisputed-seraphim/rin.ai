<?php
/* db class to manage database operations */
class db {
	/* vars for the database connection */
	private $host = "",
			$user = "",
			$pass = "",
			$conn = "",
			$dbname = "",
			$log_query = "";
	
	/* object state flags */
	public  $connected = false,
			$ready = false;
	
	/* constructor, allows for initializing mysql connection upon creation of object */
	function __construct( $host = "", $user = "", $pass = "", $dbname = "" ) {
		if( $host !== "" && $user !== "" )
			$this->connect( $host, $user, $pass );
		
		if( $dbname !== "" )
			$this->select_db( $dbname );
	}
	
	/* connect function, for connecting to mysql instance */
	public function connect( $host = "", $user = "", $pass = "" ) {
		$this->host = $host === "" ? $this->host : $host;
		$this->user = $user === "" ? $this->user : $user;
		$this->pass = $pass;
		
		/* attempt to connect to mysql */
		$this->conn = @mysqli_connect( $this->host, $this->user, $this->pass );
		if( !$this->conn ) {
			$this->connected = false;
			return @mysqli_connect_error();
		}

		/* successful, object is now 'connected' to mysql */
		$this->connected = true;
		return true;
	}
	
	/* select_db function, for selecting a database to work with in mysql */
	public function select_db( $name = "" ) {
		/* cannot select a database if not connected to mysql */
		if( !$this->connected )
			return "Not connected to a database.";
		
		/* attempt to select chosen database */
		$temp = @mysqli_select_db( $this->conn, $name );
		if( !$temp ) {
			$this->ready = false;
			return @mysqli_connect_error();
		}
		
		/* successful, object is now 'ready' for database queries */
		$this->dbname = $name;
		$this->ready = true;
		return true;
	}
	
	/* set name of the log table */
	public function set_log_info( $query = "", $params = array() ) {
		
	}
	
	/* create a prepared query */
	public function prepare( $query, $params = array(), $now = false, $log = false ) {
		if( !$this->connected || !$this->ready )
			return false;
		
		if( $query === null )
			return false;
		
		$stmt = @mysqli_prepare( $this->conn, $query );
		if( !$stmt )
			return false;

		return new premade_query( $stmt, $params, $now, $log );
	}
	
	/* shortcut to grab a specific entry based on column value */
	public function get( $table, $column = "", $value = "", $limit = 0, $log = false ) {
		if( !$this->connected || !$this->ready )
			return false;
			
		$limit = $limit === 0 ? '' : ' limit '.$limit;
		$where = $column === "" ? '' : ' where '.$column.' = ?';
		$query = 'select * from '.$table.$where.$limit.';';
		
		$res = $this->prepare( $query, array( "s" => $value ), true, $log );
		if( $res !== false )
			return $res->get();
		return $res;
	}
	
	/* make string valid sql string */
	public function clean_string( $str ) {
		if( !$this->connected )
			return $str;

		if( get_magic_quotes_gpc() )
			$str = stripslashes( $str );
		
		return @mysqli_real_escape_string( $this->conn, htmlentities( $str ) );
	}
	
	/* static functions useful for database operations */
	
	/* ensure that the given value is of type $type, where $type is a word defining the type */
	public static function ensure( $val, $type = "string" ) {
		switch( strtolower( $type ) ) {
			case "array": return is_array( $val );
			case "object": return is_object( $val );
			case "number": return is_numeric( $val );
			case "string": return is_string( $val );
			default: return false;
		}
	}
}

/* query object that contains all pieces of a mysql query */
class premade_query {
	private $stmt = "",
			$meta = "",
			$fields = array();

	/* array of query results */
	public  $results = array();
	
	/* create a query object using a mysqli_stmt object */
	public function __construct( $stmt, $params = array(), $now = false, $log = false ) {
		$this->stmt = $stmt;
		$this->meta = $stmt->result_metadata();
		
		/* if query will have results, get field names */
		if( $this->meta !== false )
			foreach( $this->meta->fetch_fields() as $field )
				$this->fields[] = $field->name;

		/* if query is desired to run immediately, return the result */
		if( $params === true )
			return $this->execute( $params, $now );
			
		if( $now === true )
			return $this->execute( $params, $log );
	}
	
	public function __destruct() { $this->stmt->close(); }
	
	/* execute a premade query and return results */
	public function execute( $params = array(), $log = false ) {
		/* reset results and bind any passed parameters to the query */
		$this->results = array();
		$vals = array();
		$i = 0;
		if( is_array( $params ) )
			foreach( $params as $type => $val ) {
				$this->stmt->bind_param( $type, $vals[ $i ] );
				$vals[ $i++ ] = $val;
			}
		
		/* execute query and obtain execution time in milliseconds */
		$msc = microtime( true );
		$exec = $this->stmt->execute();
		if( !$exec )
			return false;
		
		/* if query does not have results, return empty result object */
		if( $this->meta === false ) {
			$msc = ( microtime( true ) - $msc ) * 1000;
			return new query_result( $this->results, $msc );
		}
		
		/* obtain resultset into an associative array as $this->results */
		$data = array();
		$res = array();
		foreach( $this->fields as $field )
			$res[ $field ] = &$data[ $field ];
		call_user_func_array( array( $this->stmt, "bind_result" ), $res );
		$acopy = create_function( '$a', 'return $a;' );
		while( $this->stmt->fetch() )
			$this->results[] = array_map( $acopy, $res );
		
		$msc = ( microtime( true ) - $msc ) * 1000;
		return new query_result( $this->results, $msc );
	}
	
	public function get() { return $this->results; }
}

/* wrapper for query results to perform operations on obtained results */
class query_result {
	public  $data = "",
			$fields = array(),
			$exec_time = "";
	
	/* index result data for quicker searching */
	//private $cols = array(),
	//		$vals = array();
	
	/* create a query result from an array of data and an execution time */
	function __construct( $data = array(), $time = 0 ) {
		$this->data = $data;
		$this->exec_time = $time;
		
		if( count( $data ) > 0 )
			foreach( $data[0] as $k => $v )
				$this->fields[] = $k;
		/* index result data for use with ->get() */
		/*foreach( $this->data as $i ) {
			foreach( $i as $col => $val ) {
				if( array_search( $col, $this->cols ) === false ) {
					$this->cols[] = $col;
					$this->vals[] = array();
				}
				$this->vals[ array_search( $col, $this->cols ) ][] = $val;
			}
		}*/
	}
	
	/* get specific results from result set */
	public function get( $col = null, $val = null ) {
		/* if called with no arguments, return all result data */
		//if( $col === null )
			return $this->data;
		
		/* if a column only is specified, return array of values of that column */
		/*if( $val === null )
			return $this->vals[ array_search( $col, $this->cols ) ];*/
			
		/* if a column/value pair is specified, return results that include that pair */
		/*$res = array();
		$index = array_search( $col, $this->cols );
		foreach( $this->vals[ $index ] as $i => $value )
			if( $value === $val )
				$res[] = $this->data[ $i ];
		return $res;*/
	}
}

?>