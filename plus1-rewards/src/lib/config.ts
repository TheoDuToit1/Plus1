/**
 * Central app configuration
 * Uses the VITE_APP_URL env var — set to https://www.plus1rewards.com in production
 */
export const APP_URL: string = (import.meta as any).env?.VITE_APP_URL || 'https://www.plus1rewards.com';

/**
 * Encodes a shop ID into a QR-ready URL.
 * When scanned by a regular phone camera, opens the PWA at the scan-shop page.
 * When scanned by the in-app scanner, jsQR decodes it and we extract the shopId.
 */
export function encodeShopQR(shopId: string): string {
  if (!shopId) return '';
  // Ensure the URL is properly formatted
  const baseUrl = APP_URL.endsWith('/') ? APP_URL.slice(0, -1) : APP_URL;
  return `${baseUrl}/member/scan-shop?shop=${encodeURIComponent(shopId)}`;
}

/**
 * Encodes a member identifier into a QR-ready string.
 * Format: plus1rewards.com/member?id={qrCode} — readable by shop scanner.
 */
export function encodeMemberQR(qrCode: string, phone: string): string {
  if (!qrCode && !phone) return '';
  // Ensure the URL is properly formatted
  const baseUrl = APP_URL.endsWith('/') ? APP_URL.slice(0, -1) : APP_URL;
  const identifier = qrCode || phone;
  return `${baseUrl}/member?id=${encodeURIComponent(identifier)}`;
}

/**
 * Parses a QR scan result and extracts the shop ID.
 * Handles: full URL, "SHOP:{id}" legacy format, and raw UUIDs.
 */
export function parseShopQR(data: string): string | null {
  // Full URL format: https://www.plus1rewards.com/member/scan-shop?shop=UUID
  try {
    const url = new URL(data);
    const shopId = url.searchParams.get('shop');
    if (shopId) return shopId;
  } catch { /* not a URL */ }

  // Legacy format: SHOP:{id}
  if (data.startsWith('SHOP:')) return data.replace('SHOP:', '');

  // Raw UUID fallback
  if (data.match(/^[0-9a-f-]{36}$/i)) return data;

  return null;
}

/**
 * Parses a QR scan result and extracts the member identifier.
 * Handles: full URL, "PLUS1-{phone}-{ts}" legacy, and raw strings.
 */
export function parseMemberQR(data: string): string | null {
  // Full URL format: plus1rewards.com/member?id=...
  try {
    const url = new URL(data);
    const id = url.searchParams.get('id');
    if (id) return decodeURIComponent(id);
  } catch { /* not a URL */ }

  // Legacy PLUS1-{phone}-{ts}
  const match = data.match(/PLUS1-([0-9]+)-/);
  if (match) return match[1];

  // Return raw string (could be a qr_code field value)
  return data || null;
}

/**
 * Validates if a QR code value is safe to generate
 * Checks for common issues that might cause QR generation to fail
 */
export function validateQRValue(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  if (value.length > 2000) return false; // QR codes have practical limits
  // Check for problematic characters that might cause issues
  try {
    // Test if it can be encoded as URI component
    encodeURIComponent(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a safe fallback QR value if the primary one fails
 */
export function createFallbackQR(primaryValue: string, fallbackValue: string): string {
  if (validateQRValue(primaryValue)) return primaryValue;
  if (validateQRValue(fallbackValue)) return fallbackValue;
  return 'ERROR_GENERATING_QR';
}
