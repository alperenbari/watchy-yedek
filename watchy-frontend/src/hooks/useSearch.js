
import { useState } from 'react';
import {
  searchMovies,
  searchMoviesByYear,
  getPlatforms,
  getWatchyScore
} from '../services/api';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [platforms, setPlatforms] = useState({});
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDecade, setSelectedDecade] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDecades, setShowDecades] = useState(false);

  const decades = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

  const resetResults = () => {
    setSearchResults([]);
    setPlatforms({});
    setScores({});
  };

  const populateMovieDetails = async (movies) => {
    if (!movies?.length) return;

    const details = await Promise.all(
      movies.map(async (movie) => {
        try {
          const [platformRes, scoreRes] = await Promise.all([
            getPlatforms(movie.movie_id),
            getWatchyScore(movie.movie_id)
          ]);

          return {
            id: movie.movie_id,
            platforms: platformRes,
            score: scoreRes?.watchy_score ?? null
          };
        } catch (error) {
          console.error(`Film detayları alınamadı (${movie.movie_id}):`, error);
          return {
            id: movie.movie_id,
            platforms: [],
            score: null
          };
        }
      })
    );

    setPlatforms((prev) => {
      const next = { ...prev };
      details.forEach(({ id, platforms: platformList }) => {
        next[id] = platformList;
      });
      return next;
    });

    setScores((prev) => {
      const next = { ...prev };
      details.forEach(({ id, score }) => {
        next[id] = score;
      });
      return next;
    });
  };

  const handleSearch = async (searchTerm) => {
    const effectiveQuery = typeof searchTerm === 'string' ? searchTerm : query;
    const trimmedQuery = effectiveQuery.trim();

    if (!trimmedQuery) return;

    if (trimmedQuery !== query) {
      setQuery(trimmedQuery);
    }

    setSelectedDecade(null);
    setSelectedYear(null);
    setShowDecades(false);
    resetResults();
    setLoading(true);

    try {
      const data = await searchMovies(trimmedQuery);
      setSearchResults(data);
      await populateMovieDetails(data);
    } catch (err) {
      console.error('Arama hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleYearSelect = async (year) => {
    setSelectedDecade(null);
    setSelectedYear(year);
    setQuery('');
    resetResults();
    setLoading(true);
    try {
      const data = await searchMoviesByYear(year);
      setSearchResults(data);
      await populateMovieDetails(data);
    } catch (err) {
      console.error('Yıl bazlı arama hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    query, setQuery,
    searchResults,
    platforms,
    scores,
    loading,
    selectedDecade, setSelectedDecade,
    selectedYear, setSelectedYear,
    showMenu, setShowMenu,
    showDecades, setShowDecades,
    decades,
    handleSearch,
    handleYearSelect
  };
};
