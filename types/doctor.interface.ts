export interface IColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface IBrandingConfig {
  brandName: string;
  brandTagline?: string;
  primaryColor: string;
  secondaryColor: string;
  primaryForeground?: string;
  secondaryForeground?: string;
  primaryScale?: IColorScale;
  secondaryScale?: IColorScale;
  logoUrl?: string | null;
  faviconUrl?: string | null;
}

export interface IDoctorProfile {
  name: string;
  title: string;
  qualifications: string;
  degrees?: string | null;
  bmdcRegNumber?: string | null;
  experienceYears?: number | null;
  specialties: string[];
  bio?: string | null;
  avatarUrl?: string | null;
  certifications?: string[];
  certificateDocuments?: string[];
  awards?: string[];
  consultationFee?: number;
  videoConsultationFee?: number;
}

export interface IScheduleBreak {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  title?: string;
  label?: string;
}

export interface IChamberSchedule {
  id?: string;
  chamberLocationId?: string;
  dayOfWeek: number | string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  slotDuration?: number | null;
  slotDurationMinutes?: number;
  breakStartTime?: string | null;
  breakEndTime?: string | null;
  breaks?: IScheduleBreak[] | null;
  maxPatients?: number | null;
  isActive: boolean;
}

export interface IChamberLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phoneNumber?: string | null;
  roomNumber?: string | null;
  floorNumber?: string | null;
  mapEmbedUrl?: string | null;
  defaultSlotDurationMinutes: number;
  isActive: boolean;
  schedules?: IChamberSchedule[];
  _count?: {
    appointments?: number;
  };
}

export interface IClinicSettings {
  id: string;
  clinicName?: string;
  brandName?: string;
  tagline?: string | null;
  doctorName: string;
  doctorTitle: string;
  degrees?: string | null;
  bmdcNumber?: string | null;
  bmdcRegNumber?: string | null;
  specialization?: string | null;
  bio?: string | null;
  experienceYears?: number | null;
  doctorPhoto?: string | null;
  certifications?: string[];
  certificateDocuments?: string[];
  awards?: string[];
  consultationFee?: number;
  videoConsultationFee?: number;
  contactEmail?: string | null;
  contactPhone?: string | null;
  emergencyPhone?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  logoUrl?: string | null;
  signatureUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  features?: Record<string, boolean>;
  bookingNotice?: string | null;
  googleSheetConnected?: boolean;
  googleSheetUrl?: string | null;
  googleSheetId?: string | null;
  aiChatEnabled?: boolean;
  lastSheetSyncAt?: string | null;
  knowledgeBaseData?: any;
}

export interface IPublicSiteConfig {
  branding: IBrandingConfig;
  doctor: IDoctorProfile;
  chambers: IChamberLocation[];
  contact?: {
    phone?: string;
    emergencyPhone?: string;
    email?: string;
    whatsappNumber?: string;
    address?: string;
  };
  emergencyPhone?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  features?: Record<string, boolean>;
}

export interface IService {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  fee: number;
  price?: number;
  durationMinutes: number;
  isActive: boolean;
}

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CHECKED_IN = "CHECKED_IN",
  IN_CONSULTATION = "IN_CONSULTATION",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}

export interface IVitalSign {
  id: string;
  patientId: string;
  systolicBp?: number | null;
  diastolicBp?: number | null;
  pulseRate?: number | null;
  temperature?: number | null;
  respiratoryRate?: number | null;
  spO2?: number | null;
  heightCm?: number | null;
  weightKg?: number | null;
  bmi?: number | null;
  bloodSugarFasting?: number | null;
  bloodSugarPostMeal?: number | null;
  recordedAt: string;
  notes?: string | null;
}

export interface IPatient {
  id: string;
  name: string;
  fullName?: string;
  patientId?: string;
  phoneNumber: string;
  phone?: string;
  email?: string | null;
  dateOfBirth?: string | null;
  age?: number | string | null;
  ageYears?: number | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: string | null;
  address?: string | null;
  emergencyContact?: string | null;
  allergies?: string[];
  chronicDiseases?: string[];
  medicalHistory?: string[];
  createdAt: string;
  updatedAt: string;
  vitals?: IVitalSign[];
  _count?: {
    appointments?: number;
    prescriptions?: number;
    invoices?: number;
  };
}

export interface IAppointment {
  id: string;
  appointmentRef?: string;
  patientId: string;
  chamberId?: string;
  chamberLocationId?: string;
  serviceId?: string | null;
  serialNumber?: number;
  appointmentDate: string; // YYYY-MM-DD
  startTime?: string;       // HH:mm
  endTime?: string;         // HH:mm
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  fee?: number;
  isPaid?: boolean;
  type?: "IN_PERSON" | "VIDEO_CALL";
  notes?: string | null;
  reasonForVisit?: string | null;
  chiefComplaint?: string | null;
  symptoms?: string[];
  patientName?: string | null;
  patientPhone?: string | null;
  patientEmail?: string | null;
  whatsappNumber?: string | null;
  
  // Cancellation & Refund
  cancelReason?: string | null;
  cancelledAt?: string | null;
  cancelledBy?: "DOCTOR" | "PATIENT" | string | null;
  isRefunded?: boolean;
  refundAmount?: number;
  refundReason?: string | null;
  refundedAt?: string | null;

  patient?: IPatient;
  chamber?: IChamberLocation;
  chamberLocation?: IChamberLocation;
  service?: IService | null;
  invoices?: IInvoice[];
  prescriptions?: IPrescription[];
  createdAt: string;
}

export interface IPrescriptionItem {
  id?: string;
  brandName: string;
  drugName?: string;
  genericName?: string | null;
  strength?: string | null;
  form?: string | null;
  dosage: string;
  dose?: string;
  frequency?: string | null;
  duration: string;
  instruction: string;
}

export interface IPrescription {
  id: string;
  prescriptionNumber?: string;
  patientId: string;
  doctorId?: string;
  appointmentId?: string | null;
  chiefComplaints?: string[] | string | null;
  diagnoses?: string[] | string | null;
  clinicalFindings?: string | null;
  diagnosis?: string | null;
  investigationsAdvised?: string[];
  advice?: string | null;
  adviceBangla?: string | null;
  adviceEnglish?: string | null;
  followUpDate?: string | null;
  nextFollowUpDate?: string | null;
  verificationToken: string;
  createdAt: string;
  patient?: IPatient;
  doctor?: {
    fullName?: string;
    profilePhoto?: string | null;
    email?: string;
  };
  appointment?: IAppointment | null;
  items: IPrescriptionItem[];
}

export interface IInvoiceItem {
  id?: string;
  serviceId?: string | null;
  description: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface IPaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  method: "CASH" | "CARD" | "BKASH" | "SSLCOMMERZ" | "STRIPE" | "OTHER";
  transactionRef?: string | null;
  paidAt: string;
}

export interface IInvoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  appointmentId?: string | null;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: PaymentStatus;
  notes?: string | null;
  createdAt: string;
  patient?: IPatient;
  items?: IInvoiceItem[];
  payments?: IPaymentRecord[];
}

export interface IQueueItem {
  id: string;
  serialNumber: number;
  appointmentDate: string;
  startTime: string;
  status: AppointmentStatus;
  type: string;
  patient: {
    id: string;
    name: string;
    phoneNumber: string;
    ageYears?: number | null;
    gender: string;
    allergies?: string[];
  };
  service?: {
    id: string;
    name: string;
    fee: number;
  } | null;
}

export interface IReportKPI {
  todayAppointments: number;
  waitingInQueue: number;
  todayRevenue: number;
  totalActivePatients: number;
  weeklyTrend: {
    day: string;
    appointments: number;
    revenue: number;
  }[];
  consultationDistribution: {
    name: string;
    count: number;
  }[];
}

// Full Doctor Dashboard Analytics Overview
export interface IDoctorAnalytics {
  statsCards: {
    totalPatients: number;
    upcomingAppointments: number;
    totalAppointments: number;
    totalRevenue: number;
  };
  patientsRegistrationByDate: {
    date: string;
    count: number;
  }[];
  appointmentsByDate: {
    date: string;
    count: number;
  }[];
  genderDistribution: {
    name: string;
    gender: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  recentRegistrations: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    gender?: string;
    createdAt: string;
  }[];
  recentAppointments: {
    id: string;
    appointmentRef: string;
    patientName: string;
    patientPhone?: string;
    appointmentDate: string;
    startTime?: string;
    status: string;
    fee: number;
    isPaid: boolean;
    chamberName: string;
    createdAt: string;
  }[];
  revenueByChamber: {
    chamberId: string;
    chamberName: string;
    revenue: number;
  }[];
}

// Live Chat & Socket.io Types
export interface IChatMessage {
  id: string;
  conversationId: string;
  senderId?: string | null;
  senderType: "PATIENT" | "DOCTOR" | "AI";
  content: string;
  isAi: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface IConversation {
  id: string;
  patientId?: string | null;
  patientName: string;
  patientPhone?: string | null;
  patientEmail?: string | null;
  unreadCountDoctor: number;
  unreadCountPatient: number;
  lastMessageAt: string;
  patient?: IPatient | null;
  messages?: IChatMessage[];
}

export interface IGoogleSheetStatus {
  isConnected: boolean;
  sheetUrl?: string | null;
  sheetId?: string | null;
  lastSyncAt?: string | null;
  aiChatEnabled: boolean;
  totalEntries: number;
}

export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string | null;
  category: string;
  tags?: string[];
  authorName?: string;
  isPublished?: boolean;
  readTimeMinutes?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFaq {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
}

export interface ITestimonial {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  chamberName?: string | null;
  verified: boolean;
}

export interface IBlogCommentUser {
  id: string;
  fullName: string;
  profilePhoto?: string | null;
  role: string;
}

export interface IBlogComment {
  id: string;
  content: string;
  blogPostId: string;
  userId: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  user: IBlogCommentUser;
  replies?: IBlogComment[];
}

