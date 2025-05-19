export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  photo?: string;
  isDisabled: boolean;
  primaryCarId?: number;
  preferredCurrencyId: number;
}
