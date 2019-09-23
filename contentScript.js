let scripts = [
    chrome.runtime.getURL('inject.js')
];

let s = document.createElement('meta');
s.httpEquiv = "Content-Security-Policy";
s.content = "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'";
(document.head || document.documentElement).appendChild(s);

scripts.forEach((script) => {
    let s = document.createElement('script');

    s.src = script;
    s.onload = function() {
        this.remove();
    };

    (document.head || document.documentElement).appendChild(s);
});
