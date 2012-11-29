<?php
/* db class to manage database operations */
class db {
	/* vars for the database connection */
	private $host = "",
			$user = "",
			$pass = "",
			$conn = "",
			$dbname = "";
	
	/* object state flags */
	private $connected = false,
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
	
	/* query function, returns associative array with results */
	public function query( $query, $new = false ) {
		if( !$this->ready )
			return "Not ready to run a query.";
		
		/* execute the query */
		$result = @mysqli_query( $this->conn, $query );
		if( !$result )
			return @mysqli_error();
		
		/* build associative array of results */
		$return = array();
		$i = 0;
		while( $row = $result->fetch_assoc() ) {
			$return[ $i ] = array();
			foreach( $row as $col => $val )
				$return[ $i ][ $col ] = $val;
			$i++;
		}
		//if( $new )
		//	return new query_result( $return );
		return $return;
	}
	
	/* create a premade query */
	public function prepare( $query, $params, $now ) {
		//$stmt = mysqli_stmt_init( $this->conn );
		$stmt = @mysqli_prepare( $this->conn, $query );
		if( !$stmt )
			return false;

		return new premade_query( $stmt, $params, $now );
	}
	
	/* shortcut to grab a specific entry based on column value */
	public function get( $table, $column = "", $value = "", $limit = 0 ) {
		$limit = $limit === 0 ? '' : ' limit '.$limit;
		$where = $column === "" ? '' : ' where '.$column.' = "'.$value.'"';
		$query = 'select * from '.$table.$where.$limit.';';
		return $this->query( $query );
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

	public $results = array();
	
	/* create a query object using a mysqli_stmt object */
	public function __construct( $stmt, $params = array(), $now = false ) {
		$this->stmt = $stmt;
		$this->meta = $stmt->result_metadata();
		
		/* if query will have results, get field names */
		if( $this->meta !== false )
			foreach( $this->meta->fetch_fields() as $field )
				$this->fields[] = $field->name;

		if( $now === true )
			return $this->execute( $params );
	}
	
	private function __destruct() { $this->stmt->close(); }
	
	/* execute a premade query and return results */
	public function execute( $params = array() ) {
		/* reset results and bind any passed parameters to the query, then execute */
		$this->results = array();
		$vals = array();
		$i = 0;
		foreach( $params as $type => $val ) {
			$this->stmt->bind_param( $type, $vals[ $i ] );
			$vals[ $i++ ] = $val;
		}
		$exec = $this->stmt->execute();
		if( !$exec )
			return false;
		
		/* if query does not have results, return success */
		if( $this->meta === false )
			return true;
		
		/* obtain resultset into an associative array as $this->results */
		$data = array();
		$res = array();
		foreach( $this->fields as $field )
			$res[ $field ] = &$data[ $field ];
		call_user_func_array( array( $this->stmt, "bind_result" ), $res );
		$acopy = create_function( '$a', 'return $a;' );
		while( $this->stmt->fetch() )
			$this->results[] = array_map( $acopy, $res );
		//print_r( $this );
		return $this->results;
	}
}

/* wrapper for query results to perform operations on obtained results */
class query_result {
	public $data = "";
	
	/* index result data */
	private $cols = array(),
			$vals = array();
	
	function __construct( $data = array() ) {
		$this->data = $data;
		foreach( $this->data as $i ) {
			foreach( $i as $col => $val ) {
				if( array_search( $col, $this->cols ) === false ) {
					$this->cols[] = $col;
					$this->vals[] = array();
				}
				$this->vals[ array_search( $col, $this->cols ) ][] = $val;
			}
		}
	}
	
	/* get specific results from result set */
	public function get( $prop, $val ) {}
}

?>