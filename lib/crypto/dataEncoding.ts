import { createHmac } from 'crypto';


export const encodeIdWithSecret = (id: number, secretKey: string): number => {
  // Convert the id to a string
  const idString = id.toString();

  // Create an HMAC object
  const hmac = createHmac('sha256', secretKey);

  // Update the HMAC with the id
  hmac.update(idString);

  // Get the HMAC digest in Base64 format
  const hash = hmac.digest('base64');

  // Combine the original id and the hash, separated by a dot
  const encodedString = `${idString}.${hash}`;

  // Convert the encoded string to a number using a custom method
  return stringToNumber(encodedString);
}

// Helper function to convert string to number
function stringToNumber(str: string): number {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = ((result << 5) - result) + str.charCodeAt(i);
    result = result & result; // Convert to 32-bit integer
  }
  return result;
}

// Decoding function (for when you need to decode the id)
export const decodeIdWithSecret = (encoded: number, secretKey: string): number | null => {
  // Convert the encoded number back to string
  const encodedString = numberToString(encoded);
  
  const [idString, hash] = encodedString.split('.');

  // Recreate the HMAC
  const hmac = createHmac('sha256', secretKey);
  hmac.update(idString);
  const expectedHash = hmac.digest('base64');

  // Check if the provided hash matches the expected hash
  if (hash === expectedHash) {
    return parseInt(idString, 10);
  } else {
    // If the hashes don't match, the encoded string has been tampered with
    return null;
  }
}

// Helper function to convert number back to string
function numberToString(num: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-';
  let result = '';
  let n = Math.abs(num);
  
  while (n > 0) {
    result = characters[n % characters.length] + result;
    n = Math.floor(n / characters.length);
  }
  
  return result || '0';
}