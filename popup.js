$(document).ready(function () {
    function rule_table_row(profile, item) {
        var res = "<tr>";
        res += "<td>" + profile[item.select_index]._name + "</td>";
        res += "<td>" + item.path + "</td>";
        res += "</tr>";
        return res;
    }

    chrome.storage.sync.get('DBE_data', function (items) {
        var data = items.DBE_data.data;
        var profile = items.DBE_data.profile;
        var body = $("#rules_table tbody");
        for (var i = 0; i < data.length; i++) {
            body.append(rule_table_row(profile, data[i]));
        }
    });

    // перевод
    $("#table-type").text(chrome.i18n.getMessage("extTypefiles"));
    $("#table-directory").text(chrome.i18n.getMessage("extDirectory"));


});


