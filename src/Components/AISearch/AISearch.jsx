import React, { useState, useEffect, useRef } from 'react';
import './AISearch.css';
// 使用 CSS 圖標替代圖片
import { Item } from '../Item/Item';

const AISearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchType] = useState('hybrid'); // 固定使用混合搜索
  const [hasSearched, setHasSearched] = useState(false);
  const [searchBreakdown, setSearchBreakdown] = useState(null);
  
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // 獲取熱門搜索
  useEffect(() => {
    fetchTrendingSearches();
  }, []);

  // 點擊外部關閉建議
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchTrendingSearches = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/trending-searches`);
      const data = await response.json();
      if (data.success) {
        setTrending(data.trending);
      }
    } catch (error) {
      console.error('獲取熱門搜索失敗:', error);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/search-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 5 })
      });

      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('獲取搜索建議失敗:', error);
    }
  };

  const performSearch = async (query, type = searchType) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setShowSuggestions(false);

    try {
      console.log(`🔍 執行搜索: "${query}", 類型: ${type}`);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          limit: 20,
          searchType: type,
          filters: {}
        })
      });

      const data = await response.json();
      console.log('搜索結果:', data);

      if (data.success) {
        setSearchResults(data.results || []);
        setSearchBreakdown(data.breakdown);
      } else {
        console.error('搜索失敗:', data.message);
        setSearchResults([]);
        setSearchBreakdown(null);
      }
    } catch (error) {
      console.error('搜索請求失敗:', error);
      setSearchResults([]);
      setSearchBreakdown(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length >= 2) {
      fetchSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  const handleTrendingClick = (term) => {
    setSearchQuery(term);
    performSearch(term);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  // 移除搜索類型切換功能，固定使用混合搜索

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setSearchBreakdown(null);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  return (
    <div className="ai-search">
      {/* 搜索標題 */}
      <div className="search-header">
        <h2>🎯 智能搜索</h2>
        <p>結合 AI 語義理解與關鍵字匹配，為您找到最相關的商品</p>
      </div>

      {/* 搜索框 */}
      <div className="search-container" ref={suggestionsRef}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="搜索商品... (例如: 約會穿的黑色外套、便宜的運動服)"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="search-input"
            />
            {searchQuery && (
              <button type="button" onClick={clearSearch} className="clear-button">
                ×
              </button>
            )}
            <button type="submit" className="search-button" disabled={isLoading}>
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <span className="search-icon">🔍</span>
              )}
            </button>
          </div>
        </form>

        {/* 搜索建議 */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="suggestion-icon">🔍</span>
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 移除搜索類型切換按鈕 - 固定使用混合搜索 */}

      {/* 熱門搜索 */}
      {!hasSearched && trending.length > 0 && (
        <div className="trending-searches">
          <h3>🔥 熱門搜索</h3>
          <div className="trending-tags">
            {trending.map((term, index) => (
              <span
                key={index}
                className="trending-tag"
                onClick={() => handleTrendingClick(term)}
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 搜索結果統計 */}
      {hasSearched && searchBreakdown && (
        <div className="search-stats">
          <div className="stats-info">
            <span>找到 {searchResults.length} 個結果</span>
            {searchBreakdown.vector_results > 0 && (
              <span className="stat-detail">
                語義: {searchBreakdown.vector_results}
              </span>
            )}
            {searchBreakdown.keyword_results > 0 && (
              <span className="stat-detail">
                關鍵字: {searchBreakdown.keyword_results}
              </span>
            )}
          </div>
          <div className="weights-info">
            🧠 語義: {Math.round(searchBreakdown.weights?.vector * 100)}% + 🔍 關鍵字: {Math.round(searchBreakdown.weights?.keyword * 100)}%
          </div>
        </div>
      )}

      {/* 搜索結果 */}
      <div className="search-results">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner large"></div>
            <p>AI 正在為您搜索最相關的商品...</p>
          </div>
        ) : hasSearched ? (
          searchResults.length > 0 ? (
            <div className="results-grid">
              {searchResults.map((product, index) => (
                <div key={product.id} className="result-item">
                  <Item
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    new_price={product.new_price}
                    old_price={product.old_price}
                  />
                  <div className="result-metadata">
                    <span className={`search-type ${product.search_type}`}>
                      {product.search_type === 'vector' ? '🧠' : '🔍'}
                    </span>
                    {product.similarity_score && (
                      <span className="similarity-score">
                        {Math.round(product.similarity_score * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>😔 沒有找到相關商品</h3>
              <p>試試其他關鍵字，或瀏覽熱門搜索</p>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default AISearch;
