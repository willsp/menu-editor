(function(TreeNode) {
    'use strict';

    var createChild = function(init, data) {
        // clone init except for data and rootName
        var newInit = {};
        newInit.prototype = init.prototype;

        for (var prop in init) {
            if (init.hasOwnProperty(prop)) {
                newInit[prop] = init[prop];
            }
        }

        newInit.data = data;
        delete newInit.rootName;
        delete newInit.rootStore;

        return TreeNode.ImportFromJSON(newInit);
    };

    TreeNode.ImportFromJSON = function(init) {
        if (init) {
            var tree = new TreeNode();
            var data = init.data;
            var i, max, newInit, newProp;

            var childKey = init.childKey || 'children';
            
            tree.data  = {};
            tree.data.store = {};

            var addChild = function(child) {
                tree.add(createChild(init, child));
            };
                
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    if (childKey.indexOf(prop) === -1) {
                        tree.data.store[prop] = data[prop];
                        TreeNode.ImportFromJSON.custom(tree, init, prop, data[prop]);
                    } else {
                        data[prop].forEach(addChild);
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
