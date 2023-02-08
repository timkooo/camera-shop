export type Review = {
  'id': string;
  'userName': string;
  'advantage': string;
  'disadvantage': string;
  'review': string;
  'rating': number;
  'createAt': string;
  'cameraId': number;
}

export type ReviewPost = Omit<Review, 'id' | 'createAt'>;
