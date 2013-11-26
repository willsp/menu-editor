(function() {
    'use strict';

    var app = window.angularModule;

    app.directive('pwSortable', function($document) {
        return {
            scope: {
                container: '=pwSortable',
                reference: '=',
                direction: '='
            },
            controller: function($scope, $element) {
                var me = this;
                var horizontal = this.horizontal = $scope.direction === 'horizontal';
                this.plane = {};
                this.element = $element;

                this.mousemove = function mousemove(e) {
                    var plane = me.plane;
                    var orient = plane.orientation;
                    var parent = $element.parent();
                    var siblings = parent.children();
                    var next = $element.next();
                    var previous, offset;

                    plane[orient] = e['page' + orient] - plane['start' + orient];
                    $element.css(plane.cssProp, plane[orient] + 'px');
                    
                    // Get the previous sibling
                    for (var i = 0, max = siblings.length; i < max; i++) {
                        if (siblings[i] !== $element[0]) {
                            previous = angular.element(siblings[i]);
                        } else {
                            break;
                        }
                    }

                    // Check top current vs offsetTop of neighbors
                    if (next.length && $element[0][plane.offset] > next[0][plane.offset]) {
                        if (previous) {
                            previous.after(next);
                        } else {
                            parent.prepend(next);
                        }

                        // correct for moving elements...
                        offset = next[0][plane.dimension] +
                            parseInt(window.getComputedStyle(next[0])[plane.margin1], 10) +
                            parseInt(window.getComputedStyle(next[0])[plane.margin2], 10);
                        plane[orient] = plane[orient] - offset;
                        plane['start' + orient] = plane['start' + orient] + offset;
                        $element.css(plane.cssProp, plane[orient] + 'px');

                    } else if (previous && $element[0][plane.offset] < previous[0][plane.offset]) {
                        $element.after(previous);

                        // correct for moving elements...
                        offset = previous[0][plane.dimension] +
                            parseInt(window.getComputedStyle(previous[0])[plane.margin1], 10) +
                            parseInt(window.getComputedStyle(previous[0])[plane.margin2], 10);
                        plane[orient] = plane[orient] + offset;
                        plane['start' + orient] = plane['start' + orient] - offset;
                        $element.css(plane.cssProp, plane[orient] + 'px');
                    }
                };

                this.mouseup = function mouseup(e) {
                    var cont = $scope.container;
                    var ref = $scope.reference;
                    var insertAt = [].indexOf.call($element.parent().children(), $element[0]);
                    cont.splice(cont.indexOf(ref), 1);
                    cont.splice(insertAt, 0, ref);

                    $element.removeAttr('style');
                    $document.unbind('mousemove', me.mousemove);
                    $document.unbind('mouseup', me.mouseup);
                };
            }
        };
    });

    app.directive('pwHandle', function($document) {
        return {
            require: '^pwSortable',
            link: function(scope, element, attrs, sortCtrl) {

                element.on('mousedown', function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var plane;
                    var horizontal = sortCtrl.horizontal;
                    var sortable = sortCtrl.element;

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
            }
        };
    });

}());
