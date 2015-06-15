(function(TreeNode) {
    'use strict';

    TreeNode.ImportFromJSON.custom = function(tree, init, prop, val) {
        var textKey = init.textKey;
        var urlKey = init.urlKey;

        if (textKey.indexOf(prop) !== -1) {
            tree.data.text = val;
        } else if (prop === urlKey) {
            tree.data.url = val;
        }
    };

}(window.TreeNode));
