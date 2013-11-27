(function(TreeNode) {
    'use strict';

    TreeNode.ImportFromJSON = function(init) {
        if (init) {
            var tree = new TreeNode();
            var data = init.data;
            var childKey, i, max;

            if (init.childKey) {
                childKey = init.childKey;
            } else {
                childKey = 'children';
            }

            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    if (prop !== childKey) {
                        tree.data[prop] = data[prop];
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
}(window.TreeNode));
