// Shared buttonText renderer for all three filter dropdowns below: shows
// "All" instead of every single label joined together (which gets very wide
// once there are more than a handful of options, e.g. the rank filter).
function multiselectButtonText(options, select) {
  var total = $(select).find("option").length;
  if (options.length === 0) {
    return "None selected";
  } else if (options.length === total) {
    return "All";
  } else {
    var labels = [];
    options.each(function () {
      if ($(this).attr("value") !== undefined) {
        labels.push($(this).attr("value"));
      } else {
        labels.push($(this).html());
      }
    });
    return labels.join(", ") + "";
  }
}

// Multi-select handler
$("#subject-select").multiselect({
  includeSelectAllOption: true,
  numberDisplayed: 5,
  onChange: function (option, checked, select) {
    var csub = $(option).val();
    if (checked == true) {
      if (subs.indexOf(csub) < 0) subs.push(csub);
    } else {
      var idx = subs.indexOf(csub);
      if (idx >= 0) subs.splice(idx, 1);
      // In case a conf with multiple types (including this type) is wrongly hid, show all confs with at least one checked type.
      for (var i = 0; i < subs.length; i++) {
        // $('.' + subs[i] + '-conf').show();
      }
    }
    update_filtering({ subs: subs });
  },
  onSelectAll: function (options) {
    subs = all_subs;
    update_filtering({ subs: subs });
  },
  onDeselectAll: function (options) {
    subs = [];
    update_filtering({ subs: subs });
  },
  buttonText: multiselectButtonText,
  buttonTitle: function (options, select) {
    return "";
  },
});

// Same pattern as #subject-select, for the rank facet. Options are every
// distinct (source, value) pair actually present in conferences.yml - shown
// as e.g. "A (CORE)" / "A (CCF)" - rather than picking one source to filter
// on, since different sources use overlapping-looking scales and only the
// visitor knows which one they care about.
$("#rank-select").multiselect({
  includeSelectAllOption: true,
  numberDisplayed: 3,
  onChange: function (option, checked, select) {
    var crank = $(option).val();
    if (checked == true) {
      if (ranks.indexOf(crank) < 0) ranks.push(crank);
    } else {
      var idx = ranks.indexOf(crank);
      if (idx >= 0) ranks.splice(idx, 1);
    }
    update_filtering({ ranks: ranks });
  },
  onSelectAll: function (options) {
    ranks = all_ranks;
    update_filtering({ ranks: ranks });
  },
  onDeselectAll: function (options) {
    ranks = [];
    update_filtering({ ranks: ranks });
  },
  buttonText: multiselectButtonText,
  buttonTitle: function (options, select) {
    return "";
  },
});

// Same pattern as #subject-select, for the continent facet.
$("#continent-select").multiselect({
  includeSelectAllOption: true,
  numberDisplayed: 3,
  onChange: function (option, checked, select) {
    var ccontinent = $(option).val();
    if (checked == true) {
      if (continents.indexOf(ccontinent) < 0) continents.push(ccontinent);
    } else {
      var idx = continents.indexOf(ccontinent);
      if (idx >= 0) continents.splice(idx, 1);
    }
    update_filtering({ continents: continents });
  },
  onSelectAll: function (options) {
    continents = all_continents;
    update_filtering({ continents: continents });
  },
  onDeselectAll: function (options) {
    continents = [];
    update_filtering({ continents: continents });
  },
  buttonText: multiselectButtonText,
  buttonTitle: function (options, select) {
    return "";
  },
});
