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

    menuEditor.controller('menuEditorCtrl', function menuEditorCtrl($scope, $http, $document) {
        $scope.errors = [];
        $scope.updates = [];
        $scope.roots = [];
        $scope.menuGetAddress = '';
        $scope.menuPutAddress = '';
        $scope.insertedNodes = [];
        $scope.deletedNodes = [];
        $scope.updatedNodes = [];

        $scope.reloadMenu = function() {
            if (confirm("You will lose any unsaved work, are you sure?")) {
                $scope.getMenu();
            }
        };

        $scope.getMenu = function() {
            $scope.roots = [];
            $scope.insertedNodes = [];
            $scope.deletedNodes = [];
            $scope.updatedNodes = [];

            $http({method: 'POST', data: '', url: $scope.menuGetAddress}).
                success(function(data, status, headers, config) {
                var menu = new TreeNode.ImportFromJSON({
                    data: data.d,
                    childKey: 'Children',
                    original: 'Original',
                    textKey: 'Text',
                    urlKey: 'Url'
                });

                $scope.roots.push(menu);
            }).
                error(function(data, status, headers, config) {
                $scope.errors.push({
                    text: "Error: Unable to load menu. Status: " + status,
                    time: new Date()
                });
            });
        };

        $scope.putMenu = function() {
            var updateQuery = $scope.roots[0].ExportUpdates({
                inserts: $scope.insertedNodes,
                deletes: $scope.deletedNodes,
                updates: $scope.updatedNodes
            }).Statement();


            $http({method: 'POST', data: {"query": updateQuery}, url: $scope.menuPutAddress}).
                success(function(data, status, headers, config) {
                if (data.d === "OK") {
                    $scope.updates.push({
                        text: data.d + ' (Status: ' + status + ')',
                        time: new Date()
                    });

                    $scope.insertedNodes = [];
                    $scope.deletedNodes = [];
                    $scope.updatedNodes = [];
                } else {
                    $scope.errors.push({
                        text: "Error: There was a problem. Message: " +
                            data.d + " Status: " + status,
                        time: new Date()
                    });
                }
            }).
                error(function(data, status, headers, config) {
                $scope.errors.push({
                    text: "Error: Unable to save menu. Message: " +
                        data + " Status: " + status,
                    time: new Date()
                });
            });
        };
                        
        $scope.add = function(item) {
            if (item) {
                var child = item.add(new TreeNode());
                item.showChildren = true;
                $scope.insertedNodes.push(child);
            } else {
                $scope.roots.push(new TreeNode());
            }
        };

        $scope.remove = function(item) {
            var text = (item.data && item.data.text) ? item.data.text : 'this';
            if (confirm('Really delete ' + text + '?')) {
                var removed = item.parent.remove(item);
                var insertIndex = $scope.insertedNodes.indexOf(removed);
                var updateIndex = $scope.updatedNodes.indexOf(removed);

                if (insertIndex > -1) {
                    $scope.insertedNodes.splice(insertIndex, 1);
                } else {
                    $scope.deletedNodes.push(removed);

                    if (updateIndex > -1) {
                        $scope.updatedNodes.splice(updateIndex, 1);
                    }
                }
            }
        };

        $scope.check = function(item) {
            var insertIndex = $scope.insertedNodes.indexOf(item);
            var updateIndex = $scope.updatedNodes.indexOf(item);
            
            if (insertIndex < 0 && updateIndex < 0) {
                if (item.data) {
                    if (item.data.original && (item.data.text !== item.data.original.text ||
                        item.data.url !== item.data.original.url)) {
                        $scope.updatedNodes.push(item);
                    }
                }
            }
        };

        $scope.showChildren = function(item) {
            item.showChildren = !item.showChildren;
        };

        $document.ready(function () {
            if ($scope.menuGetAddress) {
                $scope.getMenu();
            }
        });
    });

    window.angularModule = menuEditor;
}());

