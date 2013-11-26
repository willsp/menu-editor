/*global angular, TreeNode, confirm*/

(function() {
    'use strict';

    var menuEditor = angular.module('menuEditor', []);

    menuEditor.filter('showChildren', function() {
        return function(input) {
            if (input) {
                return 'children-visible';
            }
        };
    });

    menuEditor.filter('hasChildren', function() {
        return function(input) {
            if (input) {
                return 'has-children';
            }
        };
    });

    menuEditor.controller('menuEditorCtrl', function menuEditorCtrl($scope) {
        $scope.roots = [];

        $scope.add = function(item) {
            if (item) {
                item.add(new TreeNode());
                item.showChildren = true;
            } else {
                $scope.roots.push(new TreeNode());
            }
        };

        $scope.remove = function(item) {
            var text = (item.data && item.data.text) ? item.data.text : 'this';
            if (confirm('Really delete ' + text + '?')) {
                item.parent.remove(item);
            }
        };

        $scope.showChildren = function(item) {
            item.showChildren = !item.showChildren;
        };
    });

    window.angularModule = menuEditor;
}());

