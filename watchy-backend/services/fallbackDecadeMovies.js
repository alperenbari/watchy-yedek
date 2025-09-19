const FALLBACK_MOVIES = {
  1950: [
    {
      movie_id: 'fallback-1950-1',
      title: "Singin' in the Rain",
      posterUrl: null,
      overview: 'Gene Kelly ve Debbie Reynolds ile MGM müzikallerinin parıltısı.',
      release_year: 1952
    },
    {
      movie_id: 'fallback-1950-2',
      title: 'Rear Window',
      posterUrl: null,
      overview: 'Hitchcock klasik gerilimi mahalle gözetlemesine taşıdı.',
      release_year: 1954
    },
    {
      movie_id: 'fallback-1950-3',
      title: 'Ben-Hur',
      posterUrl: null,
      overview: 'Charlton Heston başrollü destansı araba yarışı hâlâ nefes kesiyor.',
      release_year: 1959
    }
  ],
  1960: [
    {
      movie_id: 'fallback-1960-1',
      title: 'Psycho',
      posterUrl: null,
      overview: 'Duş sahnesiyle korku sinemasının dilini değiştiren Hitchcock başyapıtı.',
      release_year: 1960
    },
    {
      movie_id: 'fallback-1960-2',
      title: 'Lawrence of Arabia',
      posterUrl: null,
      overview: 'David Lean çölleri 70mm sinemanın büyüsüne dönüştürdü.',
      release_year: 1962
    },
    {
      movie_id: 'fallback-1960-3',
      title: 'The Graduate',
      posterUrl: null,
      overview: 'Gençlik bunalımını ironik tonla anlatan Dustin Hoffman çıkışı.',
      release_year: 1967
    }
  ],
  1970: [
    {
      movie_id: 'fallback-1970-1',
      title: 'The Godfather',
      posterUrl: null,
      overview: 'Coppola mafya destanı aile dramını operatik seviyeye taşıdı.',
      release_year: 1972
    },
    {
      movie_id: 'fallback-1970-2',
      title: 'Taxi Driver',
      posterUrl: null,
      overview: 'Scorsese, Vietnam sonrası New York paranoyasını unutulmaz kıldı.',
      release_year: 1976
    },
    {
      movie_id: 'fallback-1970-3',
      title: 'Star Wars',
      posterUrl: null,
      overview: 'George Lucas uzay operasıyla blockbuster çağını başlattı.',
      release_year: 1977
    }
  ],
  1980: [
    {
      movie_id: 'fallback-1980-1',
      title: 'E.T. the Extra-Terrestrial',
      posterUrl: null,
      overview: 'Spielberg dostluk ve bilimkurguyu gişe fenomenine dönüştürdü.',
      release_year: 1982
    },
    {
      movie_id: 'fallback-1980-2',
      title: 'Back to the Future',
      posterUrl: null,
      overview: 'Zamanda yolculuğu mizahla birleştiren kült klasik.',
      release_year: 1985
    },
    {
      movie_id: 'fallback-1980-3',
      title: 'Blade Runner',
      posterUrl: null,
      overview: 'Ridley Scott neon-noir atmosferiyle siberpunk vizyonu kurdu.',
      release_year: 1982
    }
  ],
  1990: [
    {
      movie_id: 'fallback-1990-1',
      title: 'Pulp Fiction',
      posterUrl: null,
      overview: 'Tarantino pop kültürü diyaloğu ve doğrusal olmayan kurguyla tazeledi.',
      release_year: 1994
    },
    {
      movie_id: 'fallback-1990-2',
      title: 'The Shawshank Redemption',
      posterUrl: null,
      overview: 'Umut temasını hapishane dramında unutulmaz kılan klasik.',
      release_year: 1994
    },
    {
      movie_id: 'fallback-1990-3',
      title: 'The Matrix',
      posterUrl: null,
      overview: 'Wachowski kardeşler aksiyonu felsefi sorularla buluşturdu.',
      release_year: 1999
    }
  ],
  2000: [
    {
      movie_id: 'fallback-2000-1',
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      posterUrl: null,
      overview: 'Peter Jackson fantastik epikleri Oscar vitrinine taşıdı.',
      release_year: 2001
    },
    {
      movie_id: 'fallback-2000-2',
      title: 'Eternal Sunshine of the Spotless Mind',
      posterUrl: null,
      overview: 'Romantizmi bilimkurgu ile harmanlayan zarif hafıza yolculuğu.',
      release_year: 2004
    },
    {
      movie_id: 'fallback-2000-3',
      title: 'The Dark Knight',
      posterUrl: null,
      overview: 'Christopher Nolan süper kahraman türünü karanlık suç dramasına dönüştürdü.',
      release_year: 2008
    }
  ],
  2010: [
    {
      movie_id: 'fallback-2010-1',
      title: 'Inception',
      posterUrl: null,
      overview: 'Rüya içinde rüya kavramıyla gişe kurgusunu zekice zorlayan Nolan filmi.',
      release_year: 2010
    },
    {
      movie_id: 'fallback-2010-2',
      title: 'Mad Max: Fury Road',
      posterUrl: null,
      overview: 'George Miller aksiyon koreografisini çöl üstünde yeniden tanımladı.',
      release_year: 2015
    },
    {
      movie_id: 'fallback-2010-3',
      title: 'Moonlight',
      posterUrl: null,
      overview: 'Oscar ödüllü büyüme hikâyesi hassasiyet ve şiirsellikle parladı.',
      release_year: 2016
    }
  ],
  2020: [
    {
      movie_id: 'fallback-2020-1',
      title: 'Dune',
      posterUrl: null,
      overview: 'Denis Villeneuve bilimkurgu destanını çağdaş ölçekte yeniden yorumladı.',
      release_year: 2021
    },
    {
      movie_id: 'fallback-2020-2',
      title: 'Everything Everywhere All at Once',
      posterUrl: null,
      overview: 'Çoklu evreni aile dramı ve aksiyonla birleştiren yaratıcı fenomen.',
      release_year: 2022
    },
    {
      movie_id: 'fallback-2020-3',
      title: 'Top Gun: Maverick',
      posterUrl: null,
      overview: 'Tom Cruise nostaljiyi yüksek oktanlı hava gösterisine dönüştürdü.',
      release_year: 2022
    }
  ]
};

function getFallbackMovies(startYear, endYear, limit) {
  const movies = FALLBACK_MOVIES[startYear] || [];

  if (!movies.length) {
    return [];
  }

  return movies
    .filter((movie) => movie.release_year >= startYear && movie.release_year <= endYear)
    .slice(0, limit);
}

module.exports = {
  getFallbackMovies
};
