<?php
header('Content-Type: application/json');

require 'database.php';
require 'products.php';
require 'users.php';

class Router {
    private $data = [];
    private $products;
    private $users;

    public function __construct() {
        $this->products = new Products();
        $this->users = new Users();
    }

    public function run() {
        if ( isset( $_POST['products'] ) ) {
            if ( isset( $_POST['category'] ) && !empty( $_POST['category'] ) ) {
                $this->data = $this->products->get_products_by_category( $_POST['category'] );
            } else {
                $this->data = $this->products->get_products_list();
            }
        } else if ( isset( $_POST['categories'] ) ) {
            $this->data = $this->products->get_categories_list();
        } else if ( isset($_POST['cart_products'] ) ) {
            if ( isset( $_POST['user_phone'] ) ) {
                $this->data = $this->users->get_cart_products( $_POST['user_phone'] );
                
                if ( isset( $_POST['products_id'] ) ) {
                    $this->users->update_cart_products( json_decode( $_POST['products_id'] ), 
                        $_POST['user_phone'] );
                }
            }
        } else if ( $_POST['login'] ) {
            if ( isset( $_POST['user_phone'] ) && isset( $_POST['user_password'] ) ) {
                if ( $this->users->login( $_POST['user_phone'], $_POST['user_password'] ) ) {
                    $this->data = array( 'login' => true );
                } else {
                    $this->data = array( 'login' => false );
                }
            }
        }  else if ( $_POST['register'] ) {
            if ( isset( $_POST['name'] ) && isset( $_POST['phone'] ) && isset( $_POST['password'] ) )  {
                if ( $this->users->register( $_POST['name'], $_POST['phone'], $_POST['password'] ) ) {
                    $this->data = array( 'register' => true );
                } else {
                    $this->data = array( 'register' => false );
                }
            }
        }

        echo json_encode( $this->data );
    }
}

$router = new Router();
$router->run();
