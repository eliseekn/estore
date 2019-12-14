<?php

header('Content-Type: application/json');

define('DB_HOST', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'eliseekn');
define('DB_NAME', 'estore');

class Database {
    private $db_connection;

    public function __construct() {
        $this->db_connection = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
    }

    public function get_products_list($product_cat) {
        $products = [];

        if (empty($product_cat)) {
            $query = mysqli_query($this->db_connection, "SELECT * FROM store");
        } else {
            $query = mysqli_query($this->db_connection, "SELECT * FROM store WHERE product_cat='$product_cat'");
        }

        if (!$query) {
			die(mysqli_error($this->db_connection));
		}

        while ($product = mysqli_fetch_assoc($query)) {
            $products[] = array(
                'productId' => $product['id'],
                'productName' => $product['product_name'],
                'productImage' => $product['product_image'],
                'productPrice' => $product['product_price']
            );
        }

        return $products;
    }

    private function get_product_by_id($product_id) {
        $query = mysqli_query($this->db_connection, "SELECT * FROM store WHERE id='$product_id'");
        $product = mysqli_fetch_assoc($query);

        return array(
            'productId' => $product['id'],
            'productName' => $product['product_name'],
            'productImage' => $product['product_image'],
            'productPrice' => $product['product_price']
        );
    }

    public function get_products_list_count($product_cat) {
        if (empty($product_cat)) {
            $query = mysqli_query($this->db_connection, "SELECT * FROM store");
        } else {
            $query = mysqli_query($this->db_connection, "SELECT * FROM store WHERE product_cat='$product_cat'");
        }

        if (!$query) {
			die(mysqli_error($this->db_connection));
		}

        $products_count = mysqli_num_rows($query);
        return $products_count;
    }

    public function get_user_cart_items($user_email) {
        $cart_items = [];
        $query = mysqli_query($this->db_connection, "SELECT * FROM users WHERE email='$user_email'");

        if (!$query) {
			die(mysqli_error($this->db_connection));
		}

        $user = mysqli_fetch_assoc($query);
        $products_id = explode(',', $user['cart_products_id']);

        foreach ($products_id as $product_id) {
            $cart_items[] = $this->get_product_by_id($product_id);
        }

        return $cart_items;
    }
}

$data = [];
$db = new Database();

if (isset($_POST['products_list'])) {
    if (!isset($_POST['product_cat'])) {
        $data = $db->get_products_list("");
    } else {
        $product_cat = $_POST['product_cat'];

        if (!empty($product_cat)) {
            $data = $db->get_products_list($product_cat);
        }
    }
} else if (isset($_POST['products_count'])) {
    if (!isset($_POST['product_cat'])) {
        $data = array(
            'products_count' => $db->get_products_list_count("")
        );
    } else {
        $product_cat = $_POST['product_cat'];

        if (!empty($product_cat)) {
            $data = array(
                'products_count' => $db->get_products_list_count($product_cat)
            );
        }
    }
} else if (isset($_POST['user_cart_items'])) {
    if (isset($_POST['user_email'])) {
        $user_email = $_POST['user_email'];

        if (!empty($user_email)) {
            $data = $db->get_user_cart_items($user_email);
        }
    }
}

echo json_encode($data);
