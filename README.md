## DS Deadlines 

Countdown timers to keep track of a bunch of Distributed Systems conference deadlines.

This is a fork of [ai-deadlin.es](https://github.com/paperswithcode/ai-deadlines). 

## Contributing

Contributions are very welcome!

To add or update a deadline:
- Fork the repository
- Update `_data/conferences.yml`
- Make sure it has the `title`, `year`, `id`, `link`, `deadline`, `timezone`, `date`, `place`, `sub` attributes
    + See available timezone strings [here](https://momentjs.com/timezone/).
- Optionally add a `note` and `abstract_deadline` in case the conference has a separate mandatory abstract deadline
- Optionally add `hindex` (refers to h5-index from [here](https://scholar.google.com/citations?view_op=top_venues&vq=eng))
- Optionally add `rank`, a list of one or more `{source, edition, value}` entries — one per ranking body that has rated the conference. Always name the source and edition explicitly rather than a bare letter, since different bodies use overlapping-looking scales. The two sources worth adding for *new* entries are:
    + [**CORE**](https://portal.core.edu.au/conf-ranks/) (edition e.g. `ICORE2026`) — scale `A*`, `A`, `B`, `C`
    + [**CCF**](https://www.ccf.org.cn/Academic_Evaluation/By_category/) (edition = the year of that catalog edition) — scale `A`, `B`, `C`
    + Older sources (`GGS`, `ERA`, `Qualis`) are frozen/superseded and only appear on entries migrated from before this field existed, tagged `edition: legacy` (or `edition: '2012'` for Qualis) since their exact original edition isn't known — don't use them for new entries
- Example:
    ```yaml
    - title: BestConf
      year: 2022
      id: bestconf22  # title as lower case + last two digits of year
      full_name: Best Conference for Anything  # full conference name
      link: link-to-website.com
      deadline: YYYY-MM-DD HH:SS
      abstract_deadline: YYYY-MM-DD HH:SS
      timezone: Asia/Seoul
      place: Incheon, South Korea
      date: September, 18-22, 2022
      start: YYYY-MM-DD
      end: YYYY-MM-DD
      paperslink: link-to-full-paper-list.com
      pwclink: link-to-papers-with-code.com
      hindex: 100.0
      sub: SP
      rank:
        - source: CORE
          edition: ICORE2026
          value: A
        - source: CCF
          edition: '2026'
          value: B
      note: Important
    ```
- Send a pull request

## License

This project is licensed under [MIT][1].

It uses:

- [IcoMoon Icons](https://icomoon.io/#icons-icomoon): [GPL](http://www.gnu.org/licenses/gpl.html) / [CC BY4.0](http://creativecommons.org/licenses/by/4.0/)

[1]: https://abhshkdz.mit-license.org/