// Copyright (c) 2012 The Codeant Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* Authors: Anton Sinicyn <sinicin2008@gmail.com>
            Dmitry Dmitrienko <dmitry.dmitrienko@outlook.com>
            Nickolai Rashevsky <rashevskyn@gmail.com>
*/
chrome.downloads.onDeterminingFilename.addListener(function(item, __suggest) {
  function suggest(filename, conflictAction) {
    __suggest({filename: filename,
               conflictAction: conflictAction,
               conflict_action: conflictAction});
  }
});