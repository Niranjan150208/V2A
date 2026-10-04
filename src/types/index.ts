// TypeScript interfaces for VITHAI TO ARUVADAI (V2A)

export type Language = "en" | "ta";

export type CropCategory =
  | "Cereal"
  | "Pulse"
  | "Oilseed"
  | "Commercial"
  | "Horticulture";

export type SeasonName =
  | "Kuruvai (Summer-Kharif)"
  | "Samba (Main-Rabi)"
  | "Thaladi (Late-Rabi)"
  | "Navarai (Summer)"
  | "General Season";

export type TaskCategory =
  | "Land Prep"
  | "Sowing"
  | "Irrigation"
  | "Fertilization"
  | "Weeding"
  | "Pest Control"
  | "Harvesting"
  | "Post-Harvest";

export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Deferred";

export type ExpenseCategory =
  | "Seeds"
  | "Fertilizers"
  | "Bio-Inputs"
  | "Labour"
  | "Machinery"
  | "Irrigation"
  | "Transport"
  | "Storage"
  | "Packaging"
  | "Other";

export interface User {
  id: string;
  phone: string;
  name: string;
  tamilName?: string;
  role: "farmer" | "buyer" | "expert" | "agri_officer";
  avatarUrl?: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  fullName: string;
  tamilFullName: string;
  fatherName: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  pincode: string;
  kisanCardNumber: string;
  pmKisanBeneficiaryId?: string;
  totalLandAcres: number;
  primaryCrops: string[];
  soilTypes: string[];
  waterSources: string[];
  aadhaarVerified: boolean;
  memberSince: string;
}

export interface LandParcel {
  id: string;
  surveyNumber: string;
  subDivision: string;
  pattaNumber: string;
  acres: number;
  soilType:
    | "Clay Loam"
    | "Alluvial"
    | "Red Sandy Loam"
    | "Black Cotton"
    | "Sandy";
  irrigationType:
    | "Canal"
    | "Borewell"
    | "Drip Irrigation"
    | "Open Well"
    | "Rainfed";
  locationName: string;
  geoCoordinates?: { lat: number; lng: number };
}

export interface Farm {
  id: string;
  farmerId: string;
  farmName: string;
  village: string;
  district: string;
  parcels: LandParcel[];
  totalAreaAcres: number;
  activeSeasonsCount: number;
}

export interface Crop {
  id: string;
  name: string;
  tamilName: string;
  category: CropCategory;
  durationDays: number;
  idealSoilTypes: string[];
  waterRequirement: "Low" | "Medium" | "High" | "Very High";
  avgCostPerAcre: number;
  avgYieldBagsPerAcre: number; // 75kg bags
  mspPerQuintal: number;
  marketRateRange: { min: number; max: number };
  recommendedSeasons: string[];
  description: string;
  tamilDescription: string;
  pestVulnerabilities: string[];
}

export interface SoilReport {
  id: string;
  photoDataUrl?: string;
  farmId: string;
  parcelId: string;
  sampleDate: string;
  labName: string;
  nitrogenStatus: "Low" | "Medium" | "High";
  nitrogenValueKgPerHa: number;
  phosphorusStatus: "Low" | "Medium" | "High";
  phosphorusValueKgPerHa: number;
  potassiumStatus: "Low" | "Medium" | "High";
  potassiumValueKgPerHa: number;
  ph: number;
  phDescription: "Acidic" | "Neutral" | "Slightly Alkaline" | "Alkaline";
  electricalConductivity: number; // dS/m
  organicCarbonPct: number;
  micronutrients: {
    zinc: "Deficient" | "Sufficient";
    iron: "Deficient" | "Sufficient";
    boron: "Deficient" | "Sufficient";
  };
  recommendations: string[];
  tamilRecommendations: string[];
}

export interface SeedBatch {
  id: string;
  batchNumber: string;
  cropId: string;
  cropName: string;
  variety: string;
  tamilVariety: string;
  manufacturer: string;
  producerType:
    | "Government (TSSCA)"
    | "Certified Agri University"
    | "Licensed Private Seed Co"
    | "Farmer Producer Org";
  certNumber: string;
  germinationRatePct: number;
  physicalPurityPct: number;
  geneticPurityPct: number;
  testingDate: string;
  expiryDate: string;
  qrPayload: string;
  verificationStatus:
    | "VERIFIED_OFFICIAL"
    | "VERIFIED_DEMO"
    | "UNVERIFIED"
    | "FLAGGED_EXPIRED";
  treatedWithPesticide: boolean;
  packageWeightKg: number;
  mrp: number;
}

export interface InputProduct {
  id: string;
  name: string;
  tamilName: string;
  category:
    | "Organic Bio-Fertilizer"
    | "NPK & Micronutrients"
    | "Bio-Pesticide"
    | "Seeds"
    | "Farm Equipment";
  brand: string;
  dosageRecommendation: string;
  suitableCrops: string[];
  unit: "kg" | "liter" | "bag (50kg)" | "packet";
  pricePerUnit: number;
  originalPrice?: number;
  stockAvailable: number;
  certifiedOrganic: boolean;
  supplierName: string;
  rating: number;
  imageUrl?: string;
  description: string;
}

export interface InputPurchase {
  id: string;
  orderStatus?: "Placed" | "Received" | "Cancelled";
  seasonId: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  purchaseDate: string;
  batchNumber: string;
  supplier: string;
  isUsedInField: boolean;
  notes?: string;
}

export interface FarmTask {
  id: string;
  seasonId: string;
  title: string;
  tamilTitle: string;
  category: TaskCategory;
  cropStage: string;
  scheduledDate: string;
  completedDate?: string;
  status: TaskStatus;
  priority: "Normal" | "High" | "Critical";
  labourCount?: number;
  machineryHours?: number;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
}

export interface IrrigationRecord {
  id: string;
  seasonId: string;
  date: string;
  source:
    | "Cauvery River Canal"
    | "Borewell (Solar)"
    | "Borewell (Grid)"
    | "Farm Pond / Rainwater";
  method: "Flood / Basin" | "Drip Irrigation" | "Sprinkler";
  durationHours: number;
  electricityCost: number;
  dieselCost: number;
  notes?: string;
}

export interface CropObservation {
  id: string;
  seasonId: string;
  date: string;
  stage: string;
  imageUrl?: string;
  symptoms: string[];
  aiDiagnosis: {
    diseaseName: string;
    tamilDiseaseName: string;
    confidencePct: number;
    severity: "Mild" | "Moderate" | "Severe";
    scientificCause: string;
    recommendedRemedy: string[];
    isMockSimulation: boolean;
  };
  expertReviewRequested: boolean;
  expertReply?: string;
  status: "Reported" | "Treating" | "Resolved";
}

export interface ExpertRequest {
  id: string;
  farmerId: string;
  seasonId: string;
  expertName: string;
  institution: string;
  topic: string;
  question: string;
  status: "Pending Review" | "Answered";
  answer?: string;
  date: string;
}

export interface MachineryListing {
  id: string;
  title: string;
  tamilTitle: string;
  equipmentType:
    | "Tractor (45 HP)"
    | "Paddy Transplanter"
    | "Combine Harvester"
    | "Power Tiller"
    | "Drone Sprayer"
    | "Rotavator";
  chcCenterName: string; // Custom Hiring Centre
  hourlyRate: number;
  dailyRate: number;
  includesFuelAndDriver: boolean;
  contactPerson: string;
  phone: string;
  village: string;
  availableFrom: string;
  rating: number;
}

export interface LabourBooking {
  id: string;
  seasonId: string;
  workType:
    | "Paddy Nursery Pulling"
    | "Transplanting"
    | "Hand Weeding"
    | "Harvesting & Bagging"
    | "Spraying";
  requiredDate: string;
  workersCount: number;
  dailyWagePerPerson: number;
  totalCostEstimate: number;
  leadWorkerName: string;
  phone: string;
  status: "Requested" | "Confirmed" | "Completed";
}

export interface HarvestRecord {
  id: string;
  seasonId: string;
  harvestDate: string;
  actualQuantityBags: number;
  bagWeightKg: number;
  totalYieldKg: number;
  yieldPerAcreBags: number;
  moistureContentPct: number;
  grainQualityGrade: "Grade A Super" | "Standard Common" | "Damaged / Wet";
  labourExpense: number;
  machineryExpense: number;
  transportToGodownExpense: number;
  notes?: string;
}

export interface StorageListing {
  id: string;
  name: string;
  tamilName: string;
  type:
    | "WDRA Certified Warehouse"
    | "Cold Storage"
    | "Paddy Silo"
    | "Village PACCS Godown";
  location: string;
  distanceKm: number;
  capacityMetricTons: number;
  availableSpaceTons: number;
  ratePerBagPerMonth: number;
  pledgeLoanAvailable: boolean; // e-NWR warehouse receipt finance
  phone: string;
}

export interface TransportListing {
  id: string;
  vehicleType:
    | "Mini Truck (Tata Ace 1.5T)"
    | "Medium Truck (Eicher 4T)"
    | "Tractor Trailer (3T)"
    | "Heavy Lorry (10T)";
  driverName: string;
  phone: string;
  baseCharge: number;
  ratePerKm: number;
  maxPayloadBags: number;
  rating: number;
}

export interface Buyer {
  id: string;
  name: string;
  tamilName: string;
  organization: string;
  buyerType:
    | "Modern Rice Mill"
    | "Wholesale Mandi Trader"
    | "FPO Aggregator"
    | "Government DPC (Direct Purchase Centre)"
    | "Exporter";
  district: string;
  fssaiNumber: string;
  gstNumber: string;
  verifiedBuyer: boolean;
  rating: number;
  averagePaymentDays: number;
  targetCrops: string[];
}

export interface ProduceListing {
  id: string;
  seasonId: string;
  farmerId: string;
  cropName: string;
  variety: string;
  quantityBags: number;
  bagWeightKg: number;
  askingPricePerBag: number;
  qualityGrade: string;
  moisturePct: number;
  pickupLocation: string;
  listingDate: string;
  status: "Active" | "Under Negotiation" | "Sold" | "Unsold Relisted";
}

export interface BuyerOffer {
  id: string;
  listingId: string;
  seasonId: string;
  buyerId: string;
  buyerName: string;
  buyerOrg: string;
  offeredPricePerBag: number;
  quantityBagsRequested: number;
  gradeAccepted: string;
  pickupTerms:
    | "Buyer Farm-gate Pickup"
    | "Farmer Delivers to Mill"
    | "Mandi Delivery";
  paymentTerms:
    | "Immediate Bank NEFT"
    | "50% Advance + 50% on Weighment"
    | "3-Day Post-delivery";
  status: "Pending" | "Accepted" | "Countered" | "Rejected";
  offerDate: string;
  notes?: string;
}

export interface SaleRecord {
  id: string;
  seasonId: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerOrg: string;
  saleDate: string;
  bagsSold: number;
  pricePerBag: number;
  grossAmount: number;
  deductions: {
    mandiCessOrMarketFee: number;
    baggingCost: number;
    moistureDeduction: number;
    logisticsPaidByFarmer: number;
  };
  netSaleProceeds: number;
  weighmentSlipNumber: string;
  saleInvoiceNumber: string;
  status: "Invoiced" | "Partially Paid" | "Settled";
}

export interface Payment {
  id: string;
  saleId: string;
  seasonId: string;
  buyerName: string;
  amount: number;
  paymentType: "Advance" | "Milestone 1" | "Final Settlement";
  method: "UPI / Direct Bank Transfer" | "e-NAM Escrow" | "Cheque";
  status: "RECEIVED" | "PENDING" | "OVERDUE";
  paymentDate?: string;
  dueDate: string;
  transactionReference?: string;
  referenceNo?: string;
}

export interface Expense {
  id: string;
  seasonId: string;
  category: ExpenseCategory;
  description: string;
  tamilDescription?: string;
  amount: number;
  date: string;
  paymentMode: "Cash" | "UPI" | "Credit / Due";
  paidTo: string;
  receiptNumber?: string;
}

export interface GovernmentScheme {
  id: string;
  code: string;
  name: string;
  tamilName: string;
  sponsoredBy: "Tamil Nadu State Govt" | "Central Govt" | "Joint Central-State";
  subsidyAmountOrBenefit: string;
  targetGroup: string;
  eligibilityConditions: string[];
  requiredDocuments: string[];
  applicationPortalUrl: string;
  deadlineText: string;
  activeStatus: boolean;
}

export interface JourneyEvent {
  id: string;
  seasonId: string;
  stage:
    | "Planning & Soil"
    | "Seed Sourcing"
    | "Sowing & Nursery"
    | "Crop Nutrition"
    | "Protection"
    | "Harvesting"
    | "Storage & Logistics"
    | "Market Sale"
    | "Financial Settlement";
  title: string;
  tamilTitle: string;
  date: string;
  description: string;
  tamilDescription?: string;
  costImpact?: number;
  incomeImpact?: number;
  badge?: string;
  verifiedOfficial?: boolean;
}

export interface CropSeason {
  id: string;
  seasonCode: string; // e.g. CR-2026-SAMBA-01
  farmerId: string;
  cropId: string;
  cropName: string;
  tamilCropName: string;
  variety: string;
  seasonName: SeasonName;
  parcelId: string;
  parcelName: string;
  areaAcres: number;
  startDate: string;
  sowingDate: string;
  plannedHarvestDate: string;
  actualHarvestDate?: string;
  stage:
    | "Planning"
    | "Seed Verified"
    | "Sown"
    | "Vegetative Growth"
    | "Flowering & Grain Filling"
    | "Harvest Ready"
    | "Harvested"
    | "Stored"
    | "Sold & Settled";
  targetYieldBags: number;
  allocatedBudget: number;
  seedBatchId?: string;
  notes?: string;
}
