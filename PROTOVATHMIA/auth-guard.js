// auth-guard.js — Universal Platform Security & Crash Gateway
(function() {
    var AUTH_KEY = 'pathologia_access_granted';
    var PASS = '888888';
    
    var path = window.location.pathname.toLowerCase();
    // Do not guard crash.html or access.html
    if (path.indexOf('crash.html') !== -1 || path.indexOf('access.html') !== -1) {
        return;
    }

    try {
        var token = localStorage.getItem(AUTH_KEY);
        if (token !== PASS) {
            // Prevent flash of protected content
            if (document.documentElement) {
                document.documentElement.style.display = 'none';
            }
            var prefix = '';
            if (path.indexOf('larnaka') !== -1) {
                prefix = '../';
            }
            window.location.replace(prefix + 'crash.html');
        }
    } catch (e) {
        window.location.replace('crash.html');
    }
})();
