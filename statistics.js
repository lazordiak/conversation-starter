const statistics = [
  {
    category: "incarceration",
    data:
    [
      {
        text:"In 2014, African Americans constituted 2.3 million, or 34%, of the total 6.8 million correctional population.",
        source:"https://www.naacp.org/criminal-justice-fact-sheet/",
        tags: ["prison", "prison industrial complex", "jail"]
      },
    ],
  },
  {
    category: "poverty",
    data:
    [
      {
        text:"The median household income among black Americans is still dramatically lower than among white Americans ($40,065, as compared to $65,041).",
        source:"https://www.epi.org/publication/50-years-after-the-kerner-commission/",
        tags: [ "poverty", "ineqaulity" ]
      },
    ]
  },
  {
    category: "health",
    data:
    [
      {
        text:"The infant mortality rate in America for per 1000 births is more than twice as high for black infants (11.4) as compared to white infants (4.9).",
        source:"https://www.epi.org/publication/50-years-after-the-kerner-commission/",
        tags: [ "infant mortality" ]
      },
      {
        text:"An African American born today can, on average, expect to live about 3.5 fewer years than a white person born on the same day.",
        source:"https://www.epi.org/publication/50-years-after-the-kerner-commission/#_note11",
        tags: [ "life expectancy" ]
      }
    ]
  }
]

exports.statistics = statistics;
