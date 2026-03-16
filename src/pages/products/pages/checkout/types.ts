export interface BookingData {
  hotelName: string;
  hotelAddress: string;
  hotelRating: number;
  hotelReviews: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  nights: number;
  guests: string;
  originalPrice: number;
  discount: number;
  subtotal: number;
  taxesAndFees: number;
  total: number;
}

export interface PaymentInfo {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: 'pay-at-hotel' | 'pay-now' | 'bank-transfer';
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCode: string;
  specialRequests?: string;
}

export interface CheckoutFormData {
  bookingData: BookingData;
  paymentInfo: PaymentInfo;
  guestInfo: GuestInfo;
  agreeMarketing: boolean;
  agreeTerms: boolean;
}

export interface CheckoutStepProps {
  current: number;
  onChange?: (step: number) => void;
}
