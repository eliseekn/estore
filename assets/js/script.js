let userCartItems = [];

function updateCartItemsCount() {
    $(".cart-items-count").each(function(i, elmt) {
        $(elmt).text(userCartItems.length);
    });
}

function updateCartItemsPrice() {
    let totalPrice = 0;

    $(".cart-item-price").each(function(i, elmt) {
        totalPrice += Number($(elmt).text());
    });

    $("#cart-items-price").text(totalPrice);
}

function getUserEmail() {
    let userId = document.querySelector("#user");
    let userEmail = userId.dataset.userEmail;
    return userEmail;
}

function getProductsList() {
    $.ajax({
        url: '././api/database.php',
        type: 'post',
        data: { products_list: 'products_list' },
        success: function(productsList) {
            let productCard = '';

            productsList.forEach(product => {
                productCard += `
                    <div class="card mb-4 shadow">
                        <img src="${product.productImage}" class="card-img-top">
                        <div class="card-body text-center">
                            <h5 class="card-title font-weight-bold">${product.productPrice} FCFA</h5>
                            <p class="card-text">${product.productName}</p>
                            <a href="#"
                                class="btn btn-dark add-to-cart"
                                data-product-id="${product.productId}"
                                data-product-name="${product.productName}"
                                data-product-price="${product.productPrice}">Ajouter au panier</a>
                        </div>
                    </div>
                `;
            });

            $(".card-columns").html(productCard);

            $(".add-to-cart").each(function(i, elmt) {
                $(elmt).click(function(e) {
                    e.preventDefault();

                    let productId = this.dataset.productId;
                    let productName = this.dataset.productName;
                    let productPrice = this.dataset.productPrice;

                    let inCart = userCartItems.find(item => item.id === productId);
                    if (!inCart) {
                        userCartItems.push({ productId, productName, productPrice });
                        $(this).text('Déjà dans le panier!');
                        $(this).addClass('disabled');

                        updateCartItemsCount();
                    }
                });
            });
        }
    })
}

function getUserCartItems() {
    $.ajax({
        url: '././api/database.php',
        type: 'post',
        data: {
            user_cart_items: 'user_cart_items',
            user_email: getUserEmail()
        },
        success: function(_userCartItems) {
            _userCartItems.forEach(item => {
                let productId = item.productId;
                let productName = item.productName;
                let productPrice = item.productPrice;

                $(".add-to-cart").each(function(i, elmt) {
                    let _productId = elmt.dataset.productId;
                    if (_productId === productId) {
                        $(elmt).text('Déjà dans le panier!');
                        $(elmt).addClass('disabled');
                    }
                });

                userCartItems.push({ productId, productName, productPrice });
                updateCartItemsCount();
            });
        }
    });
}

$(function() {
    getProductsList();
    getUserCartItems();

    $("#cart-button").click(function(e) {
        e.preventDefault();

        let itemCard = '';

        userCartItems.forEach(item => {
            itemCard += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <p>${item.productName} (<span class="cart-item-price" data-product-id="${item.productId}">${item.productPrice}</span> FCFA)</p>
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

        $("#cart-items-list").html(itemCard);

        $(".remove-from-cart").each(function(i, elmt) {
            $(elmt).click(function(e) {
                e.preventDefault();

                let cartItem = $(this).parent().parent();
                cartItem.remove();

                let productId = this.dataset.productId;
                let inCart = userCartItems.find(item => item.id === productId);
                let j = userCartItems.findIndex(item => item.id === productId);

                userCartItems.splice(j, 1);

                $(".add-to-cart").each(function(i, elmt) {
                    let _productId = elmt.dataset.productId;

                    if (_productId === productId) {
                        $(elmt).text('Ajouter au panier');
                        $(elmt).removeClass('disabled');
                    }
                });

                updateCartItemsCount();
                updateCartItemsPrice();
            });
        });

        $(".cart-item-amount").each(function(i, elmt) {
            $(elmt).change(function() {
                let productId = this.dataset.productId;
                let itemPrice = this.dataset.productPrice;
                let totalPrice = itemPrice * $(this).val();

                $(".cart-item-price").each(function(i, elmt) {
                    let _productId = elmt.dataset.productId;
                    if (_productId === productId) {
                        $(elmt).text(totalPrice);
                    }
                });

                updateCartItemsPrice();
            });
        });

        updateCartItemsPrice();
    });

    $("#clear-cart-button").click(function(e) {
        e.preventDefault();

        $(".remove-from-cart").each(function(i, elmt) {
            $(elmt).click();
        });

        updateCartItemsPrice();
    });
});
