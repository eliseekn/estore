<?php
class Users {
    private $db;
    private $products;

    public function __construct() {
        $this->db = new Database();
        $this->products = new Products();
    }

    public function login( string $phone, string $password ): bool {
        $query = $this->db->query( "SELECT * FROM users WHERE phone='$phone' AND password='$password'" );
        $row = $this->db->fetch_row( $query );
        return $row[0] >= 1 ? true : false;
    }

    public function register( string $name, string $phone, string $password ) {
        if ( $this->login( $phone, $password ) ) {
            return false;
        } else {
            $name = $this->db->escape_string( $name );
            $phone = $this->db->escape_string( $phone );
            $password = $this->db->escape_string( $password );

            return $this->db->query( "INSERT INTO users VALUES ('$name', '$phone', '$password')" );
        }
    }

    public function get_cart_products( string $phone ): array {
        $cart_products = [];
        $query = $this->db->query( "SELECT * FROM users WHERE phone='$phone'" );
        $row = $this->db->fetch_assoc( $query );
        $products_id = explode( ',', $row['products_id'] );

        foreach ( $products_id as $product_id ) {
            $cart_products[] = $this->products->get_product_by_id( $product_id );
        }

        return $cart_products;
    }

    public function update_cart_products( $cart_products, string $phone ) {
        $products_id = implode( ',', $cart_products );
        $products_id = $this->db->escape_string( $products_id );
        $this->db->query( "UPDATE users SET products_id='$products_id' WHERE phone='$phone'" );
    }
}
