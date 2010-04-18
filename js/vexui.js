// Vex UI Utilities
// Mohit Muthanna <mohit@muthanna.com>
//
// jQuery UI wrappers.
//
// Requires: jQuery, jQueryUI, vexutils.js

function VexUI() {}

VexUI.Pulsate = function(sel) {
  var old_background = $(sel).css('background');
  var old_color = $(sel).css('color');

  $(sel).css('background', 'red');
  $(sel).css('color', 'yellow');

  $(sel).effect("pulsate", {}, 50, function() {
      $(sel).css('background', old_background);
      $(sel).css('color', old_color);
  });
}

VexUI.MessageBox = function(sel) {
  this.sel = sel
  this.sel_content = sel + " .content"
  this.sel_icon = sel + " .ui-icon"
}

VexUI.MessageBox.prototype.Initialize = function() {
  $(this.sel).dialog({
    bgiframe: true,
    modal: true,
    autoOpen: false,
    buttons: {
      Ok: function() { $(this).dialog('close') }
    }
  });
}

VexUI.MessageBox.prototype.Open = function(title, message, mode) {
  var boxclass = ""
  var icon = "alert"
  var state = ""

  if (mode == "alert") {
    boxclass = "alert"
    icon = "alert"
    state = "error"
  }

  $(this.sel).dialog("option", "title", title);
  $(this.sel).dialog("option", "dialogClass", boxclass);
  $(this.sel_content).empty();
  $(this.sel_content).text(message);

  $(this.sel_icon).removeClass(["ui-icon-alert"])
  $(this.sel_icon).addClass("ui-icon-" + icon);
  $(this.sel).dialog("open");
}

VexUI.MessageBox.prototype.Close = function() {
  $(this.sel).dialog("close");
}

VexUI.MessageBox.prototype.Destroy = function() {
  $(this.sel).dialog("destroy");
}
