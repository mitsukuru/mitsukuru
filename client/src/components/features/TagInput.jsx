import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X, Tag, Plus } from 'lucide-react';
import { searchTags } from '@/api/tagApi';
import styles from './TagInput.module.scss';

const TagInput = ({ tags = [], onChange, placeholder = "タグを追加..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // タグ検索のデバウンス処理
  useEffect(() => {
    // 入力値が空の場合は検索をしない
    if (!inputValue || inputValue.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await searchTags(inputValue);
        setSuggestions(response.tags || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('タグ検索エラー:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // 外部クリックで候補を非表示
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    console.log('handleInputChange:', newValue);
    setInputValue(newValue);
  };

  const handleInputKeyDown = (e) => {
    console.log('handleInputKeyDown:', e.key, 'inputValue:', inputValue);
    
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      console.log('trimmedValue:', trimmedValue);
      
      if (trimmedValue) {
        addTag(trimmedValue);
      } else {
        // 空の値の場合も入力をクリア
        console.log('clearing empty input');
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = (tagName) => {
    const normalizedTagName = tagName.toLowerCase();
    
    // 重複チェックと制限チェック
    if (tagName && !tags.includes(normalizedTagName) && tags.length < 10) {
      const newTags = [...tags, normalizedTagName];
      onChange(newTags);
    }
    
    // 必ず入力値をクリアし、候補を非表示にする
    setInputValue('');
    setShowSuggestions(false);
    
    // デバッグ用ログ
    console.log('addTag called, cleared inputValue');
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleSuggestionClick = (tagName) => {
    addTag(tagName);
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) => !tags.includes(suggestion.name)
  );

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <div className={styles.tagContainer}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              <Tag size={14} />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className={styles.removeButton}
                aria-label={`${tag}を削除`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          
          <div className={styles.inputGroup}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
              placeholder={tags.length === 0 ? placeholder : ""}
              className={styles.input}
              maxLength={50}
            />
            {inputValue.trim() && (
              <button
                type="button"
                onClick={() => addTag(inputValue.trim())}
                className={styles.addButton}
                aria-label="タグを追加"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </div>

        {showSuggestions && (
          <div ref={suggestionsRef} className={styles.suggestions}>
            {loading ? (
              <div className={styles.suggestionItem}>
                <span className={styles.loading}>検索中...</span>
              </div>
            ) : filteredSuggestions.length > 0 ? (
              <>
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion.name)}
                    className={styles.suggestionItem}
                  >
                    <Tag size={14} />
                    <span>{suggestion.name}</span>
                    <span className={styles.postsCount}>
                      {suggestion.posts_count}件の投稿
                    </span>
                  </button>
                ))}
              </>
            ) : inputValue.length >= 2 ? (
              <div className={styles.suggestionItem}>
                <span className={styles.noResults}>
                  候補が見つかりません
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className={styles.tagCount}>
          {tags.length}/10 タグ
        </div>
      )}
    </div>
  );
};

TagInput.propTypes = {
  tags: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default TagInput;