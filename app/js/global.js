(function() {

  if (!localStorage.getItem('price')) {
    localStorage.setItem('price', 99 + '.00 $')
  }

  var setAmount = function() {
    var price = localStorage.getItem('price');
    $('.sw-price-1').text(price);
  };

  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js',{scope:'/app/'})
        .then(function (registration) {
            console.log('Registration successful, scope is:', registration.scope);
            var startTimer;
            if (navigator.onLine) {
                setAmount();
                startTimer = setInterval(generateAmount, 10000);
                function generateAmount() {
                        var price = Math.floor((Math.random() * 300) + 100) + '.00 $';
                        localStorage.setItem('price', price);
                        var price = localStorage.getItem('price');
                        $('.sw-price-1').text(price);
                }
            } else {
                clearInterval(startTimer);
                setAmount();
            }
        }).catch(function (e) {
        console.log("Failed to register ServiceWorker", e);
    })
}

})();
