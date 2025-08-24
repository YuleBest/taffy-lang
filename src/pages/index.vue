<template>
  <div class="app-container">
    <div class="container">
      <header class="header">
        <h1>永雏塔菲加密器</h1>
        <p class="subtitle">V1.0.0</p>
        <div class="header-buttons">
          <button @click="showCharMap = !showCharMap" class="config-btn">
            <span class="icon">⚙️</span>
            {{ showCharMap ? '隐藏' : '显示' }}字符映射
          </button>
          <button @click="$router.push('/help')" class="help-btn">
            <span class="icon">📖</span>
            使用说明
          </button>
        </div>
      </header>

      <!-- 字符映射表配置 -->
      <div v-if="showCharMap" class="char-map-config">
        <h3>自定义字符映射表</h3>
        <p class="config-description">设置4个不同的字符作为加密映射，默认使用「永、雏、塔、菲」</p>
        <div class="char-inputs">
          <div class="char-input">
            <label>字符1:</label>
            <input v-model="customChar1" maxlength="1" placeholder="永" />
          </div>
          <div class="char-input">
            <label>字符2:</label>
            <input v-model="customChar2" maxlength="1" placeholder="雏" />
          </div>
          <div class="char-input">
            <label>字符3:</label>
            <input v-model="customChar3" maxlength="1" placeholder="塔" />
          </div>
          <div class="char-input">
            <label>字符4:</label>
            <input v-model="customChar4" maxlength="1" placeholder="菲" />
          </div>
        </div>
        <div class="char-preview"><strong>当前映射：</strong>{{ currentCharMap.join('、') }}</div>
      </div>

      <div class="cards-grid">
        <div class="card">
          <h2 class="card-title">文本加密</h2>
          <div class="form-group">
            <textarea
              v-model="inputText"
              placeholder="请输入要加密或解密的文本"
              class="modern-input"
            ></textarea>
            <div class="char-count">输入字数：{{ inputText.length }}</div>
          </div>
          <div class="form-group">
            <input v-model="key" placeholder="请输入私钥" class="modern-input" />
          </div>
          <div class="btn-group">
            <button @click="encryptText" class="btn btn-primary">加密</button>
            <button @click="decryptText" class="btn btn-secondary">解密</button>
            <button
              @click="swapText"
              class="btn btn-secondary"
              :disabled="!inputText && !outputText"
            >
              互换
            </button>
          </div>
          <div class="form-group">
            <textarea
              v-model="outputText"
              placeholder="加密/解密结果"
              class="modern-input result"
              readonly
            ></textarea>
            <div class="char-count">输出字数：{{ outputText.length }}</div>
          </div>

          <!-- 进度条 -->
          <div v-if="isProcessing" class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="progress-text">{{ progressText }} {{ progress }}%</div>
          </div>

          <!-- 文本操作按钮 -->
          <div v-if="showTextActions && !isProcessing" class="action-buttons">
            <button @click="copyText" class="btn btn-secondary">复制到剪贴板</button>
            <button @click="downloadText" class="btn btn-primary">下载文件</button>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">文件加密</h2>
          <div class="file-upload">
            <input type="file" @change="handleFile" id="file-input" class="file-input" />
            <label for="file-input" class="file-label">
              <span class="file-icon">📁</span>
              <span class="file-text">{{ selectedFile ? selectedFile.name : '选择文件' }}</span>
              <span class="file-size">{{
                selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : '最大50MB'
              }}</span>
            </label>
          </div>
          <div class="form-group">
            <input v-model="fileKey" placeholder="请输入文件加密私钥" class="modern-input" />
          </div>
          <div class="btn-group">
            <button
              @click="encryptFile"
              :disabled="!selectedFile || isProcessing"
              class="btn btn-primary"
            >
              加密文件
            </button>
            <button
              @click="decryptFile"
              :disabled="!selectedFile || isProcessing"
              class="btn btn-secondary"
            >
              解密文件
            </button>
          </div>

          <!-- 进度条 -->
          <div v-if="isProcessing" class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="progress-text">{{ progressText }} {{ progress }}%</div>
          </div>

          <!-- 文件操作按钮 -->
          <div v-if="showFileActions && !isProcessing" class="action-buttons">
            <button @click="downloadFileResult" class="btn btn-primary">
              <span class="icon">📥</span>
              下载文件
            </button>
          </div>

          <div v-if="fileMessage" class="message" :class="{ error: fileMessage.includes('失败') }">
            {{ fileMessage }}
          </div>
        </div>
      </div>
    </div>
    <!-- 免责声明 -->
  </div>
  <div class="disclaimer">
    <p><strong>免责声明：</strong></p>
    <p>
      本工具仅供学习和技术交流使用，不得用于任何非法用途。用户需自行承担使用本工具的一切风险和责任。
      加密强度取决于私钥复杂度，请妥善保管您的私钥。对于因私钥泄露或不当使用造成的任何损失，本工具概不负责。
    </p>
    <p>
      建议在处理重要数据前进行充分测试，确保加密/解密功能正常。对于因软件故障或操作失误导致的数据丢失，本工具不承担任何责任。
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  encryptText as encryptTextUtil,
  decryptText as decryptTextUtil,
  encryptFile as encryptFileUtil,
  decryptFile as decryptFileUtil,
  downloadFile,
} from '../utils/crypto'

const inputText = ref('')
const key = ref('taffy')
const outputText = ref('')
const fileKey = ref('taffy')
const selectedFile = ref(null)
const fileMessage = ref('')

// 字符映射表配置
const charMap = ref(['永', '雏', '塔', '菲'])
const customChar1 = ref('永')
const customChar2 = ref('雏')
const customChar3 = ref('塔')
const customChar4 = ref('菲')
const showCharMap = ref(false)

const currentCharMap = computed(() => [
  customChar1.value,
  customChar2.value,
  customChar3.value,
  customChar4.value,
])

// 验证字符映射表
function validateCharMap() {
  const chars = currentCharMap.value
  if (chars.some((char) => !char || char.trim() === '')) {
    throw new Error('字符映射表不能为空')
  }
  const uniqueChars = new Set(chars)
  if (uniqueChars.size !== 4) {
    throw new Error('字符映射表中的字符必须唯一')
  }
}

// 进度和状态管理
const isProcessing = ref(false)
const progress = ref(0)
const progressText = ref('')
const showTextActions = ref(false)
const textBlobUrl = ref('')
const textFileName = ref('')
const showFileActions = ref(false)
const fileBlobUrl = ref('')
const fileDownloadName = ref('')

// 交换输入和输出文本
function swapText() {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
}

async function encryptText() {
  try {
    validateCharMap()
    isProcessing.value = true
    progress.value = 0
    progressText.value = '正在加密...'

    // 模拟进度条
    const progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += 10
      }
    }, 100)

    const result = await encryptTextUtil(inputText.value, key.value, currentCharMap.value)
    clearInterval(progressInterval)

    progress.value = 100
    progressText.value = '加密完成！'
    outputText.value = result

    // 创建下载链接
    const blob = new Blob([result], { type: 'text/plain' })
    textBlobUrl.value = URL.createObjectURL(blob)
    textFileName.value = 'encrypted-text.yctf'
    showTextActions.value = true

    setTimeout(() => {
      isProcessing.value = false
      progress.value = 0
      progressText.value = ''
    }, 1000)
  } catch (e) {
    isProcessing.value = false
    progress.value = 0
    progressText.value = ''
    outputText.value = '加密失败：' + e.message
    showTextActions.value = false
  }
}

async function decryptText() {
  try {
    validateCharMap()
    isProcessing.value = true
    progress.value = 0
    progressText.value = '正在解密...'

    // 模拟进度条
    const progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += 10
      }
    }, 100)

    const result = await decryptTextUtil(inputText.value, key.value, currentCharMap.value)
    clearInterval(progressInterval)

    progress.value = 100
    progressText.value = '解密完成！'
    outputText.value = result

    // 创建下载链接
    const blob = new Blob([result], { type: 'text/plain' })
    textBlobUrl.value = URL.createObjectURL(blob)
    textFileName.value = 'decrypted-text.txt'
    showTextActions.value = true

    setTimeout(() => {
      isProcessing.value = false
      progress.value = 0
      progressText.value = ''
    }, 1000)
  } catch (e) {
    isProcessing.value = false
    progress.value = 0
    progressText.value = ''
    outputText.value = '解密失败：' + e.message
    showTextActions.value = false
  }
}

function copyText() {
  navigator.clipboard
    .writeText(outputText.value)
    .then(() => {
      alert('已复制到剪贴板！')
    })
    .catch(() => {
      alert('复制失败，请手动复制')
    })
}

function downloadText() {
  if (textBlobUrl.value) {
    downloadFile(textBlobUrl.value, textFileName.value)
    // 清理URL
    URL.revokeObjectURL(textBlobUrl.value)
    textBlobUrl.value = ''
    showTextActions.value = false
  }
}

function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 50 * 1024 * 1024) {
    fileMessage.value = '文件过大，限制 50MB'
    selectedFile.value = null
  } else {
    fileMessage.value = `已选择文件：${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
    selectedFile.value = file
  }
}

async function encryptFile() {
  try {
    validateCharMap()
    const file = selectedFile.value
    if (!file || !fileKey.value) return

    isProcessing.value = true
    progress.value = 0
    progressText.value = '正在加密文件...'

    // 模拟进度条
    const progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += 5
      }
    }, 200)

    const encryptedBlob = await encryptFileUtil(file, fileKey.value, currentCharMap.value)
    clearInterval(progressInterval)

    progress.value = 100
    progressText.value = '文件加密完成！'

    const url = URL.createObjectURL(encryptedBlob)
    fileBlobUrl.value = url
    fileDownloadName.value = file.name + '.yctf'
    showFileActions.value = true
    fileMessage.value = '文件加密完成！'

    setTimeout(() => {
      isProcessing.value = false
      progress.value = 0
      progressText.value = ''
    }, 1000)
  } catch (e) {
    isProcessing.value = false
    progress.value = 0
    progressText.value = ''
    fileMessage.value = '文件加密失败：' + e.message
    showFileActions.value = false
  }
}

async function decryptFile() {
  try {
    validateCharMap()
    const file = selectedFile.value
    if (!file || !fileKey.value) return

    isProcessing.value = true
    progress.value = 0
    progressText.value = '正在解密文件...'

    // 模拟进度条
    const progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += 5
      }
    }, 200)

    const decryptedBlob = await decryptFileUtil(file, fileKey.value, currentCharMap.value)
    clearInterval(progressInterval)

    progress.value = 100
    progressText.value = '文件解密完成！'

    const url = URL.createObjectURL(decryptedBlob)
    fileBlobUrl.value = url
    fileDownloadName.value = file.name.replace(/\.yctf$/, '') || 'decrypted-file'
    showFileActions.value = true
    fileMessage.value = '文件解密完成！'

    setTimeout(() => {
      isProcessing.value = false
      progress.value = 0
      progressText.value = ''
    }, 1000)
  } catch (e) {
    isProcessing.value = false
    progress.value = 0
    progressText.value = ''
    fileMessage.value = '文件解密失败：' + e.message
    showFileActions.value = false
  }
}

function downloadFileResult() {
  if (fileBlobUrl.value) {
    downloadFile(fileBlobUrl.value, fileDownloadName.value)
    // 清理URL
    URL.revokeObjectURL(fileBlobUrl.value)
    fileBlobUrl.value = ''
    showFileActions.value = false
  }
}
</script>

<style scoped>
.app {
  height: 100vh;
  width: 100vw;
}

.app-container {
  min-height: 100vh;
  padding: 20px 15px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  display: flex;
  align-items: center;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  align-items: start;
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
}

.header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.header * {
  margin: 0 10px;
}

.header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0 0 15px 0;
  font-weight: 300;
}

.config-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.config-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.config-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.help-btn {
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.help-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(214, 51, 132, 0.35);
  background: linear-gradient(135deg, #e55a87 0%, #b23d5a 100%);
}

.help-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
}

@media (min-width: 1024px) {
  .card {
    padding: 35px;
  }
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 25px 0;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.modern-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #fafafa;
  box-sizing: border-box;
}

.modern-input:focus {
  outline: none;
  border-color: #ff9a9e;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 154, 158, 0.1);
}

textarea.modern-input {
  min-height: 120px;
  resize: vertical;
}

textarea.modern-input.result {
  background: #f1f5f9;
}

.btn-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 25px 0;
}

.btn {
  padding: 12px 32px;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 110px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 154, 158, 0.4);
}

.btn-secondary {
  background: white;
  color: #ff9a9e;
  border: 2px solid #ff9a9e;
}

.btn-secondary:hover:not(:disabled) {
  background: #ff9a9e;
  color: white;
  transform: translateY(-2px);
}

.file-upload {
  margin-bottom: 20px;
}

.file-input {
  display: none;
}

.file-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 25px 20px;
  border: 1px dashed #cbd5e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
  flex-direction: column;
  text-align: center;
}

.file-label:hover {
  border-color: #ff9a9e;
  background: #f7fafc;
}

.file-icon {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.file-text {
  font-size: 1rem;
  color: #4a5568;
  font-weight: 500;
  margin-bottom: 4px;
}

.file-size {
  font-size: 0.85rem;
  color: #718096;
}

.message {
  padding: 15px 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  margin-top: 20px;
}

.message:not(.error) {
  background: #f0fff4;
  color: #38a169;
  border: 1px solid #9ae6b4;
}

.message.error {
  background: #fed7d7;
  color: #e53e3e;
  border: 1px solid #feb2b2;
}

@media (max-width: 768px) {
  .app-container {
    padding: 15px 10px;
  }

  .card {
    padding: 25px 20px;
    margin-bottom: 15px;
  }

  .header {
    margin-bottom: 30px;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .header .subtitle {
    font-size: 0.9rem;
  }

  .card-title {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }

  .btn-group {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .btn {
    width: 100%;
    max-width: 250px;
    padding: 12px 24px;
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .action-buttons .btn {
    width: 100%;
    max-width: 250px;
  }

  .file-label {
    padding: 20px 15px;
  }

  .file-icon {
    font-size: 1.5rem;
  }

  .file-text {
    font-size: 0.9rem;
  }

  .file-size {
    font-size: 0.8rem;
  }
}

/* 进度条样式 */
.progress-container {
  margin: 15px 0;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff9a9e, #fecfef);
  transition: width 0.3s ease;
  border-radius: 3px;
}

.progress-text {
  text-align: center;
  margin-top: 6px;
  color: #666;
  font-size: 13px;
  font-weight: 500;
}

/* 操作按钮区域 */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;
}

.action-buttons .btn {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 10px 24px;
  font-size: 14px;
}

.icon {
  font-size: 16px;
}

.btn-group {
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.btn {
  width: auto;
  min-width: 110px;
}

.char-count {
  font-size: 0.85rem;
  color: #666;
  text-align: right;
  margin-top: 4px;
  margin-bottom: -8px;
  font-weight: 500;
}

/* 字符映射表配置样式 */
.char-map-config {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.char-map-config h3 {
  color: #d63384;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

.config-description {
  color: #666;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.char-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.char-input {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.char-input label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.char-input input {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.char-input input:focus {
  outline: none;
  border-color: #d63384;
  background: white;
  box-shadow: 0 0 0 3px rgba(214, 51, 132, 0.1);
}

.char-preview {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 1.1rem;
  color: #495057;
}

.char-preview strong {
  color: #d63384;
}

@media (max-width: 768px) {
  .char-map-config {
    padding: 20px;
  }
  .char-inputs {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 免责声明样式 */
.disclaimer {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 12px;
  padding: 20px;
  margin: 20px auto 30px;
  max-width: 800px;
  color: #856404;
  font-size: 0.9rem;
  line-height: 1.6;
}

.disclaimer strong {
  color: #b8860b;
  font-weight: 600;
}

.disclaimer p {
  margin: 8px 0;
}

@media (max-width: 768px) {
  .disclaimer {
    margin: 20px 15px 0;
    padding: 15px;
    font-size: 0.85rem;
  }
}
</style>
