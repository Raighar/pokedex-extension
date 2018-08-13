// ==UserScript==
// @name         Pokedex Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds functions to Pokemon GO Pokedex website
// @author       Raighar
// @match        https://droomachine.github.io/index.html
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
  'use strict';

  // Export Buttom
  var exportLink = $('<a href="#" title="Export"></a>');
  var exportImage = $('<img src="https://image.flaticon.com/icons/svg/179/179419.svg" alt="export" id="export">');
  exportImage.css("padding-left", 5);
  exportImage.css("padding-top", 5);
  exportImage.css("height", 40);
  exportLink.append(exportImage);
  $("div.topnav").append(exportLink);

  // Import Button
  var importLink = $('<a href="#" title="Import"></a>');
  var importImage = $('<img src="https://image.flaticon.com/icons/svg/179/179381.svg" alt="export" id="import">');
  importImage.css("padding-left", 5);
  importImage.css("padding-top", 5);
  importImage.css("height", 40);
  importLink.append(importImage);
  $("div.topnav").append(importLink);

  // toString Button
  var toStringLink = $('<a href="#" title="Missing PKMN String"></a>');
  var toStringImage = $('<img src="https://image.flaticon.com/icons/svg/179/179394.svg" alt="toString" id="toString">');
  toStringImage.css("padding-left", 5);
  toStringImage.css("padding-top", 5);
  toStringImage.css("height", 40);
  toStringLink.append(toStringImage);
  $("div.topnav").append(toStringLink);

  // Event listeners
  $("#export").on("click", startExport);
  $("#import").on("click", function() { alert("To import data, simply paste the copied data!"); });
  $("#toString").on("click", toString);
  $(window).on("paste", function(e) {
    startImport(e.originalEvent.clipboardData.getData("text/plain"));
  });

  // Holds data
  var pokedexService = new PokedexService();

  // functions
  function copyToClipboard(text) {
    var dummy = $('<div>');
    $("body").append(dummy);
    dummy.attr("contenteditable", true)
      .html(text).select()
      .on("focus", function() { document.execCommand("selectAll", false, null) })
      .focus();

    document.execCommand("copy");
    dummy.remove();
    alert("Copied to Clipboard!");
  }

  function startExport() {
    if (localStorage.getItem('checked-checkboxes') && $.parseJSON(localStorage.getItem('checked-checkboxes')).length !== 0) {
      var encoded = btoa(localStorage.getItem('checked-checkboxes'));
      copyToClipboard(encoded);
    } else {
      alert("Nothing to export!");
    }
  }

  function startImport(data) {
    try {
      var decoded = atob(data);
      var arrCheckedCheckboxes = $.parseJSON(decoded);

      // simple document ready code
      $(arrCheckedCheckboxes.toString()).prop('checked', true);
      arrCheckedCheckboxes.forEach(function(obj) {
        var num = "cont";
        var n = obj.substr(1);
        num += n;
        document.getElementById(num).style.backgroundColor = "#62D17A";
      })
      var checkedBoxes = document.querySelectorAll('input[name=dex]:checked');
      var width = Math.round(checkedBoxes.length/386*10000)/100;
      document.getElementById("myBar").style.width = width + '%';
      document.getElementById("barLabel").innerHTML = "Pokedex Completion: ";
      document.getElementById("barLabel").innerHTML += width * 1  + '%';
      document.getElementById("barLabel").innerHTML += " | ";
      document.getElementById("barLabel").innerHTML += checkedBoxes.length;
      document.getElementById("barLabel").innerHTML += " / 386 completed";

      alert("Import successful!");
    } catch (Exception) {
      alert("Pasted invalid data!")
    }
  }

  function toString() {
    var output = "";

    // Entries
    var start = 0;
    $.each(pokedexService.genCounts, function(i, end) {
      output += "Gen " + (i + 1) + ":<br>";

      $.each(pokedexService.entries.slice(start, end), function(i, entry) {
        var checkbox = $("#" + entry.id);
        var label = checkbox.parent().children(".pokemon-name");

        if (!checkbox.prop("checked")) {
          output += entry.name + "<br>";
        }
      });

      output += "<br>";
      start = end + 1;
    });

    // Shinies
    output += "Shinies:<br>";
    $.each(pokedexService.shinies, function(i, entry) {
      var checkbox = $("#shiny" + entry.id);
      var label = checkbox.parent().children(".pokemon-name");

      if (!checkbox.prop("checked")) {
        output += entry.name + "<br>";
      }
    });
    output += "<br>";

    // Special
    output += "Special:<br>";
    $.each(pokedexService.special, function(i, entry) {
      var checkbox = $("#special" + entry.id);
      var label = checkbox.parent().children(".pokemon-name");

      if (!checkbox.prop("checked")) {
        output += entry.name + "<br>";
      }
    });
    output += "<br>";

    // Alolan
    output += "Alolan:<br>";
    $.each(pokedexService.alolan, function(i, entry) {
      var checkbox = $("#alolan" + entry.id);
      var label = checkbox.parent().children(".pokemon-name");

      if (!checkbox.prop("checked")) {
        output += entry.name + "<br>";
      }
    });
    output += "<br>";

    copyToClipboard(output);
  }
})();