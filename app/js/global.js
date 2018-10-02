
(function () {

    timer.init();

    if (!localStorage.getItem('price')) {
        localStorage.setItem('price', 99 + '.00 $')
    }


    function generateAmount() {
        var price = Math.floor((Math.random() * 300) + 100) + '.00 $';
        localStorage.setItem('price', price);
        var price = localStorage.getItem('price');
        $('.sw-price-1').text(price);
        timer.reset();
    }

    var setAmount = function () {
        var price = localStorage.getItem('price');
        $('.sw-price-1').text(price);
    };
    
    document.addEventListener('updateTimer', function(e){
        
        if(parseInt(e.detail.minutes) > 0) {
            generateAmount();
        }
        
    });

    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('service-worker.js', { scope: '/app/' })
            .then(function (registration) {
                if (navigator.onLine) {
                        setAmount();
                        timer.start();
                } else {
                    timer.pause();
                    timer.reset();
                    setAmount();
                }
            }).catch(function (e) {
                console.log("Failed to register ServiceWorker", e);
            })
    }

})();
