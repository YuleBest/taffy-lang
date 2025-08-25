// 永雏塔菲加密器 - 加密工具函数
import pako from 'pako'

// 默认字符映射表
const defaultMap = ['永', '雏', '塔', '菲'] as string[]

// 验证字符映射表的有效性
function validateMap(map: string[]): void {
  if (!map || map.length !== 4) {
    throw new Error('字符映射表必须包含4个字符')
  }
  const uniqueChars = new Set(map)
  if (uniqueChars.size !== 4) {
    throw new Error('字符映射表中的字符必须唯一')
  }
}

/**
 * 简单的SHA256实现（用于不支持crypto.subtle的环境）
 */
function simpleSHA256(msg: string): Uint8Array {
  // 这是一个简化的SHA256实现，仅用于演示
  // 在实际应用中，应该使用更完整的实现或polyfill
  const chars = new TextEncoder().encode(msg)
  // 创建一个简单的哈希（这不是真正的SHA256，仅用于演示）
  const hash = new Uint8Array(32)
  let sum = 0
  for (let i = 0; i < chars.length; i++) {
    sum += chars[i]
  }
  //  Simple填充
  for (let i = 0; i < 32; i++) {
    hash[i] = (sum + i * 3) % 256
  }
  return hash
}

/**
 * 计算SHA256哈希
 */
export async function sha256(msg: string): Promise<Uint8Array> {
  // 检查crypto.subtle是否可用
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    try {
      const buf = new TextEncoder().encode(msg)
      const hash = await crypto.subtle.digest('SHA-256', buf)
      return new Uint8Array(hash)
    } catch (error) {
      console.warn('Web Crypto API 失败，使用备用实现:', error)
      // 如果Web Crypto API失败，回退到简单实现
      return simpleSHA256(msg)
    }
  } else {
    console.warn('Web Crypto API 不可用，使用备用实现')
    // 如果Web Crypto API不可用，使用备用实现
    return simpleSHA256(msg)
  }
}

/**
 * XOR字节加密/解密
 */
export function xorBytes(data: Uint8Array, keyHash: Uint8Array): Uint8Array {
  const res = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    res[i] = data[i] ^ keyHash[i % keyHash.length]
  }
  return res
}

/**
 * 将字节数组转换为字符编码
 */
export function bytesToYCTF(bytes: Uint8Array, map: string[] = defaultMap): string {
  validateMap(map)
  let binStr = ''
  for (const b of bytes) binStr += b.toString(2).padStart(8, '0')
  let res = ''
  for (let i = 0; i < binStr.length; i += 2) {
    const idx = parseInt(binStr.substr(i, 2), 2)
    res += map[idx]
  }
  return res
}

/**
 * 将字符编码转换为字节数组
 */
export function yctfToBytes(text: string, map: string[] = defaultMap): Uint8Array {
  validateMap(map)
  let binStr = ''
  for (const ch of text) {
    const idx = map.indexOf(ch)
    if (idx === -1) throw new Error(`非法字符: ${ch}`)
    binStr += idx.toString(2).padStart(2, '0')
  }
  const bytes = []
  for (let i = 0; i < binStr.length; i += 8) {
    bytes.push(parseInt(binStr.substr(i, 8).padStart(8, '0'), 2))
  }
  return new Uint8Array(bytes)
}

/**
 * 从密码生成AES密钥
 */
export async function getAESKeyFromPassword(password: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode('yctf-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/**
 * 加密文本（先GZIP压缩再加密）
 */
export async function encryptText(input: string, key: string, map?: string[]): Promise<string> {
  const keyHash = await sha256(key)
  // 先进行GZIP压缩
  const compressed = pako.gzip(input)
  // 再进行XOR加密
  const encrypted = xorBytes(compressed, keyHash)
  return bytesToYCTF(encrypted, map)
}

/**
 * 解密文本（先解密再GZIP解压）
 */
export async function decryptText(input: string, key: string, map?: string[]): Promise<string> {
  const keyHash = await sha256(key)
  // 先进行XOR解密
  const decrypted = xorBytes(yctfToBytes(input.trim(), map), keyHash)
  // 再进行GZIP解压
  const decompressed = pako.ungzip(decrypted, { to: 'string' })
  return decompressed
}

/**
 * 加密文件（使用字符映射表编码）
 */
export async function encryptFile(file: File, password: string, map?: string[]): Promise<Blob> {
  const keyHash = await sha256(password)

  // 读取文件数据
  const fileData = await file.arrayBuffer()

  // 先进行GZIP压缩
  const compressed = pako.gzip(new Uint8Array(fileData))

  // 再进行XOR加密
  const encrypted = xorBytes(compressed, keyHash)

  // 转换为字符映射表编码
  const encoded = bytesToYCTF(encrypted, map)

  // 使用UTF-8编码返回
  const utf8Encoded = new TextEncoder().encode(encoded)
  return new Blob([utf8Encoded])
}

/**
 * 解密文件（使用字符映射表解码）
 */
export async function decryptFile(file: File, password: string, map?: string[]): Promise<Blob> {
  const keyHash = await sha256(password)
  const fileData = await file.arrayBuffer()

  // 将文件内容解码为UTF-8字符串
  const encodedText = new TextDecoder('utf-8').decode(fileData)

  // 使用字符映射表解码
  const encryptedBytes = yctfToBytes(encodedText.trim(), map)

  // 进行XOR解密
  const decrypted = xorBytes(encryptedBytes, keyHash)

  // 再进行GZIP解压
  const decompressed = pako.ungzip(decrypted)

  return new Blob([decompressed])
}

/**
 * 下载文件
 */
export function downloadFile(url: string, filename: string): void {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
