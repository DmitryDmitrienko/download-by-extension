// Copyright (c) 2012 The Codeant Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* Authors: Anton Sinitsyn <sinicin2008@gmail.com>
 Dmitry Dmitrienko <dmitry.dmitrienko@outlook.com>
 Nickolai Rashevsky <rashevsky.n@gmail.com>
 */

chrome.downloads.onDeterminingFilename.addListener(function (item, __suggest) {

    function check_rule(rule, profile, filename) {
        var types = profile[rule.select_index];
        for (var i = 0; i < types._ext.length; i++) {
            if (filename.indexOf(types._ext[i]) > -1) {
                return true;
            }
        }
        return false;
    }

    function get_new_file_name(rules, profile, filename) {
        for (var i = 0; i < rules.length; i++) {
            if (check_rule(rules[i], profile, filename)) {
                return rules[i].path + "/" + filename;
            }
        }
        return filename;
    }

    chrome.storage.sync.get('DBE_data', function (items) {
        var data = items.DBE_data.data;
        var profile = items.DBE_data.profile;
        var new_file_name = get_new_file_name(data, profile, item.filename);
        __suggest({filename: new_file_name,
            conflict_action: 'overwrite',
            conflictAction: 'overwrite'});
    });

    return true;
});