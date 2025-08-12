import React, { useState, useEffect, useRef } from 'react';
import './AISearch.css';
import { Item } from '../Item/Item';

const AISearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchBreakdown, setSearchBreakdown] = useState(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  
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

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setShowSuggestions(false);

    try {
      console.log(`🔍 執行搜索: "${query}"`);
      console.log(`🌐 API URL: ${process.env.REACT_APP_API_URL || "http://localhost:4000"}`);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          limit: 20,
          filters: {}
        })
      });

      console.log(`📡 Response status: ${response.status}`);
      console.log(`📡 Response ok: ${response.ok}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🎯 搜索結果:', data);

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
    performExactSearch(suggestion);
  };

  const performExactSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setShowSuggestions(false);

    try {
      console.log(`🎯 執行精確匹配搜索: "${query}"`);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/exact-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query
        })
      });

      console.log(`📡 Response status: ${response.status}`);
      console.log(`📡 Response ok: ${response.ok}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🎯 精確匹配結果:', data);

      if (data.success) {
        setSearchResults(data.results || []);
        setSearchBreakdown(data.breakdown);
      } else {
        console.error('精確匹配失敗:', data.message);
        setSearchResults([]);
        setSearchBreakdown(null);
      }
    } catch (error) {
      console.error('精確匹配請求失敗:', error);
      setSearchResults([]);
      setSearchBreakdown(null);
    } finally {
      setIsLoading(false);
    }
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

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setSearchBreakdown(null);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  // 點擊推薦標記顯示完整分析
  const handleRecommendationClick = (product) => {
    setSelectedAnalysis(product);
    setShowAIAnalysis(true);
  };

  // 關閉AI分析彈窗
  const closeAIAnalysis = () => {
    setShowAIAnalysis(false);
    setSelectedAnalysis(null);
  };

  return (
    <div className="ai-search">
      {/* 搜索標題 */}
      <div className="search-header">
        <h2>🧠 AI 語意搜索</h2>
        <p>使用先進的 AI 語義理解技術，智能找到最符合您需求的商品</p>
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
      {hasSearched && (
        <div className="search-stats">
          <div className="stats-info">
            <span>找到 {searchResults.length} 個結果</span>
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
                  {/* LLM 推薦標記 */}
                  {product.llm_recommended && (
                    <div 
                      className="recommendation-badge"
                      onClick={() => handleRecommendationClick(product)}
                    >
                      <span className="badge-icon">⭐</span>
                      <span className="badge-text">AI 推薦</span>
                    </div>
                  )}
                  <Item
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    new_price={product.new_price}
                    old_price={product.old_price}
                  />
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

      {/* AI 分析彈窗 */}
      {showAIAnalysis && selectedAnalysis && (
        <div className="ai-analysis-modal" onClick={closeAIAnalysis}>
          <div className="ai-analysis-content" onClick={(e) => e.stopPropagation()}>
            <div className="ai-analysis-header">
              <div className="ai-analysis-title">
                <span>🤖</span>
                AI 智能推薦分析
              </div>
              <button className="close-modal" onClick={closeAIAnalysis}>×</button>
            </div>
            
            <div className="ai-analysis-text">
              <h3>{selectedAnalysis.name}</h3>
              <p><strong>價格：</strong>${selectedAnalysis.new_price}</p>
              <p><strong>AI 推薦理由：</strong></p>
              <p>{selectedAnalysis.recommendation_reason || '這個商品最符合您的搜索需求'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISearch;
