(function(TreeNode) {
    'use strict';

    TreeNode.ImportFromJSON.custom = function(tree, init, prop) {
        var data = init.data;
        var val = data[prop];
        var textKey = init.textKey;
        var urlKey = init.urlKey;

        var original = init.original;
        var origProps = [
            'text',
            'lft',
            'rgt',
            'url',
            'page_url',
            'id',
            'page_id'
        ];

        tree.data.original = {};

        switch(prop) {
            case textKey:
                tree.data.text = val;
                break;
            case urlKey:
                tree.data.url = val;
                break;
            case original:
                for (var i = 0; i < val.length; i++) {
                    tree.data.original[origProps[i]] = val[i];
                }
        }
    };

}(window.TreeNode));
