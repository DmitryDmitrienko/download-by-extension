$(document).ready ->
  ruleTableRow = (profile, item)->
    """
      <tr>
      <td>#{profile[item.select_index].name}</td>
      <td>#{item.path}</td>
      </tr>
    """

  chrome.storage.sync.get 'DBE_data', (items)->
    if 'DBE_data' of items
      console.log items.DBE_data
      data = items.DBE_data.data
      profile = items.DBE_data.profile
      body = $ "#rules_table tbody"
      for d in data
        body.append(ruleTableRow(profile, d))
  
  $("#rules_table tbody").on 'click', 'tr', (e) ->
    path = $(this).children("td").last().html()
    chrome.downloads.search {query: [path]}, (results) ->
      for res, i in results
        if results[i].exists
          return chrome.downloads.show results[i].id  
      return chrome.downloads.showDefaultFolder()  

  # перевод
  $("#table-type").text chrome.i18n.getMessage("extTypefiles")
  $("#table-directory").text chrome.i18n.getMessage("extDirectory")