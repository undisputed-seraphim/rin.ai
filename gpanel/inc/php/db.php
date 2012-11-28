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
			return false;
		
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
			return false;
		
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
	
	/* shortcut to grab a specific entry based on column value */
	public function get( $table, $column = "", $value = "", $limit = 0 ) {
		$limit = $limit === 0 ? '' : ' limit '.$limit;
		$where = $column === "" ? '' : ' where '.$column.' = "'.$value.'"';
		$query = 'select * from '.$table.$where.$limit.';';
		return $this->query( $query );
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
	
	public function get( $prop, $val ) {}
}

?>