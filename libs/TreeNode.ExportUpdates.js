// TreeNode.ExportUpdates.js
/*jshint plusplus: false*/

(function(TreeNode) {
    'use strict';

    TreeNode.prototype.ExportUpdates = function(options) {
        options = options || {};
        options.context = this;

        return new TreeNode.UpdateWriter(options);
    };

    TreeNode.UpdateWriter = function(options) {
        if (!(this instanceof TreeNode.UpdateWriter)) {
            return new TreeNode.UpdateWriter(options);
        }

        var context = options.context;
        var updateStatement;
        var insertStatement;
        var deleteStatement;
        var statement;
        var updates = options.updates; // Arrays of nodes
        var inserts = options.inserts;
        var deletes = options.deletes;

        this.Statement = function() {
            return statement;
        };

        this.Context = function() {
            return context;
        };

        if (context.Lft === undefined) {
            context.Decorate('LftRgt');
        }

        updateStatement = buildUpdates(context, updates, inserts);
        insertStatement = buildInserts(inserts);
        deleteStatement = buildDeletes(deletes);

        statement = updateStatement;
        statement += (statement && insertStatement) ? '\n\n' + insertStatement : insertStatement;
        statement += (statement && deleteStatement) ? '\n\n' + deleteStatement : deleteStatement;
    };

    function buildUpdates(context, updates, inserts) {
        var pl = context.data;
        var positionChanged;
        var url;
        var statement = '';
        var updateIndex = updates.indexOf(context);

        if (!(inserts && inserts.indexOf(context) >= 0)) {
            positionChanged = (parseInt(pl.original.lft, 10) !== context.Lft ||
                parseInt(pl.original.rgt, 10) !== context.Rgt);

            if (positionChanged || (updates && updateIndex >= 0)) {
                statement += 'UPDATE `nav`\nSET\n';
                statement += '`lft` = ' + context.Lft;
                statement += ',\n`rgt` = ' + context.Rgt;

                if (updates && updateIndex >= 0) {
                    url = (pl.url) ? '\'' + pl.url + '\'' : 'NULL';
                    statement += ',\n`name` = \'' + pl.text + '\',\n';
                    statement += '`url` = ' + url;
                    statement += ',\n`page_id` = ' + (pl.page_id || 'NULL');
                    updates.splice(updateIndex, 1);
                }

                statement += '\nWHERE id = ' + pl.original.id + ';\n';
            }
        }
        for (var i = 0, max = context.children.length; i < max; i++) {
            statement += buildUpdates(context.children[i], updates, inserts);
        }

        return statement;
    }

    function buildInserts(inserts) {
        var statement = '';

        if (inserts && inserts.length) {
            statement = 'INSERT INTO `nav` (`name`, `lft`, `rgt`, `page_id`, `url`)\n' +
                        'VALUES';
            for (var i = 0, max = inserts.length; i < max; i++) {
                statement += (i) ? ',' : ''; // Add comma for all but the first
                statement += '\n(' + [
                    '\'' + inserts[i].data.text + '\'',
                    inserts[i].Lft,
                    inserts[i].Rgt,
                    inserts[i].data.page_id || 'NULL',
                    (inserts[i].data.url) ? '\'' + inserts[i].data.url + '\'' : 'NULL'
                ].join(',') + ')';
            }
            
            statement += ';';
        }

        return statement;
    }

    function buildDeletes(deletes) {
        var statement = '';

        if (deletes && deletes.length) {
            
            for (var i = 0, max = deletes.length; i < max; i++) {
                statement += 'DELETE FROM `nav`\n';
                statement += 'WHERE `id` = ' + deletes[i].data.original.id + ';\n';
            }
        }

        return statement;
    }
}(this.TreeNode));
