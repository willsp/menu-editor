(function(TreeNode) {
    'use strict';

    TreeNode.ImportFromJSON = function(init) {
        if (init) {
            var tree = new TreeNode();
            var data = init.data;
            var i, max, newInit, newProp;

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
                            // clone init except for data
                            newInit = {};
                            newInit.prototype = init.prototype;
                            newInit.data = data[prop][i];
                            for (newProp in init) {
                                if (init.hasOwnProperty(newProp) &&
                                    newProp !== 'data') {
                                    newInit[newProp] = init[newProp];
                                }
                            }

                            tree.add(TreeNode.ImportFromJSON(newInit));
                        }
                    }
                }
            }

            return tree;
        }
    };

    TreeNode.ImportFromJSON.custom = function(tree, init, property) {
        // Override this to process properties in a custom fashion
    };
}(window.TreeNode));
