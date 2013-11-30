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
        $scope.menuGetAddress = '/menu/Menu.asmx/GetJSON';
        $scope.menuPutAddress = '/menu/Menu.asmx/UpdateMenu';

        $scope.reloadMenu = function() {
            if (confirm("You will lose any unsaved work, are you sure?")) {
                $scope.getMenu();
            }
        };

        $scope.getMenu = function() {
            $scope.roots = [];

            $http({method: 'POST', data: '', url: $scope.menuGetAddress}).
                success(function(data, status, headers, config) {
                var menu = new TreeNode.ImportFromJSON({
                    data: data.d,
                    childKey: 'Children',
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
            var updateQuery = $scope.roots[0].ExportUpdates().Statement();

            $http({method: 'POST', data: updateQuery, url: $scope.menuGetAddress}).
                success(function(data, status, headers, config) {
                $scope.updates.push({
                    text: data + ' (' + status + ')',
                    time: new Date()
                });
            }).
                error(function(data, status, headers, config) {
                $scope.errors.push({
                    text: "Error: Unable to save menu. Status: " + status,
                    time: new Date()
                });
            });
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

        $document.ready(function () {
            if ($scope.menuGetAddress) {
                $scope.getMenu();
            }
        });
    });

    window.angularModule = menuEditor;
}());

