class TypeFile then constructor:(@name, @atr, @ext)->

class Event
  constructor:(@sender, listeners=[]) -> @listeners = listeners
  attach: (listener)-> @listeners.push(listener)
  notify: (args)-> for listener in @listeners then listener(@sender, args)

class ListModel
  constructor: (@items)->
    @itemAdded = new Event @
    @itemRemoved = new Event @
    @listSelect = 
      'empty-type': new TypeFile '', 'empty-type', []
      'doc-type': new TypeFile chrome.i18n.getMessage("extDocument"), 'doc-type', [
            "docx",
            "pdf",
            "doc",
            "txt",
            "rtf",
            "odt",
            "tex",
            "docm",
            "ppt",
            "pptx",
            "xls",
            "xlsx"
        ]
      "torrent-type": new TypeFile chrome.i18n.getMessage("extTorrent"), "torrent-type", [
            "torrent"
        ]
      "pic-type": new TypeFile chrome.i18n.getMessage("picture"), "pic-type", [
            "jpg",
            "jpeg",
            "png",
            "gif",
        ]
      "book-type": new TypeFile chrome.i18n.getMessage("ebooks"), "book-type", [
            "djv",
            "fb2",
            "fb3",
            "mobi"
        ]
      "video-type": new TypeFile chrome.i18n.getMessage("extVideo"), "video-type", [
          "mkv",
          "avi",
          "3gp",
          "mov",
          "bik",

      ]
      "music-type": new TypeFile chrome.i18n.getMessage("extMusic"), "music-type", [
          "mp3",
          "aac",
          "wav"

      ]
      "archives-type": new TypeFile chrome.i18n.getMessage("extArchives"), "archives-type",[
          "zip",
          "rar",
          "7z",
          "gzip",
          "gz",
          "tar"
      ]
      "programm-type": new TypeFile chrome.i18n.getMessage("extProgramm"), "programm-type",[
          "exe",
          "com",
          "deb",
          "msi",
          "dmg"
      ]
      "image-type": new TypeFile chrome.i18n.getMessage("extImage"), "image-type",[
          "iso",
          "adf",
          "cso",
          "md0",
          "md1",
          "md2",
          "mdf"
      ]
  
  getItems: -> [].concat @items 
  addItem: (item)->
    object = 
      'select_index': item
      'path': ''
    @items.push object
    @itemAdded.notify {item: item}
    do @save
  removeItemAt: (index)->
    @items.splice index, 1
    do @itemRemoved.notify
    do @save
  updateSelect: (index, value)->
    @items[index].select_index = value
    do @save
  updatePath: (index, value)->
    @items[index].path = value
    do @save
  save: ->
    chrome.storage.sync.set 
      'DBE_data':
        'data': @items
        'profile': @listSelect
      ,
      -> console.log 'saved'

class ListView
  constructor:(@model, @elements)->
    @listModified = new Event @
    @addButtonClicked = new Event @
    @delButtonClicked = new Event @
    @selectOptionsChange = new Event @
    @pathChange = new Event @
    @saveButtonClicked = new Event @
    @helpButtonCicked = new Event @
    do @initEvent
    do @init

  initEvent:->
    @model.itemAdded.attach => 
      do @rebuildList
    @model.itemRemoved.attach => 
      do @rebuildList
    @elements.list.change (e) =>
      @listModified.notify 
        index: e.target.selectedIndex
    
    @elements.addButton.click =>
      do @addButtonClicked.notify

    @elements.saveButton.click =>
      do @saveButtonClicked.notify

    @elements.helpButton.click =>
      do @helpButtonCicked.notify

  init: ->
    $('#rules').on 'click', @elements.delButton,  (e) =>
      index = @getIndex e.currentTarget
      @delButtonClicked.notify index

    $("#rules").on 'change', @elements.selectOptions, (e) =>
      index = @getIndex e.currentTarget
      new_value = $(e.currentTarget).children(':selected').attr 'id'
      @selectOptionsChange.notify
        'index': index
        'value': new_value

    $('#rules').on 'change', @elements.pathInput, (e) =>
      index = @getIndex e.currentTarget
      new_value = do $(e.currentTarget).val
      @pathChange.notify
        'index': index
        'value': new_value

  getIndex: (self)-> parseInt $(self).parents('tr').attr 'id'

  show:-> do @rebuildList

  rebuildList: ->
    list = @elements.list
    list.html ''
    items = do @model.getItems

    for key of items
      if items.hasOwnProperty key
        html = """
        <tr id=#{key}>
        <td>#{@createHtmlSelect(items[key].select_index)}</td>
        <td><input type="text" class="form-control input-dir" name="inputDir" value="#{items[key].path}"> </td>
        <td> #{@createListExtensions(items[key].select_index)}</td>
        <td>
        <button type="button" class="del btn btn-default">
        <span class="glyphicon glyphicon-remove"></span>
        </button>
        </td>
        </tr>
        """
        list.prepend html

  createHtmlSelect: (typeSelect)->
    html = """
    <select class="form-control type-file">
    #{for key of @model.listSelect
      select = ' '
      if typeSelect == key
        select = ' selected="selected"'
      "<option id=" + key +  select + ">" + @model.listSelect[key].name + "</option>"
    }
    </select>
    """

  createListExtensions:(typeSelect)-> @model.listSelect[typeSelect].ext.join(', ')


class ListController
  constructor:(@model, @view)-> do @init

  init:->
    @view.addButtonClicked.attach =>
      do @addItem
    @view.delButtonClicked.attach (sender, index) =>
      @delItem index
    @view.selectOptionsChange.attach (sender, data) =>
      @updateSelect data.index, data.value
      do @view.rebuildList
    @view.pathChange.attach (sender, data) =>
      @updatePath data.index, data.value
    @view.saveButtonClicked.attach =>
      do @saveData
    @view.helpButtonCicked.attach =>
      $("#modalHelp").modal 'show'

  addItem:-> @model.addItem('empty-type')

  delItem:(index)->
    if index!=-1
      do $("tr##{do index.toString}").remove
      @model.removeItemAt index

  updateSelect: (index, value)->
    if index!=-1
      @model.updateSelect index,value

  updatePath: (index, value)->
    if index!=-1
      @model.updatePath index,value

  saveData:-> do @model.save



$(document).ready ->
  # перевод
  $("#add-rule").text chrome.i18n.getMessage("extAddRule")
  $("#saveRule").text chrome.i18n.getMessage("extSaveRule")
  $("#table-type").text chrome.i18n.getMessage("extTypefiles")
  $("#table-directory").text chrome.i18n.getMessage("extDirectory")
  $("#helpButton text").text chrome.i18n.getMessage("extHelp")
  $(".container h2").text chrome.i18n.getMessage("extDesc")
  $("#myModalLabel").text chrome.i18n.getMessage("extHelp")
  $("#buttonCloseModal").text chrome.i18n.getMessage("extClose")
  $("#helpMessage").text chrome.i18n.getMessage("extHelpMessage")
  $("#extension").text chrome.i18n.getMessage("extExtension")


  data = 
    'data': [
      {'select_index': 'doc-type', 'path': 'documents'}
      {'select_index': "torrent-type", 'path': 'torrents'}
      {'select_index': 'pic-type', 'path': 'picture'}
      {'select_index': 'book-type', 'path': 'books'}
      {'select_index': 'video-type', 'path': 'video'}
      {'select_index': 'music-type', 'path': 'music'}
      {'select_index': 'archives-type', 'path': 'archives'}
      {'select_index': 'programm-type', 'path': 'programms'}
      {'select_index': 'image-type', 'path': 'image'}
    ]
  #chrome.storage.sync.remove 'DBE_data'
  chrome.storage.sync.get 'DBE_data', (items)->
    if 'DBE_data' of items
      data = items.DBE_data
      console.log data
    model = new ListModel data.data
    elements = 
      'list': $("#rules")
      'addButton': $('#add-rule')
      'delButton': ".del"
      'selectOptions': '.type-file'
      'pathInput': '.input-dir'
      'saveButton': $('#saveRule') 
      'helpButton': $("#helpButton")
    view = new ListView model, elements
    controller = new ListController model, view
    do controller.saveData
    do view.show
