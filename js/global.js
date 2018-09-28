(function() {


  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
            console.log("ServiceWorker registered");
            var price = localStorage.getItem('price');
            $('.sw-price-1').text(price);
            // updatefound event is fired if service-worker.js changed
            registration.onupdatefound = swUpdated;
        }).catch(function (e) {
        console.log("Failed to register ServiceWorker", e);
    })
}

function swUpdated(e) {
    console.log('swUpdated');
    var price = Math.floor((Math.random() * 300) + 100) + '.00 $';
    localStorage.setItem('price', price);
    var price = localStorage.getItem('price');
    $('.sw-price-1').text(price);
    // get the SW which being installed
    var sw = e.target.installing;
    // listen for installation stage changes
    sw.onstatechange = swInstallationStateChanged;
}

function swInstallationStateChanged(e) {
    // get the SW which being installed
    var sw = e.target;
    console.log('swInstallationStateChanged: ' + sw.state);

    if (sw.state == 'installed') {
        // is any sw already installed? This function will run 'before' 'SW's activate' handler, so we are checking for any previous sw, not this one.
        if (navigator.serviceWorker.controller) {
            console.log('Content has updated!');
        } else {
            console.log('Content is now available offline!');
        }
    }

    if (sw.state == 'activated') {
        // new|updated SW is now activated.
        console.log('SW is activated!');
    }
}


})();
