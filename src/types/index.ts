export type Role = 'STUDENT' | 'WARDEN' | 'ADMIN';
export type Gender = 'MALE' | 'FEMALE';
export type HostelType = 'MALE' | 'FEMALE' | 'MIXED';
export type RoomStatus = 'AVAILABLE' | 'FULL' | 'MAINTENANCE' | 'CLOSED';
export type BedStatus = 'VACANT' | 'OCCUPIED' | 'RESERVED';
export type ApplicationStatus =
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'APPROVED'
  | 'ALLOCATED'
  | 'REJECTED'
  | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type AllocationStatus = 'ACTIVE' | 'VACATED' | 'TRANSFERRED';
export type MaintenanceCategory =
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'STRUCTURAL'
  | 'FURNITURE'
  | 'CLEANING'
  | 'OTHER';
export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type MaintenanceStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  gender: Gender;
  role: Role;
  matricNumber?: string | null;
  department?: string | null;
  level?: string | null;
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicSession {
  id: number;
  name: string;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
}

export interface Hostel {
  id: number;
  name: string;
  type: HostelType;
  description?: string | null;
  location?: string | null;
  totalRooms: number;
  imageUrl?: string | null;
  isActive: boolean;
  wardenId?: number | null;
  warden?: Pick<User, 'id' | 'fullName' | 'email' | 'phone'> | null;
  rooms?: Room[];
  roomCount?: number;
  totalBeds?: number;
  vacantBeds?: number;
  occupiedBeds?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bed {
  id: number;
  roomId: number;
  bedNumber: string;
  status: BedStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: number;
  hostelId: number;
  roomNumber: string;
  floor?: string | null;
  capacity: number;
  pricePerSession: number;
  status: RoomStatus;
  hostel?: Pick<Hostel, 'id' | 'name' | 'type'>;
  beds: Bed[];
  vacantBeds?: number;
  occupiedBeds?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  studentId: number;
  applicationId?: number | null;
  sessionId: number;
  amount: number;
  reference: string;
  method: string;
  status: PaymentStatus;
  paidAt?: string | null;
  application?: Application | null;
  session?: AcademicSession;
  student?: Pick<User, 'id' | 'fullName' | 'email' | 'matricNumber'>;
  createdAt: string;
  updatedAt: string;
}

export interface Allocation {
  id: number;
  studentId: number;
  bedId: number;
  applicationId: number;
  sessionId: number;
  status: AllocationStatus;
  allocatedAt: string;
  vacatedAt?: string | null;
  student?: Pick<User, 'id' | 'fullName' | 'email' | 'matricNumber'>;
  bed?: Bed & { room?: Room & { hostel?: Hostel } };
  application?: Application;
  session?: AcademicSession;
}

export interface Application {
  id: number;
  studentId: number;
  hostelId: number;
  sessionId: number;
  preferredRoomType?: string | null;
  status: ApplicationStatus;
  remarks?: string | null;
  student?: Pick<User, 'id' | 'fullName' | 'email' | 'matricNumber' | 'gender'>;
  hostel?: Pick<Hostel, 'id' | 'name' | 'type'>;
  session?: AcademicSession;
  payments?: Payment[];
  allocation?: Allocation | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: number;
  studentId: number;
  roomId?: number | null;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  description: string;
  photoUrl?: string | null;
  status: MaintenanceStatus;
  handledById?: number | null;
  resolvedAt?: string | null;
  student?: Pick<User, 'id' | 'fullName' | 'email'>;
  room?: Room & { hostel?: Hostel };
  handledBy?: Pick<User, 'id' | 'fullName'> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalStudents: number;
  totalHostels: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  vacantBeds: number;
  occupancyRate: number;
  pendingApplications: number;
  approvedApplications: number;
  allocatedApplications: number;
  pendingPayments: number;
  totalRevenue: number;
  openMaintenance: number;
  maintenanceByStatus: { status: string; count: number }[];
  applicationsByStatus: { status: string; count: number }[];
}

export interface HostelOccupancy {
  hostelId: number;
  hostelName: string;
  totalBeds: number;
  occupiedBeds: number;
  vacantBeds: number;
  occupancyRate: number;
}

export interface StudentStats {
  applications: number;
  successfulPayments: number;
  maintenanceRequests: number;
  currentAllocation: Allocation | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    unreadCount?: number;
  };
  errors?: { field: string; message: string }[];
}
