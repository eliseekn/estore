$(function() {
    $('#login-form').submit(function(e) {
        e.preventDefault();

        $.ajax({
            url: '././api/router.php',
            type: 'post',
            data: {
                login: 'login',
                phone: $('#phone').val(),
                password: $('#password').val()
            },
            success: function(data) {
                if (data.login === true) {
                    window.location.href = 'index.php';
                } else {
                    alert('Numéro de téléphone et/ou mot de passe incorrect');
                }
            }
        });
    })

    $('#register-form').submit(function(e) {
        e.preventDefault();

        $.ajax({
            url: '././api/router.php',
            type: 'post',
            data: {
                register: 'register',
                username: $('#username').val(),
                password: $('#password').val(),
                phone: $('#phone').val(),
                email: $('#email').val(),
                street: $('#street').val()
            },
            success: function(data) {
                if (data.register === true) {
                    window.location.href = 'index.php';
                } else {
                    alert('Ce numéro de téléphone est déjà enregistré');
                }
            }
        });
    })
});