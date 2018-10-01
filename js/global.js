(function() {

  if (!localStorage.getItem('price')) {
    localStorage.setItem('price', 99 + '.00 $')
  }

  var setAmount = function() {
    var price = localStorage.getItem('price');
    $('.sw-price-1').text(price);
  };

  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js')
        .then(function (registration) {
            if (navigator.onLine) {
                setAmount();
                setInterval(function(){ 
                    var price = Math.floor((Math.random() * 300) + 100) + '.00 $';
                    localStorage.setItem('price', price);
                    var price = localStorage.getItem('price');
                    $('.sw-price-1').text(price);
                }, 3000);
            } else {
                setAmount();
            }
        }).catch(function (e) {
        console.log("Failed to register ServiceWorker", e);
    })
}

})();
