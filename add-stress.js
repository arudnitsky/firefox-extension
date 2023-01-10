function addStressReceiver(request, sender, sendResponse) {
    replaceText();
}

var tagsToIgnore = [
    '[document]',
    'noscript',
    'header',
    'html',
    'meta',
    'head',
    'input',
    'script',
    'style'
];

function isExcluded(elm) {
    if (elm.tagName == "STYLE") {
        return true;
    }
    if (elm.tagName == "SCRIPT") {
        return true;
    }
    if (elm.tagName == "NOSCRIPT") {
        return true;
    }
    if (elm.tagName == "IFRAME") {
        return true;
    }
    if (elm.tagName == "OBJECT") {
        return true;
    }
    return false
}

async function traverse(elm) {
    if (elm.nodeType == Node.ELEMENT_NODE || elm.nodeType == Node.DOCUMENT_NODE) {
        if (isExcluded(elm)) {
            // exclude elements with invisible text nodes
            return
        }

        for (var i = 0; i < elm.childNodes.length; i++) {
            traverse(elm.childNodes[i]);
        }
    }

    if (elm.nodeType == Node.TEXT_NODE) {
        if (elm.nodeValue.trim() == "") {
            return
        }

        // console.log(elm.nodeValue);
        var stressedText = await callStressApi(elm.nodeValue);
        // console.log(">>", stressedText);
        elm.nodeValue = stressedText;
    }
}

async function replaceText() {
    traverse(document);
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

async function callStressApi(textToStress) {
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

browser.runtime.onMessage.addListener(addStressReceiver);

