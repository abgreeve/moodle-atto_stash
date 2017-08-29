<?php
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

/**
 * Atto text editor stash plugin lib.
 *
 * @package    atto_stash
 * @copyright  2017 Adrian Greeve <adriangreeve.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Initialise the strings required for JS.
 *
 * @return void
 */
function atto_stash_strings_for_js() {
    global $PAGE;
    $PAGE->requires->strings_for_js(array('addstashsnippets', 'items', 'trades', 'addsnippet'), 'atto_stash');
}

function atto_stash_get_fontawesome_icon_map() {
    return ['atto_stash:e/stash_insert' => 'fa-diamond'];
}

/**
 * Sends the parameters to JS module.
 *
 * @return array
 */
function atto_stash_params_for_js($elementid, $options, $fpoptions) {
    global $CFG, $USER, $PAGE;
    // require_once($CFG->dirroot . '/repository/lib.php');  // Load constants.

    // We need to get the course id, if it's not available then don't show the button.
    $context = $PAGE->context;
    $course = null;
    $viewbutton = false;
    if ($context->contextlevel == CONTEXT_COURSE || $context->contextlevel == CONTEXT_MODULE) {
        $course = $PAGE->course;
        $manager = \block_stash\manager::get($course->id);
        $viewbutton = $manager->can_manage($USER->id);
    }

    $params = [
            'viewbutton' => $viewbutton,
            'courseid' => isset($course) ? $course->id : null,
            'testparam' => 'This is an awesome test'
    ];

    print_object($params);

    return $params;
}
