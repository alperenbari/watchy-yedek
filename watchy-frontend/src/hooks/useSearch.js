
import { useState } from 'react';
import { searchMovies, getPlatforms, getWatchyScore, getApiUrl } from '../services/api';

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

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSelectedDecade(null);
    setSelectedYear(null);
    setShowDecades(false);
    setSearchResults([]);
    setPlatforms({});
    setScores({});
    setLoading(true);
    try {
      const data = await searchMovies(query);
      setSearchResults(data);
      for (const movie of data) {
        const [platformRes, scoreRes] = await Promise.all([
          getPlatforms(movie.movie_id),
          getWatchyScore(movie.movie_id)
        ]);
        setPlatforms(prev => ({ ...prev, [movie.movie_id]: platformRes }));
        setScores(prev => ({ ...prev, [movie.movie_id]: scoreRes.watchy_score }));
      }
    } catch (err) {
      console.error('Arama hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleYearSelect = async (year) => {
    setSelectedYear(year);
    setSearchResults([]);
    setPlatforms({});
    setScores({});
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`search/year/${year}`));
      const data = await res.json();
      setSearchResults(data);
      for (const movie of data) {
        const [platformRes, scoreRes] = await Promise.all([
          getPlatforms(movie.movie_id),
          getWatchyScore(movie.movie_id)
        ]);
        setPlatforms(prev => ({ ...prev, [movie.movie_id]: platformRes }));
        setScores(prev => ({ ...prev, [movie.movie_id]: scoreRes.watchy_score }));
      }
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
