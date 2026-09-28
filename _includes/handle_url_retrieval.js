// Get subjects from URL/Cache
var url = new URL(window.location);
subs = url.searchParams.get("sub");
if (subs == undefined) {
  subs = store.get("{{site.domain}}-subs");
} else {
  subs = subs.toUpperCase().split(",");
}

// Apply selections
if (subs == undefined) {
  subs = all_subs;
}
$("#subject-select").multiselect("select", subs);

// Get continents from URL/Cache, same pattern as subjects.
continents = url.searchParams.get("continent");
if (continents == undefined) {
  continents = store.get("{{site.domain}}-continents");
} else {
  continents = continents.toUpperCase().split(",");
}
if (continents == undefined) {
  continents = all_continents;
}
$("#continent-select").multiselect("select", continents);

update_filtering({ subs: subs, continents: continents });
