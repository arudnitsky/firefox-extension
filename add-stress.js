function addStressReceiver(request, sender, sendResponse) {
    replaceText()
}

async function replaceText() {
    var elements = document.getElementsByTagName('*');

    var count = 0
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var stressedText = await callStressApi(text);
                element.replaceChild(document.createTextNode(stressedText), node);
                count += 1;
            }
        }
    }
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
