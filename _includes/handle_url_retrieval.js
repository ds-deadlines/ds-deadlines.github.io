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

// Get ranks from URL/Cache, same pattern as subjects - but only on pages
// that actually compute all_ranks (currently just the main list), since
// unlike subs/continents it isn't backed by a small static data file.
var ranks = [];
if (typeof all_ranks !== "undefined") {
  ranks = url.searchParams.get("rank");
  if (ranks == undefined) {
    ranks = store.get("{{site.domain}}-ranks");
  } else {
    ranks = decodeURIComponent(ranks).split(";;;");
  }
  if (ranks == undefined) {
    ranks = all_ranks;
  }
  $("#rank-select").multiselect("select", ranks);
}

update_filtering({ subs: subs, continents: continents, ranks: ranks });
