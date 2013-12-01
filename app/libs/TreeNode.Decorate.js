(function (TreeNode) {
    "use strict";

    TreeNode.prototype.Decorate = function(Decorator, options) {
        if (typeof TreeNode[Decorator] !== "function") {
            return null;
        }

        options = options || {};
        options.context = this;

        return new TreeNode[Decorator](options);
    };

}(this.TreeNode));

