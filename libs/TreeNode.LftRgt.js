(function (TreeNode) {
    "use strict";

    TreeNode.LftRgt = function (options) {
        if (!(this instanceof TreeNode.LftRgt)) {
            return new TreeNode.LftRgt(options);
        }

        var currIndex;

        if (!(options && options.context && options.context instanceof TreeNode)) {
            return null;
        }

        this.CurrentIndex = function() {
            return currIndex++;
        };

        this.context = options.context;
        currIndex = (options.index || options.index === 0) ? options.index : 1;
        
        decorateChild(this.context, this);

        return this;
    };

    function decorateChild(treeNode, context) {
        treeNode.Lft = context.CurrentIndex();

        for (var i = 0, max = treeNode.children.length; i < max; i++) {
            decorateChild(treeNode.children[i], context);
        }

        treeNode.Rgt = context.CurrentIndex();
    }

}(this.TreeNode));

