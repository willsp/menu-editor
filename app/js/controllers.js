/*global angular, TreeNode, confirm, $scope*/

(function() {
    'use strict';

    var menuEditor = angular.module('menuEditor', ['willsp.pwSortable']);

    menuEditor.filter('selected', function() {
        return function(input) {
            if (input) {
                return 'selected';
            }
        };
    });

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
        $scope.updates = [];
        $scope.dbList = [];
        $scope.menuGetAddress = '';
        $scope.menuPutAddress = '';
        $scope.menu = {};

        $scope.reloadMenu = function() {
            if (confirm('You will lose any unsaved work, are you sure?')) {
                $scope.getMenu();
            }
        };

        $scope.getMenus = function() {
            $http({method: 'GET', url: $scope.dburl + $scope.dbview}).
                success(function(data, status, headers, config) {
                    $scope.dbList = data.rows;
                }).
                error(function(data, status, headers, config) {
                $scope.updates.unshift({
                    text: 'Error: Unable to load menu. Status: ' + status,
                    time: new Date(),
                    type: "error"
                });
            });
        };

        $scope.open = function(url) {
            if ($scope.menuPutAddress) {
                $scope.putMenu();
            }

            $scope.menuGetAddress = $scope.dburl + '/' + url;
            $scope.menuPutAddress = $scope.dburl + '/' + url;

            $scope.getMenu();
        };

        $scope.getMenu = function() {
            $http({method: 'GET', url: $scope.menuGetAddress}).
                success(function(data, status, headers, config) {
                    var menu;
                    menu = TreeNode.ImportFromJSON({
                        data: data,
                        childKey: 'Children',
                        textKey: 'Text',
                        urlKey: 'Url'
                    });

                    $scope.menu = menu;
                }).
                error(function(data, status, headers, config) {
                $scope.updates.unshift({
                    text: 'Error: Unable to load menu. Status: ' + status,
                    time: new Date(),
                    type: "error"
                });
            });
        };

        $scope.putMenu = function() {
            var menu = $scope.menu;
            var updated = menu.ExportToKeyValue({
                childKey: 'Children',
                callback: function(save) {
                    save.Text = this.data.text;
                    if (this.data.url) {
                        save.Url = this.data.url;
                    }
                }
            });

            $http({method: 'PUT', data: updated, url: $scope.menuPutAddress}).
                success(function(data, status, headers, config) {
                if (data.ok) {
                    $scope.updates.unshift({
                        text: 'SUCCESS (Status: ' + status + ')',
                        time: new Date(),
                        type: "info"
                    });
                    menu.data.store._rev = data.rev;
                } else {
                    $scope.updates.unshift({
                        text: 'Error: There was a problem. ' +
                            'Status: ' + status,
                        time: new Date(),
                        type: "error"
                    });
                }
            }).
                error(function(data, status, headers, config) {
                $scope.updates.unshift({
                    text: 'Error: Unable to save menu. Message: ' +
                        data.reason + ' Status: ' + status,
                    time: new Date(),
                    type: "error"
                });
            });
        };
                        
        $scope.add = function(item) {
            var child;

            if (item) {
                child = item.add(new TreeNode());
                item.showChildren = true;
            } else {
                child = $scope.menu.add(new TreeNode());
            }
        };

        $scope.adddb = function() {
            var guid = generateGuid();
            
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
            // Prime this with the test db... I'm tired of copy pasting it every time I reload...
            $scope.dburl = 'http://localhost:5984/greenlee';
            $scope.dbview = '/_design/edit/_view/menus';
            $scope.getMenus();
        });

        function generateGuid() {
            var result, i, j;
            result = '';
            for(j=0; j<32; j++) {
                if( j == 8 || j == 12|| j == 16|| j == 20) 
                    result = result + '-';
                i = Math.floor(Math.random()*16).toString(16).toUpperCase();
                result = result + i;
            }
            return result;
        }
    });
}());

