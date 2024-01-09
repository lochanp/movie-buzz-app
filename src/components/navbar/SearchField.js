import React, { useRef } from 'react';
import { useKey } from '../../utils/useKey';

const SearchField = ({ query, setQuery }) => {
  const inputEl = useRef();

  useKey('Enter', () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  });

  // useEffect(() => {
  //   inputEl.current.focus();
  //   const enterkey = (e) => {

  //     if(e.code === 'Enter') {
  //       if(document.activeElement === inputEl.current) return;
  //       inputEl.current.focus();
  //       setQuery('')
  //     }
  //   }
  //   document.addEventListener('keydown',enterkey)
  //   return() => {
  //     document.removeEventListener('keydown',enterkey)
  //   }
  // }, [setQuery])

  return (
    <input
      ref={inputEl}
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
};

export default SearchField;
