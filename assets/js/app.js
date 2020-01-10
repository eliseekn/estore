let cartProducts = [];

function updateCartProductsCount() {
    $(".cart-products-count").each(function(i, el) {
        $(el).text(cartProducts.length);
    });
}

function updateCartPrice() {
    let totalPrice = 0;

    $(".cart-price").each(function(i, el) {
        totalPrice += Number($(el).text());
    });

    $("#cart-price").text(totalPrice);
}

function getUserPhone() {
    let userId = document.querySelector("#user");
    let userPhone = userId.dataset.userPhone;
    return userPhone;
}

function getProductsList(productsCat) {
    $.ajax({
        url: '././api/router.php',
        type: 'post',
        data: {
            products: 'products',
            category: productsCat
        },
        success: function(productsList) {
            let productsCard = '';

            productsList.forEach(product => {
                productsCard += `
                    <div class="card mb-4 shadow product-card">
                        <img src="${product.productImage}" class="card-img-top">
                        <div class="card-body text-center">
                            <h5 class="card-title font-weight-bold">${product.productPrice} FCFA</h5>
                            <p class="card-text product-name">${product.productName}</p>
                            <a href="#"
                                class="btn btn-dark add-to-cart"
                                data-product-id="${product.productId}"
                                data-product-name="${product.productName}"
                                data-product-price="${product.productPrice}"
                                data-product-cat="${product.productCat}">Ajouter au panier</a>
                        </div>
                    </div>
                `;
            });

            $("#products-list").html(productsCard);

            if (productsCat === "") {
                $("#products-list-title").text("Tous les produits");
            } else {
                $("#products-list-title").text(productsCat);
            }

            $(".add-to-cart").each(function(i, el) {
                $(el).click(function(e) {
                    e.preventDefault();

                    let productId = this.dataset.productId;
                    let productName = this.dataset.productName;
                    let productPrice = this.dataset.productPrice;
                    let productCat = this.dataset.productCat;

                    let inCart = cartProducts.find(item => item.id === productId);
                    if (!inCart) {
                        cartProducts.push({ productId, productName, productPrice, productCat });
                        updateCartProductsCount();

                        $(this).text('Déjà dans le panier!');
                        $(this).addClass('disabled');
                    }
                    
                    _updateCartProducts();
                });
            });
        }
    });
}

function getCategoriesList() {
    $.ajax({
        url: '././api/router.php',
        type: 'post',
        data: { categories: 'categories' },
        success: function(categoriesList) {
            let categoriesCard = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <a href="#" class="text-dark categories-list" data-cat-name="">Tous les produits</a>
                </li>
            `;

            categoriesList.forEach(cat => {
                categoriesCard += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <a href="#" class="text-dark categories-list" data-cat-name="${cat.catName}">${cat.catName}</a>
                    </li>
                `;
            });

            $("#categories-list").html(categoriesCard);

            $(".categories-list").each(function(i, el) {
                $(el).click(function(e) {
                    e.preventDefault();

                    let catName = this.dataset.catName;
                    getProductsList(catName);
                    updateCartProducts();
                });
            });
        }
    });
}

function getCartProducts() {
    $.ajax({
        url: '././api/router.php',
        type: 'post',
        data: {
            cart_products: 'cart_products',
            user_phone: getUserPhone()
        },
        success: function(_cartProducts) {
            _cartProducts.forEach(item => {
                let productId = item.productId;
                let productName = item.productName;
                let productPrice = item.productPrice;
                let productCat = item.productCat;

                $(".add-to-cart").each(function(i, el) {
                    let _productId = el.dataset.productId;
                    if (_productId === productId) {
                        $(this).text('Déjà dans le panier!');
                        $(this).addClass('disabled');
                    }
                });
                
                cartProducts.push({ productId, productName, productPrice, productCat });
                updateCartProductsCount();
            });
        }
    });
}

function updateCartProducts() {
    $.ajax({
        url: '././api/router.php',
        type: 'post',
        data: {
            cart_products: 'cart_products',
            user_phone: getUserPhone()
        },
        success: function(_cartProducts) {
            _cartProducts.forEach(item => {
                let productId = item.productId;
                let productName = item.productName;
                let productPrice = item.productPrice;
                let productCat = item.productCat;

                $(".add-to-cart").each(function(i, el) {
                    let _productId = el.dataset.productId;
                    if (_productId === productId) {
                        $(this).text('Déjà dans le panier!');
                        $(this).addClass('disabled');
                    }
                });
            });
        }
    });
}

function _updateCartProducts() {
    let ProductsId = cartProducts.map(item => {
        return item.productId;
    });

    ProductsId = JSON.stringify(ProductsId);

    $.ajax({
        url: '././api/router.php',
        type: 'post',
        data: {
            cart_products: 'cart_products',
            user_phone: getUserPhone(),
            products_id: ProductsId
        }
    });
}

$(function() {
    getProductsList('');
    getCategoriesList();
    getCartProducts();

    $("#cart-button").click(function(e) {
        e.preventDefault();

        let itemsCard = '';

        cartProducts.forEach(item => {
            itemsCard += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <p>${item.productName} (<span class="cart-price" data-product-id="${item.productId}">${item.productPrice}</span> FCFA)</p>
                    <div class="form-group row align-items-center">
                        <span>Quantité</span>
                        <div class="col">
                            <input type="number" class="form-control cart-item-amount" value="1" min="1" data-product-price="${item.productPrice}" data-product-id="${item.productId}">
                        </div>
                        <button type="button" class="btn btn-danger remove-from-cart" data-product-id="${item.productId}">Retirer</button>
                    </div>
                </li>
            `;
        });

        $("#cart-products-list").html(itemsCard);

        $(".remove-from-cart").each(function(i, el) {
            $(el).click(function(e) {
                e.preventDefault();

                let cartItem = $(this).parent().parent();
                cartItem.remove();

                let productId = this.dataset.productId;
                let inCart = cartProducts.find(item => item.id === productId);
                let j = cartProducts.findIndex(item => item.id === productId);

                cartProducts.splice(j, 1);

                $(".add-to-cart").each(function(i, el) {
                    let _productId = el.dataset.productId;

                    if (_productId === productId) {
                        $(el).text('Ajouter au panier');
                        $(el).removeClass('disabled');
                    }
                });

                _updateCartProducts();
                updateCartProductsCount();
                updateCartPrice();
            });
        });

        $(".cart-item-amount").each(function(i, el) {
            $(el).change(function() {
                let productId = this.dataset.productId;
                let itemPrice = this.dataset.productPrice;
                let totalPrice = itemPrice * $(this).val();

                $(".cart-price").each(function(i, el) {
                    let _productId = el.dataset.productId;
                    if (_productId === productId) {
                        $(el).text(totalPrice);
                    }
                });

                updateCartProductsCount();
                updateCartPrice();
            });
        });

        updateCartPrice();
    });

    $("#clear-cart").click(function(e) {
        e.preventDefault();

        $(".remove-from-cart").each(function(i, el) {
            $(el).click();
        });

        _updateCartProducts();
        updateCartPrice();
    });

    $('#search').keyup(function() {
        let searchItem = $(this).val().toUpperCase();

        $(".product-name").each(function(i, el) {
            if ($(el).text().toUpperCase().indexOf(searchItem) > -1) {
                $(el).parent().parent().css("display", "flex");
            } else {
                $(el).parent().parent().css("display", "none");
            }
        });
    });
});
