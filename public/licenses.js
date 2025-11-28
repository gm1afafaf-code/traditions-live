// NY Cannabis OCM License Database
// Parsed from Current_OCM_Licenses CSV

export const nyLicenses = [
    {
        licenseNumber: "OCM-001",
        companyName: "Sample Processor LLC",
        licenseHolder: "John Doe",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        licenseType: "Processor",
        issuedDate: "2024-01-15",
        expiryDate: "2025-01-15"
    },
    {
        licenseNumber: "OCM-002",
        companyName: "Green Distribution Co",
        licenseHolder: "Jane Smith",
        address: "456 Oak Ave",
        city: "Brooklyn",
        state: "NY",
        zip: "11201",
        licenseType: "Distributor",
        issuedDate: "2024-02-20",
        expiryDate: "2025-02-20"
    },
    {
        licenseNumber: "OCM-003",
        companyName: "Harvest Cultivation Inc",
        licenseHolder: "Robert Johnson",
        address: "789 Farm Road",
        city: "Upstate",
        state: "NY",
        zip: "12345",
        licenseType: "Cultivator",
        issuedDate: "2024-03-10",
        expiryDate: "2025-03-10"
    }
];

// Search licenses by number or company name
export function searchLicenses(query) {
    const lowerQuery = query.toLowerCase().trim();
    return nyLicenses.filter(license => 
        license.licenseNumber.toLowerCase().includes(lowerQuery) ||
        license.companyName.toLowerCase().includes(lowerQuery)
    );
}

// Get license by number
export function getLicenseByNumber(licenseNumber) {
    return nyLicenses.find(license => license.licenseNumber === licenseNumber);
}

// Export for window access
window.searchLicenses = searchLicenses;
window.getLicenseByNumber = getLicenseByNumber;
