
import { useState } from 'react';
import { searchMovies, searchMoviesByYear, getPlatforms, getWatchyScore } from '../services/api';

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
    for (const movie of movies) {
      const [platformRes, scoreRes] = await Promise.all([
        getPlatforms(movie.movie_id),
        getWatchyScore(movie.movie_id)
      ]);
      setPlatforms((prev) => ({ ...prev, [movie.movie_id]: platformRes }));
      setScores((prev) => ({ ...prev, [movie.movie_id]: scoreRes.watchy_score }));
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSelectedDecade(null);
    setSelectedYear(null);
    setShowDecades(false);
    resetResults();
    setLoading(true);
    try {
      const data = await searchMovies(query);
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
