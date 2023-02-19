import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk-hooks';
import { useKeyPress } from '../../hooks/use-key-press';
import { loadSearchResults } from '../../store/api-actions';
import { selectSearchResults } from '../../store/cameras/cameras.selectors';

export const Search = () => {
  const searchResults = useAppSelector(selectSearchResults);
  const searchInput = useRef<HTMLInputElement | null>(null);
  const searchList = useRef<HTMLUListElement | null>(null);
  const [count, setCount] = useState<number>(0);
  const downPress = useKeyPress('ArrowDown');
  const upPress = useKeyPress('ArrowUp');
  const enterPress = useKeyPress('Enter');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSearchParamChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value }: { value: string } = evt.target;
    dispatch(loadSearchResults(value));
  };

  const handleSearchResultClick = (evt: React.MouseEvent<HTMLLIElement>, cameraId: number) => {
    evt.preventDefault();
    navigate(`product/${cameraId}`);
  };

  useEffect(() => {
    if (searchResults.length && downPress) {
      setCount((prevState) =>
        prevState < searchResults.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);

  useEffect(() => {
    if (searchResults.length && upPress) {
      setCount((prevState) => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);

  useEffect(() => {
    if (searchResults.length && enterPress) {
      if (searchList.current) {
        const searchElements = Array.from(searchList.current.children) as HTMLLIElement[];
        searchElements[count] && searchElements[count].click();
      }
    }
  }, [count, enterPress]);

  useEffect(() => {
    if (searchList.current) {
      const searchElements = Array.from(searchList.current.children) as HTMLLIElement[];
      searchElements[count] && searchElements[count].focus();
    }
  }, [count]);

  return (
    <div className={classNames('form-search', {'list-opened' : searchResults.length > 0})}>
      <form>
        <label>
          <svg className="form-search__icon" width="16" height="16" aria-hidden="true">
            <use xlinkHref="#icon-lens"></use>
          </svg>
          <input className="form-search__input" type="text" autoComplete="off" placeholder="Поиск по сайту" ref={searchInput} onChange={handleSearchParamChange}/>
        </label>
        <ul className="form-search__select-list" ref={searchList}>
          {searchResults.map((camera, index) => (
            <li key={camera.id} className="form-search__select-item" tabIndex={0} onClick={(evt) => handleSearchResultClick(evt, camera.id)}>{camera.name}</li>
          ))}
        </ul>
      </form>
      <button className="form-search__reset" type="reset">
        <svg width="10" height="10" aria-hidden="true">
          <use xlinkHref="#icon-close"></use>
        </svg><span className="visually-hidden">Сбросить поиск</span>
      </button>
    </div>
  );
};
