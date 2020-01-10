<?php
define('DB_HOST', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'eliseekn');
define('DB_NAME', 'estore');

class Database {
    private $connection;

    public function __construct() {
        $this->connection = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
        mysqli_set_charset($this->connection, "utf8");
    }

    public function escape_string( string $str ): string {
        return mysqli_real_escape_string( $this->connection, $str );
	}

    public function query( string $query ) {
        return mysqli_query( $this->connection, $query );
    }

    public function fetch_assoc( $query ) {
        return mysqli_fetch_assoc( $query );
    }

    public function fetch_row( $query ) {
        return mysqli_fetch_row( $query );
    }
}
