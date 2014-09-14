###
Copyright (c) 2014 The Codeant Authors. All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
Authors: 
 Anton Sinitsyn <sinicin2008@gmail.com>
 Dmitry Dmitrienko <dmitry.dmitrienko@outlook.com>
 Nickolai Rashevsky <rashevsky.n@gmail.com>
###

chrome.downloads.onDeterminingFilename.addListener (item, __suggest) -> 
  check_rule = (rule, profile, filename) ->
    types = profile[rule.select_index]
    for t in types.ext
      if filename.indexOf(t) > -1 or filename.toUpperCase().indexOf(t.toUpperCase()) > -1 
        return true
    false
  

  get_new_file_name = (rules, profile, filename) ->
    for rule in rules
      if check_rule rule, profile, filename 
        filename = "#{rule.path}/#{filename}"
    return filename

  chrome.storage.sync.get 'DBE_data', (items) ->
    data = items.DBE_data.data
    profile = items.DBE_data.profile
    new_file_name = get_new_file_name data, profile, item.filename
    __suggest
        filename: new_file_name,
        conflict_action: 'overwrite',
        conflictAction: 'overwrite'
  
  true