import { FC } from 'react';
import { Review } from '../../types/review';
import { formatDateAttribute } from '../../utils/utils';

type ReviewCardProps = {
  review: Review;
}

export const ReviewCard: FC<ReviewCardProps> = ({review}) => (
  <li className="review-card">
    <div className="review-card__head">
      <p className="title title--h4">{review.userName}</p>
      <time className="review-card__data" dateTime="2022-03-02">{formatDateAttribute(review.createAt)}</time>
    </div>
    <div className="rate review-card__rate">
      {Array.from<number>(Array.from({ length: 5 }, (v, k) => k + 1)).map((element, index) => (
        <svg key={ element } width="17" height="16" aria-hidden="true">
          <use xlinkHref={index <= review.rating - 1 ? '#icon-full-star' : '#icon-star'} ></use>
        </svg>
      ))}
      <p className="visually-hidden">Оценка: {review.rating}</p>
    </div>
    <ul className="review-card__list">
      <li className="item-list"><span className="item-list__title">Достоинства:</span>
        <p className="item-list__text">{review.advantage}</p>
      </li>
      <li className="item-list"><span className="item-list__title">Недостатки:</span>
        <p className="item-list__text">{review.disadvantage}</p>
      </li>
      <li className="item-list"><span className="item-list__title">Комментарий:</span>
        <p className="item-list__text">{review.review}</p>
      </li>
    </ul>
  </li>
);
