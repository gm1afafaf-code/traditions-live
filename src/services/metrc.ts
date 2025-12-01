/**
 * METRC API Integration Service
 * Official NYS Cannabis Compliance API
 * Base URL: https://api-ny.metrc.com
 * Auth: HTTP Basic Auth (vendorApiKey:userApiKey)
 */

export interface MetrcConfig {
  vendorApiKey: string;
  userApiKey: string;
  licenseNumber: string;
  baseUrl?: string;
}

export interface MetrcPackage {
  id: string;
  label: string; // UID (e.g., "1A4FF0300000022000001")
  packageType: string;
  productName: string;
  productCategoryName: string;
  quantity: number;
  unitOfMeasureName: string;
  itemStrainName?: string;
  itemUnitCbdPercent?: number;
  itemUnitCbdContent?: number;
  itemUnitCbdContentUnitOfMeasureName?: string;
  itemUnitThcPercent?: number;
  itemUnitThcContent?: number;
  itemUnitThcContentUnitOfMeasureName?: string;
  packagedDate: string;
  expirationDate?: string;
  isProductionBatch: boolean;
  productionBatchNumber?: string;
  isTradeSample: boolean;
  isTesting: boolean;
  productRequiresRemediation: boolean;
  containsRemediatedProduct: boolean;
  remediationDate?: string;
  receivedDateTime?: string;
  receivedFromManifestNumber?: string;
  receivedFromFacilityLicenseNumber?: string;
  isOnHold: boolean;
  archivedDate?: string;
  finishedDate?: string;
  lastModified: string;
}

export interface MetrcPlant {
  id: string;
  label: string; // UID
  plantBatchName?: string;
  plantBatchTypeName?: string;
  strainName: string;
  locationName: string;
  harvestCount: number;
  isOnHold: boolean;
  plantedDate: string;
  vegetativeDate?: string;
  floweringDate?: string;
  harvestedDate?: string;
  destroyedDate?: string;
  lastModified: string;
}

export interface MetrcPlantBatch {
  id: string;
  name: string;
  type: 'Seed' | 'Clone';
  count: number;
  strainName: string;
  locationName: string;
  plantedDate: string;
  untrackedCount: number;
  trackedCount: number;
  packagedCount: number;
  harvestedCount: number;
  destroyedCount: number;
  lastModified: string;
}

export interface MetrcTransfer {
  id: string;
  manifestNumber: string;
  shipmentTypeName: string;
  shipmentTransactionType: string;
  createdDateTime: string;
  createdByUserName: string;
  lastModified: string;
  deliveryId?: string;
  recipientFacilityLicenseNumber?: string;
  recipientFacilityName?: string;
  shipperFacilityLicenseNumber: string;
  shipperFacilityName: string;
  estimatedDepartureDateTime: string;
  actualDepartureDateTime?: string;
  estimatedArrivalDateTime: string;
  actualArrivalDateTime?: string;
  deliveryPackageCount: number;
  deliveryReceivedPackageCount?: number;
  receivedDateTime?: string;
}

export interface MetrcLabTest {
  packageLabel: string;
  productName: string;
  productCategoryName: string;
  testPerformedDate: string;
  overallPassed: boolean;
  testTypeName: string;
  testPassed: boolean;
  testComment?: string;
  thcPercent?: number;
  thcMgPerG?: number;
  cbdPercent?: number;
  cbdMgPerG?: number;
  moisturePercent?: number;
  foreignMatterPercent?: number;
  otherCannabinoids?: Array<{
    cannabinoidName: string;
    percent: number;
    mgPerG: number;
  }>;
}

export interface MetrcStrain {
  id: string;
  name: string;
  testingStatus: 'None' | 'InProgress' | 'Passed';
  thcLevel?: number;
  cbdLevel?: number;
  indicaPercentage?: number;
  sativaPercentage?: number;
}

export interface MetrcLocation {
  id: string;
  name: string;
  locationType: 'Default' | 'Planting' | 'Vegetation' | 'Flowering' | 'Drying' | 'Packaging' | 'Quarantine';
}

export class MetrcAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'MetrcAPIError';
  }
}

export class MetrcService {
  private config: MetrcConfig;
  private baseUrl: string;
  private authHeader: string;

  constructor(config: MetrcConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api-ny.metrc.com';
    this.authHeader = 'Basic ' + btoa(`${config.vendorApiKey}:${config.userApiKey}`);
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new MetrcAPIError(
          errorData.message || `METRC API error: ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof MetrcAPIError) {
        throw error;
      }
      throw new MetrcAPIError(`Network error: ${(error as Error).message}`);
    }
  }

  // ============================================================================
  // PACKAGES
  // ============================================================================

  async getPackages(
    licenseNumber?: string,
    lastModifiedStart?: string,
    lastModifiedEnd?: string
  ): Promise<MetrcPackage[]> {
    const license = licenseNumber || this.config.licenseNumber;
    let endpoint = `/packages/v2/active?licenseNumber=${license}`;

    if (lastModifiedStart) {
      endpoint += `&lastModifiedStart=${lastModifiedStart}`;
    }
    if (lastModifiedEnd) {
      endpoint += `&lastModifiedEnd=${lastModifiedEnd}`;
    }

    return this.request<MetrcPackage[]>(endpoint);
  }

  async getPackageById(id: string, licenseNumber?: string): Promise<MetrcPackage> {
    const license = licenseNumber || this.config.licenseNumber;
    return this.request<MetrcPackage>(`/packages/v2/${id}?licenseNumber=${license}`);
  }

  async createPackages(packages: Array<{
    tag: string;
    location?: string;
    item: string;
    quantity: number;
    unitOfMeasure: string;
    patientLicenseNumber?: string;
    note?: string;
    isProductionBatch: boolean;
    productionBatchNumber?: string;
    isTradeSample: boolean;
    isDonation: boolean;
    productRequiresRemediation: boolean;
    useSameItem: boolean;
    actualDate: string;
    ingredients?: Array<{
      package: string;
      quantity: number;
      unitOfMeasure: string;
    }>;
  }>): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/packages/v2/create?licenseNumber=${license}`, 'POST', packages);
  }

  async createPlantingPackages(packages: Array<{
    packageLabel: string;
    plantBatchName: string;
    plantBatchType: string;
    plantCount: number;
    locationName: string;
    patientLicenseNumber?: string;
    actualDate: string;
  }>): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/packages/v2/create/plantings?licenseNumber=${license}`, 'POST', packages);
  }

  // ============================================================================
  // PLANTS & PLANT BATCHES
  // ============================================================================

  async getPlantBatches(licenseNumber?: string): Promise<MetrcPlantBatch[]> {
    const license = licenseNumber || this.config.licenseNumber;
    return this.request<MetrcPlantBatch[]>(`/plantbatches/v2/active?licenseNumber=${license}`);
  }

  async createPlantBatches(batches: Array<{
    name: string;
    type: 'Seed' | 'Clone';
    count: number;
    strain: string;
    location: string;
    patientLicenseNumber?: string;
    actualDate: string;
  }>): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/plantbatches/v2/createplantings?licenseNumber=${license}`, 'POST', batches);
  }

  async getPlants(licenseNumber?: string): Promise<MetrcPlant[]> {
    const license = licenseNumber || this.config.licenseNumber;
    return this.request<MetrcPlant[]>(`/plants/v2/vegetative?licenseNumber=${license}`);
  }

  async getFloweringPlants(licenseNumber?: string): Promise<MetrcPlant[]> {
    const license = licenseNumber || this.config.licenseNumber;
    return this.request<MetrcPlant[]>(`/plants/v2/flowering?licenseNumber=${license}`);
  }

  async changePlantGrowthPhase(changes: Array<{
    label: string;
    newLocation: string;
    growthDate: string;
  }>): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/plants/v2/changegrowthphases?licenseNumber=${license}`, 'POST', changes);
  }

  async movePlants(moves: Array<{
    label: string;
    location: string;
    moveDate: string;
  }>): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/plants/v2/moveplants?licenseNumber=${license}`, 'POST', moves);
  }

  async harvestPlants(harvests: Array<{
    plant: string;
    weight: number;
    unitOfWeight: string;
    dryingLocation: string;
    harvestName: string;
    actualDate: string;
  }>): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/plants/v2/harvestplants?licenseNumber=${license}`, 'POST', harvests);
  }

  // ============================================================================
  // TRANSFERS & MANIFESTS
  // ============================================================================

  async getTransfers(licenseNumber?: string): Promise<MetrcTransfer[]> {
    const license = licenseNumber || this.config.licenseNumber;
    return this.request<MetrcTransfer[]>(`/transfers/v2/incoming?licenseNumber=${license}`);
  }

  async getOutgoingTransfers(licenseNumber?: string): Promise<MetrcTransfer[]> {
    const license = licenseNumber || this.config.licenseNumber;
    return this.request<MetrcTransfer[]>(`/transfers/v2/outgoing?licenseNumber=${license}`);
  }

  async createTransfer(transfer: {
    shipperFacilityLicenseNumber: string;
    shipmentTypeName: string;
    shipmentTransactionType: string;
    plannedRoute: string;
    estimatedDepartureDateTime: string;
    estimatedArrivalDateTime: string;
    destinations: Array<{
      recipientFacilityLicenseNumber: string;
      transferTypeName: string;
      plannedRoute: string;
      estimatedArrivalDateTime: string;
      transporters: Array<{
        transporterFacilityLicenseNumber: string;
        driverName: string;
        driverLicenseNumber: string;
        driverVehicleLicenseNumber: string;
      }>;
      packages: Array<{
        packageLabel: string;
        grossWeight?: number;
        grossUnitOfWeightName?: string;
      }>;
    }>;
  }): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/transfers/v2/external/incoming?licenseNumber=${license}`, 'POST', [transfer]);
  }

  // ============================================================================
  // LAB TESTS
  // ============================================================================

  async getLabTests(packageLabel: string): Promise<MetrcLabTest[]> {
    const license = this.config.licenseNumber;
    return this.request<MetrcLabTest[]>(
      `/labtests/v2/states?licenseNumber=${license}&packageLabel=${packageLabel}`
    );
  }

  async recordLabTest(test: {
    label: string;
    resultDate: string;
    overallPassed: boolean;
    testTypeName: string;
    testPassed: boolean;
    testComment?: string;
    cannabinoidResults?: Array<{
      cannabinoidName: string;
      percent: number;
      mgPerG: number;
    }>;
  }): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/labtests/v2/record?licenseNumber=${license}`, 'POST', [test]);
  }

  // ============================================================================
  // STRAINS
  // ============================================================================

  async getStrains(licenseNumber?: string): Promise<MetrcStrain[]> {
    const license = licenseNumber || this.config.licenseNumber;
    return this.request<MetrcStrain[]>(`/strains/v2/active?licenseNumber=${license}`);
  }

  async createStrain(strain: {
    name: string;
    testingStatus: 'None' | 'InProgress' | 'Passed';
    thcLevel?: number;
    cbdLevel?: number;
    indicaPercentage?: number;
    sativaPercentage?: number;
  }): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/strains/v2/create?licenseNumber=${license}`, 'POST', [strain]);
  }

  // ============================================================================
  // LOCATIONS / ROOMS
  // ============================================================================

  async getLocations(licenseNumber?: string): Promise<MetrcLocation[]> {
    const license = licenseNumber || this.config.licenseNumber;
    return this.request<MetrcLocation[]>(`/locations/v2/active?licenseNumber=${license}`);
  }

  async createLocation(location: {
    name: string;
    locationType: string;
  }): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/locations/v2/create?licenseNumber=${license}`, 'POST', [location]);
  }

  // ============================================================================
  // RETAIL (NYS Specific - December 17, 2025 Requirement)
  // ============================================================================

  async createRetailItemId(items: Array<{
    packageLabel: string;
    retailItemName: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: number;
  }>): Promise<void> {
    const license = this.config.licenseNumber;
    return this.request(`/packages/v2/create/retail?licenseNumber=${license}`, 'POST', items);
  }

  // ============================================================================
  // TAGS / UIDs
  // ============================================================================

  async getAvailableTags(licenseNumber?: string): Promise<Array<{ tagTypeName: string; available: number }>> {
    const license = licenseNumber || this.config.licenseNumber;
    return this.request(`/plantbatches/v2/types?licenseNumber=${license}`);
  }

  // ============================================================================
  // OFFLINE SYNC HELPERS
  // ============================================================================

  async getLastModified(licenseNumber?: string): Promise<{
    packages: string;
    plants: string;
    transfers: string;
  }> {
    // Get the last modified timestamp for each resource type
    const license = licenseNumber || this.config.licenseNumber;

    const [packages, plants, transfers] = await Promise.all([
      this.getPackages(license).then(p => p[0]?.lastModified || new Date().toISOString()),
      this.getPlants(license).then(p => p[0]?.lastModified || new Date().toISOString()),
      this.getTransfers(license).then(t => t[0]?.lastModified || new Date().toISOString()),
    ]);

    return { packages, plants, transfers };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function formatMetrcDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function parseMetrcDate(dateString: string): Date {
  return new Date(dateString);
}

export function generatePackageLabel(facilityCode: string, sequence: number): string {
  // NYS format: 1A4FF + facility code + sequence number (padded to 13 digits total)
  const prefix = '1A4FF';
  const paddedSequence = sequence.toString().padStart(13, '0');
  return `${prefix}${facilityCode}${paddedSequence}`;
}

export function validateLicenseNumber(license: string): boolean {
  // NYS OCM license formats: AUCC-*, AUCP-*, AUDIS-*, AUCM-*, OCM-MICR-*
  const validPrefixes = ['AUCC', 'AUCP', 'AUDIS', 'AUCM', 'OCM-MICR'];
  return validPrefixes.some(prefix => license.startsWith(prefix));
}
