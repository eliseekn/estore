<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>eStore</title>

        <meta name="author" content="eliseekn">
        <meta name="description" content="Shopping cart template with jQuery,Bootstrap(frontend) et PHP/MySQL (backend)">
        <meta name="keywords" content="ecommerce,shopping cart,shop">

        <link rel="stylesheet" href="vendor/bootstrap-4.4.1-dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="vendor/fontawesome-5.11.2/css/all.min.css">

        <style type="text/css">
            nav li {
                font-size: 1.3rem;
                padding-right: .3em;
            }

            h4, .title {
                font-weight: bold;
            }

            hr {
                width: 100px;
                border-width: 5px;
                margin: 0;
                border-radius: 50px;
            }

            li input[type=number] {
                width: 60px;
            }

            .cart-price {
                font-weight: bold !important;
            }

            .current-page {
                background-color: #343a40;
                color: white !important;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div class="container">
                <a class="navbar-brand" href="#">eStore</a>

                <ul class="navbar-nav ml-auto">

                <?php
                session_start();

                if ( isset( $_SESSION['phone'] ) && isset( $_SESSION['username'] ) ) {
                ?>

                    <div class="dropdown">
                        <a href="" class="nav-link dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <li class="fas fa-user"></li>
                            <span data-user-phone="<?php echo $_SESSION['phone'] ?>" id="user"><?php echo $_SESSION['username'] ?></span>
                        </a>

                        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <a class="dropdown-item" href="logout.php">
                                <li class="fas fa-sign-out-alt"></li>
                                <span>Déconnexion</span>
                            </a>
                        </div>
                    </div>

                <?php } else { ?>
                    <a href="login.html" class="nav-link">
                        <li class="fas fa-sign-in-alt"></li>
                        <span>Connexion</span>
                    </a>
                <?php } ?>

                    <a href="" class="nav-link" id="cart-button" data-toggle="modal" data-target="#exampleModalCenter">
                        <li class="fas fa-shopping-cart"></li>
                        <span>Panier (<span class="cart-count">0</span>)</span>
                    </a>
                </ul>
            </div>
        </nav>

        <section class="container my-5">
            <div class="row">
                <div class="col-lg-3">
                    <h4 class="mt-5 text-dark">Rechercher</h4>
                    <hr class="bg-dark mb-4">

                    <div class="form-group">
                        <input type="search" class="form-control" placeholder="Nom du produit" id="search">
                    </div>

                    <h4 class="mt-5 text-dark">Catégories</h4>
                    <hr class="bg-dark mb-4">
                    <div class="card">
                        <ul class="list-group list-group-flush" id="categories-list"></ul>
                    </div>
                </div>

                <div class="col-lg-9">
                    <h4 class="mt-5 text-dark" id="products-list-title">Tous les produits</h4>
                    <hr class="bg-dark mb-4">

                    <div class="card-columns" id="products-list"></div>

                    <nav class="my-4">
                        <ul class="pagination"></ul>
                    </nav>
                </div>
            </div>
        </section>

        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white px-3">
                        <h5 class="modal-title">Votre panier (<span class="cart-count">0</span>)</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <li class="fas fa-times"></li>
                        </button>
                    </div>

                    <div class="modal-body">
                        <ul class="list-group list-group-flush" id="cart-products-list"></ul>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-dark disabled">Coût total: <span id="cart-price"></span> FCFA</button>
                        <button type="button" class="btn btn-danger" id="clear-cart">Tout retirer</button>
                        <button type="button" class="btn btn-success">Passer la commande</button>
                    </div>
                </div>
            </div>
        </div>

        <script type="text/javascript" src="vendor/jquery-3.4.1.min.js"></script>
        <script type="text/javascript" src="vendor/popper.min.js"></script>
        <script type="text/javascript" src="vendor/bootstrap-4.4.1-dist/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="assets/js/app.js"></script>
    </body>
</html>
