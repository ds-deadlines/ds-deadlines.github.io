// Borrowed from https://github.com/moment/moment-timezone/issues/167
// Adds support for time zones 'UTC-12'..'UTC+12'
function addUtcTimeZones() {
  // Moment.js uses the IANA timezone database, which supports generic time zones like 'Etc/GMT+1'.
  // However, the signs for these time zones are inverted compared to ISO 8601.
  // For more details, see https://github.com/moment/moment-timezone/issues/167
  for (let offset = -12; offset <= 12; offset++) {
    const posixSign = offset <= 0 ? "+" : "-";
    const isoSign = offset >= 0 ? "+" : "-";
    const link = `Etc/GMT${posixSign}${Math.abs(
      offset
    )}|UTC${isoSign}${Math.abs(offset)}`;
    moment.tz.link(link);
  }
}

// For conferences with a recurring (e.g. monthly) deadline instead of a single
// fixed one. `deadlineStr` is one known occurrence (same day-of-month/time as
// all the others); this advances it a month at a time until it's no longer in
// the past, capped at `untilStr` (the last confirmed occurrence) so a stale,
// un-updated entry doesn't silently drift into dates nobody ever confirmed.
function nextRollingOccurrence(deadlineStr, timezone, untilStr) {
  var occurrence = moment.tz(deadlineStr, timezone);
  var cap = untilStr ? moment.tz(untilStr, timezone) : null;
  var now = moment();
  while (occurrence.isBefore(now) && (!cap || occurrence.isBefore(cap))) {
    occurrence.add(1, "months");
  }
  return occurrence;
}

// Country/territory name (lowercased) -> continent code. Used to derive a
// conference's continent from its free-text `place` field when no explicit
// `continent` override is set. Keyed by country rather than by city/place
// string, since conferences change city/venue every edition but essentially
// never change country - so this table almost never needs updating when a
// conference moves, only the (much rarer) first time it's held somewhere in
// a country not covered here yet.
var COUNTRY_TO_CONTINENT = {
  // North America
  "usa": "NA", "united states": "NA", "united states of america": "NA",
  "us": "NA", "u.s.": "NA", "u.s.a.": "NA", "america": "NA",
  "canada": "NA", "mexico": "NA", "barbados": "NA", "jamaica": "NA",
  "cuba": "NA", "haiti": "NA", "dominican republic": "NA", "bahamas": "NA",
  "trinidad and tobago": "NA", "panama": "NA", "costa rica": "NA",
  "guatemala": "NA", "honduras": "NA", "el salvador": "NA",
  "nicaragua": "NA", "belize": "NA", "puerto rico": "NA", "bermuda": "NA",
  // South America
  "brazil": "SA", "argentina": "SA", "chile": "SA", "colombia": "SA",
  "peru": "SA", "venezuela": "SA", "ecuador": "SA", "bolivia": "SA",
  "paraguay": "SA", "uruguay": "SA", "guyana": "SA", "suriname": "SA",
  // Europe
  "uk": "EU", "united kingdom": "EU", "england": "EU", "scotland": "EU",
  "wales": "EU", "northern ireland": "EU", "great britain": "EU",
  "ireland": "EU", "france": "EU", "germany": "EU", "italy": "EU",
  "spain": "EU", "portugal": "EU", "netherlands": "EU",
  "the netherlands": "EU", "belgium": "EU", "switzerland": "EU",
  "austria": "EU", "sweden": "EU", "norway": "EU", "denmark": "EU",
  "finland": "EU", "iceland": "EU", "poland": "EU", "czechia": "EU",
  "czech republic": "EU", "slovakia": "EU", "hungary": "EU",
  "romania": "EU", "bulgaria": "EU", "greece": "EU", "croatia": "EU",
  "slovenia": "EU", "serbia": "EU", "bosnia and herzegovina": "EU",
  "montenegro": "EU", "north macedonia": "EU", "albania": "EU",
  "estonia": "EU", "latvia": "EU", "lithuania": "EU", "ukraine": "EU",
  "belarus": "EU", "moldova": "EU", "russia": "EU",
  "russian federation": "EU", "luxembourg": "EU", "malta": "EU",
  "cyprus": "EU", "monaco": "EU", "andorra": "EU", "san marino": "EU",
  "vatican city": "EU", "liechtenstein": "EU",
  // Asia
  "china": "AS", "japan": "AS", "south korea": "AS",
  "republic of korea": "AS", "korea": "AS", "north korea": "AS",
  "india": "AS", "pakistan": "AS", "bangladesh": "AS", "sri lanka": "AS",
  "nepal": "AS", "taiwan": "AS", "hong kong": "AS", "macau": "AS",
  "singapore": "AS", "malaysia": "AS", "indonesia": "AS",
  "philippines": "AS", "thailand": "AS", "vietnam": "AS",
  "cambodia": "AS", "laos": "AS", "myanmar": "AS", "mongolia": "AS",
  "kazakhstan": "AS", "uzbekistan": "AS", "turkmenistan": "AS",
  "kyrgyzstan": "AS", "tajikistan": "AS", "afghanistan": "AS",
  "iran": "AS", "iraq": "AS", "saudi arabia": "AS", "uae": "AS",
  "united arab emirates": "AS", "qatar": "AS", "kuwait": "AS",
  "bahrain": "AS", "oman": "AS", "yemen": "AS", "jordan": "AS",
  "lebanon": "AS", "syria": "AS", "israel": "AS", "palestine": "AS",
  "turkey": "AS", "brunei": "AS", "timor-leste": "AS", "bhutan": "AS",
  "maldives": "AS",
  // Africa
  "south africa": "AF", "egypt": "AF", "morocco": "AF", "algeria": "AF",
  "tunisia": "AF", "libya": "AF", "nigeria": "AF", "kenya": "AF",
  "ethiopia": "AF", "ghana": "AF", "tanzania": "AF", "uganda": "AF",
  "sudan": "AF", "senegal": "AF", "cameroon": "AF", "ivory coast": "AF",
  "cote d'ivoire": "AF", "zimbabwe": "AF", "zambia": "AF",
  "botswana": "AF", "namibia": "AF", "mozambique": "AF", "angola": "AF",
  "rwanda": "AF", "madagascar": "AF", "mali": "AF", "niger": "AF",
  "chad": "AF", "somalia": "AF", "congo": "AF",
  "democratic republic of the congo": "AF", "dr congo": "AF",
  "gabon": "AF", "benin": "AF", "burkina faso": "AF",
  "togo": "AF", "sierra leone": "AF", "liberia": "AF", "guinea": "AF",
  "malawi": "AF", "eritrea": "AF", "djibouti": "AF", "gambia": "AF",
  "lesotho": "AF", "eswatini": "AF", "swaziland": "AF",
  "mauritius": "AF", "seychelles": "AF", "cabo verde": "AF",
  "cape verde": "AF",
  // Oceania
  "australia": "OC", "new zealand": "OC", "fiji": "OC",
  "papua new guinea": "OC", "samoa": "OC", "tonga": "OC",
  "vanuatu": "OC", "solomon islands": "OC", "kiribati": "OC",
  "micronesia": "OC", "palau": "OC", "marshall islands": "OC",
  "nauru": "OC", "tuvalu": "OC",
  // Antarctica
  "antarctica": "AN",
};

// Derives a continent code from a free-text `place` string (e.g. "Denver, CO,
// USA" or "Barbados") by looking up its last comma-separated segment (or the
// whole string, for single-token places like city-states) against
// COUNTRY_TO_CONTINENT. Returns "XX" (Unknown) when nothing matches, rather
// than guessing - callers should surface that bucket visibly (e.g. as its own
// filter option) instead of silently mis-classifying or dropping the entry,
// so a real gap gets noticed and fixed (with an explicit `continent:`
// override on that conference) instead of failing quietly.
function deriveContinent(place) {
  if (!place) return "XX";
  var parts = place.split(",");
  var last = parts[parts.length - 1].trim().toLowerCase();
  if (COUNTRY_TO_CONTINENT[last]) return COUNTRY_TO_CONTINENT[last];
  var whole = place.trim().toLowerCase();
  if (COUNTRY_TO_CONTINENT[whole]) return COUNTRY_TO_CONTINENT[whole];
  return "XX";
}

// Faceted filtering: a conference is shown when it matches AT LEAST ONE
// selected value in EVERY facet that's actually wired up (subs, and
// continents/ranks once their globals exist - see load_data.js). Selecting
// "everything" in a facet is a no-op for it, same as never narrowing it.
// A conference with no data at all in a given facet (e.g. no rank source
// rated it) can only match once that facet is narrowed away from "select
// all" - same as it would in any other faceted search.
function update_filtering(data) {
  var page_url = "{{site.baseurl}}";

  var subs = data.subs || all_subs;
  store.set("{{site.domain}}-subs", subs);

  var hasContinents = typeof all_continents !== "undefined";
  var continents = hasContinents ? (data.continents || all_continents) : null;
  if (hasContinents) store.set("{{site.domain}}-continents", continents);

  var hasRanks = typeof all_ranks !== "undefined";
  var ranks = hasRanks ? (data.ranks || all_ranks) : null;
  if (hasRanks) store.set("{{site.domain}}-ranks", ranks);

  $(".ConfItem").each(function () {
    var el = $(this);
    var confSubs = (el.attr("data-subs") || "").split(",").filter(Boolean);
    var subMatch = confSubs.some(function (s) { return subs.indexOf(s) > -1; });

    var continentMatch = true;
    if (hasContinents) {
      var confContinent = el.attr("data-continent") || "XX";
      continentMatch = continents.indexOf(confContinent) > -1;
    }

    var rankMatch = true;
    if (hasRanks) {
      var confRanks = (el.attr("data-ranks") || "").split(";;;").filter(Boolean);
      rankMatch = ranks.length >= all_ranks.length || confRanks.some(function (r) { return ranks.indexOf(r) > -1; });
    }

    el.toggle(subMatch && continentMatch && rankMatch);
  });

  var params = [];
  if (subs.length > 0 && subs.length < all_subs.length) params.push("sub=" + subs.join());
  if (hasContinents && continents.length > 0 && continents.length < all_continents.length) params.push("continent=" + continents.join());
  if (hasRanks && ranks.length > 0 && ranks.length < all_ranks.length) params.push("rank=" + encodeURIComponent(ranks.join(";;;")));

  if (params.length === 0) {
    window.history.pushState("", "", page_url);
  } else {
    window.history.pushState("", "", page_url + "/?" + params.join("&"));
  }
}

function createCalendarFromObject(data) {
  return createCalendar({
    options: {
      class: "calendar-obj",

      // You can pass an ID. If you don't, one will be generated for you
      id: data.id,
    },
    data: {
      // Event title
      title: data.title,

      // Event start date
      start: data.date,

      // Event duration
      duration: 60,
    },
  });
}
