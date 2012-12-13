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
	
	/* merge two query_result objects */
	public static function result_merge( $res1, $res2 ) {
		
	}
	
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
		$tmp = array();
		$types = "";
		$i = 0;
		if( is_array( $params ) ) {
			if( count( $params ) > 0 ) {
				foreach( $params as $param )
					foreach( $param as $type => $val )
						$types .= $type;
				$tmp[] = $types;
				foreach( $params as $param )
					foreach( $param as $type => $val ) {
						$bind_name = 'vals['.$i++.']';
            	    	$$bind_name = $val;
               			$tmp[] = &$$bind_name;
					}
				call_user_func_array( array( $this->stmt, "bind_param"), $tmp );
			}
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
	
	/* create a query result from an array of data and an execution time */
	function __construct( $data = array(), $time = 0 ) {
		$this->data = $data;
		$this->exec_time = $time;
		
		if( count( $data ) > 0 )
			foreach( $data[0] as $k => $v )
				$this->fields[] = $k;
			return;
	}
	
	/* get specific results from result set */
	public function get( $col = null, $val = null, $res = null ) {
		if( $res === null )
			$res = $this->data;
			
		if( $col === null )
			return $this->data;

		$return = array();
		foreach( $res as $i => $result )
			foreach( $result as $k => $v )
				if( strtolower( $col ) == strtolower( $k ) )
					if( strtolower( $v ) == strtolower( $val ) )
						$return[] = $res[ $i ];
		if( count( $return ) === 0 )
			return false;
		return $return;
	}
	
	/* group results into associative array by column value */
	public function group_by( $format = "null", $params = array() ) {
		if( count( $params ) === 0 || strpos( $format, "?" ) === false )
			return false;
		
		if( count( $params ) !== substr_count( $format, "?" ) )
			return false;
			
		foreach( $params as $param )
			if( !in_array( strtolower( $param ), $this->fields ) )
				return false;
		
		$res = array();
		foreach( $this->data as $i => $result ) {
			/* replace "?"s with paramaters at same index */
			$cur = $format;
			foreach( $params as $param )
				$cur = substr_replace( $cur, $result[ $param ], strpos( $cur, "?" ), 1 );
			
			if( !isset( $res[ $cur ] ) )
				$res[ $cur ] = array();
			$res[ $cur ][] = $result;
		}
		
		return $res;
	}
}

?>