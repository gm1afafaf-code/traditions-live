// NY Cannabis OCM License Database - LIVE API
// Fetches from NYS Open Data: https://data.ny.gov/resource/jskf-tt3q.json

let cachedLicenses = [];
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch all licenses from NYS OCM API
async function fetchLicenses() {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (cachedLicenses.length > 0 && (now - lastFetch) < CACHE_DURATION) {
        return cachedLicenses;
    }
    
    try {
        // Fetch up to 10,000 licenses
        const response = await fetch('https://data.ny.gov/resource/jskf-tt3q.json?$limit=10000');
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        // Transform to our format
        cachedLicenses = data.map(l => ({
            licenseNumber: l.license_number || l.application_number || 'Pending',
            companyName: l.entity_name || 'Unknown',
            dba: l.dba || '',
            licenseHolder: l.primary_contact_name || l.entity_name || 'Unknown',
            address: l.address_line_1 || '',
            city: l.city || '',
            state: l.state || 'NY',
            zip: l.zip_code || '',
            county: l.county || '',
            region: l.region || '',
            licenseType: l.license_type || 'Unknown',
            licenseTypeCode: l.license_type_code || '',
            licenseStatus: l.license_status || 'Unknown',
            issuedDate: l.issued_date ? l.issued_date.split('T')[0] : '',
            effectiveDate: l.effective_date ? l.effective_date.split('T')[0] : '',
            expiryDate: l.expiration_date ? l.expiration_date.split('T')[0] : '',
            operationalStatus: l.operational_status || '',
            businessPurpose: l.business_purpose || '',
            seeCategory: l.see_category || ''
        }));
        
        lastFetch = now;
        console.log(`✅ Loaded ${cachedLicenses.length} NYS OCM licenses from live API`);
        
        return cachedLicenses;
    } catch (error) {
        console.error('Error fetching licenses:', error);
        return cachedLicenses;
    }
}

// Export the licenses array
export let nyLicenses = [];

// Initialize - fetch licenses on module load
fetchLicenses().then(licenses => {
    nyLicenses = licenses;
    window.dispatchEvent(new CustomEvent('licenses-loaded', { detail: { count: licenses.length }}));
});

// Search licenses by number, company name, DBA, or city
export function searchLicenses(query) {
    const lowerQuery = query.toLowerCase().trim();
    
    if (nyLicenses.length === 0) {
        return [];
    }
    
    return nyLicenses.filter(license => {
        const num = (license.licenseNumber || '').toLowerCase();
        const company = (license.companyName || '').toLowerCase();
        const dba = (license.dba || '').toLowerCase();
        const holder = (license.licenseHolder || '').toLowerCase();
        const city = (license.city || '').toLowerCase();
        
        return num.includes(lowerQuery) ||
               company.includes(lowerQuery) ||
               dba.includes(lowerQuery) ||
               holder.includes(lowerQuery) ||
               city.includes(lowerQuery);
    }).slice(0, 50);
}

// Get license by number
export function getLicenseByNumber(licenseNumber) {
    const lowerNum = licenseNumber.toLowerCase().trim();
    return nyLicenses.find(l => 
        (l.licenseNumber || '').toLowerCase() === lowerNum
    );
}

// Force refresh from API
export async function refreshLicenses() {
    lastFetch = 0;
    const licenses = await fetchLicenses();
    nyLicenses = licenses;
    return licenses;
}

// Export for window access
window.searchLicenses = searchLicenses;
window.getLicenseByNumber = getLicenseByNumber;
window.refreshLicenses = refreshLicenses;
