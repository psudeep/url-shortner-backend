import crypto from 'crypto';

const SHORT_URL_LENGTH = parseInt(process.env.SHORT_URL_LENGTH || '6', 10);

export function generateShortCode(): string {
  const buffer = crypto.randomBytes(8);
  return buffer.toString('base64')
    .replace(/[+/]/g, '')  // Remove '+' and '/'
    .substring(0, SHORT_URL_LENGTH);  // Truncate to desired length
}

export function isValidShortCode(code: string): boolean {
  const validCharacters = /^[A-Za-z0-9_-]+$/;
  return code.length === SHORT_URL_LENGTH && validCharacters.test(code);
}