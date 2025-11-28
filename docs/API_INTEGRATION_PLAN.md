# TRADITIONS Platform - NYS OCM & METRC Integration Planning

## Executive Summary

TRADITIONS needs to integrate with NYS Office of Cannabis Management (OCM) systems and METRC (Marijuana Enforcement Tracking Reporting Compliance) to operate as a compliant B2B cannabis wholesale platform in New York State.

**KEY DEADLINE: December 17, 2025** - All NYS licensed cannabis businesses must have inventory integrated with METRC.

---

## 1. NYS OCM (Office of Cannabis Management) Requirements

### Contact Information
- **Compliance Questions**: compliance@ocm.ny.gov
- **STS (Seed-to-Sale) Questions**: STS@ocm.ny.gov
- **Labs Questions**: labs@ocm.ny.gov
- **Website**: https://cannabis.ny.gov/

### License Types We Need to Support
NYS OCM issues licenses with these prefixes:
- **AUCC** - Adult-Use Cultivator
- **AUCP** - Adult-Use Processor
- **AUDIS** - Adult-Use Distributor
- **AUCM** - Adult-Use Conditional Microbusiness
- **OCM-MICR** - Microbusiness
- **OCM-PROC** - Processor
- **OCM-CULT** - Cultivator
- **OCM-DIST** - Distributor
- **OCM-DISP** - Dispensary

### Multi-Location License Suffixes in METRC
Single OCM license numbers may have multiple METRC entries:
- **-C** or **-C1, -C2** - Cultivation locations
- **-P** or **-P1, -P2** - Processing locations
- **-D** or **-D1** - Retail Dispensary
- **-DX** or **-DX1** - Distribution

Example: OCM-MICR-00-000000-C1 (Cultivation at Location 1)

### Required Compliance Data
Per 9 NYCRR § 125.8(a), licensees must maintain:
1. Real-time electronic inventory tracking
2. Product testing data (all products must be lab tested before sale)
3. Transfer manifests for all product movements
4. Complete chain of custody records
5. Retail ID QR codes on final product packaging

---

## 2. METRC API Integration

### API Access
- **NY METRC API Base URL**: https://api-ny.metrc.com
- **Documentation**: https://api-ny.metrc.com/Documentation
- **Support**: https://support.metrc.com or 877-566-6506

### Authentication
METRC uses two types of API keys:
1. **Integrator API Key** - For third-party software vendors (TRADITIONS would need this)
2. **User API Key** - For individual licensees

Authentication method: HTTP Basic Auth with `vendorApiKey:userApiKey` format

### Key API Endpoints (v2)

#### Packages (Most Critical for Wholesale)
```
GET  /packages/v2/{id}                    - Get package details
GET  /packages/v2/active                  - List active packages
GET  /packages/v2/onhold                  - List packages on hold
GET  /packages/v2/inactive                - List inactive packages
POST /packages/v2/create                  - Create new package
POST /packages/v2/change/item             - Change package item
POST /packages/v2/adjust                  - Adjust package quantity
POST /packages/v2/finish                  - Finish a package
POST /packages/v2/unfinish                - Unfinish a package
```

#### Transfers (Critical for B2B Wholesale)
```
GET  /transfers/v2/incoming               - Incoming transfers
GET  /transfers/v2/outgoing               - Outgoing transfers
GET  /transfers/v2/rejected               - Rejected transfers
GET  /transfers/v2/{id}/deliveries        - Get transfer deliveries
POST /transfers/v2/external/incoming      - Create incoming transfer
POST /transfers/v2/external/outgoing      - Create outgoing transfer
POST /transfers/v2/templates              - Create transfer template
```

#### Plants (For Cultivators)
```
GET  /plants/v2/{id}                      - Get plant details
GET  /plants/v2/vegetative                - List vegetative plants
GET  /plants/v2/flowering                 - List flowering plants
GET  /plants/v2/onhold                    - List plants on hold
POST /plants/v2/create/plantings          - Create new plantings
POST /plants/v2/moveplants                - Move plants
POST /plants/v2/changegrowthphase         - Change growth phase
POST /plants/v2/harvest                   - Harvest plants
```

#### Harvests (For Processors)
```
GET  /harvests/v2/{id}                    - Get harvest details
GET  /harvests/v2/active                  - List active harvests
GET  /harvests/v2/onhold                  - List harvests on hold
POST /harvests/v2/create/packages         - Create packages from harvest
POST /harvests/v2/finish                  - Finish harvest
```

#### Lab Tests
```
GET  /labtests/v2/states                  - Get test states
GET  /labtests/v2/types                   - Get test types
GET  /labtests/v2/results                 - Get test results
POST /labtests/v2/record                  - Record lab test results
```

#### Sales (For Dispensaries)
```
GET  /sales/v2/receipts                   - Get sales receipts
GET  /sales/v2/transactions               - Get transactions
POST /sales/v2/receipts                   - Create sales receipt
POST /sales/v2/receipts/finalize          - Finalize receipt
POST /sales/v2/receipts/void              - Void receipt
```

#### Items (Product Types)
```
GET  /items/v2                            - List all items
GET  /items/v2/{id}                       - Get item details
GET  /items/v2/categories                 - Get item categories
POST /items/v2/create                     - Create new item
POST /items/v2/update                     - Update item
```

#### Employees
```
GET  /employees/v2                        - List employees
POST /employees/v2/create                 - Create employee
POST /employees/v2/update                 - Update employee
```

### UID (Unique Identifier) System
METRC uses RFID tags and QR codes for tracking:
- **Plant UIDs**: Physical RFID tag for each plant (assigned at vegetative stage, 6"+)
- **Package UIDs**: Physical tag for each package/lot
- **Retail Item UIDs**: Digital QR codes for final consumer products

Costs:
- $0.10 per UID
- Complimentary allocations per license type:
  - Cultivators: 2,500 Plant UIDs
  - Processors: 2,500 Item UIDs
  - Microbusinesses: 750 Item UIDs
  - Distributors: 750 Package UIDs

---

## 3. Data TRADITIONS Must Track & Report

### For Every Product Listing
1. **METRC Package UID** (required)
2. **Lab Test Results** (COA - Certificate of Analysis)
   - THC percentage
   - CBD percentage
   - Terpene profile
   - Pesticide testing
   - Heavy metal testing
   - Microbial testing
3. **Source Information**
   - Cultivator license number
   - Processor license number (if applicable)
   - Harvest batch ID
4. **Product Information**
   - Item category (Flower, Concentrate, Edible, etc.)
   - Strain name
   - Net weight
   - Unit count

### For Every Transfer/Sale
1. **Transfer Manifest** (legally required)
   - Origin license number
   - Destination license number
   - Package UIDs being transferred
   - Quantities
   - Date/time
   - Driver info
   - Vehicle info
   - Route
2. **Chain of Custody**
   - Timestamps of each transfer
   - Receiving acknowledgment
3. **Financial Records**
   - Invoice/receipt
   - Payment terms
   - Excise tax calculations

### Inventory Reconciliation
- Real-time inventory counts must match METRC
- Daily reconciliation recommended
- Discrepancies must be reported within 24 hours

---

## 4. Implementation Recommendations for TRADITIONS

### Phase 1: License Verification (Current)
- [x] License lookup by number/company name
- [x] Grok AI fallback for OCM database search
- [ ] Store verified license data with METRC format suffixes
- [ ] Link licenses to user accounts

### Phase 2: METRC API Integration (Before Dec 17, 2025)
1. **Register as Third-Party Integrator**
   - Contact METRC at credentialing@metrc.com
   - Complete TPI onboarding
   - Obtain Integrator API Key

2. **Implement Core API Calls**
   - Package lookup/verification
   - Transfer creation/management
   - Inventory synchronization

3. **Add Manifest Generation**
   - Auto-generate transfer manifests
   - Include all required data fields
   - QR code generation for retail items

### Phase 3: Full Compliance Features
1. **Lab Test Integration**
   - Parse COA documents
   - Display cannabinoid profiles
   - Verify testing status before listing

2. **Reporting Dashboard**
   - Real-time inventory vs METRC reconciliation
   - Transfer history
   - Compliance alerts

3. **Tax Calculation**
   - Excise tax computation
   - Invoice generation with tax breakdown

---

## 5. API Response Examples

### Package Object
```json
{
  "Id": 123456,
  "Label": "1A4FF03000000220000010",
  "PackageType": "Product",
  "SourceHarvestNames": "2024-01-Harvest",
  "SourcePackageLabels": null,
  "RoomName": "Vault Room 1",
  "Quantity": 100.0,
  "UnitOfMeasureName": "Grams",
  "PatientLicenseNumber": null,
  "ProductName": "OG Kush - Flower",
  "ProductCategoryName": "Buds",
  "ItemStrainName": "OG Kush",
  "ItemUnitCbdPercent": 0.5,
  "ItemUnitThcPercent": 24.3,
  "LabTestingState": "TestPassed",
  "ProductionBatchNumber": "PB-2024-001",
  "IsTradeSample": false,
  "SourceProductionBatchNumbers": null,
  "PackagedDate": "2024-01-15",
  "InitialLabTestingState": "NotSubmitted",
  "LabTestingStateDate": "2024-01-20",
  "LabTestingRecordedDate": "2024-01-20"
}
```

### Transfer Object
```json
{
  "Id": 789,
  "ManifestNumber": "0000000001",
  "ShipmentLicenseType": 0,
  "ShipperFacilityLicenseNumber": "OCM-DIST-00-000001-DX1",
  "ShipperFacilityName": "Distribution Co",
  "Name": "Wholesale Transfer",
  "TransporterFacilityLicenseNumber": "OCM-DIST-00-000001",
  "DriverName": "John Driver",
  "DriverOccupationalLicenseNumber": "D123456",
  "DriverVehicleLicenseNumber": "ABC-1234",
  "VehicleMake": "Ford",
  "VehicleModel": "Transit",
  "VehicleLicensePlateNumber": "NY-12345",
  "DeliveryCount": 1,
  "ReceivedDeliveryCount": 0,
  "PackageCount": 10,
  "ReceivedPackageCount": 0,
  "ContainsPlantPackage": false,
  "ContainsProductPackage": true,
  "ContainsTradeSample": false,
  "ContainsDonation": false,
  "ContainsTestingSample": false,
  "EstimatedDepartureDateTime": "2024-01-20T08:00:00",
  "ActualDepartureDateTime": null,
  "EstimatedArrivalDateTime": "2024-01-20T12:00:00",
  "ActualArrivalDateTime": null,
  "CreatedDateTime": "2024-01-19T15:30:00",
  "CreatedByUserName": "admin@distributor.com",
  "LastModified": "2024-01-19T15:30:00"
}
```

---

## 6. Resources & Links

### Official Documentation
- NYS OCM Seed-to-Sale: https://cannabis.ny.gov/seed-to-sale
- NYS OCM Compliance: https://cannabis.ny.gov/compliance
- METRC NY Partner Page: https://www.metrc.com/partner/new-york/
- METRC API Documentation: https://api-ny.metrc.com/Documentation
- METRC Learn (Training): https://learn.metrc.com/learn
- METRC Support Portal: https://support.metrc.com

### Key Regulations
- 9 NYCRR § 125.8 - Inventory Tracking Requirements
- 9 NYCRR § 128.5 - Packaging & Labeling Requirements
- 9 NYCRR § 133.3 - Inspection Authorization

### Contact for Integration Support
- METRC Credentialing: credentialing@metrc.com
- METRC Support: 877-566-6506
- OCM STS Team: STS@ocm.ny.gov

---

## 7. Next Steps

1. [ ] Apply for METRC Third-Party Integrator status
2. [ ] Set up METRC Sandbox environment for development
3. [ ] Implement package lookup API
4. [ ] Implement transfer manifest generation
5. [ ] Add lab test result display
6. [ ] Build inventory reconciliation tool
7. [ ] Complete integration testing before Dec 17, 2025 deadline

---

*Document Created: November 26, 2025*
*Last Updated: November 26, 2025*
*For TRADITIONS Platform Development Team*
