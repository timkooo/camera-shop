import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS_PER_PAGE } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk-hooks';
import { selectCamerasAmount } from '../../store/cameras/cameras.selectors';

type PaginationProps = {
  pageNumber: number;
};

export const Pagination = ({ pageNumber }: PaginationProps) => {
  const camerasAmount = useAppSelector(selectCamerasAmount);
  const [pagesAmount, setPagesAmount] = useState<number>(1);
  const dispatch = useAppDispatch();

  const countPageNumber = () => Math.ceil(camerasAmount / PRODUCTS_PER_PAGE);

  useEffect(() => {
    setPagesAmount(countPageNumber);
  }, [dispatch, camerasAmount]);

  return (
    <div className="pagination">
      <ul className="pagination__list">
        <li className="pagination__item">
          <Link
            className={classNames('pagination__link', 'pagination__link--text', {
              'visually-hidden': pageNumber === 1,
            })}
            to={`/catalog/page/${pageNumber - 1}`}
          >
          Назад
          </Link>
        </li>
        {Array.from({ length: pagesAmount }, (v, k) => k + 1).map(
          (element, index) => (
            <li key={element} className="pagination__item">
              <Link
                className={classNames('pagination__link', {
                  'pagination__link--active': pageNumber === index + 1,
                })}
                to={`/catalog/page/${index + 1}`}
              >
                {index + 1}
              </Link>
            </li>
          )
        )}
        <li className="pagination__item">
          <Link
            className={classNames('pagination__link', 'pagination__link--text', {
              'visually-hidden': pageNumber === pagesAmount,
            })}
            to={`/catalog/page/${pageNumber + 1}`}
          >
          Далее
          </Link>
        </li>
      </ul>
    </div>
  );
};
