
import { useEffect, useMemo, useRef, useState } from 'react';
import './thematicjourneys.css';
import {
  getPlatforms,
  searchMoviesByPeriod,
  searchMoviesByDirector,
  searchMoviesByActor,
  getPersonDetails
} from '../services/api';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w185';
const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2';

const DECADE_CONFIGS = [
  {
    id: '2020s',
    title: "2020'ler",
    subtitle: '',
    description: '',
    period: [2020, 2029],
    color: '#0ea5e9'
  },
  {
    id: '2010s',
    title: "2010'lar",
    subtitle: '',
    description: '',
    period: [2010, 2019],
    color: '#f97316'
  },
  {
    id: '2000s',
    title: "2000'ler",
    subtitle: '',
    description: '',
    period: [2000, 2009],
    color: '#dc2626'
  },
  {
    id: '1990s',
    title: "1990'lar",
    subtitle: '',
    description: '',
    period: [1990, 1999],
    color: '#16a34a'
  },
  {
    id: '1980s',
    title: "1980'ler",
    subtitle: '',
    description: '',
    period: [1980, 1989],
    color: '#2563eb'
  },
  {
    id: '1970s',
    title: "1970'ler",
    subtitle: '',
    description: '',
    period: [1970, 1979],
    color: '#db2777'
  },
  {
    id: '1960s',
    title: "1960'lar",
    subtitle: '',
    description: '',
    period: [1960, 1969],
    color: '#7c3aed'
  }
];

const DIRECTOR_CARDS = [
  {
    id: 'christopher-nolan',
    tmdbId: 525,
    title: 'Christopher Nolan',
    subtitle: 'Zamanı büken anlatılar',
    description: 'Epik ölçekli bilim kurgu ve gerilim filmleriyle modern blockbuster tanımını yeniledi.',
    color: '#1d4ed8',
    movies: [
      {
        id: 'inception',
        title: 'Inception',
        poster_path: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
        platforms: []
      },
      {
        id: 'the-dark-knight',
        title: 'The Dark Knight',
        poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        platforms: []
      },
      {
        id: 'interstellar',
        title: 'Interstellar',
        poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        platforms: []
      }
    ]
  },
  {
    id: 'steven-spielberg',
    tmdbId: 488,
    title: 'Steven Spielberg',
    subtitle: 'Hollywood’un hikâye ustası',
    description: 'Serüven, bilim kurgu ve dramı eşsiz bir duygusallıkla buluşturdu.',
    color: '#f97316',
    movies: [
      {
        id: 'jurassic-park',
        title: 'Jurassic Park',
        poster_path: '/bRKmwU9eXZI5dKT11Zx1KsayiLW.jpg',
        platforms: []
      },
      {
        id: 'schindlers-list',
        title: "Schindler's List",
        poster_path: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
        platforms: []
      },
      {
        id: 'et',
        title: 'E.T. the Extra-Terrestrial',
        poster_path: '/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg',
        platforms: []
      }
    ]
  },
  {
    id: 'martin-scorsese',
    tmdbId: 1032,
    title: 'Martin Scorsese',
    subtitle: 'Suç sinemasının efendisi',
    description: 'Karakter odaklı suç hikâyeleri ve enerjik anlatımıyla sinema tarihine damga vurdu.',
    color: '#dc2626',
    movies: [
      {
        id: 'goodfellas',
        title: 'Goodfellas',
        poster_path: '/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
        platforms: []
      },
      {
        id: 'the-wolf-of-wall-street',
        title: 'The Wolf of Wall Street',
        poster_path: '/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg',
        platforms: []
      },
      {
        id: 'taxi-driver',
        title: 'Taxi Driver',
        poster_path: '/ekstpH614fwDX8DUln1a2Opz0N8.jpg',
        platforms: []
      }
    ]
  },
  {
    id: 'quentin-tarantino',
    tmdbId: 138,
    title: 'Quentin Tarantino',
    subtitle: 'Pop kültür kurgucusu',
    description: 'Keskin diyalogları ve çizgisel olmayan kurgusuyla tür sinemasını baştan yorumladı.',
    color: '#7c3aed',
    movies: [
      {
        id: 'pulp-fiction',
        title: 'Pulp Fiction',
        poster_path: '/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg',
        platforms: []
      },
      {
        id: 'kill-bill-vol-1',
        title: 'Kill Bill: Vol. 1',
        poster_path: '/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg',
        platforms: []
      },
      {
        id: 'inglourious-basterds',
        title: 'Inglourious Basterds',
        poster_path: '/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg',
        platforms: []
      }
    ]
  },
  {
    id: 'alfred-hitchcock',
    tmdbId: 2636,
    title: 'Alfred Hitchcock',
    subtitle: 'Gerilimde ustalık dersi',
    description: 'Psikolojik gerilimdeki yenilikleriyle “gerilim ustası” unvanını hak etti.',
    color: '#0ea5e9',
    movies: [
      {
        id: 'psycho',
        title: 'Psycho',
        poster_path: '/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg',
        platforms: []
      },
      {
        id: 'vertigo',
        title: 'Vertigo',
        poster_path: '/5YAGO4huuHGB8f4X1G0wfy67QeB.jpg',
        platforms: []
      },
      {
        id: 'rear-window',
        title: 'Rear Window',
        poster_path: '/ILVF0eJxHMddjxeQhswFtpMtqx.jpg',
        platforms: []
      }
    ]
  },
  {
    id: 'stanley-kubrick',
    tmdbId: 240,
    title: 'Stanley Kubrick',
    subtitle: 'Kusursuz kadrajların mimarı',
    description: 'Teknik mükemmeliyetçiliğiyle her türde unutulmaz klasikleri ardında bıraktı.',
    color: '#db2777',
    movies: [
      {
        id: '2001-a-space-odyssey',
        title: '2001: A Space Odyssey',
        poster_path: '/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg',
        platforms: []
      },
      {
        id: 'a-clockwork-orange',
        title: 'A Clockwork Orange',
        poster_path: '/4sHeTAp65WrSSuc05nRBKddhBxO.jpg',
        platforms: []
      },
      {
        id: 'the-shining',
        title: 'The Shining',
        poster_path: '/xazWoLealQwEgqZ89MLZklLZD3k.jpg',
        platforms: []
      }
    ]
  },
  {
    id: 'ridley-scott',
    tmdbId: 578,
    title: 'Ridley Scott',
    subtitle: 'Bilim kurgu vizyoneri',
    description: 'Görsel dünyasıyla epik macera ve bilim kurgu hikâyelerini öne çıkardı.',
    color: '#16a34a',
    movies: [
      {
        id: 'gladiator',
        title: 'Gladiator',
        poster_path: '/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
        platforms: []
      },
      {
        id: 'alien',
        title: 'Alien',
        poster_path: '/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg',
        platforms: []
      },
      {
        id: 'blade-runner',
        title: 'Blade Runner',
        poster_path: '/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg',
        platforms: []
      }
    ]
  },
  {
    id: 'james-cameron',
    tmdbId: 2710,
    title: 'James Cameron',
    subtitle: 'Sınırları zorlayan vizyon',
    description: 'Teknolojik yenilikleri destansı aşk ve macera anlatılarıyla buluşturdu.',
    color: '#2563eb',
    movies: [
      {
        id: 'titanic',
        title: 'Titanic',
        poster_path: '/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
        platforms: []
      },
      {
        id: 'avatar',
        title: 'Avatar',
        poster_path: '/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg',
        platforms: []
      },
      {
        id: 'terminator-2',
        title: 'Terminator 2: Judgment Day',
        poster_path: '/weVXMD5QBGeQil4HEATZqAkXeEc.jpg',
        platforms: []
      }
    ]
  },
  {
    id: 'hayao-miyazaki',
    tmdbId: 608,
    title: 'Hayao Miyazaki',
    subtitle: 'Hayal gücünün efendisi',
    description: 'Anime sinemasını evrensel öyküler ve büyülü dünyalarla dünyaya tanıttı.',
    color: '#f59e0b',
    movies: [
      {
        id: 'spirited-away',
        title: 'Spirited Away',
        poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
        platforms: []
      },
      {
        id: 'my-neighbor-totoro',
        title: 'My Neighbor Totoro',
        poster_path: '/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg',
        platforms: []
      },
      {
        id: 'princess-mononoke',
        title: 'Princess Mononoke',
        poster_path: '/cMYCDADoLKLbB83g4WnJegaZimC.jpg',
        platforms: []
      }
    ]
  },
  {
    id: 'peter-jackson',
    tmdbId: 108,
    title: 'Peter Jackson',
    subtitle: 'Orta Dünya’nın mimarı',
    description: 'Yüzüklerin Efendisi uyarlamasıyla fantastik sinemada çığır açtı.',
    color: '#22d3ee',
    movies: [
      {
        id: 'lotr-fellowship',
        title: 'The Fellowship of the Ring',
        poster_path: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
        platforms: []
      },
      {
        id: 'lotr-two-towers',
        title: 'The Two Towers',
        poster_path: '/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg',
        platforms: []
      },
      {
        id: 'lotr-return-of-the-king',
        title: 'The Return of the King',
        poster_path: '/lTwUT4NsSyUQlHV20Mx3C96JHq4.jpg',
        platforms: []
      }
    ]
  }
];

const ACTOR_CARDS = [
  {
    id: 'tom-cruise',
    tmdbId: 500,
    name: 'Tom Cruise',
    profilePath: '/3mShHjSQR7NXOVbdTu5rT2Qd0MN.jpg'
  },
  {
    id: 'robert-downey-jr',
    tmdbId: 3223,
    name: 'Robert Downey Jr.',
    profilePath: '/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg'
  },
  {
    id: 'scarlett-johansson',
    tmdbId: 1245,
    name: 'Scarlett Johansson',
    profilePath: '/mjReG6rR7NPMEIWb1T4YWtV11ty.jpg'
  },
  {
    id: 'leonardo-dicaprio',
    tmdbId: 6193,
    name: 'Leonardo DiCaprio',
    profilePath: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg'
  },
  {
    id: 'dwayne-johnson',
    tmdbId: 18918,
    name: 'Dwayne Johnson',
    profilePath: '/5QApZVV8FUFlVxQpIK3Ew6cqotq.jpg'
  },
  {
    id: 'jennifer-lawrence',
    tmdbId: 72129,
    name: 'Jennifer Lawrence',
    profilePath: '/k6CsASaySnS3ag0Y2Ns2vqPahVn.jpg'
  },
  {
    id: 'brad-pitt',
    tmdbId: 287,
    name: 'Brad Pitt',
    profilePath: '/9OfnD7lxgIj3BNQpJFnwxnwl6w5.jpg'
  },
  {
    id: 'chris-hemsworth',
    tmdbId: 74568,
    name: 'Chris Hemsworth',
    profilePath: '/piQGdoIQOF3C1EI5cbYZLAW1gfj.jpg'
  },
  {
    id: 'angelina-jolie',
    tmdbId: 11701,
    name: 'Angelina Jolie',
    profilePath: '/bXNxIKcJ5cNNW8QFrBPWcfTSu9x.jpg'
  },
  {
    id: 'keanu-reeves',
    tmdbId: 6384,
    name: 'Keanu Reeves',
    profilePath: '/8RZLOyYGsoRe9p44q3xin9QkMHv.jpg'
  },
  {
    id: 'meryl-streep',
    tmdbId: 109,
    name: 'Meryl Streep',
    profilePath: '/7UKRbJBNG7mxBl2QQc5XsAh6F8B.jpg'
  },
  {
    id: 'natalie-portman',
    tmdbId: 524,
    name: 'Natalie Portman',
    profilePath: '/edPU5HxncLWa1YkgRPNkSd68ONG.jpg'
  },
  {
    id: 'christian-bale',
    tmdbId: 3894,
    name: 'Christian Bale',
    profilePath: '/7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg'
  },
  {
    id: 'morgan-freeman',
    tmdbId: 192,
    name: 'Morgan Freeman',
    profilePath: '/jPsLqiYGSofU4s6BjrxnefMfabb.jpg'
  },
  {
    id: 'samuel-l-jackson',
    tmdbId: 2231,
    name: 'Samuel L. Jackson',
    profilePath: '/AiAYAqwpM5xmiFrAIeQvUXDCVvo.jpg'
  },
  {
    id: 'cate-blanchett',
    tmdbId: 112,
    name: 'Cate Blanchett',
    profilePath: '/mXpe59YDxcvAJS6EtshsvsRvLZP.jpg'
  },
  {
    id: 'ryan-gosling',
    tmdbId: 30614,
    name: 'Ryan Gosling',
    profilePath: '/asoKC7CLCqpZKZDL6iovNurQUdf.jpg'
  },
  {
    id: 'anne-hathaway',
    tmdbId: 1813,
    name: 'Anne Hathaway',
    profilePath: '/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg'
  },
  {
    id: 'viola-davis',
    tmdbId: 90633,
    name: 'Viola Davis',
    profilePath: '/qCJB1ACi5VjtY4ypXuv3hjAvbSu.jpg'
  },
  {
    id: 'hugh-jackman',
    tmdbId: 6968,
    name: 'Hugh Jackman',
    profilePath: '/4Xujtewxqt6aU0Y81tsS9gkjizk.jpg'
  }
];

const ThematicJourneys = ({
  onContentChange,
  showPeriodSections = true,
  showPeopleSections = false,
  peopleSectionRef
}) => {
  const [moviesByDecade, setMoviesByDecade] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedDecade, setExpandedDecade] = useState(null);
  const [detailMovies, setDetailMovies] = useState({});
  const [detailLoadingDecade, setDetailLoadingDecade] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [platformsByMovieId, setPlatformsByMovieId] = useState({});
  const [expandedDirector, setExpandedDirector] = useState(null);
  const [directorDetailMovies, setDirectorDetailMovies] = useState({});
  const [directorDetailLoadingId, setDirectorDetailLoadingId] = useState(null);
  const [directorDetailError, setDirectorDetailError] = useState(null);
  const [expandedActor, setExpandedActor] = useState(null);
  const [actorDetailMovies, setActorDetailMovies] = useState({});
  const [actorDetailLoadingId, setActorDetailLoadingId] = useState(null);
  const [actorDetailError, setActorDetailError] = useState(null);
  const [actorProfiles, setActorProfiles] = useState({});

  const hasFetchedPeriodsRef = useRef(false);
  const actorProfilesLoadedRef = useRef(false);

  const dedupePlatforms = (platforms) =>
    Array.isArray(platforms)
      ? platforms.filter((platform, index, list) => {
          if (platform?.provider_id) {
            return (
              list.findIndex((item) => item?.provider_id === platform.provider_id) === index
            );
          }

          return (
            index ===
            list.findIndex((item) => item?.provider_name === platform?.provider_name)
          );
        })
      : [];

  useEffect(() => {
    if (!showPeriodSections) {
      setExpandedDecade(null);
      setDetailError(null);
    }
  }, [showPeriodSections]);

  useEffect(() => {
    if (!showPeopleSections) {
      setExpandedDirector(null);
      setDirectorDetailError(null);
      setExpandedActor(null);
      setActorDetailError(null);
    }
  }, [showPeopleSections]);

  useEffect(() => {
    if (!showPeopleSections || actorProfilesLoadedRef.current) {
      return;
    }

    let isMounted = true;

    const fetchProfiles = async () => {
      const entries = await Promise.all(
        ACTOR_CARDS.map(async (actor) => {
          try {
            const details = await getPersonDetails(actor.tmdbId);

            const normalizedName =
              typeof details?.name === 'string' && details.name.trim()
                ? details.name.trim()
                : actor.name;

            const normalizedPath =
              typeof details?.profile_path === 'string' && details.profile_path
                ? details.profile_path.trim()
                : actor.profilePath || null;

            return [actor.id, { name: normalizedName, profilePath: normalizedPath }];
          } catch (error) {
            console.error(`Oyuncu profili alınamadı (${actor.name}):`, error);
            return [actor.id, { name: actor.name, profilePath: actor.profilePath || null }];
          }
        })
      );

      if (!isMounted) {
        return;
      }

      setActorProfiles((prev) => {
        const next = { ...prev };
        let hasChanges = false;

        for (const entry of entries) {
          if (!entry) {
            continue;
          }

          const [id, data] = entry;
          const current = next[id];

          if (
            !current ||
            current.name !== data.name ||
            current.profilePath !== data.profilePath
          ) {
            next[id] = data;
            hasChanges = true;
          }
        }

        return hasChanges ? next : prev;
      });

      actorProfilesLoadedRef.current = true;
    };

    fetchProfiles();

    return () => {
      isMounted = false;
    };
  }, [showPeopleSections]);

  useEffect(() => {
    if (!showPeriodSections) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchMovies = async () => {
      if (hasFetchedPeriodsRef.current) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const responses = await Promise.all(
          DECADE_CONFIGS.map(({ period }) =>
            searchMoviesByPeriod(period[0], period[1])
          )
        );

        const platformUpdates = {};
        const normalized = {};

        await Promise.all(
          responses.map(async (movies, index) => {
            const decadeId = DECADE_CONFIGS[index].id;
            const decadeMovies = Array.isArray(movies) ? movies : [];

            const enriched = await Promise.all(
              decadeMovies.map(async (movie) => {
                const movieId = movie.movie_id || movie.id;

                if (!movieId) {
                  return null;
                }

                if (!platformUpdates[movieId]) {
                  try {
                    const platformRes = await getPlatforms(movieId);
                    platformUpdates[movieId] = {
                      platforms: Array.isArray(platformRes?.platforms)
                        ? platformRes.platforms
                        : [],
                      link: platformRes?.link ?? ''
                    };
                  } catch (error) {
                    console.error(`Platform bilgisi alınamadı (${movieId}):`, error);
                    platformUpdates[movieId] = {
                      platforms: [],
                      link: ''
                    };
                  }
                }

                return {
                  ...movie,
                  id: movieId,
                  platforms: platformUpdates[movieId].platforms,
                  link: platformUpdates[movieId].link
                };
              })
            );

            const filtered = enriched
              .filter((movie) => movie && movie.platforms.length > 0)
              .slice(0, 3);

            normalized[decadeId] = filtered;
          })
        );

        if (!isMounted) {
          return;
        }

        setMoviesByDecade(normalized);
        setPlatformsByMovieId((prev) => ({ ...prev, ...platformUpdates }));
        hasFetchedPeriodsRef.current = true;
      } catch (error) {
        console.error('Error fetching thematic movies:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, [showPeriodSections]);

  const journeys = useMemo(
    () =>
      DECADE_CONFIGS.map((config) => ({
        ...config,
        movies: moviesByDecade[config.id] || []
      })),
    [moviesByDecade]
  );

  const handleJourneySelect = async (journey) => {
    if (!journey) return;

    setExpandedDirector(null);
    setDirectorDetailError(null);
    setExpandedActor(null);
    setActorDetailError(null);

    if (expandedDecade === journey.id) {
      setExpandedDecade(null);
      setDetailError(null);
      return;
    }

    if (typeof onContentChange === 'function') {
      onContentChange();
    }

    setExpandedDecade(journey.id);
    setDetailError(null);

    if (detailMovies[journey.id]) {
      return;
    }

    try {
      setDetailLoadingDecade(journey.id);
      const movies = await searchMoviesByPeriod(journey.period[0], journey.period[1]);

      const platformUpdates = {};

      const formattedMovies = await Promise.all(
        (Array.isArray(movies) ? movies : []).map(async (movie) => {
          const movieId = movie.movie_id || movie.id;

          if (!movieId) {
            return null;
          }

          if (!platformUpdates[movieId]) {
            try {
              const platformRes = await getPlatforms(movieId);
              platformUpdates[movieId] = {
                platforms: Array.isArray(platformRes?.platforms)
                  ? platformRes.platforms
                  : [],
                link: platformRes?.link ?? ''
              };
            } catch (error) {
              console.error(`Platform bilgisi alınamadı (${movieId}):`, error);
              platformUpdates[movieId] = {
                platforms: [],
                link: ''
              };
            }
          }

          return {
            id: movieId,
            title: movie.title,
            posterUrl: movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : null,
            director: movie.director || null,
            cast: Array.isArray(movie.cast) ? movie.cast.slice(0, 3) : [],
            releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : null,
            platforms: platformUpdates[movieId].platforms,
            link: platformUpdates[movieId].link
          };
        })
      );

      const filteredMovies = formattedMovies
        .filter((movie) => movie && movie.platforms.length > 0)
        .slice(0, 12);

      setDetailMovies((prev) => ({
        ...prev,
        [journey.id]: filteredMovies
      }));
      setPlatformsByMovieId((prev) => ({ ...prev, ...platformUpdates }));
    } catch (error) {
      console.error('Error fetching decade highlights:', error);
      setDetailError('Bu dönemin popüler filmleri alınırken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDetailLoadingDecade(null);
    }
  };

  const handleDirectorSelect = async (director) => {
    if (!director) return;

    setExpandedDecade(null);
    setDetailError(null);
    setExpandedActor(null);
    setActorDetailError(null);

    if (expandedDirector === director.id) {
      setExpandedDirector(null);
      setDirectorDetailError(null);
      return;
    }

    if (typeof onContentChange === 'function') {
      onContentChange();
    }

    setExpandedDirector(director.id);
    setDirectorDetailError(null);

    if (directorDetailMovies[director.id]) {
      return;
    }

    if (!director.tmdbId) {
      setDirectorDetailError('Bu yönetmen için film bilgisi bulunamadı.');
      return;
    }

    try {
      setDirectorDetailLoadingId(director.id);
      const movies = await searchMoviesByDirector(director.tmdbId);

      const platformUpdates = {};

      const formattedMovies = await Promise.all(
        (Array.isArray(movies) ? movies : []).map(async (movie) => {
          const movieId = movie.movie_id || movie.id;

          if (!movieId) {
            return null;
          }

          if (!platformUpdates[movieId]) {
            if (platformsByMovieId[movieId]) {
              platformUpdates[movieId] = platformsByMovieId[movieId];
            } else {
              try {
                const platformRes = await getPlatforms(movieId);
                platformUpdates[movieId] = {
                  platforms: Array.isArray(platformRes?.platforms)
                    ? platformRes.platforms
                    : [],
                  link: platformRes?.link ?? ''
                };
              } catch (error) {
                console.error(`Platform bilgisi alınamadı (${movieId}):`, error);
                platformUpdates[movieId] = {
                  platforms: [],
                  link: ''
                };
              }
            }
          }

          const platformInfo = platformUpdates[movieId] || { platforms: [], link: '' };

          return {
            id: movieId,
            title: movie.title,
            posterUrl: movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : null,
            director: movie.director || director.title,
            cast: Array.isArray(movie.cast) ? movie.cast.slice(0, 3) : [],
            releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : null,
            platforms: platformInfo.platforms,
            link: platformInfo.link
          };
        })
      );

      const filteredMovies = formattedMovies
        .filter((movie) => movie && movie.platforms.length > 0)
        .slice(0, 12);

      setDirectorDetailMovies((prev) => ({
        ...prev,
        [director.id]: filteredMovies
      }));
      setPlatformsByMovieId((prev) => ({ ...prev, ...platformUpdates }));
    } catch (error) {
      console.error('Error fetching director highlights:', error);
      setDirectorDetailError('Bu yönetmenin filmleri alınırken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDirectorDetailLoadingId(null);
    }
  };

  const handleActorSelect = async (actor) => {
    if (!actor) return;

    setExpandedDecade(null);
    setDetailError(null);
    setExpandedDirector(null);
    setDirectorDetailError(null);

    if (expandedActor === actor.id) {
      setExpandedActor(null);
      setActorDetailError(null);
      return;
    }

    if (typeof onContentChange === 'function') {
      onContentChange();
    }

    setExpandedActor(actor.id);
    setActorDetailError(null);

    if (actorDetailMovies[actor.id]) {
      return;
    }

    if (!actor.tmdbId) {
      setActorDetailError('Bu oyuncu için film bilgisi bulunamadı.');
      return;
    }

    try {
      setActorDetailLoadingId(actor.id);
      const movies = await searchMoviesByActor(actor.tmdbId);

      const platformUpdates = {};

      const formattedMovies = await Promise.all(
        (Array.isArray(movies) ? movies : []).map(async (movie) => {
          const movieId = movie.movie_id || movie.id;

          if (!movieId) {
            return null;
          }

          if (!platformUpdates[movieId]) {
            if (platformsByMovieId[movieId]) {
              platformUpdates[movieId] = platformsByMovieId[movieId];
            } else {
              try {
                const platformRes = await getPlatforms(movieId);
                platformUpdates[movieId] = {
                  platforms: Array.isArray(platformRes?.platforms)
                    ? platformRes.platforms
                    : [],
                  link: platformRes?.link ?? ''
                };
              } catch (error) {
                console.error(`Platform bilgisi alınamadı (${movieId}):`, error);
                platformUpdates[movieId] = {
                  platforms: [],
                  link: ''
                };
              }
            }
          }

          const platformInfo = platformUpdates[movieId] || { platforms: [], link: '' };

          return {
            id: movieId,
            title: movie.title,
            posterUrl: movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : null,
            director: movie.director || null,
            cast: Array.isArray(movie.cast) ? movie.cast.slice(0, 3) : [],
            releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : null,
            platforms: platformInfo.platforms,
            link: platformInfo.link
          };
        })
      );

      const filteredMovies = formattedMovies
        .filter((movie) => movie && movie.platforms.length > 0)
        .slice(0, 12);

      setActorDetailMovies((prev) => ({
        ...prev,
        [actor.id]: filteredMovies
      }));
      setPlatformsByMovieId((prev) => ({ ...prev, ...platformUpdates }));
    } catch (error) {
      console.error('Error fetching actor highlights:', error);
      setActorDetailError('Bu oyuncunun filmleri alınırken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setActorDetailLoadingId(null);
    }
  };

  const handleKeyPress = (event, journey) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleJourneySelect(journey);
    }
  };

  const handleDirectorKeyPress = (event, director) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDirectorSelect(director);
    }
  };

  const handleActorKeyPress = (event, actor) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActorSelect(actor);
    }
  };

  const actorsWithProfiles = useMemo(
    () =>
      ACTOR_CARDS.map((actor) => {
        const override = actorProfiles[actor.id] || {};

        const resolvedName =
          typeof override.name === 'string' && override.name.trim()
            ? override.name.trim()
            : actor.name;

        const resolvedProfilePath =
          typeof override.profilePath === 'string' && override.profilePath
            ? override.profilePath
            : actor.profilePath || null;

        return {
          ...actor,
          name: resolvedName,
          profilePath: resolvedProfilePath
        };
      }),
    [actorProfiles]
  );

  const activeJourney = useMemo(
    () => journeys.find((journey) => journey.id === expandedDecade) || null,
    [expandedDecade, journeys]
  );

  const activeDirector = useMemo(
    () => DIRECTOR_CARDS.find((director) => director.id === expandedDirector) || null,
    [expandedDirector]
  );

  const activeActor = useMemo(
    () => actorsWithProfiles.find((actor) => actor.id === expandedActor) || null,
    [actorsWithProfiles, expandedActor]
  );

  return (
    <section className="thematic-journeys">
      {showPeriodSections && (
        <>
          <h2 className="section-title">Dönem Filmleri</h2>
          {loading ? (
            <div
              className="loading-placeholder"
              role="status"
              aria-label="İçerik yükleniyor"
            />
          ) : (
            <>
              <div className="journeys-container">
                {journeys.map((journey) => (
                  <div
                    key={journey.id}
                    className={`journey-card${expandedDecade === journey.id ? ' journey-card--active' : ''}`}
                    style={{ backgroundColor: journey.color }}
                    onClick={() => handleJourneySelect(journey)}
                    onKeyDown={(event) => handleKeyPress(event, journey)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={expandedDecade === journey.id}
                  >
                    <div className="journey-header">
                      <h3 className="journey-title">{journey.title}</h3>
                      {journey.subtitle && <h4 className="journey-subtitle">{journey.subtitle}</h4>}
                      {journey.description && (
                        <p className="journey-description">{journey.description}</p>
                      )}
                    </div>

                    {journey.movies.length === 0 ? (
                      <div className="journey-empty">Bu dönemde yayın platformlarında uygun film bulunamadı.</div>
                    ) : (
                      <div className="journey-movies">
                        {journey.movies.map((movie, index) => {
                          const uniquePlatforms = dedupePlatforms(movie.platforms);
                          const movieId = movie.id || movie.movie_id;
                          const movieLink = movie.link || (movieId ? platformsByMovieId[movieId]?.link : '');

                          return (
                            <div key={movie.id || movie.movie_id || index} className="movie-poster">
                              {movie.poster_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                                  alt={movie.title}
                                  className="poster-image"
                                />
                              ) : (
                                <div className="poster-placeholder">
                                  <span>🎬</span>
                                </div>
                              )}

                              <div className="movie-platforms">
                                {uniquePlatforms.map((platform) => {
                                  const linkForPlatform =
                                    platform?.direct_link ||
                                    platform?.external_link ||
                                    movieLink;
                                  const badgeContent = (
                                    <>
                                      <img
                                        src={
                                          platform?.logo_path === '/yt'
                                            ? 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_(2017).svg'
                                            : `https://image.tmdb.org/t/p/w92${platform?.logo_path}`
                                        }
                                        alt={platform?.provider_name}
                                        title={platform?.provider_name}
                                      />
                                      <span>{platform?.provider_name}</span>
                                    </>
                                  );

                                  return linkForPlatform ? (
                                    <a
                                      key={platform?.provider_id || platform?.provider_name}
                                      className="platform-badge"
                                      href={linkForPlatform}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {badgeContent}
                                    </a>
                                  ) : (
                                    <div
                                      key={platform?.provider_id || platform?.provider_name}
                                      className="platform-badge"
                                    >
                                      {badgeContent}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="journey-indicators">
                      <span className="indicator active"></span>
                      <span className="indicator"></span>
                      <span className="indicator"></span>
                    </div>
                  </div>
                ))}
              </div>

              {activeJourney && (
                <div className="journey-detail-panel">
                  <div className="journey-detail-header">
                    <div className="journey-detail-headline">
                      <span className="journey-detail-years">
                        {activeJourney.period[0]} – {activeJourney.period[1]}
                      </span>
                      <h3 className="journey-detail-title">{activeJourney.title}</h3>
                      {activeJourney.subtitle && (
                        <p className="journey-detail-subtitle">{activeJourney.subtitle}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      className="journey-detail-close"
                      onClick={() => {
                        setExpandedDecade(null);
                        setDetailError(null);
                      }}
                    >
                      Kapat
                    </button>
                  </div>

                  <p className="journey-detail-description">{activeJourney.description}</p>

                  {detailLoadingDecade === activeJourney.id ? (
                    <div
                      className="journey-detail-loading"
                      role="status"
                      aria-label="İçerik yükleniyor"
                    />
                  ) : detailError ? (
                    <div className="journey-detail-error">{detailError}</div>
                  ) : (detailMovies[activeJourney.id] || []).length === 0 ? (
                    <div className="journey-detail-empty">Bu dönemde platformlarda izlenebilecek film bulunamadı.</div>
                  ) : (
                    <div className="detail-movie-list">
                      {(detailMovies[activeJourney.id] || []).map((movie) => {
                        const uniquePlatforms = dedupePlatforms(movie.platforms);
                        const movieLink = movie.link || (movie.id ? platformsByMovieId[movie.id]?.link : '');

                        return (
                          <article key={movie.id} className="detail-movie-card">
                            <div className="detail-movie-poster">
                              {movie.posterUrl ? (
                                <img src={movie.posterUrl} alt={movie.title} />
                              ) : (
                                <div className="detail-movie-placeholder" aria-hidden="true">
                                  🎞️
                                </div>
                              )}
                            </div>

                            <div className="detail-movie-meta">
                              <h4 className="detail-movie-title">
                                {movie.title}
                                {movie.releaseYear ? <span className="detail-movie-year"> ({movie.releaseYear})</span> : null}
                              </h4>
                              <p className="detail-movie-director">
                                {movie.director ? `Yönetmen: ${movie.director}` : 'Yönetmen bilgisi bulunamadı'}
                              </p>
                              {movie.cast.length > 0 && (
                                <p className="detail-movie-cast">
                                  Başroller: {movie.cast.join(', ')}
                                </p>
                              )}
                              <div className="detail-movie-platforms">
                                {uniquePlatforms.map((platform) => {
                                  const linkForPlatform =
                                    platform?.direct_link ||
                                    platform?.external_link ||
                                    movieLink;
                                  const badgeContent = (
                                    <>
                                      <img
                                        src={
                                          platform?.logo_path === '/yt'
                                            ? 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_(2017).svg'
                                            : `https://image.tmdb.org/t/p/w92${platform?.logo_path}`
                                        }
                                        alt={platform?.provider_name}
                                        title={platform?.provider_name}
                                      />
                                      <span>{platform?.provider_name}</span>
                                    </>
                                  );

                                  return linkForPlatform ? (
                                    <a
                                      key={platform?.provider_id || platform?.provider_name}
                                      className="platform-badge"
                                      href={linkForPlatform}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {badgeContent}
                                    </a>
                                  ) : (
                                    <div
                                      key={platform?.provider_id || platform?.provider_name}
                                      className="platform-badge"
                                    >
                                      {badgeContent}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </article>
                        );
                      })}
            </div>
          )}
        </div>
              )}
            </>
          )}
        </>
      )}

      {showPeopleSections && (
        <div
          id="kisiler"
          ref={peopleSectionRef || null}
          className="people-section"
        >
          <h2 className="section-title">Yönetmenler</h2>
          <div className="journeys-container directors-container">
            {DIRECTOR_CARDS.map((director) => (
              <div
                key={director.id}
                className={`journey-card director-card${expandedDirector === director.id ? ' journey-card--active' : ''}`}
                style={{ backgroundColor: director.color }}
                onClick={() => handleDirectorSelect(director)}
                onKeyDown={(event) => handleDirectorKeyPress(event, director)}
                role="button"
                tabIndex={0}
                aria-expanded={expandedDirector === director.id}
              >
                <div className="journey-header">
                  <h3 className="journey-title">{director.title}</h3>
                  {director.subtitle && <h4 className="journey-subtitle">{director.subtitle}</h4>}
                  {director.description && (
                    <p className="journey-description">{director.description}</p>
                  )}
                </div>

                <div className="journey-movies">
                  {director.movies.map((movie) => (
                    <div key={movie.id} className="movie-poster">
                      {movie.poster_path ? (
                        <img
                          src={`${POSTER_BASE_URL}${movie.poster_path}`}
                          alt={`${movie.title} film afişi`}
                          className="poster-image"
                        />
                      ) : (
                        <div className="poster-placeholder" aria-hidden="true">
                          🎬
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {activeDirector && (
            <div className="journey-detail-panel">
              <div className="journey-detail-header">
                <div className="journey-detail-headline">
                  <span className="journey-detail-years">Yönetmen</span>
                  <h3 className="journey-detail-title">{activeDirector.title}</h3>
                  {activeDirector.subtitle && (
                    <p className="journey-detail-subtitle">{activeDirector.subtitle}</p>
                  )}
                </div>

                <button
                  type="button"
                  className="journey-detail-close"
                  onClick={() => {
                    setExpandedDirector(null);
                    setDirectorDetailError(null);
                  }}
                >
                  Kapat
                </button>
              </div>

              {activeDirector.description && (
                <p className="journey-detail-description">{activeDirector.description}</p>
              )}

              {directorDetailLoadingId === activeDirector.id ? (
                <div
                  className="journey-detail-loading"
                  role="status"
                  aria-label="İçerik yükleniyor"
                />
              ) : directorDetailError ? (
                <div className="journey-detail-error">{directorDetailError}</div>
              ) : (directorDetailMovies[activeDirector.id] || []).length === 0 ? (
                <div className="journey-detail-empty">Bu yönetmenin platformlarda izlenebilecek filmi bulunamadı.</div>
              ) : (
                <div className="detail-movie-list">
                  {(directorDetailMovies[activeDirector.id] || []).map((movie) => {
                    const uniquePlatforms = dedupePlatforms(movie.platforms);
                    const movieLink = movie.link || (movie.id ? platformsByMovieId[movie.id]?.link : '');

                    return (
                      <article key={movie.id} className="detail-movie-card">
                        <div className="detail-movie-poster">
                          {movie.posterUrl ? (
                            <img src={movie.posterUrl} alt={movie.title} />
                          ) : (
                            <div className="detail-movie-placeholder" aria-hidden="true">
                              🎞️
                            </div>
                          )}
                        </div>

                        <div className="detail-movie-meta">
                          <h4 className="detail-movie-title">
                            {movie.title}
                            {movie.releaseYear ? (
                              <span className="detail-movie-year"> ({movie.releaseYear})</span>
                            ) : null}
                          </h4>
                          <p className="detail-movie-director">
                            {movie.director ? `Yönetmen: ${movie.director}` : 'Yönetmen bilgisi bulunamadı'}
                          </p>
                          {movie.cast.length > 0 && (
                            <p className="detail-movie-cast">
                              Başroller: {movie.cast.join(', ')}
                            </p>
                          )}
                          <div className="detail-movie-platforms">
                            {uniquePlatforms.map((platform) => {
                              const linkForPlatform =
                                platform?.direct_link ||
                                platform?.external_link ||
                                movieLink;
                              const badgeContent = (
                                <>
                                  <img
                                    src={
                                      platform?.logo_path === '/yt'
                                        ? 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_(2017).svg'
                                        : `https://image.tmdb.org/t/p/w92${platform?.logo_path}`
                                    }
                                    alt={platform?.provider_name}
                                    title={platform?.provider_name}
                                  />
                                  <span>{platform?.provider_name}</span>
                                </>
                              );

                              return linkForPlatform ? (
                                <a
                                  key={platform?.provider_id || platform?.provider_name}
                                  className="platform-badge"
                                  href={linkForPlatform}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {badgeContent}
                                </a>
                              ) : (
                                <div
                                  key={platform?.provider_id || platform?.provider_name}
                                  className="platform-badge"
                                >
                                  {badgeContent}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <h2 className="section-title">Oyuncular</h2>
          <div className="actors-grid">
            {actorsWithProfiles.map((actor) => (
              <article
                key={actor.id}
                className={`actor-card${expandedActor === actor.id ? ' actor-card--active' : ''}`}
                onClick={() => handleActorSelect(actor)}
                onKeyDown={(event) => handleActorKeyPress(event, actor)}
                role="button"
                tabIndex={0}
                aria-expanded={expandedActor === actor.id}
              >
                <div className="actor-photo-wrapper">
                  {actor.profilePath ? (
                    <img
                      src={`${PROFILE_BASE_URL}${actor.profilePath}`}
                      alt={`${actor.name} portresi`}
                      className="actor-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="actor-photo-placeholder" aria-hidden="true">
                      🎭
                    </div>
                  )}
                </div>
                <h3 className="actor-name">{actor.name}</h3>
              </article>
            ))}
          </div>

          {activeActor && (
            <div className="journey-detail-panel actor-detail-panel">
              <div className="journey-detail-header">
                <div className="journey-detail-headline">
                  <span className="journey-detail-years">Oyuncu</span>
                  <h3 className="journey-detail-title">{activeActor.name}</h3>
                </div>

                <button
                  type="button"
                  className="journey-detail-close"
                  onClick={() => {
                    setExpandedActor(null);
                    setActorDetailError(null);
                  }}
                >
                  Kapat
                </button>
              </div>

              {actorDetailLoadingId === activeActor.id ? (
                <div
                  className="journey-detail-loading"
                  role="status"
                  aria-label="İçerik yükleniyor"
                />
              ) : actorDetailError ? (
                <div className="journey-detail-error">{actorDetailError}</div>
              ) : (actorDetailMovies[activeActor.id] || []).length === 0 ? (
                <div className="journey-detail-empty">Bu oyuncunun platformlarda izlenebilecek filmi bulunamadı.</div>
              ) : (
                <div className="detail-movie-list">
                  {(actorDetailMovies[activeActor.id] || []).map((movie) => {
                    const uniquePlatforms = dedupePlatforms(movie.platforms);
                    const movieLink = movie.link || (movie.id ? platformsByMovieId[movie.id]?.link : '');

                    return (
                      <article key={movie.id} className="detail-movie-card">
                        <div className="detail-movie-poster">
                          {movie.posterUrl ? (
                            <img src={movie.posterUrl} alt={movie.title} />
                          ) : (
                            <div className="detail-movie-placeholder" aria-hidden="true">
                              🎞️
                            </div>
                          )}
                        </div>

                        <div className="detail-movie-meta">
                          <h4 className="detail-movie-title">
                            {movie.title}
                            {movie.releaseYear ? (
                              <span className="detail-movie-year"> ({movie.releaseYear})</span>
                            ) : null}
                          </h4>
                          <p className="detail-movie-director">
                            {movie.director ? `Yönetmen: ${movie.director}` : 'Yönetmen bilgisi bulunamadı'}
                          </p>
                          {movie.cast.length > 0 && (
                            <p className="detail-movie-cast">
                              Başroller: {movie.cast.join(', ')}
                            </p>
                          )}
                          <div className="detail-movie-platforms">
                            {uniquePlatforms.map((platform) => {
                              const linkForPlatform =
                                platform?.direct_link ||
                                platform?.external_link ||
                                movieLink;
                              const badgeContent = (
                                <>
                                  <img
                                    src={
                                      platform?.logo_path === '/yt'
                                        ? 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_(2017).svg'
                                        : `https://image.tmdb.org/t/p/w92${platform?.logo_path}`
                                    }
                                    alt={platform?.provider_name}
                                    title={platform?.provider_name}
                                  />
                                  <span>{platform?.provider_name}</span>
                                </>
                              );

                              return linkForPlatform ? (
                                <a
                                  key={platform?.provider_id || platform?.provider_name}
                                  className="platform-badge"
                                  href={linkForPlatform}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {badgeContent}
                                </a>
                              ) : (
                                <div
                                  key={platform?.provider_id || platform?.provider_name}
                                  className="platform-badge"
                                >
                                  {badgeContent}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ThematicJourneys;
