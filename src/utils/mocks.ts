import { datatype, internet, lorem, name, commerce, image, date } from 'faker';
import { Camera } from '../types/camera';
import { Review, ReviewPost } from '../types/review';

export const makeFakeCamera = (id: number = 1): Camera => ({
  id: id,
  name: commerce.productName(),
  vendorCode: datatype.string(),
  type: commerce.product(),
  category: commerce.product(),
  description: commerce.productDescription(),
  level: commerce.product(),
  rating: datatype.number({min: 1, max: 5}),
  price: datatype.number({min: 1000, max: 200000}),
  previewImg: image.technics(),
  previewImg2x: image.technics(),
  previewImgWebp: image.technics(),
  previewImgWebp2x: image.technics(),
  reviewCount: datatype.number(),
})

export const makeFakeCameras = (): Camera[] =>
  new Array(5).fill(null).map((_, index) => makeFakeCamera(index + 1));
  
export const makeFakePromo = () => ({
  id: datatype.number({min: 1, max: 40}),
  name: commerce.productName(),
  previewImg: image.technics(),
  previewImg2x: image.technics(),
  previewImgWebp: image.technics(),
  previewImgWebp2x: image.technics(),
})

export const makeFakeReview = (id: number = 1): Review => ({
  id: datatype.string() + id,
  userName: internet.userName(),
  advantage: commerce.productDescription(),
  disadvantage: commerce.productDescription(),
  review: commerce.productDescription(),
  rating: datatype.number({min: 1, max: 5}),
  createAt: datatype.string(),
  cameraId: id,
})

export const makeFakeReviews = (): Review[] =>
  new Array(5).fill(null).map((_, index) => makeFakeReview(index));


  export const makeFakeReviewPost = (id: number = 1): ReviewPost => ({  
  userName: internet.userName(),
  advantage: commerce.productDescription(),
  disadvantage: commerce.productDescription(),
  review: commerce.productDescription(),
  rating: datatype.number({min: 1, max: 5}),
  cameraId: id,
})