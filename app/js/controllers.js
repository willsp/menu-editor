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

    menuEditor.controller('menuEditorCtrl', function menuEditorCtrl($scope, $http) {
        $scope.roots = [];

        $scope.getMenu = function() {
            if (confirm("You will lose any unsaved work, are you sure?")) {
                $scope.roots = [];

                $http({method: 'GET', url: $scope.menuGetAddress}).
                    success(function(data, status, headers, config) {
                        var menu = new TreeNode.ImportFromJSON({
                            data: data,
                            childKey: 'Children'
                        });

                        $scope.roots.push(menu);
                    }).
                    error(function(data, status, headers, config) {
                        /*jshint devel: true*/
                        console.log("error");
                        console.dir(data);
                        console.dir(status);
                    });
            }
        };

        $scope.putMenu = function() {
            var json = JSON.stringify($scope.roots[0]);
        };
                        
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

