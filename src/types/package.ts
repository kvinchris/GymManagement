export interface Package {
  id: string;
  name: string;
  description: string;
  price: number; // Price in currency units (e.g., USD)
  duration: number; // Duration in days
  features: string[]; // List of features included in the package
}
