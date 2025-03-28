export interface Member {
  id: string;
  memberId: string; // Unique member ID for display (e.g., GM12345)
  name: string;
  email: string;
  phone: string;
  address: string;
  packageId: string; // Reference to the membership package
  packageName: string; // Name of the package for display
  startDate: Date; // When the membership started
  expiryDate: Date; // When the membership expires
  notes?: string; // Optional notes about the member
}
