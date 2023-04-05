//https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
function walkNodeTree(root, options) {
    options = options || {};

    const inspect = options.inspect || (n => true),
        collect = options.collect || (n => true);
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ALL,
        {
            acceptNode: function (node) {
                if (!inspect(node)) { return NodeFilter.FILTER_REJECT; }
                if (!collect(node)) { return NodeFilter.FILTER_SKIP; }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const nodes = []; let n;
    while (n = walker.nextNode()) {
        options.callback && options.callback(n);
        nodes.push(n);
    }

    return nodes;
}
