$(document).ready(function(){
  function std_rules() {
    var torrents = {};
    torrents['name'] = "torrents";
    torrents['path'] = "torrents/";
    torrents['files'] = ".torrent";

    var docs = {};
    docs['name'] = "documents";
    docs['path'] = "docs/";
    docs['files'] = ".doc,.docx,.pdf,.xls,.xlsx,.txt,.rtf,.ppt,.pptx";

    var arch = {};
    arch['name'] = "zips";
    arch['path'] = "zips/";
    arch['files'] = ".rar,.zip,.7z";  
    var list = [torrents, docs, arch];
    return list;
  }

  function rule_table_row(item) {
    var res = "<tr>";
    res += "<td>"+item.name + "</td>";
    res += "<td>"+item.dir + "</td>";
    res += "<td>"+item.files + "</td>";
    res += "</tr>";
    return res;
  }
  
  chrome.storage.sync.get('DBE_data', function(items){
    items = items.DBE_data;
    for(var i = 0; i < items.length; i++) {
      $("#rules_table tbody").append(rule_table_row(items[i]));
    }
  });
  
  
});


