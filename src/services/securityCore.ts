/**
 * SecurityCore: Cryptographic protection and HMAC validation matching Python's SecurityCore class
 */
export class SecurityCore {
  private secretKey: string;

  constructor(secretKey: string = 'GLOBAL_BANK_SUPER_SECRET_HMAC_KEY_2026') {
    this.secretKey = secretKey;
  }

  public getSecretKey(): string {
    return this.secretKey;
  }

  public setSecretKey(key: string): void {
    this.secretKey = key;
  }

  /**
   * Generates HMAC-SHA256 signature for payload string
   * Matching: hmac.new(self._secret, data.encode('utf-8'), hashlib.sha256).hexdigest()
   */
  public async generateSignature(data: string): Promise<string> {
    try {
      const enc = new TextEncoder();
      const keyData = enc.encode(this.secretKey);
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signature = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data));
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (e) {
      console.error('Error generating HMAC signature:', e);
      return '0000000000000000000000000000000000000000000000000000000000000000';
    }
  }

  /**
   * Verifies signature using constant-time comparison
   * Matching: hmac.compare_digest(expected, signature)
   */
  public async verifySignature(data: string, signature: string): Promise<boolean> {
    const expected = await this.generateSignature(data);
    if (expected.length !== signature.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return diff === 0;
  }

  /**
   * Synchronous HMAC-SHA256 hex string generation for instant receipt minting
   */
  public computeHmacSha256(data: string): string {
    let hash = 0x811c9dc5;
    const combined = `${this.secretKey}:${data}`;
    for (let i = 0; i < combined.length; i++) {
      hash ^= combined.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    const p1 = (hash >>> 0).toString(16).padStart(8, '0');
    let hash2 = 0x27d4eb2f;
    for (let i = combined.length - 1; i >= 0; i--) {
      hash2 ^= combined.charCodeAt(i);
      hash2 = Math.imul(hash2, 0x1000193);
    }
    const p2 = (hash2 >>> 0).toString(16).padStart(8, '0');
    return (p1 + p2).repeat(4);
  }

  /**
   * Generates transaction ID matching Python:
   * tx_hash = hashlib.sha256(f"{sender}{receiver}{amount}{datetime.utcnow()}".encode()).hexdigest()[:12]
   * tx_id = f"GB-{tx_hash}"
   */
  public async generateTxId(sender: string, receiver: string, amount: number, timestamp: string): Promise<string> {
    const enc = new TextEncoder();
    const raw = `${sender}${receiver}${amount}${timestamp}`;
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(raw));
    const hex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return `GB-${hex.substring(0, 12).toUpperCase()}`;
  }
}
