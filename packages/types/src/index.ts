export type HealthResponse = {
  status: 'ok' | 'error';
  timestamp: string;
};

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  KITCHEN_STAFF = 'KITCHEN_STAFF',
  DELIVERY_STAFF = 'DELIVERY_STAFF',
  RESIDENT = 'RESIDENT',
}

export interface UserDto {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  organizationId: string | null;
  propertyId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyDto {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  timezone: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export enum ResidentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum MealPlan {
  STANDARD = 'STANDARD',
  LUNCH_ONLY = 'LUNCH_ONLY',
  DINNER_ONLY = 'DINNER_ONLY',
  CUSTOM = 'CUSTOM',
}

export interface RoomDto {
  id: string;
  roomNumber: string;
  floor: string | null;
  capacity: number;
  propertyId: string;
}

export interface ResidentDto {
  id: string;
  userId: string;
  propertyId: string;
  roomId: string | null;
  residentCode: string | null;
  mealPlan: MealPlan;
  status: ResidentStatus;
  joinedAt: Date;
  leftAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  user?: Pick<UserDto, 'id' | 'name' | 'email'>;
  room?: Pick<RoomDto, 'id' | 'roomNumber'>;
}

export enum MealType {
  LUNCH = 'LUNCH',
  DINNER = 'DINNER'
}

export enum BookingStatus {
  BOOKED = 'BOOKED',
  SKIPPED = 'SKIPPED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum MealStatus {
  BOOKED = 'BOOKED',
  PREPARING = 'PREPARING',
  PACKED = 'PACKED',
  ASSIGNED = 'ASSIGNED',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
  CONFIRMED = 'CONFIRMED',
  DISPUTED = 'DISPUTED',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryBatchStatus {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  DISPATCHED = 'DISPATCHED',
  COMPLETED = 'COMPLETED'
}

export enum ComplaintType {
  MISSING_MEAL = 'MISSING_MEAL',
  WRONG_MEAL = 'WRONG_MEAL',
  DAMAGED_PACKAGING = 'DAMAGED_PACKAGING',
  LATE_DELIVERY = 'LATE_DELIVERY',
  QUALITY = 'QUALITY',
  OTHER = 'OTHER'
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED'
}

export interface MenuDto {
  id: string;
  propertyId: string;
  date: Date | string;
  type: MealType;
  title: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BookingDto {
  id: string;
  propertyId: string;
  menuId: string;
  residentId: string;
  status: BookingStatus;
  createdAt: Date | string;
  updatedAt: Date | string;

  menu?: MenuDto;
  resident?: ResidentDto;
}

export interface MealDto {
  id: string;
  propertyId: string;
  bookingId: string;
  residentId: string;
  roomId: string | null;
  deliveryBatchId: string | null;
  status: MealStatus;
  qrToken: string;
  createdAt: Date | string;
  updatedAt: Date | string;

  booking?: BookingDto;
  resident?: ResidentDto;
  room?: RoomDto;
}

export interface ComplaintDto {
  id: string;
  propertyId: string;
  mealId: string;
  residentId: string;
  type: ComplaintType;
  status: ComplaintStatus;
  description: string;
  resolutionNotes: string | null;
  assignedToId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;

  meal?: MealDto;
  resident?: ResidentDto;
}
