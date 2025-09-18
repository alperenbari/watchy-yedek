const FALLBACK_MOVIES = {
  1950: [
    {
      movie_id: 'fallback-1950-1',
      title: 'Kanun Namına',
      posterUrl: null,
      overview: "Lütfi Ö. Akad'ın gerçek olaylardan uyarlanan suç draması.",
      release_year: 1952
    },
    {
      movie_id: 'fallback-1950-2',
      title: 'İstanbul Macerası',
      posterUrl: null,
      overview: 'Yeşilçam melodramlarının erken döneminden bir şehir hikâyesi.',
      release_year: 1955
    },
    {
      movie_id: 'fallback-1950-3',
      title: 'Gelinin Muradı',
      posterUrl: null,
      overview: 'Dönemin aile dramlarına örnek teşkil eden klasik film.',
      release_year: 1957
    }
  ],
  1960: [
    {
      movie_id: 'fallback-1960-1',
      title: 'Susuz Yaz',
      posterUrl: null,
      overview: "Metin Erksan'ın Berlin Altın Ayı ödüllü toplumsal dramı.",
      release_year: 1963
    },
    {
      movie_id: 'fallback-1960-2',
      title: 'Sevmek Zamanı',
      posterUrl: null,
      overview: 'Metaforlarla örülü unutulmaz bir aşk hikâyesi.',
      release_year: 1965
    },
    {
      movie_id: 'fallback-1960-3',
      title: 'Hudutların Kanunu',
      posterUrl: null,
      overview: "Yılmaz Güney ve Lütfi Ö. Akad işbirliğiyle çekilmiş toplumsal gerçekçi film.",
      release_year: 1966
    }
  ],
  1970: [
    {
      movie_id: 'fallback-1970-1',
      title: 'Selvi Boylum Al Yazmalım',
      posterUrl: null,
      overview: 'Aşkın emekle sınandığı unutulmaz Yeşilçam klasiği.',
      release_year: 1977
    },
    {
      movie_id: 'fallback-1970-2',
      title: 'Sürü',
      posterUrl: null,
      overview: 'Toplumsal dönüşümün dramatik hikâyesi.',
      release_year: 1978
    },
    {
      movie_id: 'fallback-1970-3',
      title: 'Arkadaş',
      posterUrl: null,
      overview: 'Yılmaz Güney imzalı sınıf çatışmasını merkezine alan film.',
      release_year: 1974
    }
  ],
  1980: [
    {
      movie_id: 'fallback-1980-1',
      title: 'Anayurt Oteli',
      posterUrl: null,
      overview: 'Yusuf Atılgan uyarlaması psikolojik bir dram.',
      release_year: 1987
    },
    {
      movie_id: 'fallback-1980-2',
      title: 'Muhsin Bey',
      posterUrl: null,
      overview: 'Arabesk kültürü üzerinden dönemin değişimini anlatan film.',
      release_year: 1987
    },
    {
      movie_id: 'fallback-1980-3',
      title: 'Aaahh Belinda',
      posterUrl: null,
      overview: 'Kimlik ve gerçeklik üzerine fantastik öğeler barındıran hiciv.',
      release_year: 1986
    }
  ],
  1990: [
    {
      movie_id: 'fallback-1990-1',
      title: 'Masumiyet',
      posterUrl: null,
      overview: 'Ömür boyu süren bir girdabın içine çekilen karakterlerin hikâyesi.',
      release_year: 1997
    },
    {
      movie_id: 'fallback-1990-2',
      title: 'Tabutta Rövaşata',
      posterUrl: null,
      overview: "İstanbul'un kenarında yaşayan mahzun bir karakterin dramı.",
      release_year: 1996
    },
    {
      movie_id: 'fallback-1990-3',
      title: 'Mayıs Sıkıntısı',
      posterUrl: null,
      overview: "Nuri Bilge Ceylan'ın kasaba üçlemesini tamamlayan film.",
      release_year: 1999
    }
  ],
  2000: [
    {
      movie_id: 'fallback-2000-1',
      title: 'Uzak',
      posterUrl: null,
      overview: 'Büyük şehirde yabancılaşmanın sessiz anlatısı.',
      release_year: 2002
    },
    {
      movie_id: 'fallback-2000-2',
      title: 'Yazı Tura',
      posterUrl: null,
      overview: 'Askerlik sonrası hayata tutunmaya çalışan iki gencin hikâyesi.',
      release_year: 2004
    },
    {
      movie_id: 'fallback-2000-3',
      title: 'İklimler',
      posterUrl: null,
      overview: 'İlişkilerin mevsimlere yayılan değişimini anlatan film.',
      release_year: 2006
    }
  ],
  2010: [
    {
      movie_id: 'fallback-2010-1',
      title: "Bir Zamanlar Anadolu'da",
      posterUrl: null,
      overview: 'Anadolu bozkırında geçen suç soruşturması üzerinden insan ruhu incelemesi.',
      release_year: 2011
    },
    {
      movie_id: 'fallback-2010-2',
      title: 'Kış Uykusu',
      posterUrl: null,
      overview: 'Cannes Altın Palmiye ödüllü uzun soluklu dram.',
      release_year: 2014
    },
    {
      movie_id: 'fallback-2010-3',
      title: 'Ahlat Ağacı',
      posterUrl: null,
      overview: 'Kök arayışındaki genç bir yazarın taşraya dönüş hikâyesi.',
      release_year: 2018
    }
  ],
  2020: [
    {
      movie_id: 'fallback-2020-1',
      title: 'Kurak Günler',
      posterUrl: null,
      overview: 'Bozkır kasabasındaki politik gerilimi anlatan çağdaş bir dram.',
      release_year: 2022
    },
    {
      movie_id: 'fallback-2020-2',
      title: 'Karanlık Gece',
      posterUrl: null,
      overview: 'Geçmişin hayaletleriyle yüzleşen bir gencin hikâyesi.',
      release_year: 2022
    },
    {
      movie_id: 'fallback-2020-3',
      title: 'İki Şafak Arasında',
      posterUrl: null,
      overview: 'Endüstriyel kazanın ardından vicdan muhasebesi yapan bir işçinin dramı.',
      release_year: 2021
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
