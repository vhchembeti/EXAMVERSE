// client/src/services/cryptoE2EE.ts
// True Client-Side End-to-End Encryption (E2EE) Vault using WebCrypto API
// Implements Zero-Knowledge PBKDF2-HMAC-SHA256 (600,000 iterations per OWASP/WebCrypto) + AES-256-GCM authenticated encryption.
// The server and database NEVER see or store the student's passphrase or plaintext notes.

export interface EncryptedNoteRecord {
  id: string;
  ciphertext: string; // Base64 AES-256-GCM ciphertext + auth tag
  iv: string;         // Base64 12-byte IV
  salt: string;       // Base64 16-byte PBKDF2 salt
  iterations: number;
  createdAt: string;
  updatedAt: string;
}

export interface DecryptedNote {
  id: string;
  title: string;
  content: string;
  examId?: string;
  topic?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Convert Uint8Array to Base64
export function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 to Uint8Array
export function base64ToUint8(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives a 256-bit AES-GCM CryptoKey from student's master passphrase and salt.
 * Uses 600,000 iterations of PBKDF2 with SHA-256 (Hardened against GPU/ASIC attacks).
 */
export async function deriveKeyFromPassphrase(
  passphrase: string,
  saltBytes: Uint8Array,
  iterations: number = 600000
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes as unknown as BufferSource,
      iterations,
      hash: 'SHA-256'
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generates a cryptographically secure 16-byte random salt for new notebooks.
 */
export function generateRandomSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Encrypts a note payload on the client side using AES-256-GCM.
 * Generates a fresh 12-byte random IV for every note.
 */
export async function encryptNotePayload(
  noteData: { title: string; content: string; examId?: string; topic?: string; tags?: string[] },
  cryptoKey: CryptoKey,
  saltBase64: string,
  existingId?: string
): Promise<EncryptedNoteRecord> {
  const enc = new TextEncoder();
  const ivBytes = window.crypto.getRandomValues(new Uint8Array(12));
  const plaintextBytes = enc.encode(JSON.stringify(noteData));

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes
    },
    cryptoKey,
    plaintextBytes
  );

  const ciphertextBase64 = uint8ToBase64(new Uint8Array(encryptedBuffer));
  const ivBase64 = uint8ToBase64(ivBytes);

  const now = new Date().toISOString();

  return {
    id: existingId || `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ciphertext: ciphertextBase64,
    iv: ivBase64,
    salt: saltBase64,
    iterations: 100000,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Decrypts an encrypted note record on the client side.
 */
export async function decryptNotePayload(
  record: EncryptedNoteRecord,
  cryptoKey: CryptoKey
): Promise<DecryptedNote> {
  const dec = new TextDecoder();
  const ciphertextBytes = base64ToUint8(record.ciphertext);
  const ivBytes = base64ToUint8(record.iv);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes as unknown as BufferSource
    },
    cryptoKey,
    ciphertextBytes as unknown as BufferSource
  );

  const rawJson = dec.decode(decryptedBuffer);
  const parsed = JSON.parse(rawJson);

  return {
    id: record.id,
    title: parsed.title || 'Untitled Note',
    content: parsed.content || '',
    examId: parsed.examId || '',
    topic: parsed.topic || '',
    tags: parsed.tags || [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}
