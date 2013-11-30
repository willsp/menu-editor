(function(global) {
    'use strict';

    function TreeNode(data) {
        this.data = data;
        this.children = [];
        this.parent = null;
    }

    TreeNode.prototype.add = function(child) {
        this.children.push(child);
        child.parent = this;
        return child;
    };

    TreeNode.prototype.remove = function(child) {
        var i = this.children.indexOf(child);
        if (i > -1) {
            return this.children.splice(i, 1)[0];
        }
    };

    TreeNode.prototype.insertBefore = function(child, ref) {
        var refIndex = this.children.indexOf(ref);

        return this.addAt(child, refIndex);
    };

    TreeNode.prototype.addAt = function(child, index) {
        if (index > -1 && index < this.children.length) {
            this.children.splice(index, 0, child);
            child.parent = this;
            return child;
        } else if (index === this.children.length) {
            return this.add(child);
        }
    };

    TreeNode.prototype.getParent = function() {
        return this.parent;
    };

    global.TreeNode = TreeNode;
}(window));

