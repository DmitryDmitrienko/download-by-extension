function TypeFile(name, attr, ext) {
    this._name = name;
    this._attr = attr;
    this._ext = ext;

}
function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    attach: function (listener) {
        this._listeners.push(listener);
    },
    notify: function (args) {
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);
        }
    }
};

function ListModel(items) {
    this._items = items;
    this._listSelect = {
        "empty-type": new TypeFile("", "empty-type", []),
        "doc-type": new TypeFile("Документы", "doc-type", [
            "docx",
            "pdf",
            "doc",
            "txt",
            "rtf",
            "odt",
            "tex",
            "docm"
        ]),
        "torrent-type": new TypeFile("Torrents", "torrent-type", [
            "torrent"
        ]),
        "pic-type": new TypeFile("Картинки", "pic-type", [
            "jpeg",
            "png",
            "gif",
        ]),
        "book-type": new TypeFile("Электронные книги", "book-type", [
            "djv",
            "fb2",
            "fb3",
            "mobi"
        ]),
        "video-type": new TypeFile("Видео", "video-type", [
            "mkv",
            "avi",
            "3gp",
            "mov",
            "bik",

        ]),
        "music-type": new TypeFile("Музыка", "music-type", [
            "mp3",
            "aac",
            "wav"

        ]),
        "archives": new TypeFile("Архивы", "archives-type",[
            "zip",
            "rar",
            "7z",
            "gzip",
            "gz",
            "tar"
        ])
    };

    this.itemAdded = new Event(this);
    this.itemRemoved = new Event(this);
}

ListModel.prototype = {
    getItems: function () {
        return [].concat(this._items);
    },

    addItem: function (item) {
        this._items.push({
            'select_index': item,
            'path': ''
        });
        this.itemAdded.notify({ item: item });
        this.save();
    },

    removeItemAt: function (index) {
        this._items.splice(index, 1);
        this.itemRemoved.notify();
        this.save();
    },

    updateSelect: function (index, value) {
        this._items[index].select_index = value;
        this.save();
    },

    updatePath: function (index, value) {
        this._items[index].path = value;
        this.save();
    },

    save: function () {
        chrome.storage.sync.set({
            'DBE_data': {
                'data': this._items,
                'profile': this._listSelect
            }
        }, function () {
            console.log("saved");
        });
    }
};

function ListView(model, elements) {
    this._model = model;
    this._elements = elements;

    this.listModified = new Event(this);
    this.addButtonClicked = new Event(this);
    this.delButtonClicked = new Event(this);
    this.selectOptionsChange = new Event(this);
    this.pathChange = new Event(this);
    this.saveButtonClicked = new Event(this);

    var _this = this;
    this._model.itemAdded.attach(function () {
        _this.rebuildList();
    });
    this._model.itemRemoved.attach(function () {
        _this.rebuildList();
    });

    this._elements.list.change(function (e) {
        _this.listModified.notify({ index: e.target.selectedIndex });
    });
    this._elements.addButton.click(function () {
        _this.addButtonClicked.notify();
    });

    this._elements.saveButton.click(function () {
        _this.saveButtonClicked.notify();
    });

    $("#rules").on('click', this._elements.delButton, function () {
        var index = parseInt($(this).parents('tr').attr('id'));
        _this.delButtonClicked.notify(index);
    });

    $("#rules").on('change', this._elements.selectOptions, function () {
        var index = parseInt($(this).parents('tr').attr('id'));
        var new_value = $(this).children(":selected").attr("id");
        _this.selectOptionsChange.notify({
            'index': index,
            'value': new_value
        });
    });

    $("#rules").on('change', this._elements.pathInput, function () {
        var index = parseInt($(this).parents('tr').attr('id'));
        var new_value = $(this).val();
        _this.pathChange.notify({
            'index': index,
            'value': new_value
        });
    });

}

ListView.prototype = {
    show: function () {
        this.rebuildList();
    },

    rebuildList: function () {
        var list, items, key;

        list = this._elements.list;
        list.html('');

        items = this._model.getItems();

        for (key in items) {
            if (items.hasOwnProperty(key)) {
                var html = "<tr " + 'id="' + key + '">';
                html += '<td>' + this.createHtmlSelect(items[key].select_index) + '</td>';
                html += '<td>' + '<input type="text" class="form-control input-dir" value="' + items[key].path + '"> </td>';
                html += '<td>' + '<button type="button" class="del btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>' + '</td>';
                html += '</tr>';
                list.prepend(html);
            }
        }
    },

    createHtmlSelect: function (typeSelect) {
        var html = '<select class="form-control type-file">';
        for (key in this._model._listSelect) {
            html += '<option id="' + key + '"';
            if (typeSelect === key)
                html += ' selected="selected"';
            html += ">" + this._model._listSelect[key]._name + '</option>';
        }
        html += '</select>';
        return html;
    }
};

function ListController(model, view) {
    this._model = model;
    this._view = view;

    var _this = this;

    this._view.addButtonClicked.attach(function () {
        _this.addItem();
    });

    this._view.delButtonClicked.attach(function (sender, index) {
        _this.delItem(index);
    });

    this._view.selectOptionsChange.attach(function (sender, data) {
        _this.updateSelect(data.index, data.value);
    });

    this._view.pathChange.attach(function (sender, data) {
        _this.updatePath(data.index, data.value);
    });

    this._view.saveButtonClicked.attach(function () {
        _this.saveData();
    });
}

ListController.prototype = {
    addItem: function () {
        this._model.addItem("empty-type");
    },

    delItem: function (index) {

        if (index !== -1) {
            var selector = "tr#" + index.toString();
            $(selector).remove();
            this._model.removeItemAt(index);
        }
    },

    updateSelect: function (index, value) {
        if (index !== -1) {
            this._model.updateSelect(index, value);
        }
    },

    updatePath: function (index, value) {
        if (index !== -1) {
            this._model.updatePath(index, value);
        }
    },

    saveData: function () {
        this._model.save();
    }

};

$(document).ready(function () {
    var data = [];
    //chrome.storage.sync.remove('DBE_data');
    chrome.storage.sync.get('DBE_data', function (items) {
        if ('DBE_data' in items) {
            data = items.DBE_data;
        }
        var model = new ListModel(data.data);
        var view = new ListView(model, {
            'list': $('#rules'),
            'addButton': $('#add-rule'),
            'delButton': ".del",
            'selectOptions': '.type-file',
            'pathInput': '.input-dir',
            'saveButton': $('save-rule')

        });
        var controller = new ListController(model, view);

        view.show();
    });
});