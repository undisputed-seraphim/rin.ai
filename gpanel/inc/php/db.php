<?php
/* db class to manage database operations */
class db {
	/* vars for the database connection */
	public  $host = "",
			$user = "",
			$pass = "",
			$conn = "",
			$dbname = "",
			$mysqli = false;
	
	/* object state flags */
	public  $connected = false,
			$ready = false;
	
	/* constructor, allows for initializing mysql connection upon creation of object */
	function __construct( $host = "", $user = "", $pass = "", $dbname = "" ) {
		$this->mysqli = function_exists( "mysqli_connect" );

		if( $host !== "" && $user !== "" )
			$this->connect( $host, $user, $pass );
		
		if( $dbname !== "" )
			$this->select_db( $dbname );
	}
	
	/* close the db connection */
	function __destruct() {
		if( $this->connected )
			$this->conn->close();
	}
	
	/* connect function, for connecting to mysql instance */
	public function connect( $host = "", $user = "", $pass = "" ) {
		$this->host = $host === "" ? $this->host : $host;
		$this->user = $user === "" ? $this->user : $user;
		$this->pass = $pass;
		
		/* attempt to connect to mysqlii */
		if( $this->mysqli ) {
			$this->conn = @mysqli_connect( $this->host, $this->user, $this->pass );
			if( !$this->conn ) {
				$this->connected = false;
				return @mysqli_connect_error();
			}
		/* or use regular mysql */
		} else {
			$this->conn = @mysql_connect( $this->host, $this->user, $this->pass );
			if( !$this->conn ) {
				$this->connected = false;
				return @mysql_error( $this->conn );
			}
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
			return @mysqli_error( $this->conn );
		}
		
		/* successful, object is now 'ready' for database queries */
		$this->dbname = $name;
		$this->ready = true;
		return true;
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
		
		if( $this->mysqli )
			return @mysqli_real_escape_string( $this->conn, htmlentities( $str ) );
		return @mysql_real_escape_string( htmlentities( $str ) );
	}
	
	/* plain and simple, run a query and return query_result object with results. */
	//WARNING: DO NOT USE FOR QUERIES WITH USER PROVIDED INFO. exploitable.
	public function query( $q ) {
		$msc = microtime( true );
		if( $this->mysqli ) {
			$result = @mysqli_query( $this->conn, $q );
			$msc = ( microtime( true ) - $msc ) * 1000;
			if( !$result )
				return false;
			$res = new query_result( $result, $msc );
			$result->close();
			return $res;
		}
	}
	
	/* bit_query constructors for each sql statement type */
	public function select( $what = array() ) {
		$bquery = new bit_query( $this, "select" );
		if( count( $what ) === 0 || $what === "" )
			$what = "*";
		$bquery->setWhat( $what );
			
		return $bquery;
	}
	
	public function update( $table = "" ) { }
	public function insert( $table = "" ) { }
	public function create_table( $table = "" ) { }
}

/* object used to create queries on the fly but still use mysqli's prepared queries */
class bit_query {
	private $db,
			$has_errors = 0,
			$errors = array(),
			
			$qstr = "",
			$query = false,
			$params = array(),
			
			$type = "",
			$what = "",
			$from = "",
			$where = "";			
	
	public function __construct( $db, $type = "select" ) {
		$this->db = $db;
		$this->type = $type;
	}
	
	public function __call( $method, $args ) {
		/* allow the use of convenience keywords */
		if( $method === "or" )
			return call_user_func_array( array( $this, "_or" ), $args );
		if( $method === "and" )
			return call_user_func_array( array( $this, "_and" ), $args );
			
		return parent::__call( $method, $args );
	}
	public function __destruct() { }
	
	public function setWhat( $what = "*" ) { $this->what = $what; }
	
	public function from( $table = "" ) {
		if( $table === "" ) {
			$this->has_errors = 1;
			$this->errors[] = "No table selected.";
		}
		$this->from .= $table;
		return $this;
	}
	
	public function join( $table = "" ) {
	}
	
	public function on( $col = "" ) {
	}
	
	public function where( $col = "" ) {
		$this->where .= $col;
		return $this;
	}
	
	public function equals( $val = null ) {
		$this->where .= " = ?";
		$this->params[] = array( "s" => $val );
		return $this;
	}
	
	public function _and( $col = "" ) {
		$this->where .= ' AND '.$col;
		return $this;
	}
	
	public function _or( $col = "" ) {
		$this->where .= ' OR '.$col;
		return $this;
	}
	
	public function execute( $params = array() ) {
		switch( $this->type ) {
			case "select":
				$this->qstr = 'SELECT '.$this->what.' FROM '.$this->from;
				if( $this->where !== "" )
					$this->qstr .= ' WHERE '.$this->where;
				$this->query = $this->db->prepare( $this->qstr );
				break;
		}
		
		if( !$this->query )
			return false;
		
		if( count( $params ) > 0 )
			$this->params = $params;
		return $this->query->execute( $this->params );
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
			$exec_time = "",
			$rows = 0;
	
	/* create a query result from an array of data and an execution time */
	function __construct( $data = array(), $time = 0 ) {
		if( gettype( $data ) !== "array" ) {
			$res = array();
			while( $row = @mysqli_fetch_assoc( $data ) )
				$res[] = $row;
			$data = $res;
		}
		
		$this->data = $data;
		$this->exec_time = $time;
		$this->rows = count( $data );
		
		if( $this->rows )
			foreach( $data[0] as $k => $v )
				$this->fields[] = $k;
			return;
	}
	
	/* get specific results from result set */
	public function get( $col = null, $val = null, $res = null ) {
		if( $col === null )
			return $this->data;
			
		if( $res === null )
			$res = $this->data;
			
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
	public function group_by( $format = null, $params = array() ) {
		if( strpos( $format, "?" ) === false && $format !== null ) {
			$data = $this->data;
			if( count( $params ) > 0 )
				$data = $params;
			$res = array();
			foreach( $data as $i => $result ) {
				$cur = $result["type"];
				if( !isset( $res[ $cur ] ) )
					$res[$cur] = array();
				$res[$cur][] = $result;
			}
			return $res;
		}
		
		if( strpos( $format, "?" ) === false )
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
	
	/* return limited set of data */
	public function limit( $n = 100 ) {
		return new query_result( array_splice( $this->data, 100 ), $this->exec_time );
	}
}

?>