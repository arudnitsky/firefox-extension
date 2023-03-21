chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.selection)
            console.log(request.selection);
        replaceText();
    }
);

function replaceText() {
    console.time('traverse');
    let nodes = textNodesUnder(document);
    console.timeEnd('traverse');
    console.time('replace');
    nodes.forEach(element => { replaceWithStressedText(element) });
    console.timeEnd('replace');
}

function textNodesUnder(el) {
    return walkNodeTree(el, {
        inspect: n => !['STYLE', 'SCRIPT', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'HEAD'].includes(n.nodeName),
        collect: n => ((n.nodeType === Node.TEXT_NODE) && (n.nodeValue.trim())),
    });
}

async function replaceWithStressedText(n) {
    console.log(n);
    var stressedText = await callStressApi(n.nodeValue);
    n.nodeValue = stressedText;
}

async function callStressApi(textToStress) {
    // url = 'http://192.168.1.7:5000/api/stress';
    url = 'http://127.0.0.1:5000/api/stress';

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            "text": textToStress
        }),
        mode: 'cors',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
    };

    const response = await fetch(url, requestOptions);
    if (response.status !== 200) {
        return "Error";
    }

    const json = await response.json();

    return json["stressedtext"];
}
