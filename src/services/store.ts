// Comprehensive Mock State and Data Service for VITHAI TO ARUVADAI (V2A)
import {
  FarmerProfile,
  Farm,
  CropSeason,
  Crop,
  SoilReport,
  SeedBatch,
  InputProduct,
  InputPurchase,
  FarmTask,
  IrrigationRecord,
  CropObservation,
  ExpertRequest,
  MachineryListing,
  LabourBooking,
  HarvestRecord,
  StorageListing,
  TransportListing,
  Buyer,
  ProduceListing,
  BuyerOffer,
  SaleRecord,
  Payment,
  Expense,
  GovernmentScheme,
  JourneyEvent,
  Language,
  User,
} from "../types";

const STORAGE_KEY = "v2a_platform_state_v1";

export interface AppState {
  language: Language;
  activeSeasonId: string;
  currentUser: User;
  farmer: FarmerProfile;
  farm: Farm;
  crops: Crop[];
  seasons: CropSeason[];
  soilReports: SoilReport[];
  seedBatches: SeedBatch[];
  inputProducts: InputProduct[];
  inputPurchases: InputPurchase[];
  tasks: FarmTask[];
  irrigations: IrrigationRecord[];
  cropObservations: CropObservation[];
  expertRequests: ExpertRequest[];
  machineryListings: MachineryListing[];
  labourBookings: LabourBooking[];
  harvestRecords: HarvestRecord[];
  storageListings: StorageListing[];
  transportListings: TransportListing[];
  buyers: Buyer[];
  produceListings: ProduceListing[];
  buyerOffers: BuyerOffer[];
  sales: SaleRecord[];
  payments: Payment[];
  expenses: Expense[];
  schemes: GovernmentScheme[];
  journeyEvents: JourneyEvent[];
  lastSyncTime: string;
}

const defaultState: AppState = {
  language: "en",
  activeSeasonId: "CR-2026-SAMBA-01",
  currentUser: {
    id: "USER-VIJAY-DEMO",
    phone: "9000000421",
    name: "VIJAY",
    tamilName: "விஜய்",
    role: "farmer",
  },
  farmer: {
    id: "FARMER-TN-0421",
    userId: "USER-VIJAY-DEMO",
    fullName: "VIJAY",
    tamilFullName: "விஜய்",
    fatherName: "Demo profile",
    village: "Thiruvaiyaru",
    taluk: "Budalur",
    district: "Thanjavur",
    state: "Tamil Nadu",
    pincode: "613204",
    kisanCardNumber: "KCC-TN-THJ-889210",
    pmKisanBeneficiaryId: "PMK-TN-2019-904123",
    totalLandAcres: 5.5,
    primaryCrops: [
      "Paddy (Samba & Kuruvai)",
      "Blackgram (Ulundu)",
      "Sesame (Ellu)",
    ],
    soilTypes: ["Alluvial River Delta", "Clay Loam"],
    waterSources: ["Cauvery Grand Anicut Canal", "Solar Submersible Borewell"],
    aadhaarVerified: true,
    memberSince: "2023-04-14",
  },
  farm: {
    id: "FARM-DELTA-01",
    farmerId: "FARMER-TN-0421",
    farmName: "Cauvery Riverbed Fertile Vayal (காவிரி படுகை வயல்)",
    village: "Thiruvaiyaru",
    district: "Thanjavur",
    totalAreaAcres: 5.5,
    activeSeasonsCount: 2,
    parcels: [
      {
        id: "PARCEL-01",
        surveyNumber: "142/3B",
        subDivision: "3B",
        pattaNumber: "PATTA-904",
        acres: 3.5,
        soilType: "Clay Loam",
        irrigationType: "Canal",
        locationName: "Keezha Theru Vayal (கிழக்கு நன்செய்)",
        geoCoordinates: { lat: 10.8789, lng: 79.1024 },
      },
      {
        id: "PARCEL-02",
        surveyNumber: "145/1A",
        subDivision: "1A",
        pattaNumber: "PATTA-904",
        acres: 2.0,
        soilType: "Alluvial",
        irrigationType: "Borewell",
        locationName: "Vada Kaadu Parcel (வடக்கு தோட்டம்)",
        geoCoordinates: { lat: 10.8812, lng: 79.1051 },
      },
    ],
  },
  crops: [
    {
      id: "CROP-PADDY-SAMBA",
      name: "Paddy (Samba Season)",
      tamilName: "நெல் (சம்பா பருவம்)",
      category: "Cereal",
      durationDays: 135,
      idealSoilTypes: ["Clay Loam", "Alluvial", "Deep Clay"],
      waterRequirement: "High",
      avgCostPerAcre: 21500,
      avgYieldBagsPerAcre: 32, // 75kg bags
      mspPerQuintal: 2320,
      marketRateRange: { min: 2150, max: 2450 },
      recommendedSeasons: ["Samba (Main-Rabi)", "Thaladi (Late-Rabi)"],
      description:
        "Long duration, high-yielding aromatic grain varieties like CR 1009 Sub 1 and Ponni Deluxe, highly suited for Cauvery delta basin.",
      tamilDescription:
        "காவிரி டெல்டா பாசனத்திற்கு உகந்த நீண்ட கால பாரம்பரிய மற்றும் கலப்பின நெல் ரகங்கள் (பொன்னி, சிஆர் 1009).",
      pestVulnerabilities: [
        "Stem Borer",
        "Leaf Folder",
        "Bacterial Leaf Blight",
      ],
    },
    {
      id: "CROP-BLACKGRAM",
      name: "Blackgram (Rice Fallow)",
      tamilName: "உளுந்து (நெல் தரிசு)",
      category: "Pulse",
      durationDays: 70,
      idealSoilTypes: ["Clay Loam", "Residual Moisture Clay"],
      waterRequirement: "Low",
      avgCostPerAcre: 8500,
      avgYieldBagsPerAcre: 8, // 50kg bags
      mspPerQuintal: 7400,
      marketRateRange: { min: 7200, max: 8100 },
      recommendedSeasons: ["Navarai (Summer)", "Thaladi (Late-Rabi)"],
      description:
        "Short duration pulse sown into standing paddy stubble utilizing residual soil moisture, fixes atmospheric nitrogen.",
      tamilDescription:
        "நெல் அறுவடைக்கு முன் பனி ஈரத்தில் விதைக்கப்படும் குறுகிய கால நன்செய் தரிசு உளுந்து (VBN 8).",
      pestVulnerabilities: ["Yellow Mosaic Virus", "Pod Borer"],
    },
    {
      id: "CROP-SESAME",
      name: "Sesame (Summer Gingelly)",
      tamilName: "எள்ளு (கோடை எள்ளு)",
      category: "Oilseed",
      durationDays: 85,
      idealSoilTypes: ["Sandy Loam", "Alluvial"],
      waterRequirement: "Low",
      avgCostPerAcre: 9200,
      avgYieldBagsPerAcre: 6,
      mspPerQuintal: 9267,
      marketRateRange: { min: 9800, max: 12500 },
      recommendedSeasons: ["Navarai (Summer)"],
      description:
        "High commercial value oilseed, drought-tolerant, premium price in local oil extraction expellers.",
      tamilDescription:
        "குறைந்த நீரில் அதிக லாபம் தரும் கோடை கால பணப்பயிர் (TMV 7 ரகம்).",
      pestVulnerabilities: ["Antigastra Shoot Webber"],
    },
    {
      id: "CROP-BANANA",
      name: "Grand Naine Banana",
      tamilName: "வாழை (ஜி-9 ரகம்)",
      category: "Horticulture",
      durationDays: 330,
      idealSoilTypes: ["Alluvial", "Deep Loam"],
      waterRequirement: "Very High",
      avgCostPerAcre: 65000,
      avgYieldBagsPerAcre: 1200, // bunches
      mspPerQuintal: 0,
      marketRateRange: { min: 14, max: 28 }, // per kg
      recommendedSeasons: ["General Season"],
      description:
        "High return tissue culture Cavendish banana with intensive nutrient requirement and year-round local demand.",
      tamilDescription:
        "திசு வளர்ப்பு ஜி-9 நேந்திரம் மற்றும் பூவன் வாழை சாகுபடி.",
      pestVulnerabilities: ["Panama Wilt", "Sigatoka Leaf Spot"],
    },
  ],
  seasons: [
    {
      id: "CR-2026-SAMBA-01",
      seasonCode: "CR-2026-SAMBA-01",
      farmerId: "FARMER-TN-0421",
      cropId: "CROP-PADDY-SAMBA",
      cropName: "Paddy (CR 1009 Sub 1)",
      tamilCropName: "நெல் (சிஆர் 1009 சப் 1)",
      variety: "CR 1009 Sub 1 (Flood Tolerant Ponni)",
      seasonName: "Samba (Main-Rabi)",
      parcelId: "PARCEL-01",
      parcelName: "Keezha Theru Vayal (3.5 Acres)",
      areaAcres: 3.5,
      startDate: "2025-08-15",
      sowingDate: "2025-08-28",
      plannedHarvestDate: "2026-01-10",
      actualHarvestDate: "2026-01-12",
      stage: "Sold & Settled",
      targetYieldBags: 112,
      allocatedBudget: 75000,
      seedBatchId: "SEED-BATCH-TSSCA-904",
      notes:
        "Main Samba crop. Flood tolerant variety successfully withstood mid-monsoon heavy rains.",
    },
    {
      id: "CR-2026-BLACKGRAM-02",
      seasonCode: "CR-2026-BLACKGRAM-02",
      farmerId: "FARMER-TN-0421",
      cropId: "CROP-BLACKGRAM",
      cropName: "Blackgram (VBN 8)",
      tamilCropName: "உளுந்து (விபிஎன் 8)",
      variety: "VBN 8 (Resistant to YMV)",
      seasonName: "Navarai (Summer)",
      parcelId: "PARCEL-02",
      parcelName: "Vada Kaadu Parcel (2.0 Acres)",
      areaAcres: 2.0,
      startDate: "2026-01-20",
      sowingDate: "2026-01-25",
      plannedHarvestDate: "2026-04-05",
      stage: "Vegetative Growth",
      targetYieldBags: 16,
      allocatedBudget: 18000,
      notes:
        "Rice-fallow pulse to restore nitrogen and provide quick 70-day cash flow.",
    },
  ],
  soilReports: [
    {
      id: "SOIL-TEST-2025-01",
      farmId: "FARM-DELTA-01",
      parcelId: "PARCEL-01",
      sampleDate: "2025-07-20",
      labName: "Sample demo soil record (unverified)",
      nitrogenStatus: "Medium",
      nitrogenValueKgPerHa: 242,
      phosphorusStatus: "Medium",
      phosphorusValueKgPerHa: 19.4,
      potassiumStatus: "High",
      potassiumValueKgPerHa: 288,
      ph: 7.1,
      phDescription: "Neutral",
      electricalConductivity: 0.38,
      organicCarbonPct: 0.68,
      micronutrients: {
        zinc: "Deficient",
        iron: "Sufficient",
        boron: "Sufficient",
      },
      recommendations: [
        "Apply 25 kg Zinc Sulphate per hectare at baseline ploughing to correct zinc deficiency",
        "Incorporate 5 tonnes of Farm Yard Manure (FYM) or green manure (Daincha) to sustain organic carbon",
        "Top-dress Urea in 3 split doses at tillering, panicle initiation, and flowering stages",
      ],
      tamilRecommendations: [
        "துத்தநாக பற்றாக்குறையை போக்க ஏக்கருக்கு 10 கிலோ ஜிங்க் சல்பேட் அடியுரமாக இடவும்",
        "மண் அங்கக கரிமத்தை உயர்த்த ஏக்கருக்கு 2 டன் மக்கிய தொழுவுரம் அல்லது தக்கைப்பூண்டு இடவும்",
        "தழைச்சத்தை (யூரியா) 3 தவணைகளாக பிரித்து தூர் கட்டும் பருவம் மற்றும் கதிர் வரும் பருவத்தில் இடவும்",
      ],
    },
  ],
  seedBatches: [
    {
      id: "SEED-BATCH-TSSCA-904",
      batchNumber: "TN-TSSCA-2025-P90412",
      cropId: "CROP-PADDY-SAMBA",
      cropName: "Paddy",
      variety: "CR 1009 Sub 1",
      tamilVariety: "சிஆர் 1009 சப் 1 (வெள்ளத்தை தாங்கும் பொன்னி)",
      manufacturer: "Tamil Nadu State Seed Development Corporation (TANSEEC)",
      producerType: "Government (TSSCA)",
      certNumber: "CERT-AGRI-TN-88219-B",
      germinationRatePct: 94,
      physicalPurityPct: 98.8,
      geneticPurityPct: 99.5,
      testingDate: "2025-07-15",
      expiryDate: "2026-04-14",
      qrPayload:
        "V2A-SEED:TN-TSSCA-2025-P90412:CR1009SUB1:GERM94:PUR98.8:EXP202604",
      verificationStatus: "VERIFIED_DEMO",
      treatedWithPesticide: true,
      packageWeightKg: 30,
      mrp: 1450,
    },
    {
      id: "SEED-BATCH-TNAU-102",
      batchNumber: "TNAU-VBN-2026-B811",
      cropId: "CROP-BLACKGRAM",
      cropName: "Blackgram",
      variety: "VBN 8 (National Pulses Research Centre Vamban)",
      tamilVariety: "விபிஎன் 8 நன்செய் தரிசு உளுந்து",
      manufacturer: "Tamil Nadu Agricultural University (TNAU) Seed Centre",
      producerType: "Certified Agri University",
      certNumber: "CERT-TNAU-VMB-49021",
      germinationRatePct: 91,
      physicalPurityPct: 99.1,
      geneticPurityPct: 99.0,
      testingDate: "2025-12-10",
      expiryDate: "2026-09-09",
      qrPayload: "V2A-SEED:TNAU-VBN-2026-B811:VBN8:GERM91:PUR99.1",
      verificationStatus: "VERIFIED_DEMO",
      treatedWithPesticide: false,
      packageWeightKg: 8,
      mrp: 880,
    },
  ],
  inputProducts: [
    {
      id: "PROD-01",
      name: "Azospirillum Bio-Fertilizer (Nitrogen Fixer)",
      tamilName: "அசோஸ்பைரில்லம் உயிரி உரம்",
      category: "Organic Bio-Fertilizer",
      brand: "Tamil Nadu State Agri Bio-Lab",
      dosageRecommendation:
        "2 kg per acre mixed with 50 kg well-rotted farmyard manure",
      suitableCrops: ["Paddy", "Millets", "Sugarcane"],
      unit: "packet",
      pricePerUnit: 45,
      originalPrice: 60,
      stockAvailable: 250,
      certifiedOrganic: true,
      supplierName: "Agri Extension Depot, Thiruvaiyaru",
      rating: 4.8,
      description:
        "Microbial bio-inoculant fixes atmospheric nitrogen into available form for root absorption, saving 25% inorganic urea.",
    },
    {
      id: "PROD-02",
      name: "Neem Cake Organic Manure (100% Pure)",
      tamilName: "வேப்பம் புண்ணாக்கு உரம்",
      category: "Organic Bio-Fertilizer",
      brand: "Erode Agro Organics",
      dosageRecommendation: "50 kg per acre during baseline ploughing",
      suitableCrops: ["Paddy", "Pulses", "Banana"],
      unit: "bag (50kg)",
      pricePerUnit: 1450,
      originalPrice: 1650,
      stockAvailable: 80,
      certifiedOrganic: true,
      supplierName: "Cauvery Bio-Inputs Cooperative",
      rating: 4.9,
      description:
        "Natural nitrification inhibitor and nematode repeller. Improves soil structure and prevents subterranean pest attack.",
    },
    {
      id: "PROD-03",
      name: "Pseudomonas fluorescens (Bio-Fungicide)",
      tamilName: "சூடோமோனாஸ் புளோரசன்ஸ் உயிரி பூஞ்சானக்கொல்லி",
      category: "Bio-Pesticide",
      brand: "TNAU Bio-Control Lab",
      dosageRecommendation:
        "1 kg per acre dissolved in 200L water for foliar spray",
      suitableCrops: ["Paddy", "Vegetables", "Pulses"],
      unit: "kg",
      pricePerUnit: 120,
      originalPrice: 150,
      stockAvailable: 120,
      certifiedOrganic: true,
      supplierName: "Delta Agro Centre",
      rating: 4.7,
      description:
        "Effective antagonistic bacterium for control of blast, sheath rot, and leaf blight in paddy.",
    },
    {
      id: "PROD-04",
      name: "Zinc Sulphate Heptahydrate (21% Zn)",
      tamilName: "ஜிங்க் சல்பேட் நுண் ஊட்டச்சத்து",
      category: "NPK & Micronutrients",
      brand: "SPIC Agro Nutrients",
      dosageRecommendation: "10 kg per acre broadcasted before leveling",
      suitableCrops: ["Paddy", "Maize"],
      unit: "kg",
      pricePerUnit: 68,
      stockAvailable: 300,
      certifiedOrganic: false,
      supplierName: "Budalur Agri Traders",
      rating: 4.6,
      description:
        "Corrects Khaira disease and yellowing of young leaves in high yielding paddy varieties.",
    },
  ],
  inputPurchases: [
    {
      id: "PUR-01",
      seasonId: "CR-2026-SAMBA-01",
      productId: "PROD-01",
      productName: "Azospirillum Bio-Fertilizer (Nitrogen Fixer)",
      quantity: 8,
      unit: "packet",
      unitPrice: 45,
      totalCost: 360,
      purchaseDate: "2025-08-20",
      batchNumber: "AZO-2025-88",
      supplier: "Agri Extension Depot, Thiruvaiyaru",
      isUsedInField: true,
      notes: "Applied in nursery bed and main field baseline.",
    },
    {
      id: "PUR-02",
      seasonId: "CR-2026-SAMBA-01",
      productId: "PROD-02",
      productName: "Neem Cake Organic Manure (100% Pure)",
      quantity: 4,
      unit: "bag (50kg)",
      unitPrice: 1450,
      totalCost: 5800,
      purchaseDate: "2025-08-22",
      batchNumber: "NC-ERD-49",
      supplier: "Cauvery Bio-Inputs Cooperative",
      isUsedInField: true,
      notes:
        "Ploughed into 3.5 acres to control nematodes and slow release nitrogen.",
    },
    {
      id: "PUR-03",
      seasonId: "CR-2026-SAMBA-01",
      productId: "PROD-04",
      productName: "Zinc Sulphate Heptahydrate (21% Zn)",
      quantity: 35,
      unit: "kg",
      unitPrice: 68,
      totalCost: 2380,
      purchaseDate: "2025-08-25",
      batchNumber: "SPIC-ZN-112",
      supplier: "Budalur Agri Traders",
      isUsedInField: true,
      notes: "Corrected zinc deficiency as flagged by soil test.",
    },
  ],
  tasks: [
    {
      id: "TASK-01",
      seasonId: "CR-2026-SAMBA-01",
      title: "Summer Ploughing & Bund Trimming",
      tamilTitle: "கோடை உழவு & வரப்பு செப்பனிடுதல்",
      category: "Land Prep",
      cropStage: "Land Preparation",
      scheduledDate: "2025-08-16",
      completedDate: "2025-08-17",
      status: "Completed",
      priority: "High",
      machineryHours: 4,
      estimatedCost: 4000,
      actualCost: 4200,
      notes: "Tractor rotavator deep ploughing done to expose weed roots.",
    },
    {
      id: "TASK-02",
      seasonId: "CR-2026-SAMBA-01",
      title: "Raised Bed Mat Nursery Sowing",
      tamilTitle: "பாய் நாற்றங்கால் அமைத்து விதைத்தல்",
      category: "Sowing",
      cropStage: "Nursery",
      scheduledDate: "2025-08-28",
      completedDate: "2025-08-28",
      status: "Completed",
      priority: "Critical",
      labourCount: 6,
      estimatedCost: 3500,
      actualCost: 3400,
      notes: "Certified CR 1009 Sub 1 seed treated with Azospirillum.",
    },
    {
      id: "TASK-03",
      seasonId: "CR-2026-SAMBA-01",
      title: "Mechanical Transplanter Main Field Planting",
      tamilTitle: "இயந்திர நெல் நடும் கருவி மூலம் நடுவு",
      category: "Sowing",
      cropStage: "Transplanting",
      scheduledDate: "2025-09-14",
      completedDate: "2025-09-15",
      status: "Completed",
      priority: "Critical",
      machineryHours: 5,
      labourCount: 4,
      estimatedCost: 9500,
      actualCost: 9200,
      notes: "8-row ride-on transplanter used with 20x15cm uniform spacing.",
    },
    {
      id: "TASK-04",
      seasonId: "CR-2026-SAMBA-01",
      title: "Cono-Weeding & Tillering Aeration",
      tamilTitle: "கோனோ வீடர் மூலம் களை எடுத்தல்",
      category: "Weeding",
      cropStage: "Tillering",
      scheduledDate: "2025-10-05",
      completedDate: "2025-10-06",
      status: "Completed",
      priority: "Normal",
      labourCount: 8,
      estimatedCost: 4800,
      actualCost: 4800,
      notes: "Weeds incorporated back into the mud as organic mulch.",
    },
    {
      id: "TASK-05",
      seasonId: "CR-2026-SAMBA-01",
      title: "Combine Harvester Cutting & Bagging",
      tamilTitle: "ஒருங்கிணைந்த அறுவடை இயந்திரம் மூலம் அறுவடை",
      category: "Harvesting",
      cropStage: "Harvesting",
      scheduledDate: "2026-01-12",
      completedDate: "2026-01-12",
      status: "Completed",
      priority: "Critical",
      machineryHours: 4.5,
      labourCount: 6,
      estimatedCost: 14000,
      actualCost: 14500,
      notes:
        "Harvested at 14% moisture. Total 110 clean bags harvested without grain loss.",
    },
  ],
  irrigations: [
    {
      id: "IRR-01",
      seasonId: "CR-2026-SAMBA-01",
      date: "2025-09-18",
      source: "Cauvery River Canal",
      method: "Flood / Basin",
      durationHours: 6,
      electricityCost: 0,
      dieselCost: 0,
      notes:
        "Canal turn water received at Grand Anicut branch canal. Water depth maintained at 2.5 cm.",
    },
    {
      id: "IRR-02",
      seasonId: "CR-2026-SAMBA-01",
      date: "2025-10-24",
      source: "Borewell (Solar)",
      method: "Flood / Basin",
      durationHours: 4.5,
      electricityCost: 0,
      dieselCost: 0,
      notes:
        "Zero-fuel irrigation using 5HP solar pump during canal rotation holiday.",
    },
  ],
  cropObservations: [
    {
      id: "OBS-01",
      seasonId: "CR-2026-SAMBA-01",
      date: "2025-10-28",
      stage: "Active Tillering (Day 52)",
      imageUrl:
        "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80",
      symptoms: [
        "Longitudinal leaf folding with transparent white patches",
        "Chewed chlorophyll margins",
        "Silken threads binding leaves",
      ],
      aiDiagnosis: {
        diseaseName: "Paddy Leaf Folder (Cnaphalocrocis medinalis)",
        tamilDiseaseName: "நெல் இலைச்சுருட்டுப் புழு",
        confidencePct: 89,
        severity: "Moderate",
        scientificCause:
          "Larval feeding inside longitudinally folded leaves, aggravated by high nitrogen application and cloudy humidity.",
        recommendedRemedy: [
          "Release Trichogramma chilonis egg parasitoids @ 2 cc/acre",
          "Spray Neem Oil formulation (10,000 ppm) @ 2 ml/litre water",
          "Avoid excess urea application during cloudy monsoon spells",
        ],
        isMockSimulation: true,
      },
      expertReviewRequested: true,
      expertReply:
        "Diagnosis validated. Bio-agent Trichogramma chilonis along with Neem oil spray is ideal. Pest ETL is below 10%, no need for synthetic chemicals.",
      status: "Resolved",
    },
  ],
  expertRequests: [
    {
      id: "EXP-REQ-01",
      farmerId: "FARMER-TN-0421",
      seasonId: "CR-2026-SAMBA-01",
      expertName: "Dr. S. Ramanathan, Ph.D.",
      institution: "ICAR - Krishi Vigyan Kendra (KVK), Needamangalam",
      topic: "Leaf Folder biological suppression vs chemical spray",
      question:
        "Leaf folder pest noticed in 3.5 acres of CR 1009 Sub 1. Can we control purely through Trichogramma egg cards without chemical spray?",
      status: "Answered",
      answer:
        "Yes, absolutely. In Samba season, release Trichogramma chilonis @ 2 cc per acre twice at 7-day interval. It will protect natural predator spiders and parasitoids.",
      date: "2025-10-29",
    },
  ],
  machineryListings: [
    {
      id: "MACH-01",
      title: "Mahindra 575 DI (45 HP Tractor with Rotavator)",
      tamilTitle: "மகிந்திரா 45 HP டிராக்டர் & ரோட்டவேட்டர்",
      equipmentType: "Tractor (45 HP)",
      chcCenterName: "Thiruvaiyaru Primary Agri Cooperative CHC",
      hourlyRate: 950,
      dailyRate: 7500,
      includesFuelAndDriver: true,
      contactPerson: "Senthil Kumar (Operator)",
      phone: "+91 94432 18920",
      village: "Thiruvaiyaru",
      availableFrom: "Ready for Immediate Booking",
      rating: 4.8,
    },
    {
      id: "MACH-02",
      title: "Yanmar 8-Row Automatic Paddy Transplanter",
      tamilTitle: "யான்மார் 8-வரிசை இயந்திர நெல் நடும் கருவி",
      equipmentType: "Paddy Transplanter",
      chcCenterName: "Delta FPO Mechanization Centre",
      hourlyRate: 1800,
      dailyRate: 13500,
      includesFuelAndDriver: true,
      contactPerson: "Palanivel R",
      phone: "+91 98421 77651",
      village: "Budalur",
      availableFrom: "Advance Booking Available",
      rating: 4.9,
    },
    {
      id: "MACH-03",
      title: "Claas Crop Tiger 30 Combine Harvester (Rubber Track)",
      tamilTitle: "கிளாஸ் கிராப் டைகர் ரப்பர் டிராக் அறுவடை இயந்திரம்",
      equipmentType: "Combine Harvester",
      chcCenterName: "Thanjavur Agro Custom Hire",
      hourlyRate: 2600,
      dailyRate: 19500,
      includesFuelAndDriver: true,
      contactPerson: "Kalyanasundaram",
      phone: "+91 97890 44321",
      village: "Kallaperambur",
      availableFrom: "Active Harvest Season Dispatch",
      rating: 4.9,
    },
  ],
  labourBookings: [
    {
      id: "LAB-01",
      seasonId: "CR-2026-SAMBA-01",
      workType: "Paddy Nursery Pulling",
      requiredDate: "2025-09-14",
      workersCount: 6,
      dailyWagePerPerson: 550,
      totalCostEstimate: 3300,
      leadWorkerName: "Kavitha (Team Lead)",
      phone: "+91 96291 00412",
      status: "Completed",
    },
    {
      id: "LAB-02",
      seasonId: "CR-2026-SAMBA-01",
      workType: "Hand Weeding",
      requiredDate: "2025-10-15",
      workersCount: 8,
      dailyWagePerPerson: 500,
      totalCostEstimate: 4000,
      leadWorkerName: "Meenakshi Ammal",
      phone: "+91 94861 88319",
      status: "Completed",
    },
  ],
  harvestRecords: [
    {
      id: "HARV-2026-01",
      seasonId: "CR-2026-SAMBA-01",
      harvestDate: "2026-01-12",
      actualQuantityBags: 110,
      bagWeightKg: 75,
      totalYieldKg: 8250,
      yieldPerAcreBags: 31.4,
      moistureContentPct: 13.8,
      grainQualityGrade: "Grade A Super",
      labourExpense: 3500,
      machineryExpense: 11000,
      transportToGodownExpense: 2800,
      notes:
        "Superb grain lustre. Moisture tested at 13.8% (ideal for immediate sale without drying discount).",
    },
  ],
  storageListings: [
    {
      id: "STOR-01",
      name: "Thanjavur Central WDRA Agri Godown",
      tamilName: "தஞ்சாவூர் மத்திய ஒழுங்குமுறை சேமிப்புக் கிடங்கு",
      type: "WDRA Certified Warehouse",
      location: "Manojippa Street, Thanjavur Junction",
      distanceKm: 9.5,
      capacityMetricTons: 5000,
      availableSpaceTons: 1200,
      ratePerBagPerMonth: 6.5,
      pledgeLoanAvailable: true,
      phone: "+91 4362 230911",
    },
    {
      id: "STOR-02",
      name: "Thiruvaiyaru PACCS Village Godown",
      tamilName: "திருவையாறு தொடக்க வேளாண் கூட்டுறவு வங்கி கிடங்கு",
      type: "Village PACCS Godown",
      location: "South Street, Thiruvaiyaru",
      distanceKm: 2.1,
      capacityMetricTons: 500,
      availableSpaceTons: 180,
      ratePerBagPerMonth: 5.0,
      pledgeLoanAvailable: true,
      phone: "+91 4362 262234",
    },
  ],
  transportListings: [
    {
      id: "TRANS-01",
      vehicleType: "Mini Truck (Tata Ace 1.5T)",
      driverName: "Murugan (Tata Ace)",
      phone: "+91 98432 99012",
      baseCharge: 500,
      ratePerKm: 35,
      maxPayloadBags: 30,
      rating: 4.8,
    },
    {
      id: "TRANS-02",
      vehicleType: "Medium Truck (Eicher 4T)",
      driverName: "Ravi Transport Service",
      phone: "+91 94420 18239",
      baseCharge: 1200,
      ratePerKm: 50,
      maxPayloadBags: 90,
      rating: 4.9,
    },
    {
      id: "TRANS-03",
      vehicleType: "Tractor Trailer (3T)",
      driverName: "Ganesan Local Trailer",
      phone: "+91 97880 23119",
      baseCharge: 800,
      ratePerKm: 40,
      maxPayloadBags: 60,
      rating: 4.7,
    },
  ],
  buyers: [
    {
      id: "BUYER-01",
      name: "Thanjavur Modern Agro Rice Mill Pvt Ltd",
      tamilName: "தஞ்சாவூர் மாடர்ன் அக்ரோ ரைஸ் மில்",
      organization: "Sri Ranganathar Modern Mills",
      buyerType: "Modern Rice Mill",
      district: "Thanjavur",
      fssaiNumber: "12419024000412",
      gstNumber: "33AABCT9981E1Z0",
      verifiedBuyer: true,
      rating: 4.9,
      averagePaymentDays: 2,
      targetCrops: ["Paddy (Ponni)", "Paddy (CR 1009)", "Paddy (BPT 5204)"],
    },
    {
      id: "BUYER-02",
      name: "Cauvery Delta Farmers Producer Company (FPO)",
      tamilName: "காவிரி டெல்டா உழவர் உற்பத்தியாளர் நிறுவனம்",
      organization: "Delta Green FPC Ltd",
      buyerType: "FPO Aggregator",
      district: "Tiruvarur",
      fssaiNumber: "12421019000109",
      gstNumber: "33AAACD4412K1Z9",
      verifiedBuyer: true,
      rating: 4.8,
      averagePaymentDays: 1,
      targetCrops: ["Organic Paddy", "Blackgram", "Sesame"],
    },
    {
      id: "BUYER-03",
      name: "Tamil Nadu Civil Supplies DPC Centre (Govt)",
      tamilName:
        "தமிழ்நாடு நுகர்பொருள் வாணிபக் கழக நேரடி நெல் கொள்முதல் நிலையம்",
      organization: "TNCSC Direct Purchase Centre (DPC)",
      buyerType: "Government DPC (Direct Purchase Centre)",
      district: "Thanjavur",
      fssaiNumber: "10014042000001",
      gstNumber: "33AAACT0001A1Z5",
      verifiedBuyer: true,
      rating: 4.5,
      averagePaymentDays: 4,
      targetCrops: ["Paddy Common", "Paddy Grade A"],
    },
  ],
  produceListings: [
    {
      id: "LIST-2026-01",
      seasonId: "CR-2026-SAMBA-01",
      farmerId: "FARMER-TN-0421",
      cropName: "Samba Paddy (CR 1009 Sub 1)",
      variety: "CR 1009 Sub 1 Ponni",
      quantityBags: 110,
      bagWeightKg: 75,
      askingPricePerBag: 2300,
      qualityGrade: "Grade A Super",
      moisturePct: 13.8,
      pickupLocation: "Thiruvaiyaru Farm Gate, Thanjavur",
      listingDate: "2026-01-13",
      status: "Sold",
    },
  ],
  buyerOffers: [
    {
      id: "OFFER-01",
      listingId: "LIST-2026-01",
      seasonId: "CR-2026-SAMBA-01",
      buyerId: "BUYER-01",
      buyerName: "Thanjavur Modern Agro Rice Mill Pvt Ltd",
      buyerOrg: "Sri Ranganathar Modern Mills",
      offeredPricePerBag: 2280,
      quantityBagsRequested: 110,
      gradeAccepted: "Grade A Super",
      pickupTerms: "Buyer Farm-gate Pickup",
      paymentTerms: "Immediate Bank NEFT",
      status: "Accepted",
      offerDate: "2026-01-14",
      notes:
        "Will arrange company truck for farm-gate weighment and direct pickup. 70% advance on weighment slip, balance within 48h after mill intake.",
    },
    {
      id: "OFFER-02",
      listingId: "LIST-2026-01",
      seasonId: "CR-2026-SAMBA-01",
      buyerId: "BUYER-02",
      buyerName: "Cauvery Delta Farmers Producer Company (FPO)",
      buyerOrg: "Delta Green FPC Ltd",
      offeredPricePerBag: 2240,
      quantityBagsRequested: 60,
      gradeAccepted: "Grade A Super",
      pickupTerms: "Farmer Delivers to Mill",
      paymentTerms: "50% Advance + 50% on Weighment",
      status: "Rejected",
      offerDate: "2026-01-14",
      notes: "Partial lot procurement offered.",
    },
  ],
  sales: [
    {
      id: "SALE-2026-01",
      seasonId: "CR-2026-SAMBA-01",
      listingId: "LIST-2026-01",
      buyerId: "BUYER-01",
      buyerName: "Thanjavur Modern Agro Rice Mill Pvt Ltd",
      buyerOrg: "Sri Ranganathar Modern Mills",
      saleDate: "2026-01-15",
      bagsSold: 110,
      pricePerBag: 2280,
      grossAmount: 250800, // 110 * 2280
      deductions: {
        mandiCessOrMarketFee: 2508, // 1%
        baggingCost: 3300, // Rs 30/bag
        moistureDeduction: 0, // 13.8% is within 14% benchmark!
        logisticsPaidByFarmer: 3500,
      },
      netSaleProceeds: 241492, // 250800 - 9308
      weighmentSlipNumber: "WS-THJ-2026-8812",
      saleInvoiceNumber: "INV-V2A-2026-0042",
      status: "Partially Paid",
    },
  ],
  payments: [
    {
      id: "PAY-01",
      saleId: "SALE-2026-01",
      seasonId: "CR-2026-SAMBA-01",
      buyerName: "Thanjavur Modern Agro Rice Mill Pvt Ltd",
      amount: 175000,
      paymentType: "Advance",
      method: "UPI / Direct Bank Transfer",
      status: "RECEIVED",
      paymentDate: "2026-01-15",
      dueDate: "2026-01-15",
      referenceNo: "NEFT-IOB-88392019482",
    },
    {
      id: "PAY-02",
      saleId: "SALE-2026-01",
      seasonId: "CR-2026-SAMBA-01",
      buyerName: "Thanjavur Modern Agro Rice Mill Pvt Ltd",
      amount: 66492,
      paymentType: "Final Settlement",
      method: "UPI / Direct Bank Transfer",
      status: "PENDING",
      dueDate: "2026-01-20",
      referenceNo: "PENDING-SETTLEMENT-MILL-01",
    },
  ],
  expenses: [
    {
      id: "EXP-01",
      seasonId: "CR-2026-SAMBA-01",
      category: "Seeds",
      description: "Certified CR 1009 Sub 1 Seed Bags (3 bags x 30kg)",
      tamilDescription:
        "சான்றளிக்கப்பட்ட சிஆர் 1009 சப் 1 நெல் விதைகள் (3 மூட்டைகள்)",
      amount: 4350,
      date: "2025-08-20",
      paymentMode: "Cash",
      paidTo: "Agri Extension Depot, Thiruvaiyaru",
      receiptNumber: "REC-SEED-490",
    },
    {
      id: "EXP-02",
      seasonId: "CR-2026-SAMBA-01",
      category: "Fertilizers",
      description: "Neem Cake & Bio-inoculants (Azospirillum, Phosphobacteria)",
      tamilDescription:
        "வேப்பம் புண்ணாக்கு மற்றும் அசோஸ்பைரில்லம் உயிரி உரங்கள்",
      amount: 6160,
      date: "2025-08-22",
      paymentMode: "UPI",
      paidTo: "Cauvery Bio-Inputs Cooperative",
      receiptNumber: "UPI-BIO-902",
    },
    {
      id: "EXP-03",
      seasonId: "CR-2026-SAMBA-01",
      category: "Machinery",
      description: "Summer Rotavator Ploughing & Puddling (Mahindra 575 DI)",
      tamilDescription: "டிராக்டர் கோடை உழவு & சேற்றுழவு வாடகை",
      amount: 7500,
      date: "2025-08-25",
      paymentMode: "Cash",
      paidTo: "Senthil Kumar (Tractor Driver)",
    },
    {
      id: "EXP-04",
      seasonId: "CR-2026-SAMBA-01",
      category: "Machinery",
      description: "8-Row Automatic Mechanical Transplanter (5 hrs)",
      tamilDescription: "இயந்திர நெல் நடுவு இயந்திர வாடகை",
      amount: 9000,
      date: "2025-09-15",
      paymentMode: "UPI",
      paidTo: "Delta FPO Mechanization Centre",
    },
    {
      id: "EXP-05",
      seasonId: "CR-2026-SAMBA-01",
      category: "Labour",
      description:
        "Nursery lifting, bundle handling and corner field transplanting",
      tamilDescription:
        "நாற்று பறித்தல் மற்றும் விடுபட்ட மூலைகளில் கை நடுவு கூலி",
      amount: 7200,
      date: "2025-09-16",
      paymentMode: "Cash",
      paidTo: "Kavitha Labour Lead",
    },
    {
      id: "EXP-06",
      seasonId: "CR-2026-SAMBA-01",
      category: "Bio-Inputs",
      description: "Micronutrient Zinc Sulphate + Pseudomonas foliar spray",
      tamilDescription: "ஜிங்க் சல்பேட் மற்றும் சூடோமோனாஸ் தெளிப்பு",
      amount: 3200,
      date: "2025-10-10",
      paymentMode: "UPI",
      paidTo: "Budalur Agri Traders",
    },
    {
      id: "EXP-07",
      seasonId: "CR-2026-SAMBA-01",
      category: "Labour",
      description: "Two rounds of weeding and bund cleaning",
      tamilDescription: "இரண்டு முறை களையெடுத்தல் மற்றும் வரப்பு வெட்டுதல்",
      amount: 8800,
      date: "2025-10-22",
      paymentMode: "Cash",
      paidTo: "Meenakshi Weeding Team",
    },
    {
      id: "EXP-08",
      seasonId: "CR-2026-SAMBA-01",
      category: "Machinery",
      description: "Claas Combine Harvester Cutting & Threshing (4.5 hours)",
      tamilDescription: "ஒருங்கிணைந்த அறுவடை இயந்திர வாடகை",
      amount: 11700,
      date: "2026-01-12",
      paymentMode: "Cash",
      paidTo: "Thanjavur Agro Custom Hire",
    },
    {
      id: "EXP-09",
      seasonId: "CR-2026-SAMBA-01",
      category: "Labour",
      description:
        "Grain bagging, stitching, loading and tare weighing (110 bags)",
      tamilDescription:
        "நெல் மூட்டை பிடித்தல், தைத்தல் மற்றும் லோடு ஏற்றுதல் கூலி",
      amount: 6600,
      date: "2026-01-13",
      paymentMode: "Cash",
      paidTo: "Kalyan Harvest Labourers",
    },
    {
      id: "EXP-10",
      seasonId: "CR-2026-SAMBA-01",
      category: "Transport",
      description:
        "Eicher Medium Truck transport from farm to mill weighbridge",
      tamilDescription: "பண்ணையிலிருந்து ஆலைக்கு நெல் மூட்டை லாரி வாடகை",
      amount: 3500,
      date: "2026-01-15",
      paymentMode: "UPI",
      paidTo: "Ravi Transport Service",
    },
    {
      id: "EXP-11",
      seasonId: "CR-2026-SAMBA-01",
      category: "Irrigation",
      description: "Borewell solar pump servicing and valve maintenance",
      tamilDescription: "சோலார் பம்புசெட் சர்வீஸ் மற்றும் வால்வு பராமரிப்பு",
      amount: 1500,
      date: "2025-11-05",
      paymentMode: "Cash",
      paidTo: "Delta Solar Works",
    },
  ],
  schemes: [
    {
      id: "SCHEME-01",
      code: "PM-KISAN",
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      tamilName: "பிரதமர் கிசான் சம்மான் நிதி திட்டம்",
      sponsoredBy: "Central Govt",
      subsidyAmountOrBenefit:
        "₹6,000 / year in three installments of ₹2,000 direct to bank",
      targetGroup: "All landholding farmer families with cultivable land",
      eligibilityConditions: [
        "Farmer must hold registered patta",
        "Aadhaar linked to active bank account",
        "e-KYC verified",
      ],
      requiredDocuments: [
        "Aadhaar Card",
        "Land Patta / Chitta copy",
        "Bank Passbook copy",
        "Kisan Credit Card (optional)",
      ],
      applicationPortalUrl: "https://pmkisan.gov.in",
      deadlineText: "Year-round continuous registration",
      activeStatus: true,
    },
    {
      id: "SCHEME-02",
      code: "KAGVVT-TN",
      name: "Kalaignarin All Village Integrated Agriculture Development Programme",
      tamilName: "கலைஞரின் அனைத்து கிராம ஒருங்கிணைந்த வேளாண் வளர்ச்சி திட்டம்",
      sponsoredBy: "Tamil Nadu State Govt",
      subsidyAmountOrBenefit:
        "100% subsidy on green manure seeds, 50% subsidy on bio-fertilizers & fruit saplings, soil testing free",
      targetGroup: "Selected Gram Panchayats in Tamil Nadu",
      eligibilityConditions: [
        "Resident farmer of notified revenue village",
        "Cultivating wetland or dryland",
      ],
      requiredDocuments: [
        "Ration Card / Smart Card",
        "Patta copy",
        "Aadhaar Card",
      ],
      applicationPortalUrl: "https://tnhorticulture.tn.gov.in",
      deadlineText: "Current Fiscal Year Active",
      activeStatus: true,
    },
    {
      id: "SCHEME-03",
      code: "PMFBY-TN",
      name: "Pradhan Mantri Fasal Bima Yojana (Crop Insurance TN)",
      tamilName: "பிரதம மந்திரி பயிர் காப்பீட்டுத் திட்டம் (சம்பா நெல்)",
      sponsoredBy: "Joint Central-State",
      subsidyAmountOrBenefit:
        "Comprehensive financial cover for prevented sowing, mid-season localized floods, and post-harvest cyclone damage",
      targetGroup:
        "Samba and Kuruvai Paddy cultivators in notified delta villages",
      eligibilityConditions: [
        "Sowing certificate issued by VAO",
        "Premium payment before cut-off date (1.5% farmer share, remaining govt subsidy)",
      ],
      requiredDocuments: [
        "VAO Adangal certificate",
        "Sowing declaration",
        "Aadhaar copy",
        "Bank account statement",
      ],
      applicationPortalUrl: "https://pmfby.gov.in",
      deadlineText: "Cut-off for Samba: November 15",
      activeStatus: true,
    },
    {
      id: "SCHEME-04",
      code: "SMAM-MACH",
      name: "Sub-Mission on Agricultural Mechanization (SMAM)",
      tamilName: "வேளாண் இயந்திரமயமாக்கல் திட்டம் (50% மானியம்)",
      sponsoredBy: "Joint Central-State",
      subsidyAmountOrBenefit:
        "40% - 50% capital subsidy on purchasing Rotavators, Power Tillers, and Paddy Transplanters",
      targetGroup:
        "Individual farmers, women SHGs, and Farmer Producer Organizations",
      eligibilityConditions: [
        "First-time equipment purchaser through Agri Engineering Dept",
      ],
      requiredDocuments: [
        "Aadhaar",
        "Land documents (min 2.5 acres)",
        "Quotation from authorized dealer",
        "Bank mandate",
      ],
      applicationPortalUrl: "https://agrimachinery.nic.in",
      deadlineText: "Applications open on TN Uzhavan App",
      activeStatus: true,
    },
  ],
  journeyEvents: [
    {
      id: "EV-01",
      seasonId: "CR-2026-SAMBA-01",
      stage: "Planning & Soil",
      title: "Delta Soil Test & Parcel Profiling",
      tamilTitle: "மண் பரிசோதனை & சத்துக்கள் அறிதல்",
      date: "2025-07-20",
      description:
        "Tested 3.5 acres at District Soil Lab. pH 7.1 neutral; organic carbon 0.68%. Zinc deficiency identified and incorporated into baseline nutrition plan.",
      tamilDescription:
        "மண் பரிசோதனை செய்யப்பட்டது. பி.எச் 7.1 நடுநிலை. துத்தநாக பற்றாக்குறைக்கு ஜிங்க் சல்பேட் பரிந்துரைக்கப்பட்டது.",
      costImpact: 0,
      badge: "Soil Card Verified",
      verifiedOfficial: true,
    },
    {
      id: "EV-02",
      seasonId: "CR-2026-SAMBA-01",
      stage: "Seed Sourcing",
      title: "Certified Seed Passport Scan (TSSCA)",
      tamilTitle: "விதை பாஸ்போர்ட் QR ஆய்வு (சான்றளிக்கப்பட்டது)",
      date: "2025-08-15",
      description:
        "Scanned QR code on 3 bags (90kg) of CR 1009 Sub 1 from Tamil Nadu State Seed Corp. Verified: 94% germination rate, 98.8% purity.",
      tamilDescription:
        "தமிழ்நாடு விதை சான்றளிப்பு நிறுவனத்தின் QR குறியீடு ஆய்வு செய்யப்பட்டு 94% முளைப்புத்திறன் உறுதி செய்யப்பட்டது.",
      costImpact: 4350,
      badge: "QR Trace Active",
      verifiedOfficial: true,
    },
    {
      id: "EV-03",
      seasonId: "CR-2026-SAMBA-01",
      stage: "Sowing & Nursery",
      title: "Raised Mat Nursery & Bio-Inoculation",
      tamilTitle: "பாய் நாற்றங்கால் & உயிரி உரம் விதை நேர்த்தி",
      date: "2025-08-28",
      description:
        "Sowed certified seeds on plastic film mat nursery treated with Azospirillum and Trichoderma to ensure robust seedling vigor for mechanical transplanter.",
      costImpact: 3760,
      badge: "Healthy Nursery",
    },
    {
      id: "EV-04",
      seasonId: "CR-2026-SAMBA-01",
      stage: "Sowing & Nursery",
      title: "8-Row Ride-On Transplanter Planting",
      tamilTitle: "8-வரிசை இயந்திர நெல் நடுவு",
      date: "2025-09-15",
      description:
        "Machine transplanted 3.5 acres in 5 hours at uniform 20x15cm grid, saving 60% labour costs and ensuring optimal plant population (50 hills/sqm).",
      costImpact: 16200,
      badge: "Mechanized Field",
    },
    {
      id: "EV-05",
      seasonId: "CR-2026-SAMBA-01",
      stage: "Crop Nutrition",
      title: "Neem Cake & Organic Micronutrient Boost",
      tamilTitle: "வேப்பம் புண்ணாக்கு & நுண்ணூட்டச்சத்து இடுதல்",
      date: "2025-10-10",
      description:
        "Applied 200kg Neem cake + 35kg Zinc Sulphate to suppress root nematodes and provide balanced tillering nourishment.",
      costImpact: 9360,
      badge: "Organic Fortified",
    },
    {
      id: "EV-06",
      seasonId: "CR-2026-SAMBA-01",
      stage: "Protection",
      title: "AI Crop Doctor Scan & KVK Agronomist Advice",
      tamilTitle: "AI நோய் கண்டறிதல் & KVK விஞ்ஞானி ஆலோசனை",
      date: "2025-10-28",
      description:
        "Detected early Leaf Folder symptoms. AI suggested Trichogramma egg parasitoids + Neem oil spray (89% match). Confirmed by KVK Dr. Ramanathan. Successfully contained without toxic insecticides.",
      costImpact: 1800,
      badge: "Bio-Protected",
    },
    {
      id: "EV-07",
      seasonId: "CR-2026-SAMBA-01",
      stage: "Harvesting",
      title: "Rubber Track Combine Harvester Cutting",
      tamilTitle: "கிளாஸ் இயந்திரம் மூலம் அறுவடை",
      date: "2026-01-12",
      description:
        "Harvested 3.5 acres under dry sun. 110 pristine bags (8,250 kg) threshed and cleaned directly on the field. Zero lodging loss.",
      costImpact: 18300,
      badge: "110 Bags Harvested",
      verifiedOfficial: true,
    },
    {
      id: "EV-08",
      seasonId: "CR-2026-SAMBA-01",
      stage: "Storage & Logistics",
      title: "Moisture Testing & Direct Farm-Gate Weighment",
      tamilTitle: "ஈரப்பதம் ஆய்வு & பண்ணை வாயில் எடை பதிவு",
      date: "2026-01-14",
      description:
        "Tested at 13.8% moisture (standard grade requirement <14%). Digital weighment recorded on electronic weighbridge slip WS-THJ-2026-8812.",
      costImpact: 3500,
      badge: "Grade A Moisture 13.8%",
      verifiedOfficial: true,
    },
    {
      id: "EV-09",
      seasonId: "CR-2026-SAMBA-01",
      stage: "Market Sale",
      title: "Thanjavur Modern Rice Mill Purchase Deed",
      tamilTitle: "தஞ்சாவூர் மாடர்ன் ரைஸ் மில் விற்பனை ஒப்பந்தம்",
      date: "2026-01-15",
      description:
        "Contracted 110 bags @ ₹2,280/bag for gross revenue of ₹2,50,800. Net proceeds after statutory mandi cess, bagging, and freight: ₹2,41,492.",
      incomeImpact: 250800,
      badge: "Sold @ ₹2,280/bag",
      verifiedOfficial: true,
    },
    {
      id: "EV-10",
      seasonId: "CR-2026-SAMBA-01",
      stage: "Financial Settlement",
      title: "NEFT Bank Settlement & Pending Due Ledger",
      tamilTitle: "வங்கி கணக்கில் முதல் தவணை & நிலுவை விவரம்",
      date: "2026-01-15",
      description:
        "Received ₹1,75,000 direct to bank (NEFT Ref: IOB-88392019482). Pending balance ₹66,492 scheduled for Jan 20. Total cultivation expense ₹75,100 deducted from net proceeds leaves real farm profit of ₹1,66,392!",
      incomeImpact: 175000,
      badge: "Realized Margin ₹1.66 Lakh",
      verifiedOfficial: true,
    },
  ],
  lastSyncTime: new Date().toLocaleTimeString(),
};

export class AppStore {
  private static createDefaultState(): AppState {
    return JSON.parse(JSON.stringify(defaultState)) as AppState;
  }

  private static loadState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        const requiredArrays: (keyof AppState)[] = [
          "crops",
          "seasons",
          "soilReports",
          "seedBatches",
          "inputProducts",
          "inputPurchases",
          "tasks",
          "irrigations",
          "cropObservations",
          "expertRequests",
          "machineryListings",
          "labourBookings",
          "harvestRecords",
          "storageListings",
          "transportListings",
          "buyers",
          "produceListings",
          "buyerOffers",
          "sales",
          "payments",
          "expenses",
          "schemes",
          "journeyEvents",
        ];
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          typeof (parsed as AppState).activeSeasonId === "string" &&
          typeof (parsed as AppState).currentUser === "object" &&
          typeof (parsed as AppState).farmer === "object" &&
          typeof (parsed as AppState).farm === "object" &&
          requiredArrays.every((key) =>
            Array.isArray((parsed as AppState)[key]),
          )
        ) {
          return parsed as AppState;
        }
        console.warn(
          "Stored app state has an invalid shape; using demo defaults.",
        );
      }
    } catch (e) {
      console.warn("Could not read state from localStorage", e);
    }
    return this.createDefaultState();
  }

  private static saveState(state: AppState): void {
    try {
      state.lastSyncTime = new Date().toLocaleTimeString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save state to localStorage", e);
    }
  }

  public static getState(): AppState {
    return this.loadState();
  }

  public static setLanguage(lang: Language): AppState {
    const s = this.loadState();
    s.language = lang;
    this.saveState(s);
    return s;
  }

  public static setCurrentUser(user: User): AppState {
    const s = this.loadState();
    s.currentUser = user;
    if (user.role === "farmer") {
      s.farmer = {
        ...s.farmer,
        userId: user.id,
        fullName: user.name,
        tamilFullName: user.tamilName || s.farmer.tamilFullName,
      };
    }
    this.saveState(s);
    return s;
  }

  public static setActiveSeason(seasonId: string): AppState {
    const s = this.loadState();
    s.activeSeasonId = seasonId;
    this.saveState(s);
    return s;
  }

  public static updateFarmerAndFarm(
    farmerUpdates: Partial<FarmerProfile>,
    farmUpdates: Partial<Farm>,
  ): AppState {
    const s = this.loadState();
    s.farmer = { ...s.farmer, ...farmerUpdates };
    s.farm = { ...s.farm, ...farmUpdates };
    s.currentUser = {
      ...s.currentUser,
      name: s.farmer.fullName,
      tamilName: s.farmer.tamilFullName,
    };
    this.saveState(s);
    return s;
  }

  public static addExpense(expense: Omit<Expense, "id">): Expense {
    const s = this.loadState();
    const newExp: Expense = {
      ...expense,
      id: `EXP-${Date.now()}`,
    };
    s.expenses.unshift(newExp);

    // also record a journey event
    s.journeyEvents.push({
      id: `EV-${Date.now()}`,
      seasonId: newExp.seasonId,
      stage: "Crop Nutrition",
      title: `Expense: ${newExp.description}`,
      tamilTitle: newExp.tamilDescription || `செலவு: ${newExp.description}`,
      date: newExp.date,
      description: `Amount ₹${newExp.amount} paid via ${newExp.paymentMode} to ${newExp.paidTo}.`,
      costImpact: newExp.amount,
      badge: `₹${newExp.amount}`,
    });

    this.saveState(s);
    return newExp;
  }

  public static addTask(task: Omit<FarmTask, "id">): FarmTask {
    const s = this.loadState();
    const newTask: FarmTask = { ...task, id: `TASK-${Date.now()}` };
    s.tasks.unshift(newTask);
    this.saveState(s);
    return newTask;
  }

  public static addIrrigation(
    record: Omit<IrrigationRecord, "id">,
  ): IrrigationRecord {
    const s = this.loadState();
    const newRecord: IrrigationRecord = { ...record, id: `IRR-${Date.now()}` };
    s.irrigations.unshift(newRecord);
    this.saveState(s);
    return newRecord;
  }

  public static addExpertRequest(
    request: Omit<ExpertRequest, "id">,
  ): ExpertRequest {
    const s = this.loadState();
    const newRequest: ExpertRequest = { ...request, id: `EXP-${Date.now()}` };
    s.expertRequests.unshift(newRequest);
    this.saveState(s);
    return newRequest;
  }

  public static addJourneyEvent(event: Omit<JourneyEvent, "id">): JourneyEvent {
    const s = this.loadState();
    const newEvent: JourneyEvent = { ...event, id: `EV-${Date.now()}` };
    s.journeyEvents.unshift(newEvent);
    this.saveState(s);
    return newEvent;
  }

  public static addSoilReport(report: Omit<SoilReport, "id">): SoilReport {
    const s = this.loadState();
    const newReport: SoilReport = { ...report, id: `SOIL-${Date.now()}` };
    s.soilReports.unshift(newReport);
    this.saveState(s);
    return newReport;
  }

  public static addInputPurchase(
    purchase: Omit<InputPurchase, "id">,
  ): InputPurchase {
    const s = this.loadState();
    const newPurchase: InputPurchase = {
      ...purchase,
      id: `INPUT-${Date.now()}`,
    };
    s.inputPurchases.unshift(newPurchase);
    const product = s.inputProducts.find(
      (item) => item.id === purchase.productId,
    );
    if (product)
      product.stockAvailable = Math.max(
        0,
        product.stockAvailable - purchase.quantity,
      );
    this.saveState(s);
    return newPurchase;
  }

  public static addSeedBatch(batch: Omit<SeedBatch, "id">): SeedBatch {
    const s = this.loadState();
    const newBatch: SeedBatch = {
      ...batch,
      id: `SEED-${Date.now()}`,
    };
    s.seedBatches.unshift(newBatch);

    s.journeyEvents.push({
      id: `EV-${Date.now()}`,
      seasonId: s.activeSeasonId,
      stage: "Seed Sourcing",
      title: `Seed Batch Recorded: ${newBatch.variety}`,
      tamilTitle: `விதை தொகுதி பதிவு: ${newBatch.tamilVariety || newBatch.variety}`,
      date: new Date().toISOString().split("T")[0],
      description: `Batch ${newBatch.batchNumber} from ${newBatch.manufacturer}. Germination: ${newBatch.germinationRatePct}%.`,
      badge:
        newBatch.verificationStatus === "VERIFIED_OFFICIAL"
          ? "Official verification"
          : "Demo batch lookup",
      verifiedOfficial: newBatch.verificationStatus === "VERIFIED_OFFICIAL",
    });

    this.saveState(s);
    return newBatch;
  }

  public static addCropObservation(
    obs: Omit<CropObservation, "id">,
  ): CropObservation {
    const s = this.loadState();
    const newObs: CropObservation = {
      ...obs,
      id: `OBS-${Date.now()}`,
    };
    s.cropObservations.unshift(newObs);

    s.journeyEvents.push({
      id: `EV-${Date.now()}`,
      seasonId: newObs.seasonId,
      stage: "Protection",
      title: `Diagnosis: ${newObs.aiDiagnosis.diseaseName}`,
      tamilTitle: `நோய் கண்டறிதல்: ${newObs.aiDiagnosis.tamilDiseaseName}`,
      date: newObs.date,
      description: `Detected with ${newObs.aiDiagnosis.confidencePct}% match. Severity: ${newObs.aiDiagnosis.severity}.`,
      badge: `${newObs.aiDiagnosis.confidencePct}% AI Match`,
    });

    this.saveState(s);
    return newObs;
  }

  public static addProduceListing(
    listing: Omit<ProduceListing, "id">,
  ): ProduceListing {
    const s = this.loadState();
    const newListing: ProduceListing = {
      ...listing,
      id: `LIST-${Date.now()}`,
    };
    s.produceListings.unshift(newListing);
    this.saveState(s);
    return newListing;
  }

  public static broadcastHarvest(
    seasonId: string,
  ): { listing: ProduceListing; offers: BuyerOffer[] } | null {
    const s = this.loadState();
    const season = s.seasons.find((item) => item.id === seasonId);
    const harvest = s.harvestRecords.find((item) => item.seasonId === seasonId);
    if (!season || !harvest) return null;

    const existingListing = s.produceListings.find(
      (item) =>
        item.seasonId === seasonId &&
        (item.status === "Active" || item.status === "Under Negotiation"),
    );
    if (existingListing) {
      return {
        listing: existingListing,
        offers: s.buyerOffers.filter(
          (offer) => offer.listingId === existingListing.id,
        ),
      };
    }

    const alreadySoldBags = s.sales
      .filter((sale) => sale.seasonId === seasonId)
      .reduce((total, sale) => total + sale.bagsSold, 0);
    const availableBags = harvest.actualQuantityBags - alreadySoldBags;
    if (availableBags <= 0) return null;

    const crop = s.crops.find((item) => item.id === season.cropId);
    const askingPricePerBag = crop?.marketRateRange
      ? Math.round((crop.marketRateRange.min + crop.marketRateRange.max) / 2)
      : 2300;
    const listing: ProduceListing = {
      id: `LIST-${Date.now()}`,
      seasonId,
      farmerId: season.farmerId,
      cropName: season.cropName,
      variety: season.variety,
      quantityBags: availableBags,
      bagWeightKg: harvest.bagWeightKg,
      askingPricePerBag,
      qualityGrade: harvest.grainQualityGrade,
      moisturePct: harvest.moistureContentPct,
      pickupLocation: `${s.farm.village} Farm Gate, ${s.farm.district}`,
      listingDate: new Date().toISOString().split("T")[0],
      status: "Active",
    };

    const matchingBuyers = s.buyers.filter((buyer) =>
      buyer.targetCrops.some((target) =>
        target
          .toLowerCase()
          .includes(season.cropName.split(" ")[0].toLowerCase()),
      ),
    );
    const buyers = matchingBuyers.length > 0 ? matchingBuyers : s.buyers;
    const offers: BuyerOffer[] = buyers.map((buyer, index) => ({
      id: `OFFER-${Date.now()}-${index}`,
      listingId: listing.id,
      seasonId,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerOrg: buyer.organization,
      offeredPricePerBag: Math.max(
        1,
        Math.round(askingPricePerBag * (1 - index * 0.025)),
      ),
      quantityBagsRequested: availableBags,
      gradeAccepted: harvest.grainQualityGrade,
      pickupTerms: "Buyer Farm-gate Pickup",
      paymentTerms: index === 0 ? "Immediate Bank NEFT" : "3-Day Post-delivery",
      status: "Pending",
      offerDate: new Date().toISOString().split("T")[0],
      notes:
        "Demo buyer offer. Confirm price and settlement terms before accepting.",
    }));

    s.produceListings.unshift(listing);
    s.buyerOffers.unshift(...offers);
    s.journeyEvents.push({
      id: `EV-${Date.now()}`,
      seasonId,
      stage: "Market Sale",
      title: "Harvest broadcast to buyers",
      tamilTitle: "அறுவடை விளைபொருள் வாங்குபவர்களுக்கு அறிவிக்கப்பட்டது",
      date: listing.listingDate,
      description: `${availableBags} bags were listed and ${offers.length} demo buyer offer(s) generated for review.`,
      badge: "Listing Active",
    });

    this.saveState(s);
    return { listing, offers };
  }

  public static acceptOffer(offerId: string): BuyerOffer | null {
    const s = this.loadState();
    const offer = s.buyerOffers.find((o) => o.id === offerId);
    if (!offer || offer.status !== "Pending") return null;
    const listing = s.produceListings.find(
      (item) => item.id === offer.listingId,
    );
    if (
      !listing ||
      listing.status !== "Active" ||
      offer.quantityBagsRequested <= 0 ||
      offer.quantityBagsRequested > listing.quantityBags ||
      s.sales.some((sale) => sale.listingId === listing.id)
    ) {
      return null;
    }

    offer.status = "Accepted";
    listing.status = "Sold";
    s.buyerOffers.forEach((otherOffer) => {
      if (
        otherOffer.listingId === offer.listingId &&
        otherOffer.id !== offer.id &&
        otherOffer.status === "Pending"
      ) {
        otherOffer.status = "Rejected";
      }
    });

    // Auto-create or update sale record
    const gross = offer.offeredPricePerBag * offer.quantityBagsRequested;
    const cess = Math.round(gross * 0.01);
    const bagging = offer.quantityBagsRequested * 30;
    const transport = offer.pickupTerms === "Buyer Farm-gate Pickup" ? 0 : 3500;
    const net = gross - cess - bagging - transport;

    const sale: SaleRecord = {
      id: `SALE-${Date.now()}`,
      seasonId: offer.seasonId,
      listingId: offer.listingId,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      buyerOrg: offer.buyerOrg,
      saleDate: new Date().toISOString().split("T")[0],
      bagsSold: offer.quantityBagsRequested,
      pricePerBag: offer.offeredPricePerBag,
      grossAmount: gross,
      deductions: {
        mandiCessOrMarketFee: cess,
        baggingCost: bagging,
        moistureDeduction: 0,
        logisticsPaidByFarmer: transport,
      },
      netSaleProceeds: net,
      weighmentSlipNumber: `WS-${Date.now().toString().slice(-4)}`,
      saleInvoiceNumber: `INV-V2A-${Date.now().toString().slice(-4)}`,
      status: "Invoiced",
    };
    s.sales.unshift(sale);

    // Record receivables according to the buyer's agreed settlement terms.
    const now = Date.now();
    const dueToday = new Date(now).toISOString().split("T")[0];
    const dueInThreeDays = new Date(now + 3 * 24 * 3600 * 1000)
      .toISOString()
      .split("T")[0];
    const paymentMilestones: Omit<Payment, "id">[] =
      offer.paymentTerms === "50% Advance + 50% on Weighment"
        ? [
            {
              saleId: sale.id,
              seasonId: offer.seasonId,
              buyerName: offer.buyerName,
              amount: Math.round(net / 2),
              paymentType: "Advance",
              method: "UPI / Direct Bank Transfer",
              status: "PENDING",
              dueDate: dueToday,
            },
            {
              saleId: sale.id,
              seasonId: offer.seasonId,
              buyerName: offer.buyerName,
              amount: net - Math.round(net / 2),
              paymentType: "Final Settlement",
              method: "UPI / Direct Bank Transfer",
              status: "PENDING",
              dueDate: dueInThreeDays,
            },
          ]
        : [
            {
              saleId: sale.id,
              seasonId: offer.seasonId,
              buyerName: offer.buyerName,
              amount: net,
              paymentType: "Final Settlement",
              method: "UPI / Direct Bank Transfer",
              status: "PENDING",
              dueDate:
                offer.paymentTerms === "Immediate Bank NEFT"
                  ? dueToday
                  : dueInThreeDays,
            },
          ];
    for (const milestone of paymentMilestones) {
      s.payments.unshift({
        ...milestone,
        id: `PAY-${Date.now()}-${s.payments.length}`,
      });
    }

    this.saveState(s);
    return offer;
  }

  public static rejectOffer(offerId: string): BuyerOffer | null {
    const s = this.loadState();
    const offer = s.buyerOffers.find((item) => item.id === offerId);
    if (!offer || offer.status !== "Pending") return null;
    offer.status = "Rejected";
    this.saveState(s);
    return offer;
  }

  public static recordPaymentSettlement(
    paymentId: string,
    refNo: string,
  ): Payment | null {
    const s = this.loadState();
    const payment = s.payments.find((p) => p.id === paymentId);
    if (!payment) return null;

    payment.status = "RECEIVED";
    payment.paymentDate = new Date().toISOString().split("T")[0];
    payment.referenceNo = refNo;

    // Check if associated sale is now settled
    const allSalePayments = s.payments.filter(
      (p) => p.saleId === payment.saleId,
    );
    const hasPending = allSalePayments.some((p) => p.status === "PENDING");
    const sale = s.sales.find((sal) => sal.id === payment.saleId);
    if (sale) {
      sale.status = hasPending ? "Partially Paid" : "Settled";
    }
    const hasPendingSeasonPayments = s.payments.some(
      (item) =>
        item.seasonId === payment.seasonId && item.status !== "RECEIVED",
    );
    if (
      !hasPendingSeasonPayments &&
      s.sales.some((item) => item.seasonId === payment.seasonId)
    ) {
      const season = s.seasons.find((item) => item.id === payment.seasonId);
      if (season) season.stage = "Sold & Settled";
    }

    s.journeyEvents.push({
      id: `EV-${Date.now()}`,
      seasonId: payment.seasonId,
      stage: "Financial Settlement",
      title: `Bank Settlement Received: ₹${payment.amount.toLocaleString()}`,
      tamilTitle: `வங்கிப் பரிவர்த்தனை வரவு: ₹${payment.amount.toLocaleString()}`,
      date: payment.paymentDate,
      description: `Payment settled via ${payment.method}. Reference: ${refNo}.`,
      incomeImpact: payment.amount,
      badge: "Bank Settled",
      verifiedOfficial: true,
    });

    this.saveState(s);
    return payment;
  }

  public static createSeason(
    seasonData: Omit<CropSeason, "id" | "seasonCode">,
  ): CropSeason {
    const s = this.loadState();
    const newId = `CR-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const newSeason: CropSeason = {
      ...seasonData,
      id: newId,
      seasonCode: newId,
    };
    s.seasons.unshift(newSeason);
    s.activeSeasonId = newId;

    s.journeyEvents.push({
      id: `EV-${Date.now()}`,
      seasonId: newId,
      stage: "Planning & Soil",
      title: `Season Initialized: ${newSeason.cropName}`,
      tamilTitle: `புதிய சாகுபடி துவக்கம்: ${newSeason.tamilCropName || newSeason.cropName}`,
      date: newSeason.startDate,
      description: `Targeting ${newSeason.targetYieldBags} bags on ${newSeason.areaAcres} acres in ${newSeason.seasonName}.`,
      badge: "Season Started",
    });

    this.saveState(s);
    return newSeason;
  }

  public static resetToDemo(): AppState {
    const state = this.createDefaultState();
    state.produceListings = [];
    state.buyerOffers = [];
    state.sales = [];
    state.payments = [];
    const harvestSeason = state.seasons.find(
      (season) => season.id === state.activeSeasonId,
    );
    if (harvestSeason) harvestSeason.stage = "Harvested";
    state.journeyEvents = state.journeyEvents.filter(
      (event) =>
        event.seasonId !== state.activeSeasonId ||
        (event.stage !== "Market Sale" &&
          event.stage !== "Financial Settlement"),
    );
    this.saveState(state);
    return state;
  }

  // Pure Financial Calculators
  public static calculateSeasonFinancials(seasonId: string) {
    const s = this.loadState();
    const seasonExpenses = s.expenses.filter((e) => e.seasonId === seasonId);
    const seasonSales = s.sales.filter((sl) => sl.seasonId === seasonId);
    const seasonPayments = s.payments.filter((p) => p.seasonId === seasonId);

    const totalExpenses = seasonExpenses.reduce((sum, e) => sum + e.amount, 0);

    const grossSales = seasonSales.reduce((sum, sl) => sum + sl.grossAmount, 0);
    const totalDeductions = seasonSales.reduce((sum, sl) => {
      const d = sl.deductions;
      return (
        sum +
        d.mandiCessOrMarketFee +
        d.baggingCost +
        d.moistureDeduction +
        d.logisticsPaidByFarmer
      );
    }, 0);
    const netProceedsInvoiced = grossSales - totalDeductions;

    const receivedPayments = seasonPayments
      .filter((p) => p.status === "RECEIVED")
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayments = seasonPayments
      .filter((p) => p.status !== "RECEIVED")
      .reduce((sum, p) => sum + p.amount, 0);

    // CRITICAL: Realized Net Profit = Realized Proceeds - Total Expenses
    // Net Result = Sales Revenue - Deductions - Total Expenses
    const projectedNetResult = netProceedsInvoiced - totalExpenses;
    const realizedCashflow = receivedPayments - totalExpenses;

    // Breakdown by category
    const expenseByCategory: Record<string, number> = {};
    for (const exp of seasonExpenses) {
      expenseByCategory[exp.category] =
        (expenseByCategory[exp.category] || 0) + exp.amount;
    }

    return {
      totalExpenses,
      grossSales,
      totalDeductions,
      netProceedsInvoiced,
      receivedPayments,
      pendingPayments, // NOT counted as received income!
      projectedNetResult,
      realizedCashflow,
      expenseByCategory,
      expenseCount: seasonExpenses.length,
      salesCount: seasonSales.length,
    };
  }
}
