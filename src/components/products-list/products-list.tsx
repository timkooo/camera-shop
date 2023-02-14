import React, { useEffect, useRef, useState } from 'react';
import { PRODUCTS_PER_PAGE } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk-hooks';
import { useModal } from '../../hooks/use-modal';
import { loadCamerasWithParams } from '../../store/api-actions';
import { selectFilters, selectParameters, selectPrice, selectSorting } from '../../store/application/application.selectors';
import { updateParameters } from '../../store/application/application.slice';
import { selectAreCamerasLoading, selectCameras } from '../../store/cameras/cameras.selectors';
import { Camera } from '../../types/camera';
import { ProductCard } from '../product-card/product-card';
import { ProductModal } from '../product-modal/product-modal';

type ProductsListProps = {
  pageNumber: string;
}

export const ProductsList = ({ pageNumber } : ProductsListProps) => {
  const cameras = useAppSelector(selectCameras);
  const areCamerasLoading = useAppSelector(selectAreCamerasLoading);
  const parameters = useAppSelector(selectParameters);
  const sorting = useAppSelector(selectSorting);
  const filters = useAppSelector(selectFilters);
  const price = useAppSelector(selectPrice);
  const [selectedProduct, setSelectedProduct] = useState<Camera | null>(null);
  const [productModalVisible, productModalToggle] = useModal();
  const dispatch = useAppDispatch();
  const mounted = useRef(false);

  const handleProductSelection = (product: Camera) => {
    setSelectedProduct(product);
    productModalToggle();
  };

  const productsToShow = () => {
    const start = (Number(pageNumber) - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const params = {
      ...parameters,
      _start: start.toString(),
      _end: end.toString(),
    };
    return params;
  };

  useEffect(() => {
    dispatch(updateParameters(productsToShow()));
  }, [dispatch, pageNumber]);

  useEffect(() => {
    if (mounted.current === true || areCamerasLoading) {
      return;
    }
    mounted.current = true;
    dispatch(loadCamerasWithParams());
    return () => {
      mounted.current = false;
    };
  }, [dispatch, parameters, sorting, price, filters]);

  if (areCamerasLoading) {
    return <div>LOADING</div>;
  }

  return (
    <React.Fragment>
      <div className="cards catalog__cards">
        {cameras.length === 0 ? (
          <div>Sorry, there was an error loading data</div>
        ) : (
          cameras.map((camera) => (
            <ProductCard
              key={camera.id}
              product={camera}
              onSelectedProductChange={() => handleProductSelection(camera)}
            />
          ))
        )}
      </div>

      <ProductModal product={selectedProduct} modalVisible={productModalVisible} onModalToggle={productModalToggle} onProductSelect={setSelectedProduct}/>
    </React.Fragment>
  );
};