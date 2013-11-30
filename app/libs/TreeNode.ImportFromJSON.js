(function(TreeNode) {
    'use strict';

    TreeNode.ImportFromJSON = function(init) {
        if (init) {
            var tree = new TreeNode();
            var data = init.data;
            var i, max;

            var childKey = init.childKey || 'children';
            
            tree.data  = {};
            tree.data.store = {};

            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    if (prop !== childKey) {
                        tree.data.store[prop] = data[prop];
                        TreeNode.ImportFromJSON.custom(tree, init, prop);
                    } else {
                        for (i = 0, max = data[prop].length; i < max; i++) {
                            tree.add(TreeNode.ImportFromJSON({
                                data: data[prop][i],
                                childKey: childKey
                            }));
                        }
                    }
                }
            }

            return tree;
        }
    };

    TreeNode.ImportFromJSON.custom = function(tree, init, property) {
        // Override this to process properties in a custom fashion
    }
}(window.TreeNode));
