import classNames from 'classnames';
import { Link } from 'react-router-dom';

type PaginationProps = {
  pageNumber: number;
  pagesAmount: number;
};

export const Pagination = ({ pageNumber, pagesAmount }: PaginationProps) => (
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
