import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function for License Verification
 *
 * This keeps the xAI API key secure on the server side.
 * The client calls this endpoint instead of x.ai directly.
 */

interface GrokResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface LicenseResult {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    console.error('XAI_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'user',
            content: `You are a NYS Office of Cannabis Management license lookup assistant. Search for any NYS cannabis license matching: "${query}"

This could be a license number, company name, or license holder name. NYS OCM licenses typically start with prefixes like:
- AUCC (Adult-Use Cultivator)
- AUCP (Adult-Use Processor)
- AUDIS (Adult-Use Distributor)
- AUCM (Adult-Use Conditional Microbusiness)
- OCM- (general)

If you find a matching license, respond with JSON ONLY:
{"found": true, "licenseNumber": "...", "companyName": "...", "licenseHolder": "...", "licenseType": "...", "city": "...", "state": "NY", "address": "..."}

If no match found:
{"found": false, "suggestion": "brief reason or suggestion"}

IMPORTANT: Only return valid JSON, nothing else.`,
          },
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('xAI API error:', errorText);
      throw new Error(`xAI API error: ${response.status}`);
    }

    const data: GrokResponse = await response.json();
    const content = data.choices[0].message.content;

    // Parse Grok's JSON response
    try {
      const result: LicenseResult = JSON.parse(content);
      return res.status(200).json(result);
    } catch (parseError) {
      console.error('Failed to parse Grok response:', content);
      return res.status(200).json({
        found: false,
        suggestion: 'Unable to parse license data',
      });
    }
  } catch (error) {
    console.error('License verification error:', error);
    return res.status(500).json({
      error: 'License verification service temporarily unavailable',
    });
  }
}
