// Vex Tools for JavaScript
// Mohit Muthanna <mohit@muthanna.com>
//
// Tools, utility functions, and other shared JS cruft.
//
// Requires: jQuery

function Vex() {}

/*
   function Vex.IsIE()

   Returns true if we're running in Internet Explorer.
*/
Vex.IsIE = function() {
  return /msie/i.test(
      navigator.userAgent) && !/opera/i.test(navigator.userAgent);
}

/*
  function Vex.Merge(dest, source)

  Merge the associative arrays (or objects) in dest and source. Modifies "dest"
  and returns its value.
*/
Vex.Merge = function(destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
};


/*
   function Vex.Ajax(url, data, handler);

   Call AJAX method in "url" using POST and data provided in "data". Upon
   success or error, calls:

      handler(success, data, textstatus, xmlhttprequest, error)

   where:

      success: bool (false if AJAX or API error)
      data: result
      textstatus: status code
        (One of: "timeout", "error", "notmodified", "parseerror", "apierror")
      xmlhttprequest: the request object
      error: an optional exception

   The AJAX method should return one of the following:

      1. Upon success:   { success: true, data: {...} }
      2. Upon error:     { success: false, message: "string" }

   Vex.error_sel (if set) is populated with the error message upon error.
*/
Vex.error_sel = "#error-message";

Vex.Ajax = function(url, data, handler) {
  $.ajax({
    type: "POST",
    'url': url,
    'data': data,
    'dataType': 'json',
    success: function(d, t, x) {
      if (!d) {
        log("Server Error: " + t + " in " + x);
        $(Vex.error_sel).text(
          "Unexpected server error. Please try again later.");
        $(Vex.error_sel).fadeIn(500).delay(3000).fadeOut(1000);
        handler(false, null, "servererror", x, null);
        return;
      }

      if (!d.success) {
        log("API Error: " + d.message);
        $(Vex.error_sel).text("(API Error) " + d.message);
        $(Vex.error_sel).fadeIn(500).delay(3000).fadeOut(1000);
        handler(false, d, "apierror", x, null);
      } else {
        handler(true, d, t, x, null);
      }
    },
    error: function(x, t, e) {
      log("Server Error: " + t);
      $(Vex.error_sel).text("(Server Error) " + t);
      $(Vex.error_sel).fadeIn(500).delay(3000).fadeOut(1000);
      handler(false, null, t, x, e);
    }
  });
}

/*
  Vex.InstallTracker - Install an asynchronous Google Analytics Tracker
  with the property ID supplied in "property_id".

  See http://google.com/analytics for details.
*/
Vex.InstallTracker = function(property_id) {
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', property_id]);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ?
      'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
  })();
}

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

// TODO(0xfe): Move these to Vex namespace.

function log(message) {
  if (window.console) {
    console.log(message);
  }
}

function html_escape(message) {
  return $('<div/>').text(message).html();
}
