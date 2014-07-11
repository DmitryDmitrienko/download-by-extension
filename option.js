function Folder(data) {
  var rules = document.getElementById('rules');
  this.node = document.getElementById('rule-template').cloneNode(true);
  this.node.id = 'rule' + (Folder.next_id++);
  this.node.rule = this;
  rules.appendChild(this.node);
  this.node.hidden = false;

  if (data) {
    this.getElement('matcher').value = data.matcher;
    this.getElement('match-param').value = data.match_param;
    this.getElement('action').value = data.action;
    this.getElement('action-js').value = data.action_js;
    this.getElement('enabled').checked = data.enabled;
  }

  this.getElement('enabled-label').htmlFor = this.getElement('enabled').id =
    this.node.id + '-enabled';

  this.render();

  this.getElement('matcher').onchange = storeRules;
  this.getElement('match-param').onkeyup = storeRules;
  this.getElement('action').onchange = storeRules;
  this.getElement('action-js').onkeyup = storeRules;
  this.getElement('enabled').onchange = storeRules;

  var rule = this;
  this.getElement('move-up').onclick = function() {
    var sib = rule.node.previousSibling;
    rule.node.parentNode.removeChild(rule.node);
    sib.parentNode.insertBefore(rule.node, sib);
    storeRules();
  };
  this.getElement('move-down').onclick = function() {
    var parentNode = rule.node.parentNode;
    var sib = rule.node.nextSibling.nextSibling;
    parentNode.removeChild(rule.node);
    if (sib) {
      parentNode.insertBefore(rule.node, sib);
    } else {
      parentNode.appendChild(rule.node);
    }
    storeRules();
  };
  this.getElement('remove').onclick = function() {
    rule.node.parentNode.removeChild(rule.node);
    storeRules();
  };
  storeRules();
}

Folder.prototype.getElement = function(name) {
  return document.querySelector('#' + this.node.id + ' .' + name);
}

Folder.prototype.render = function() {

}

Folder.next_id = 0;

function loadRules() {
  var rules = localStorage.rules;
  try {
    JSON.parse(rules).forEach(function(rule) {new Folder(rule);});
  } catch (e) {
    localStorage.rules = JSON.stringify([]);
  }
}

function storeRules() {
  localStorage.rules = JSON.stringify(Array.prototype.slice.apply(
      document.getElementById('rules').childNodes).map(function(node) {
    node.rule.render();
    return {matcher: node.rule.getElement('matcher').value,
            match_param: node.rule.getElement('match-param').value,
            action: node.rule.getElement('action').value,
            action_js: node.rule.getElement('action-js').value,
            enabled: node.rule.getElement('enabled').checked};
  }));
}

window.onload = function() {
  loadRules();
  document.getElementById('new').onclick = function() {
    new Folder();
  };
}