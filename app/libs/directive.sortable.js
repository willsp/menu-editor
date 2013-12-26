/*global angular*/

(function() {
    'use strict';

    angular.module('willsp.pwSortable',[])

    .directive('pwSortable', function($document) {
        return {
            scope: false,
            controller: function($scope, $element, $attrs) {
                var direction = $attrs.pwSortable;

                // Not ngRepeat
                var me = this;
                var horizontal = this.horizontal = direction === 'horizontal';
                this.plane = {};
                this.element = $element;


                this.mousemove = function mousemove(e) {
                    $scope.$apply(function() {
                        var plane = me.plane;
                        var orient = plane.orientation;
                        var parent = $element.parent();
                        var siblings = parent.children();
                        var next = $element.next();
                        var previous, offset, preprevious;

                        plane[orient] = e['page' + orient] - plane['start' + orient];
                        $element.css(plane.cssProp, plane[orient] + 'px');

                        // Get the previous sibling
                        for (var i = 0, max = siblings.length; i < max; i++) {
                            if (siblings[i] !== $element[0]) {
                                preprevious = previous;
                                previous = angular.element(siblings[i]);
                            } else {
                                break;
                            }
                        }

                        // Check top current vs offsetTop of neighbors
                        if (next.length && $element[0][plane.offset] > next[0][plane.offset]) {
                            next.after($element);

                            // correct for moving elements...
                            offset = next[0][plane.dimension] +
                                parseInt(window.getComputedStyle(next[0])[plane.margin1], 10) +
                                parseInt(window.getComputedStyle(next[0])[plane.margin2], 10);
                            plane[orient] = plane[orient] - offset;
                            plane['start' + orient] = plane['start' + orient] + offset;
                            $element.css(plane.cssProp, plane[orient] + 'px');

                        } else if (previous && $element[0][plane.offset] < previous[0][plane.offset]) {
                            if (preprevious) {
                                preprevious.after($element);
                            } else {
                                parent.prepend($element);
                            }

                            // correct for moving elements...
                            offset = previous[0][plane.dimension] +
                                parseInt(window.getComputedStyle(previous[0])[plane.margin1], 10) +
                                parseInt(window.getComputedStyle(previous[0])[plane.margin2], 10);
                            plane[orient] = plane[orient] + offset;
                            plane['start' + orient] = plane['start' + orient] - offset;
                            $element.css(plane.cssProp, plane[orient] + 'px');
                        }
                    });
                };

                this.mouseup = function mouseup(e) {
                    $scope.$apply(function() {
                        // Get the vars from the repeat
                        var expression = $attrs.ngRepeat;
                        var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*$/);

                        var lhs = match[1];
                        var rhs = match[2];

                        var parentScope;
                        var ref = $scope[lhs];
                        if (ref === $scope.$parent[lhs]) {
                            // Needed for nested for some reason... still trying to figure it out.
                            parentScope = $scope.$parent.$parent;
                        } else {
                            parentScope = $scope.$parent;
                        }

                        var cont = parentScope.$eval(rhs);
                        var ph = me.placeholder;

                        var family = $element.parent().children();
                        var elPos = [].indexOf.call(family, $element[0]);

                        cont.splice(cont.indexOf(ref), 1);
                        cont.splice(elPos, 0, ref);
                        $element.css('position', '');
                        $element.css(me.plane.cssProp, '');
                            
                        ph.after($element);
                        ph.remove();

                        $document.unbind('mousemove', me.mousemove);
                        $document.unbind('mouseup', me.mouseup);
                    });
                };
            }
        };
    })

    .directive('pwHandle', function($document) {
        return {
            require: '^pwSortable',
            scope: false,
            link: function(scope, element, attr, sortCtrl) {
                element.on('mousedown', function(e) {
                    scope.$apply(function() {
                        e.stopPropagation();
                        e.preventDefault();

                        var plane;
                        var horizontal = sortCtrl.horizontal;
                        var sortable = sortCtrl.element;
                        var ph = sortCtrl.placeholder = angular.element(document.createComment('pwSortable placeholder'));
                        sortable.after(ph);

                        sortable.css({
                            position: 'relative'
                        });

                        sortCtrl.plane = {
                            X: 0,
                            Y: 0,
                            startX: 0,
                            startY: 0,
                            orientation: (horizontal) ? 'X' : 'Y',
                            cssProp: (horizontal) ? 'left' : 'top',
                            offset: (horizontal) ? 'offsetLeft' : 'offsetTop',
                            dimension: (horizontal) ? 'offsetWidth' : 'offsetHeight',
                            margin1: (horizontal) ? 'marginLeft' : 'marginTop',
                            margin2: (horizontal) ? 'marginRight' : 'marginBottom'
                        };

                        plane = sortCtrl.plane;
                        plane.startX = e.pageX - plane.X;
                        plane.startY = e.pageY - plane.Y;

                        $document.on('mousemove', sortCtrl.mousemove);
                        $document.on('mouseup', sortCtrl.mouseup);
                    });
                });
            }
        };
    });
}());
