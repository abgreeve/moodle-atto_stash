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
 * Atto stash installation file.
 *
 * @package    atto_stash
 * @copyright  2017 Adrian Greeve <adriangreeve.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Enable Stash plugin button on installation.
 */
function xmldb_atto_stash_install() {
    $toolbar = get_config('editor_atto', 'toolbar');

    // Example code.
    // if (strpos($toolbar, 'recordrtc') === false) {
    //     // Newline string changed in one of the latest versions from /n to /r/n.
    //     $glue = "\r\n";
    //     if (strpos($toolbar, $glue) === false) {
    //         $glue = "\n";
    //     }
    //     $groups = explode($glue, $toolbar);
    //     // Try to put recordrtc in files group.
    //     foreach ($groups as $i => $group) {
    //         $parts = explode('=', $group);
    //         if (trim($parts[0]) == 'files') {
    //             $groups[$i] = 'files = ' . trim($parts[1]) . ', recordrtc';
    //             // Update config variable.
    //             $toolbar = implode($glue, $groups);
    //             set_config('toolbar', $toolbar, 'editor_atto');
    //             return;
    //         }
    //     }
    // }
}