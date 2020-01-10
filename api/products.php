<?php
class Products {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function get_products_list(): array {
        $products_list = [];
        $query = $this->db->query( "SELECT * FROM products" );

        while ( $row = $this->db->fetch_assoc( $query ) ) {
            $products_list[] = array(
                'productId' => $row['id'],
                'productName' => $row['name'],
                'productImage' => $row['image'],
                'productPrice' => $row['price'],
                'productCat' => $row['category']
            );
        }

        return $products_list;
    }

    public function get_categories_list(): array {
        $categories_list = [];
        $query = $this->db->query( "SELECT * FROM categories" );

        while ( $row = $this->db->fetch_assoc( $query ) ) {
            $categories_list[] = array(
                'catId' => $row['id'],
                'catName' => $row['name']
            );
        }

        return $categories_list;
    }

    public function get_product_by_id( string $product_id ): array {
        $product = [];
        $query = $this->db->query( "SELECT * FROM products WHERE id='$product_id'" );
        $row = $this->db->fetch_assoc( $query );

        $product['productId'] = $row['id'];
        $product['productName'] = $row['name'];
        $product['productImage'] = $row['image'];
        $product['productPrice'] = $row['price'];
        $product['productCat'] = $row['category'];

        return $product;
    }

    public function get_products_by_category( string $category_name ): array {
        $products_list = [];
        $query = $this->db->query( "SELECT * FROM products WHERE category='$category_name'" );

        while ( $row = $this->db->fetch_assoc( $query ) ) {
            $products_list[] = array(
                'productId' => $row['id'],
                'productName' => $row['name'],
                'productImage' => $row['image'],
                'productPrice' => $row['price'],
                'productCat' => $row['category']
            );
        }

        return $products_list;
    }
}
