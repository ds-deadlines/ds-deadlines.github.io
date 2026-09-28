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
  buttonText: function (options, select) {
    if (options.length === 0) {
      return "None selected";
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
  },
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
  buttonText: function (options, select) {
    if (options.length === 0) {
      return "None selected";
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
  },
  buttonTitle: function (options, select) {
    return "";
  },
});
