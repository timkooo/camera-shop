import classNames from 'classnames';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BasketItem } from '../../components/basket-item/basket-item';
import { OrderModal } from '../../components/order-modal/order-modal';
import { RemoveModal } from '../../components/remove-modal/remove-modal';
import { AppRoutes, ERROR_SHOW_TIME, WRONG_DATA_CODE_ERROR } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk-hooks';
import { useModal } from '../../hooks/use-modal';
import { loadDiscount, postOrder } from '../../store/api-actions';
import { selectBasketItems, selectBasketPrice, selectDiscountPrice, selectFinalPrice } from '../../store/basket/basket.selectors';
import { BasketItemType } from '../../store/basket/basket.slice';

export const Basket = () => {
  const basketItems = useAppSelector(selectBasketItems);
  const basketPrice = useAppSelector(selectBasketPrice);
  const discount = useAppSelector(selectDiscountPrice);
  const finalPrice = useAppSelector(selectFinalPrice);
  const [currentCoupon, setCurrentCoupon] = useState<string | null>(null);
  const couponInput = useRef<HTMLInputElement | null>(null);
  const [isCouponValid, setIsCouponValid] = useState<boolean | null>(null);
  const [orderModalVisible, orderModalToggle] = useModal();
  const [removeModalVisible, removeModalToggle] = useModal();
  const [itemToRemove, setItemToRemove] = useState<BasketItemType | null>(null);
  const dispatch = useAppDispatch();
  const reg = RegExp('^\\b\\S+\\b$');


  const handlePostCoupon = (evt: React.FormEvent<HTMLFormElement>) => {(async () => {
    evt.preventDefault();
    if (couponInput.current && couponInput.current.value) {
      if (!reg.test(couponInput.current.value)) {
        setIsCouponValid(false);
        setTimeout(() => setIsCouponValid(null), ERROR_SHOW_TIME);
        return;
      }
      const coupon = { coupon : couponInput.current.value };
      try {
        await dispatch(loadDiscount(coupon)).unwrap();
        setCurrentCoupon(couponInput.current.value);
        setIsCouponValid(true);
        setTimeout(() => setIsCouponValid(null), ERROR_SHOW_TIME);
      }
      catch(err) {
        if (err === WRONG_DATA_CODE_ERROR) {
          setCurrentCoupon(null);
          setIsCouponValid(false);
          setTimeout(() => setIsCouponValid(null), ERROR_SHOW_TIME);
        }
      }
      couponInput.current.value = '';
    }
  })();
  };

  const getBasketItemsIds = () => {
    const itemsIds: number[] = [];
    basketItems.map((item) => itemsIds.push(item.id));
    return itemsIds;
  };

  const handlePostOrder = () => {(async () => {
    const order = {
      camerasIds: getBasketItemsIds(),
      coupon: currentCoupon,
    };
    await dispatch(postOrder(order));
    orderModalToggle();
  })();
  };

  const handleRemoveFromBasket = (item: BasketItemType) => {
    setItemToRemove(item);
    removeModalToggle();
  };

  return (
    <main>
      <div className="page-content">
        <div className="breadcrumbs">
          <div className="container">
            <ul className="breadcrumbs__list">
              <li className="breadcrumbs__item">
                <Link className="breadcrumbs__link" to={AppRoutes.Main}>
                  Главная
                  <svg width="5" height="8" aria-hidden="true">
                    <use xlinkHref="#icon-arrow-mini"></use>
                  </svg>
                </Link>
              </li>
              <li className="breadcrumbs__item">
                <Link className="breadcrumbs__link" to={AppRoutes.Catalog}>
                  Каталог
                  <svg width="5" height="8" aria-hidden="true">
                    <use xlinkHref="#icon-arrow-mini"></use>
                  </svg>
                </Link>
              </li>
              <li className="breadcrumbs__item">
                <span className="breadcrumbs__link breadcrumbs__link--active">
                  Корзина
                </span>
              </li>
            </ul>
          </div>
        </div>
        <section className="basket">
          <div className="container">
            <h1 className="title title--h2">Корзина</h1>

            {basketItems.length === 0 ? (
              <div>Ваша корзина пуста</div>
            ) : (
              <ul className="basket__list">
                {basketItems.map((item) => (
                  <BasketItem key={item.id} item={item} onRemoveButtonClick={() => handleRemoveFromBasket(item)} />
                ))}
              </ul>
            )}

            <div className="basket__summary">
              <div className="basket__promo">
                <p className="title title--h4">
                  Если у вас есть промокод на скидку, примените его в этом поле
                </p>
                <div className="basket-form">
                  <form method="post" onSubmit={handlePostCoupon}>
                    <div className={classNames('custom-input', {'is-invalid' : isCouponValid === false}, {'is-valid' : isCouponValid === true})}>
                      <label>
                        <span className="custom-input__label">Промокод</span>
                        <input
                          ref={couponInput}
                          type="text"
                          name="promo"
                          placeholder="Введите промокод"
                        />
                      </label>
                      <p className="custom-input__error">Промокод неверный</p>
                      <p className="custom-input__success">Промокод принят!</p>
                    </div>
                    <button className="btn" type="submit">
                      Применить
                    </button>
                  </form>
                </div>
              </div>
              <div className="basket__summary-order">
                <p className="basket__summary-item">
                  <span className="basket__summary-text">Всего:</span>
                  <span className="basket__summary-value">{basketPrice ? basketPrice.toLocaleString() : basketPrice} ₽</span>
                </p>
                <p className="basket__summary-item">
                  <span className="basket__summary-text">Скидка:</span>
                  <span className={classNames('basket__summary-value', {'basket__summary-value--bonus': discount})}>
                    {discount ? discount.toLocaleString() : discount} ₽
                  </span>
                </p>
                <p className="basket__summary-item">
                  <span className="basket__summary-text basket__summary-text--total">
                    К оплате:
                  </span>
                  <span className="basket__summary-value basket__summary-value--total">
                    {finalPrice.toLocaleString()} ₽
                  </span>
                </p>
                <button className="btn btn--purple" type="submit" onClick={handlePostOrder}>
                  Оформить заказ
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <OrderModal modalVisible={orderModalVisible} onModalToggle={orderModalToggle}/>
      <RemoveModal item={itemToRemove} modalVisible={removeModalVisible} onModalToggle={removeModalToggle} onItemRemove={setItemToRemove}/>
    </main>
  );
};
