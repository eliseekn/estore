let cartProducts = [];
let userConnected = false;

function updateCartCount() {
    $(".cart-count").each(function(i, el) {
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

function getProductsList(productsCat, page) {
    $.ajax({
        url: '././api/router.php',
        type: 'post',
        data: {
            products_list: 'products_list',
            category: productsCat,
            page: page
        },
        success: function(data) {
            let productsCard = '';
            let productsList = data.products_list;
            let page = data.page;
            let total_pages = data.total_pages;
            let first_item = data.first_item;

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

            let paginationHTML = '';

            if (page != first_item + 1) {
                paginationHTML += `
                    <a class="page-link text-dark" href="#" data-page-id="${page - 1}">Précédent</a>
                `;
            }

            if (total_pages > 1) {
                for (let i = 1; i <= total_pages; i++) {
                    if (i === page) {
                        paginationHTML += `<a class="page-link text-dark current-page" href="#" data-page-id="${i}">${i}</a>`;
                    } else {
                        paginationHTML += `<a class="page-link text-dark" href="#" data-page-id="${i}">${i}</a>`;
                    }
                }
            }

            if (page != total_pages) {
                paginationHTML += `
                    <a class="page-link text-dark" href="#" data-page-id="${page + 1}">Suivant</a>
                `;
            }

            $(".pagination").html(paginationHTML);

            $(".page-link").each(function(i, el) {
                $(el).click(function(e) {
                    e.preventDefault();
        
                    let pageId = this.dataset.pageId;
                    let catName = $("#products-list-title").text();
        
                    if (catName == "Tous les produits") {
                        catName = "";
                    }
        
                    getProductsList(catName, pageId);
                    updateCart();
                });
            });

            if (productsCat === "") {
                $("#products-list-title").text("Tous les produits");
            } else {
                $("#products-list-title").text(productsCat);
            }

            $(".add-to-cart").each(function(i, el) {
                $(el).click(function(e) {
                    e.preventDefault();

                    if (!userConnected) {
                        window.location.href = "login.html";
                    } else {
                        let productId = this.dataset.productId;
                        let productName = this.dataset.productName;
                        let productPrice = this.dataset.productPrice;
                        let productCat = this.dataset.productCat;

                        let inCart = cartProducts.find(item => item.id === productId);
                        if (!inCart) {
                            cartProducts.push({ productId, productName, productPrice, productCat });
                            updateCartCount();

                            $(this).text('Déjà dans le panier!');
                            $(this).addClass('disabled');
                        }
                        
                        _updateCart();
                    }
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
                    getProductsList(catName, 1);
                    updateCart();
                });
            });
        }
    });
}

function getCart() {
    $.ajax({
        url: '././api/router.php',
        type: 'post',
        data: {
            cart: 'cart',
            user_phone: getUserPhone()
        },
        success: function(_cartProducts) {
            _cartProducts.forEach(item => {
                let productId = item.productId;

                $(".add-to-cart").each(function(i, el) {
                    if (el.dataset.productId === productId) {
                        $(this).text('Déjà dans le panier!');
                        $(this).addClass('disabled');
                    }
                });
                
                if (productId != null) {
                    let productName = item.productName;
                    let productPrice = item.productPrice;
                    let productCat = item.productCat;
                    
                    cartProducts.push({ productId, productName, productPrice, productCat });
                    updateCartCount();
                }
            });
        }
    });
}

function updateCart() {
    $.ajax({
        url: '././api/router.php',
        type: 'post',
        data: {
            cart: 'cart',
            user_phone: getUserPhone()
        },
        success: function(_cartProducts) {
            _cartProducts.forEach(item => {
                let productId = item.productId;

                $(".add-to-cart").each(function(i, el) {
                    if (el.dataset.productId === productId) {
                        $(this).text('Déjà dans le panier!');
                        $(this).addClass('disabled');
                    }
                });
            });
        }
    });
}

function _updateCart() {
    let ProductsId = cartProducts.map(item => {
        return item.productId;
    });

    ProductsId = JSON.stringify(ProductsId);

    $.ajax({
        url: '././api/router.php',
        type: 'post',
        data: {
            cart: 'cart',
            user_phone: getUserPhone(),
            products_id: ProductsId
        }
    });
}

function checkUserSession() {
    $.ajax({
        url: '././api/router.php',
        type: 'post',
        data: { check_session: 'check_session' },
        success: function(data) {
            userConnected = data.session;
            getCart();
        }
    });
}

$(function() {
    getProductsList('', 1);
    getCategoriesList();
    checkUserSession();

    $("#cart-button").click(function(e) {
        e.preventDefault();

        if (!userConnected) {
            window.location.href = "login.html";
        } else {
            let itemsCard = '';

            cartProducts.forEach(item => {
                itemsCard += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <p>${item.productName} (<span class="cart-price" data-product-id="${item.productId}">${item.productPrice}</span> FCFA)</p>
                        <div class="form-group row align-items-center">
                            <span>Quantité</span>
                            <div class="col">
                                <input type="number" class="form-control cart-amount" value="1" min="1" data-product-price="${item.productPrice}" data-product-id="${item.productId}">
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
                        if (el.dataset.productId === productId) {
                            $(el).text('Ajouter au panier');
                            $(el).removeClass('disabled');
                        }
                    });

                    _updateCart();
                    updateCartCount();
                    updateCartPrice();
                });
            });

            $(".cart-amount").each(function(i, el) {
                $(el).change(function() {
                    let productId = this.dataset.productId;
                    let itemPrice = this.dataset.productPrice;
                    let totalPrice = itemPrice * $(this).val();

                    $(".cart-price").each(function(i, el) {
                        if (el.dataset.productId === productId) {
                            $(el).text(totalPrice);
                        }
                    });

                    updateCartCount();
                    updateCartPrice();
                });
            });

            updateCartPrice();
        }
    });

    $("#clear-cart").click(function(e) {
        e.preventDefault();

        $(".remove-from-cart").each(function(i, el) {
            $(el).click();
        });

        _updateCart();
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
