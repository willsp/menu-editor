(function(TreeNode) {
    'use strict';

    var processNode = function(node, opts) {
        var childKey = opts && opts.childKey || 'children';
        var callback = opts && opts.callback || function() {};
        var thisNode = node.data.store || {};

        if (node.children && node.children.length) {
            thisNode[childKey] = [];
            node.children.forEach(function(child) {
                thisNode[childKey].push(processNode(child, opts));
            });
        }

        callback.call(node, thisNode);
        return thisNode;
    };

    TreeNode.prototype.ExportToKeyValue = function (opts) {
        return processNode(this, opts);
    };

}(this.TreeNode));

