/**
 * xAI/Grok API Service for NYS OCM License Verification
 *
 * This service uses Grok AI to verify cannabis licenses against
 * the NYS Office of Cannabis Management database.
 */

export interface GrokLicenseResult {
  found: boolean;
  licenseNumber?: string;
  companyName?: string;
  licenseHolder?: string;
  licenseType?: string;
  city?: string;
  state?: string;
  address?: string;
  suggestion?: string;
}

/**
 * Verify a cannabis license using Grok AI
 * Calls our serverless function to keep API key secure
 */
export async function verifyLicenseWithGrok(query: string): Promise<GrokLicenseResult> {
  try {
    const response = await fetch('/api/verify-license', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`License verification failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Grok license verification error:', error);
    throw new Error('License verification service temporarily unavailable');
  }
}

/**
 * Convert Grok result to License format
 */
export function grokResultToLicense(result: GrokLicenseResult) {
  if (!result.found) return null;

  return {
    licenseNumber: result.licenseNumber || '',
    companyName: result.companyName || '',
    licenseHolder: result.licenseHolder || '',
    licenseType: result.licenseType || '',
    city: result.city || '',
    state: result.state || 'NY',
    address: result.address || 'Verified by Grok AI',
    verifiedByGrok: true,
  };
}
