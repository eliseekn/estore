<?php
class Products {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    private function get_products_count( string $category ): int {
        if ( empty( $category ) ) {
            $query = $this->db->query( "SELECT * FROM products" );
        } else {
            $query = $this->db->query( "SELECT * FROM products WHERE category='$category'" );
        }

        return $this->db->rows_count( $query );
    }

    private function paginate( string $category, int $page ): array {
        $items_per_pages = 3;
        $total_pages = ceil( $this->get_products_count( $category ) / $items_per_pages );

        if ( $page < 1 ) {
			$page = 1;
		} elseif ( $page > $total_pages ) {
			$page = $total_pages;
		}

        $first_item = ($page - 1) * $items_per_pages;

        return array( $first_item, $items_per_pages, $total_pages );
    }

    public function get_products_list( string $category, int $page ): array {
        $products_list = [];
        $paginate = $this->paginate( $category, $page );
        
        if ( empty( $category ) ) {
            $query = $this->db->query( "SELECT * FROM products ORDER BY id DESC LIMIT $paginate[0], $paginate[1]" );
        } else {
            $query = $this->db->query( "SELECT * FROM products WHERE category='$category' ORDER BY id DESC LIMIT $paginate[0], $paginate[1]" );
        }

        while ( $row = $this->db->fetch_assoc( $query ) ) {
            $products_list[] = array(
                'productId' => $row['id'],
                'productName' => $row['name'],
                'productImage' => $row['image'],
                'productPrice' => $row['price'],
                'productCat' => $row['category']
            );
        }

        return array(
            'products_list' => $products_list,
            'page' => $page,
            'total_pages' => $paginate[2],
            'first_item' => $paginate[0]
        );
    }

    public function get_categories_list(): array {
        $categories_list = [];
        $query = $this->db->query( "SELECT * FROM categories ORDER BY name ASC" );

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
}
