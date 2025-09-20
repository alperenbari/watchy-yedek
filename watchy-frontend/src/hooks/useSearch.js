
import { useState } from 'react';
import {
  searchMovies,
  searchMoviesByYear,
  getPlatforms
} from '../services/api';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [platforms, setPlatforms] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasCompletedSearch, setHasCompletedSearch] = useState(false);
  const [selectedDecade, setSelectedDecade] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDecades, setShowDecades] = useState(false);

  const decades = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

  const resetResults = () => {
    setSearchResults([]);
    setPlatforms({});
    setHasCompletedSearch(false);
  };

  const populateMovieDetails = async (movies) => {
    if (!movies?.length) return [];

    const details = await Promise.all(
      movies.map(async (movie) => {
        try {
          const platformRes = await getPlatforms(movie.movie_id);

          return {
            id: movie.movie_id,
            platforms: Array.isArray(platformRes?.platforms)
              ? platformRes.platforms
              : [],
            link: platformRes?.link ?? '',
          };
        } catch (error) {
          console.error(`Film detayları alınamadı (${movie.movie_id}):`, error);
          return {
            id: movie.movie_id,
            platforms: [],
          };
        }
      })
    );

    setPlatforms((prev) => {
      const next = { ...prev };
      details.forEach(({ id, platforms: platformList, link }) => {
        next[id] = {
          platforms: platformList,
          link
        };
      });
      return next;
    });
    return details;
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
      const details = await populateMovieDetails(data);

      const availableIds = new Set(
        details
          .filter(({ platforms: platformList }) => platformList?.length)
          .map(({ id }) => id)
      );

      const filteredResults = data.filter((movie) =>
        availableIds.has(movie.movie_id)
      );

      setSearchResults(filteredResults);
      setHasCompletedSearch(true);
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
      const details = await populateMovieDetails(data);

      const availableIds = new Set(
        details
          .filter(({ platforms: platformList }) => platformList?.length)
          .map(({ id }) => id)
      );

      const filteredResults = data.filter((movie) =>
        availableIds.has(movie.movie_id)
      );

      setSearchResults(filteredResults);
      setHasCompletedSearch(true);
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
    loading,
    selectedDecade, setSelectedDecade,
    selectedYear, setSelectedYear,
    showMenu, setShowMenu,
    showDecades, setShowDecades,
    decades,
    handleSearch,
    handleYearSelect,
    hasCompletedSearch
  };
};
