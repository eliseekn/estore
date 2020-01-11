<?php
class Users {
    private $db;
    private $products;

    public function __construct() {
        $this->db = new Database();
        $this->products = new Products();
    }

    public function login( string $phone, string $password ): array {
        $query = $this->db->query( "SELECT * FROM users WHERE phone='$phone' AND password='$password'" );
        $rows = $this->db->rows_count( $query );

        if ( $rows == 1 ) {
            return $this->db->fetch_assoc( $query );
        } else {
            return array();
        }
    }

    public function register( string $username, string $phone, string $password, string $email, string $street ): bool {
        $infos = $this->login( $phone, $password );

        if ( !empty( $infos ) ) {
            return false;
        } else {
            $username = $this->db->escape_string( $username );
            $phone = $this->db->escape_string( $phone );
            $password = $this->db->escape_string( $password );
            $email = $this->db->escape_string( $email );
            $street = $this->db->escape_string( $street );

            $this->db->query( "INSERT INTO users(username, email, phone, street, password, products_id) 
                VALUES ('$username', '$email', '$phone', '$street', '$password', '')" );
            return true;
        }
    }

    public function get_cart( string $phone ): array {
        $cart_products = [];
        $query = $this->db->query( "SELECT * FROM users WHERE phone='$phone'" );
        $row = $this->db->fetch_assoc( $query );
        $products_id = explode( ',', $row['products_id'] );

        foreach ( $products_id as $product_id ) {
            $cart_products[] = $this->products->get_product_by_id( $product_id );
        }

        return $cart_products;
    }

    public function update_cart( $cart_products, string $phone ) {
        $products_id = implode( ',', $cart_products );
        $products_id = $this->db->escape_string( $products_id );
        $this->db->query( "UPDATE users SET products_id='$products_id' WHERE phone='$phone'" );
    }
}
