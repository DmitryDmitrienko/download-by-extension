<<<<<<< HEAD
 // Copyright (c) 2012 The Codeant Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* Authors: Anton Sinitsyn <sinicin2008@gmail.com>
            Dmitry Dmitrienko <dmitry.dmitrienko@outlook.com>
            Nickolai Rashevsky <rashevsky.n@gmail.com>
*/

chrome.downloads.onDeterminingFilename.addListener(function(item, __suggest) {

  function TypeFile(name,attr,ext){
    this._name = name;
    this._attr = attr;
    this._ext = ext;
  };

  var listSelect = {
      "empty-type": new TypeFile("", "empty-type",[]),
      "doc-type": new TypeFile("Документы", "doc-type",[
      "docx",
      "pdf",
      "doc"
    ]),
    "torrent-type": new TypeFile("Torrents", "torrent-type",[
      "torrent"
    ]),
    "pic-type": new TypeFile("Картинки", "pic-type",[
      "jpeg",
      "png",
      "gif",
    ])
    };
  
function check_rule(rule, filename) {
    var types = listSelect[rule.select_index]
    for(var i = 0; i < types._ext.length; i++){
      if (filename.indexOf(types._ext[i]) > -1) {
        return true;
      }
    }
	  return false;
}
function get_new_file_name(rules, filename) {

    for (var i = 0; i < rules.length; i++) {
      	if (check_rule(rules[i], filename)) {
    		    return rules[i].path + "/" + filename;
    	  }
    }
    return filename;
}
  
  chrome.storage.sync.get('DBE_data', function(items){
  	  var rules = items.DBE_data;
  	  var new_file_name = get_new_file_name(rules, item.filename);
      __suggest({filename: new_file_name,
           conflict_action: 'overwrite',
           conflictAction: 'overwrite'});
  });
  
  return true;
=======
// Copyright (c) 2012 The Codeant Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* Authors: Anton Sinitsyn <sinicin2008@gmail.com>
            Dmitry Dmitrienko <dmitry.dmitrienko@outlook.com>
            Nickolai Rashevsky <rashevskyn@gmail.com>
*/
chrome.downloads.onDeterminingFilename.addListener(function(item, __suggest) {
  function suggest(filename, conflictAction) {
    __suggest({filename: filename,
               conflictAction: conflictAction,
               conflict_action: conflictAction});
  }
>>>>>>> FETCH_HEAD
});