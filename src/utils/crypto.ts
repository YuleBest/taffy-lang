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
 * 计算SHA256哈希
 */
export async function sha256(msg: string): Promise<Uint8Array> {
  const buf = new TextEncoder().encode(msg)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return new Uint8Array(hash)
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
