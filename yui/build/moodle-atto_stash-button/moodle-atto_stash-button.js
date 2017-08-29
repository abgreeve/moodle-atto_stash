YUI.add('moodle-atto_stash-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_stash
 * @copyright  2017 Adrian Greeve <adriangreeve.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_stash-button
 */

/**
 * Atto stash selection tool.
 *
 * @namespace M.atto_stash
 * @class Button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_stash',
    CSS = {
        SOURCE: 'atto_stash_source',
        ITEMS: 'atto_stash_items',
        TRADES: 'atto_stash_trades'
    },
    SELECTORS = {
        SOURCE: '.' + CSS.SOURCE
    },
    TEMPLATES = {
        ROOT: '' +
            '<form class="mform atto_form atto_media" id="{{elementid}}_atto_media_form">' +
                '<ul class="root nav nav-tabs" role="tablist">' +
                    '<li data-stash-type="{{CSS.ITEMS}}" class="nav-item">' +
                        '<a class="nav-link active" href="#{{elementid}}_{{CSS.ITEMS}}" role="tab" data-toggle="tab">' +
                            '{{get_string "items" component}}' +
                        '</a>' +
                    '</li>' +
                    '<li data-stash-type="{{CSS.TRADES}}" class="nav-item">' +
                        '<a class="nav-link" href="#{{elementid}}_{{CSS.TRADES}}" role="tab" data-toggle="tab">' +
                            '{{get_string "trades" component}}' +
                        '</a>' +
                    '</li>' +
                '</ul>' +
                '<div class="root tab-content">' +
                    '<div data-stash-type="{{CSS.ITEMS}}" class="tab-pane active" id="{{elementid}}_{{CSS.ITEMS}}">' +
                        '<div>Content for items</div>' +
                        // '{{> tab_panes.items}}' +
                    '</div>' +
                    '<div data-stash-type="{{CSS.TRADES}}" class="tab-pane" id="{{elementid}}_{{CSS.TRADES}}">' +
                        '<div>Content for trades</div>' +
                        // '{{> tab_panes.trades}}' +
                    '</div>' +
                '</div>' +
                '<div class="mdl-align">' +
                    '<br/>' +
                    '<button class="submit" type="submit">{{get_string "addsnippet" component}}</button>' +
                '</div>' +
            '</form>',
        TAB_PANES: {
            ITEMS: '' +
                '{{renderPartial "form_components.source" context=this id=CSS.LINK_SOURCE}}' +
                '<label>' +
                    'Enter name' +
                    '<input class="fullwidth {{CSS.NAME_INPUT}}" type="text" id="{{elementid}}_link_nameentry"' +
                        'size="32" required="true"/>' +
                '</label>',
            TRADES: '' +
                '{{renderPartial "form_components.source" context=this id=CSS.MEDIA_SOURCE entersourcelabel="videosourcelabel"' +
                    ' addcomponentlabel="addsource" multisource="true" addsourcehelp=helpStrings.addsource}}' +
                '<fieldset class="collapsible collapsed" id="{{elementid}}_video-display-options">' +
                    '<input name="mform_isexpanded_{{elementid}}_video-display-options" type="hidden">' +
                    '<legend class="ftoggler">{{get_string "displayoptions" component}}</legend>' +
                    '<div class="fcontainer">' +
                        '{{> form_components.display_options}}' +
                    '</div>' +
                '</fieldset>' +
                '<fieldset class="collapsible collapsed" id="{{elementid}}_video-advanced-settings">' +
                    '<input name="mform_isexpanded_{{elementid}}_video-advanced-settings" type="hidden">' +
                    '<legend class="ftoggler">{{get_string "advancedsettings" component}}</legend>' +
                    '<div class="fcontainer">' +
                        '{{> form_components.advanced_settings}}' +
                    '</div>' +
                '</fieldset>' +
                '<fieldset class="collapsible collapsed" id="{{elementid}}_video-tracks">' +
                    '<input name="mform_isexpanded_{{elementid}}_video-tracks" type="hidden">' +
                    '<legend class="ftoggler">{{get_string "tracks" component}} {{{helpStrings.tracks}}}</legend>' +
                    '<div class="fcontainer">' +
                        '{{renderPartial "form_components.track_tabs" context=this id=CSS.VIDEO}}' +
                    '</div>' +
                '</fieldset>'
        }
    };

Y.namespace('M.atto_stash').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    initializer: function() {

        window.console.log('random text');
        window.console.log(this.get('viewbutton'));
        window.console.log(this.get('testparam'));
        window.console.log(this.get('contextid'));

        if (!this.get('viewbutton')) {
            return;
        }

        this._getStashElements(this.get('courseid'));

        this.addButton({
            icon: 'e/stash_insert',
            iconComponent: COMPONENTNAME,
            callback: this._displayDialogue,
            tags: 'stash',
            tagMatchRequiresAll: false
        });

    },

    /**
     * Gets the root context for all templates, with extra supplied context.
     *
     * @method _getContext
     * @return {Object}
     * @private
     */
    _getContext: function() {
        return {
            elementid: this.get('host').get('elementid'),
            component: COMPONENTNAME,
            CSS: CSS
        };
        // return Y.merge({
        //     langsinstalled: this.get('langs').installed,
        //     langsavailable: this.get('langs').available,
        //     helpStrings: this.get('help'),
        // }, extra);
    },

    /**
     * Handles a click on a media element.
     *
     * @method _handleClick
     * @param  {EventFacade} e
     * @private
     */
    _handleClick: function(e) {
        var medium = e.target;

        var selection = this.get('host').getSelectionFromNode(medium);
        if (this.get('host').getSelection() !== selection) {
            this.get('host').setSelection(selection);
        }
    },

    /**
     * Display the media editing tool.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('addstashsnippets', COMPONENTNAME),
            focusAfterHide: true,
            width: 660,
            focusOnShowSelector: SELECTORS.URL_INPUT
        });

        // Set the dialogue content, and then show the dialogue.
        // dialogue.set('bodyContent', 'Not much').show();
        dialogue.set('bodyContent', this._getDialogueContent(this.get('host').getSelection())).show();
        M.form.shortforms({formid: this.get('host').get('elementid') + '_atto_stash_form'});
    },

    _getStashElements: function(courseid) {
        window.console.log(courseid);
    },

    /**
     * Returns the dialogue content for the tool.
     *
     * @method _getDialogueContent
     * @param  {WrappedRange[]} selection Current editor selection
     * @return {Y.Node}
     * @private
     */
    _getDialogueContent: function(selection) {
        var content = Y.Node.create(
            Y.Handlebars.compile(TEMPLATES.ROOT)(this._getContext())
        );

        return content;

        // var medium = this.get('host').getSelectedNodes().filter('video,audio').shift();
        // var mediumProperties = medium ? this._getMediumProperties(medium) : false;
        // return this._attachEvents(this._applyMediumProperties(content, mediumProperties), selection);
    },

    /**
     * Attaches required events to the content node.
     *
     * @method _attachEvents
     * @param  {Y.Node}         content The content to which events will be attached
     * @param  {WrappedRange[]} selection Current editor selection
     * @return {Y.Node}
     * @private
     */
    _attachEvents: function(content, selection) {
        // Delegate add component link for media source fields.
        content.delegate('click', function(e) {
            e.preventDefault();
            this._addMediaSourceComponent(e.currentTarget);
        }, SELECTORS.MEDIA_SOURCE + ' .addcomponent', this);

        // Delegate add component link for track fields.
        content.delegate('click', function(e) {
            e.preventDefault();
            this._addTrackComponent(e.currentTarget);
        }, SELECTORS.TRACK + ' .addcomponent', this);

        // Only allow one track per tab to be selected as "default".
        content.delegate('click', function(e) {
            var element = e.currentTarget;
            if (element.get('checked')) {
                var getKind = function(el) {
                    return this._getTrackTypeFromTabPane(el.ancestor('.tab-pane'));
                }.bind(this);

                element.ancestor('.root.tab-content').all(SELECTORS.TRACK_DEFAULT_SELECT).each(function(select) {
                    if (select !== element && getKind(element) === getKind(select)) {
                        select.set('checked', false);
                    }
                });
            }
        }, SELECTORS.TRACK_DEFAULT_SELECT, this);

        // Set up filepicker click event.
        content.delegate('click', function(e) {
            var element = e.currentTarget;
            var fptype = (element.ancestor(SELECTORS.POSTER_SOURCE) && 'image') ||
                    (element.ancestor(SELECTORS.TRACK_SOURCE) && 'subtitle') ||
                    'media';
            e.preventDefault();
            this.get('host').showFilepicker(fptype, this._getFilepickerCallback(element, fptype), this);
        }, '.openmediabrowser', this);

        // This is a nasty hack. Basically we are using BS4 markup for the tabs
        // but it isn't completely backwards compatible with BS2. The main problem is
        // that the "active" class goes on a different node. So the idea is to put it
        // the node for BS4, and then use CSS to make it look right in BS2. However,
        // once another tab is clicked, everything sorts itself out, more or less. Except
        // that the original "active" tab hasn't had the BS4 "active" class removed
        // (so the styles will still apply to it). So we need to remove the "active"
        // class on the BS4 node so that BS2 is happy.
        //
        // This doesn't upset BS4 since it removes this class anyway when clicking on
        // another tab.
        content.all('.nav-item').on('click', function(elem) {
            elem.currentTarget.get('parentNode').all('.active').removeClass('active');
        });

        content.one('.submit').on('click', function(e) {
            e.preventDefault();
            var mediaHTML = this._getMediaHTML(e.currentTarget.ancestor('.atto_form')),
                host = this.get('host');
            this.getDialogue({
                focusAfterHide: null
            }).hide();
            if (mediaHTML) {
                host.setSelection(selection);
                host.insertContentAtFocusPoint(mediaHTML);
                this.markUpdated();
            }
        }, this);

        return content;
    },

    /**
     * Applies medium properties to the content node.
     *
     * @method _applyMediumProperties
     * @param  {Y.Node} content The content to apply the properties to
     * @param  {object} properties The medium properties to apply
     * @return {Y.Node}
     * @private
     */
    _applyMediumProperties: function(content, properties) {
        if (!properties) {
            return content;
        }

        var applyTrackProperties = function(track, properties) {
            track.one(SELECTORS.TRACK_SOURCE + ' ' + SELECTORS.URL_INPUT).set('value', properties.src);
            track.one(SELECTORS.TRACK_LANG_INPUT).set('value', properties.srclang);
            track.one(SELECTORS.TRACK_LABEL_INPUT).set('value', properties.label);
            track.one(SELECTORS.TRACK_DEFAULT_SELECT).set('checked', properties.defaultTrack);
        };

        var tabPane = content.one('.root.tab-content > .tab-pane#' + this.get('host').get('elementid') +
                              '_' + properties.type.toLowerCase());

        // Populate sources.
        tabPane.one(SELECTORS.MEDIA_SOURCE + ' ' + SELECTORS.URL_INPUT).set('value', properties.sources[0]);
        Y.Array.each(properties.sources.slice(1), function(source) {
            this._addMediaSourceComponent(tabPane.one(SELECTORS.MEDIA_SOURCE + ' .addcomponent'), function(newComponent) {
                newComponent.one(SELECTORS.URL_INPUT).set('value', source);
            });
        }, this);

        // Populate tracks.
        Y.Object.each(properties.tracks, function(value, key) {
            var trackData = value.length ? value : [{src: '', srclang: '', label: '', defaultTrack: false}];
            var paneSelector = SELECTORS['TRACK_' + key.toUpperCase() + '_PANE'];

            applyTrackProperties(tabPane.one(paneSelector + ' ' + SELECTORS.TRACK), trackData[0]);
            Y.Array.each(trackData.slice(1), function(track) {
                this._addTrackComponent(
                    tabPane.one(paneSelector + ' ' + SELECTORS.TRACK + ' .addcomponent'), function(newComponent) {
                    applyTrackProperties(newComponent, track);
                });
            }, this);
        }, this);

        // Populate values.
        tabPane.one(SELECTORS.POSTER_SOURCE + ' ' + SELECTORS.URL_INPUT).setAttribute('value', properties.poster);
        tabPane.one(SELECTORS.WIDTH_INPUT).set('value', properties.width);
        tabPane.one(SELECTORS.HEIGHT_INPUT).set('value', properties.height);
        tabPane.one(SELECTORS.MEDIA_CONTROLS_TOGGLE).set('checked', properties.controls);
        tabPane.one(SELECTORS.MEDIA_AUTOPLAY_TOGGLE).set('checked', properties.autoplay);
        tabPane.one(SELECTORS.MEDIA_MUTE_TOGGLE).set('checked', properties.muted);
        tabPane.one(SELECTORS.MEDIA_LOOP_TOGGLE).set('checked', properties.loop);

        // Switch to the correct tab.
        var mediumType = this._getMediumTypeFromTabPane(tabPane);

        // Remove active class from all tabs + tab panes.
        tabPane.siblings('.active').removeClass('active');
        content.all('.root.nav-tabs .nav-item a').removeClass('active');

        // Add active class to the desired tab and tab pane.
        tabPane.addClass('active');
        content.one(SELECTORS[mediumType.toUpperCase() + '_TAB'] + ' a').addClass('active');

        return content;
    },

    /**
     * Extracts medium properties.
     *
     * @method _getMediumProperties
     * @param  {Y.Node} medium The medium node from which to extract
     * @return {Object}
     * @private
     */
    _getMediumProperties: function(medium) {
        var boolAttr = function(elem, attr) {
            return elem.getAttribute(attr) ? true : false;
        };

        var tracks = {
            subtitles: [],
            captions: [],
            descriptions: [],
            chapters: [],
            metadata: []
        };

        medium.all('track').each(function(track) {
            tracks[track.getAttribute('kind')].push({
                src: track.getAttribute('src'),
                srclang: track.getAttribute('srclang'),
                label: track.getAttribute('label'),
                defaultTrack: boolAttr(track, 'default')
            });
        });

        return {
            type: medium.test('video') ? MEDIA_TYPES.VIDEO : MEDIA_TYPES.AUDIO,
            sources: medium.all('source').get('src'),
            poster: medium.getAttribute('poster'),
            width: medium.getAttribute('width'),
            height: medium.getAttribute('height'),
            autoplay: boolAttr(medium, 'autoplay'),
            loop: boolAttr(medium, 'loop'),
            muted: boolAttr(medium, 'muted'),
            controls: boolAttr(medium, 'controls'),
            tracks: tracks
        };
    },

    /**
     * Adds a track form component.
     *
     * @method _addTrackComponent
     * @param  {Y.Node}   element    The element which was used to trigger this function
     * @param  {Function} [callback] Function to be called when the new component is added
     *     @param {Y.Node}    callback.newComponent The compiled component
     * @private
     */
    _addTrackComponent: function(element, callback) {
        var trackType = this._getTrackTypeFromTabPane(element.ancestor('.tab-pane'));
        var context = this._getContext({
            sourcelabel: trackType + 'sourcelabel',
            addcomponentlabel: 'add' + trackType + 'track'
        });

        this._addComponent(element, TEMPLATES.FORM_COMPONENTS.TRACK, SELECTORS.TRACK, context, callback);
    },

    /**
     * Adds a media source form component.
     *
     * @method _addMediaSourceComponent
     * @param  {Y.Node}   element    The element which was used to trigger this function
     * @param  {Function} [callback] Function to be called when the new component is added
     *     @param {Y.Node}    callback.newComponent The compiled component
     * @private
     */
    _addMediaSourceComponent: function(element, callback) {
        var mediumType = this._getMediumTypeFromTabPane(element.ancestor('.tab-pane'));
        var context = this._getContext({
            multisource: true,
            id: CSS.MEDIA_SOURCE,
            entersourcelabel: mediumType + 'sourcelabel',
            addcomponentlabel: 'addsource',
            addsourcehelp: this.get('help').addsource
        });
        this._addComponent(element, TEMPLATES.FORM_COMPONENTS.SOURCE, SELECTORS.MEDIA_SOURCE, context, callback);
    },

    /**
     * Adds an arbitrary form component.
     *
     * This function Compiles and adds the provided component in the supplied 'ancestor' container.
     * It will also add links to add/remove the relevant components, attaching the
     * necessary events.
     *
     * @method _addComponent
     * @param  {Y.Node}   element    The element which was used to trigger this function
     * @param  {String}   component  The component to compile and add
     * @param  {String}   ancestor   A selector used to find an ancestor of 'component', to which
     *                               the compiled component will be appended
     * @param  {Object}   context    The context with which to render the component
     * @param  {Function} [callback] Function to be called when the new component is added
     *     @param {Y.Node}    callback.newComponent The compiled component
     * @private
     */
    _addComponent: function(element, component, ancestor, context, callback) {
        var currentComponent = element.ancestor(ancestor),
            newComponent = Y.Node.create(Y.Handlebars.compile(component)(context)),
            removeNodeContext = this._getContext(context);

        removeNodeContext.label = "remove";
        var removeNode = Y.Node.create(Y.Handlebars.compile(TEMPLATES.FORM_COMPONENTS.REMOVE_COMPONENT)(removeNodeContext));

        removeNode.one('.removecomponent').on('click', function(e) {
            e.preventDefault();
            currentComponent.remove(true);
        });

        currentComponent.insert(newComponent, 'after');
        element.ancestor().insert(removeNode, 'after');
        element.ancestor().remove(true);

        if (callback) {
            callback.call(this, newComponent);
        }
    },

    /**
     * Returns the callback for the file picker to call after a file has been selected.
     *
     * @method _getFilepickerCallback
     * @param  {Y.Node} element The element which triggered the callback
     * @param  {String} fptype  The file pickertype (as would be passed to `showFilePicker`)
     * @return {Function} The function to be used as a callback when the file picker returns the file
     * @private
     */
    _getFilepickerCallback: function(element, fptype) {
        return function(params) {
            if (params.url !== '') {
                var tabPane = element.ancestor('.tab-pane');
                element.ancestor(SELECTORS.SOURCE).one(SELECTORS.URL_INPUT).set('value', params.url);

                // Links (and only links) have a name field.
                if (tabPane.get('id') === this.get('host').get('elementid') + '_' + CSS.LINK) {
                    tabPane.one(SELECTORS.NAME_INPUT).set('value', params.file);
                }

                if (fptype === 'subtitle') {
                    var subtitleLang = params.file.split('.vtt')[0].split('-').slice(-1)[0];
                    var langObj = this.get('langs').available.reduce(function(carry, lang) {
                        return lang.code === subtitleLang ? lang : carry;
                    }, false);
                    if (langObj) {
                        element.ancestor(SELECTORS.TRACK).one(SELECTORS.TRACK_LABEL_INPUT).set('value',
                                langObj.lang.substr(0, langObj.lang.lastIndexOf(' ')));
                        element.ancestor(SELECTORS.TRACK).one(SELECTORS.TRACK_LANG_INPUT).set('value', langObj.code);
                    }
                }
            }
        };
    },

    /**
     * Given a "medium" tab pane, returns what kind of medium it contains.
     *
     * @method _getMediumTypeFromTabPane
     * @param  {Y.Node} tabPane The tab pane
     * @return {String} The type of medium in the pane
     */
    _getMediumTypeFromTabPane: function(tabPane) {
        return tabPane.getAttribute('data-medium-type');
    },

    /**
     * Given a "track" tab pane, returns what kind of track it contains.
     *
     * @method _getTrackTypeFromTabPane
     * @param  {Y.Node} tabPane The tab pane
     * @return {String} The type of track in the pane
     */
    _getTrackTypeFromTabPane: function(tabPane) {
        return tabPane.getAttribute('data-track-kind');
    },

    /**
     * Returns the HTML to be inserted to the text area.
     *
     * @method _getMediaHTML
     * @param  {Y.Node} form The form from which to extract data
     * @return {String} The compiled markup
     * @private
     */
    _getMediaHTML: function(form) {
        var mediumType = this._getMediumTypeFromTabPane(form.one('.root.tab-content > .tab-pane.active'));
        var tabContent = form.one(SELECTORS[mediumType.toUpperCase() + '_PANE']);

        return this['_getMediaHTML' + mediumType[0].toUpperCase() + mediumType.substr(1)](tabContent);
    },

    /**
     * Returns the HTML to be inserted to the text area for the link tab.
     *
     * @method _getMediaHTMLLink
     * @param  {Y.Node} tab The tab from which to extract data
     * @return {String} The compiled markup
     * @private
     */
    _getMediaHTMLLink: function(tab) {
        var context = {
            url: tab.one(SELECTORS.URL_INPUT).get('value'),
            name: tab.one(SELECTORS.NAME_INPUT).get('value') || false
        };

        return context.url ? Y.Handlebars.compile(TEMPLATES.HTML_MEDIA.LINK)(context) : '';
    },

    /**
     * Returns the HTML to be inserted to the text area for the video tab.
     *
     * @method _getMediaHTMLVideo
     * @param  {Y.Node} tab The tab from which to extract data
     * @return {String} The compiled markup
     * @private
     */
    _getMediaHTMLVideo: function(tab) {
        var context = this._getContextForMediaHTML(tab);
        context.width = tab.one(SELECTORS.WIDTH_INPUT).get('value') || false;
        context.height = tab.one(SELECTORS.HEIGHT_INPUT).get('value') || false;
        context.poster = tab.one(SELECTORS.POSTER_SOURCE + ' ' + SELECTORS.URL_INPUT).get('value') || false;

        return context.sources.length ? Y.Handlebars.compile(TEMPLATES.HTML_MEDIA.VIDEO)(context) : '';
    },

    /**
     * Returns the HTML to be inserted to the text area for the audio tab.
     *
     * @method _getMediaHTMLAudio
     * @param  {Y.Node} tab The tab from which to extract data
     * @return {String} The compiled markup
     * @private
     */
    _getMediaHTMLAudio: function(tab) {
        var context = this._getContextForMediaHTML(tab);

        return context.sources.length ? Y.Handlebars.compile(TEMPLATES.HTML_MEDIA.AUDIO)(context) : '';
    },

    /**
     * Returns the context with which to render a media template.
     *
     * @method _getContextForMediaHTML
     * @param  {Y.Node} tab The tab from which to extract data
     * @return {Object}
     * @private
     */
    _getContextForMediaHTML: function(tab) {
        var tracks = [];

        tab.all(SELECTORS.TRACK).each(function(track) {
            tracks.push({
                track: track.one(SELECTORS.TRACK_SOURCE + ' ' + SELECTORS.URL_INPUT).get('value'),
                kind: this._getTrackTypeFromTabPane(track.ancestor('.tab-pane')),
                label: track.one(SELECTORS.TRACK_LABEL_INPUT).get('value') ||
                    track.one(SELECTORS.TRACK_LANG_INPUT).get('value'),
                srclang: track.one(SELECTORS.TRACK_LANG_INPUT).get('value'),
                defaultTrack: track.one(SELECTORS.TRACK_DEFAULT_SELECT).get('checked') ? "true" : null
            });
        }, this);

        return {
            sources: tab.all(SELECTORS.MEDIA_SOURCE + ' ' + SELECTORS.URL_INPUT).get('value').filter(function(source) {
                return !!source;
            }).map(function(source) {
                return {source: source};
            }),
            description: tab.one(SELECTORS.MEDIA_SOURCE + ' ' + SELECTORS.URL_INPUT).get('value') || false,
            tracks: tracks.filter(function(track) {
                return !!track.track;
            }),
            showControls: tab.one(SELECTORS.MEDIA_CONTROLS_TOGGLE).get('checked'),
            autoplay: tab.one(SELECTORS.MEDIA_AUTOPLAY_TOGGLE).get('checked'),
            muted: tab.one(SELECTORS.MEDIA_MUTE_TOGGLE).get('checked'),
            loop: tab.one(SELECTORS.MEDIA_LOOP_TOGGLE).get('checked')
        };
    }
}, {
    ATTRS: {
        viewbutton: {},
        courseid: {},
        testparam: {}
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
