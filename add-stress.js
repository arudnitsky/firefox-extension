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
            // recursively call to traverse
            traverse(elm.childNodes[i]);
        }
    }

    if (elm.nodeType == Node.TEXT_NODE) {
        if (elm.nodeValue.trim() == "") {
            // exclude text node consisting of only spaces
            return
        }

        // elm.nodeValue here is visible text we need.
        // console.log(elm.nodeValue);
        var stressedText = await callStressApi(elm.nodeValue);
        // console.log(">>", stressedText);
        elm.nodeValue = stressedText;
    }
}

async function replaceText() {
    traverse(document);
    //var elements = document.getElementsByTagName('*');
    // var elements = document.querySelectorAll('body > *');
    // var arr = elements.children;
    // var arrLength = arr.length;
    // for (var i = 0; i < arrLength; i++) {
    //     stuff = arr[i];
    //     text = arr[i].textContent;
    //     console.log(text);
    // }

    // for (let elem of document.getElementsByTagName('*')) { //querySelectorAll('body > *')) {
    //     if (!tagsToIgnore.includes(elem.nodeName.toLocaleLowerCase())) {
    //         //if (elem.nodeName !== "SCRIPT" && elem.nodeName !== "STYLE") {
    //         console.log(elem.nodeName);
    //         if (elem.textContent !== "") {//} && elem.querySelectorAll('*').length == 0) {
    //             var text = elem.textContent;
    //             if (!isBlank(text)) {
    //                 var stressedText = await callStressApi(text);
    //                 console.log(">>", stressedText);
    //                 elem.textContent = stressedText;
    //             }
    //         }
    //     }
    // }
}
// [... document.querySelectorAll("*")].forEach(ele=>{

//     if(ele.nodeName == 'SCRIPT' ||ele.nodeName == 'STYLE'){return;} //don't want to replace script and style tags

//     if(ele.innerHTML != "" & ele.querySelectorAll("*").length==0){ //check for element inside element 
//       ele.innerHTML = "myHtml"; //replace with your html
//     }
//     });

// for (var i = 0; i < elements.length; i++) {
//     var element = elements[i];

//     for (var j = 0; j < element.childNodes.length; j++) {
//         var node = element.childNodes[j];

//         if (node.nodeType === 3) {
//             //var text = node.nodeValue;
//             var text = node.textContent;
//             if (!isBlank(text)) {
//                 var stressedText = await callStressApi(text);
//                 console.log(stressedText);
//                 element.replaceChild(document.createTextNode(stressedText), node);
//             }
//         }
//     }
// }

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
