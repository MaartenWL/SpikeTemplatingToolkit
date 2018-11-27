/*
 * Copyright (c) 2016 m.lierop
*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";

    // Load dependent modules
    var AppInit             = brackets.getModule("utils/AppInit"),
        CodeHintManager     = brackets.getModule("editor/CodeHintManager"),
        ColorUtils          = brackets.getModule("utils/ColorUtils"),
        CommandManager      = brackets.getModule("command/CommandManager"),
        CSSProperties       = require("text!CSSProperties.json"),
        CSSUtils            = brackets.getModule("language/CSSUtils"),
        DefaultDialogs      = brackets.getModule('widgets/DefaultDialogs'),
        Dialogs             = brackets.getModule('widgets/Dialogs'),
        DocumentManager     = brackets.getModule('document/DocumentManager'),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        FileSystem          = brackets.getModule('filesystem/FileSystem'),
        FileUtils           = brackets.getModule('file/FileUtils'),
        HTMLAttributes      = require("text!HtmlAttributes.json"),
        HTMLTags            = require("text!HtmlTags.json"),
        HTMLUtils           = brackets.getModule("language/HTMLUtils"),
        LanguageManager     = brackets.getModule("language/LanguageManager"),
        Menus               = brackets.getModule("command/Menus"),
        ProjectManager      = brackets.getModule('project/ProjectManager'),
        StringMatch         = brackets.getModule("utils/StringMatch"),
        TokenUtils          = brackets.getModule("utils/TokenUtils");
        

    
    
    // Context of the last request for hints: either CSSUtils.PROP_NAME,
    // CSSUtils.PROP_VALUE or null.
    var lastContext,
        stringMatcherOptions = { preferPrefixMatches: true };

    
    // Function to run when the menu item is clicked
    function parseTemplate() {
        var editor = EditorManager.getFocusedEditor();
        if (editor) {
            
            var HTMLString = editor.document.getText()
            var HTMLDoc = $.htmlDoc( HTMLString );
           
            $(HTMLDoc).find("head").append("<title>asdf asdf asdf</title>")
            $(HTMLDoc).find("cc-partgroupvariable[variablename='mooi']").attr("options","heelmooi")
            $(HTMLDoc).find("cc-partgroupvariable[variablename='lelijk']").attr("options","heellelijk")
            editor.document.setText(  $(HTMLDoc).prop('outerHTML') )
        }
    }
    
    
    function createFile(path, filename, content) {
        var file = FileSystem.getFileForPath(path + filename);

        FileUtils.writeText(file, content, true).done(function () {
            //console.log("Text successfully updated");
        }).fail(function (err) {
            error(err.name);
        });
    }
    
    function replace() {
        //LiveDevelopment.reload();

        if (DocumentManager.getCurrentDocument().file['parentPath'].includes(_pref)) {
            var _fileName = DocumentManager.getCurrentDocument().file["name"],
                _fileNameWE = FileUtils.getFilenameWithoutExtension(_fileName),
                _pathProject = ProjectManager.getProjectRoot().fullPath,
                _pathStructure = _pathProject + _pref + _structure,
                _data,
                _dataHTML,
                fileData = FileSystem.getFileForPath(_pathStructure + _fileNameWE + '.js'),
                fileHTML = FileSystem.getFileForPath(_pathStructure + _fileNameWE + '.html'),
                fileFINAL = FileSystem.getFileForPath(_pathProject + _fileNameWE + '.html');

            FileUtils.readAsText(fileData).done(function (rawText, readTimestamp) {
                rawText = rawText.replace("mr_data = ", "");
                _data = JSON.parse(rawText);
                FileUtils.readAsText(fileHTML).done(function (rawText, readTimestamp) {
                    _dataHTML = rawText;
                    for (var prop in _data) {
                        // Console test
                        // console.log(prop + " = " + _data[prop]);
                        _dataHTML = _dataHTML.split("{{::" + prop + "}}").join(_data[prop]);
                    }
                    // Remove "../"
                    _dataHTML = _dataHTML.split("../").join("");;
                    createFile(_pathProject, _fileNameWE + '.html', _dataHTML);
                }).fail(function (err) {
                    error(err.name);
                });
            }).fail(function (err) {
                error(err.name);
            });
        }
    }
    
    /* jQuery htmlDoc "fixer" - v0.2pre - 12/15/2010
     * http://benalman.com/projects/jquery-misc-plugins/
     *
     * Copyright (c) 2010 "Cowboy" Ben Alman
     * Dual licensed under the MIT and GPL licenses.
     * http://benalman.com/about/license/
     */
    
(function ($) {
    var
        rtag = /<(\/?)(html|head|body)(\s+[^>]*)?>/ig,
        prefix = 'hd' + +new Date();
    $.htmlDoc = function (str) {
        var
            elems = $([]),
            parsed,
            root;

        parsed = str.replace(rtag, function (tag, slash, name, attrs) {
            var
                len = elems.length,
                obj = {};

            if (!slash) {
                elems = elems.add('<' + name + '/>');
                if (attrs) {
                    $.each($('<div' + attrs + '/>')[0].attributes, function (i, v) {
                        obj[v.name] = v.value;
                    });
                }
                elems.eq(len).attr(obj);
            }
            return '<' + slash + 'div' + (slash ? '' : ' id="' + prefix + len + '"') + '>';
        });
        if (elems.length) {
            root = $('<div/>').html(parsed);
            $.each(elems, function (i, v) {
                var elem = root.find('#' + prefix + i).before(elems[i]);
                elems.eq(i).html(elem.contents());
                elem.remove();
            });                return root.children();
        }
        return $(str);
    };
})(jQuery);

    AppInit.appReady(function () {
        
        // First, register a command - a UI-less object associating an id to a handler
        CommandManager.register('Update', 'builder.build', parseTemplate);
        
       // var PARSE_AND_REPLACE = "Spike.UpdateTemplate";   // package-style naming to avoid collisions
        CommandManager.register("Update Email Layout",'Spike.UpdateTemplate', parseTemplate);
        CommandManager.register("Write Email Layout",'Spike.UpdateTemplate', parseTemplate);
        
        var ccmenu = Menus.addMenu('Spike', 'CampaignCloud.Parse', Menus.BEFORE, Menus.AppMenuBar.HELP_MENU);
        //var ccmenu = Menus.getMenu(Menus.AppMenuBar.CampaignCloud);
        ccmenu.addMenuItem('Spike.UpdateTemplate');
       
    });
    
    egData =
        'mr_data = {\n' +
        '    \"background-color-editor\": \"select\",\n' +
        '    \"background-color-values\": \"#ffffff,#000000\",\n' +
        '    \"background-color-labels\": \"White,Black\",\n' +
        '    \"text-color-editor\": \"select\",\n' +
        '    \"text-color-values\": \"#ffffff,#000000\",\n' +
        '    \"text-color-labels\": \"White,Black\",\n' +
        '}';
});
