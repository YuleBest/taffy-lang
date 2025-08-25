<template>
  <div class="app-container">
    <div class="container">
      <header class="header">
        <div class="header-content">
          <h1 class="title">永雏塔菲加密器</h1>
          <p class="subtitle">V1.0.0</p>
        </div>
        <div class="header-actions">
          <button @click="showCharMap = !showCharMap" class="action-btn config-btn">
            <span class="icon">⚙️</span>
            <span class="btn-text">{{ showCharMap ? '隐藏' : '显示' }}字符映射</span>
          </button>
          <button @click="$router.push('/help')" class="action-btn help-btn">
            <span class="icon">📖</span>
            <span class="btn-text">使用说明</span>
          </button>
        </div>
      </header>

      <!-- 字符映射表配置 -->
      <div v-if="showCharMap" class="char-map-config">
        <div class="config-header">
          <h3 class="config-title">自定义字符映射表</h3>
          <p class="config-description">
            设置4个不同的字符作为加密映射，默认使用「永、雏、塔、菲」
          </p>
        </div>
        <div class="char-inputs">
          <div class="char-input">
            <label class="char-label">字符1</label>
            <input v-model="customChar1" maxlength="1" placeholder="永" class="char-field" />
          </div>
          <div class="char-input">
            <label class="char-label">字符2</label>
            <input v-model="customChar2" maxlength="1" placeholder="雏" class="char-field" />
          </div>
          <div class="char-input">
            <label class="char-label">字符3</label>
            <input v-model="customChar3" maxlength="1" placeholder="塔" class="char-field" />
          </div>
          <div class="char-input">
            <label class="char-label">字符4</label>
            <input v-model="customChar4" maxlength="1" placeholder="菲" class="char-field" />
          </div>
        </div>
        <div class="char-preview">
          <span class="preview-label">当前映射：</span>
          <span class="preview-value">{{ currentCharMap.join('、') }}</span>
        </div>
      </div>

      <div class="cards-grid">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">文本加密</h2>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">输入文本</label>
              <textarea
                v-model="inputText"
                placeholder="请输入要加密或解密的文本"
                class="form-control textarea"
              ></textarea>
              <div class="char-count">输入字数：{{ inputText.length }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">私钥</label>
              <input v-model="key" placeholder="请输入私钥" class="form-control input" />
            </div>
            <div class="btn-group">
              <button @click="encryptText" class="btn btn-primary">加密</button>
              <button @click="decryptText" class="btn btn-secondary">解密</button>
              <button
                @click="swapText"
                class="btn btn-outline"
                :disabled="!inputText && !outputText"
              >
                互换
              </button>
            </div>
            <div class="form-group">
              <label class="form-label">输出结果</label>
              <textarea
                v-model="outputText"
                placeholder="加密/解密结果"
                class="form-control textarea result"
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
              <button @click="copyText" class="btn btn-outline">
                <span class="icon">📋</span>
                复制到剪贴板
              </button>
              <button @click="downloadText" class="btn btn-primary">
                <span class="icon">📥</span>
                下载文件
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">文件加密</h2>
          </div>
          <div class="card-body">
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
              <label class="form-label">文件私钥</label>
              <input
                v-model="fileKey"
                placeholder="请输入文件加密私钥"
                class="form-control input"
              />
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

            <div
              v-if="fileMessage"
              class="message"
              :class="{ error: fileMessage.includes('失败') }"
            >
              {{ fileMessage }}
            </div>
          </div>
        </div>
      </div>
      <!-- 免责声明 -->
      <div class="disclaimer">
        <div class="disclaimer-header">
          <h3 class="disclaimer-title">免责声明</h3>
        </div>
        <div class="disclaimer-content">
          <p>
            本工具仅供学习和技术交流使用，不得用于任何非法用途。用户需自行承担使用本工具的一切风险和责任。
            加密强度取决于私钥复杂度，请妥善保管您的私钥。对于因私钥泄露或不当使用造成的任何损失，本工具概不负责。
          </p>
          <p>
            建议在处理重要数据前进行充分测试，确保加密/解密功能正常。对于因软件故障或操作失误导致的数据丢失，本工具不承担任何责任。
          </p>
        </div>
      </div>
    </div>
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
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

/* Header Styles */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  color: #333;
  gap: 20px;
}

.header-content {
  text-align: center;
}

.header-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
  margin: 0;
  font-weight: 400;
  color: #666;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  min-height: 48px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.config-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.help-btn {
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  color: white;
}

.btn-text {
  font-weight: 600;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  align-items: start;
  margin-bottom: 40px;
}

@media (min-width: 769px) {
  .cards-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
}

/* Card Styles */
.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.card-header {
  padding: 25px 30px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  text-align: center;
}

.card-body {
  padding: 30px;
}

@media (max-width: 768px) {
  .card-header {
    padding: 20px 20px 15px;
  }

  .card-title {
    font-size: 1.4rem;
  }

  .card-body {
    padding: 20px;
  }
}

/* Form Styles */
.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 1rem;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #ffffff;
  box-sizing: border-box;
  line-height: 1.5;
}

.form-control:focus {
  outline: none;
  border-color: #ff9a9e;
  background: white;
  box-shadow: 0 0 0 4px rgba(255, 154, 158, 0.15);
}

.textarea {
  min-height: 140px;
  resize: vertical;
}

.textarea.result {
  background: #f8f9fa;
  font-family: 'Fira Code', monospace;
}

/* Button Styles */
.btn-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;
}

.btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.btn-primary {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: white;
}

.btn-secondary {
  background: white;
  color: #ff6b9d;
  border: 2px solid #ff6b9d;
}

.btn-outline {
  background: transparent;
  color: #666;
  border: 2px solid #e2e8f0;
}

.btn-outline:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #cbd5e0;
}

/* File Upload */
.file-upload {
  margin-bottom: 25px;
}

.file-input {
  display: none;
}

.file-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 30px 25px;
  border: 2px dashed #cbd5e0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
  flex-direction: column;
  text-align: center;
}

.file-label:hover {
  border-color: #ff9a9e;
  background: #fff5f7;
}

.file-icon {
  font-size: 2.5rem;
  color: #a0aec0;
}

.file-text {
  font-size: 1.1rem;
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 5px;
}

.file-size {
  font-size: 0.9rem;
  color: #718096;
}

/* Progress Bar */
.progress-container {
  margin: 25px 0;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff9a9e, #fecfef);
  transition: width 0.4s ease;
  border-radius: 5px;
}

.progress-text {
  text-align: center;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
  flex-wrap: wrap;
}

/* Character Map Config */
.char-map-config {
  background: white;
  border-radius: 20px;
  padding: 35px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.config-header {
  text-align: center;
  margin-bottom: 30px;
}

.config-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #d63384;
  margin: 0 0 15px 0;
}

.config-description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.char-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.char-input {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.char-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 12px;
  font-size: 1rem;
}

.char-field {
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.char-field:focus {
  outline: none;
  border-color: #d63384;
  background: white;
  box-shadow: 0 0 0 4px rgba(214, 51, 132, 0.15);
}

.char-preview {
  text-align: center;
  padding: 20px;
  background: #fff5f7;
  border-radius: 12px;
  font-size: 1.2rem;
  color: #495057;
  font-weight: 500;
}

.preview-label {
  color: #d63384;
  font-weight: 600;
}

/* Message Styles */
.message {
  padding: 18px 24px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  margin-top: 25px;
  font-size: 1rem;
  border: 1px solid transparent;
}

.message:not(.error) {
  background: #f0fff4;
  color: #38a169;
  border-color: #9ae6b4;
}

.message.error {
  background: #fed7d7;
  color: #e53e3e;
  border-color: #feb2b2;
}

/* Disclaimer */
.disclaimer {
  background: #fffbeb;
  border: 1px solid #fbd38d;
  border-radius: 16px;
  padding: 30px;
  margin: 40px auto;
  max-width: 800px;
  color: #975a16;
  font-size: 1rem;
  line-height: 1.7;
  box-sizing: border-box;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.disclaimer-header {
  text-align: center;
  margin-bottom: 20px;
}

.disclaimer-title {
  color: #b8860b;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.disclaimer-content p {
  margin: 12px 0;
}

/* Character Count */
.char-count {
  font-size: 0.9rem;
  color: #718096;
  text-align: right;
  margin-top: 6px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-container {
    padding: 15px 10px;
  }

  .container {
    padding: 0 15px;
  }

  .header {
    margin-bottom: 30px;
    gap: 15px;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .action-btn {
    width: 100%;
    padding: 14px 20px;
    font-size: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .card {
    margin-bottom: 20px;
  }

  .card-header {
    padding: 20px 15px 15px;
  }

  .card-body {
    padding: 20px 15px;
  }

  .card-title {
    font-size: 1.4rem;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-control {
    padding: 12px 14px;
    font-size: 16px;
  }

  .textarea {
    min-height: 120px;
  }

  .btn-group {
    margin: 25px 0;
    gap: 12px;
  }

  .btn {
    width: 100%;
    max-width: 280px;
    padding: 12px 20px;
    font-size: 1rem;
    min-height: 48px;
  }

  .file-label {
    padding: 25px 20px;
    gap: 12px;
  }

  .file-text {
    font-size: 1rem;
  }

  .file-size {
    font-size: 0.85rem;
  }

  .char-count {
    font-size: 0.85rem;
  }

  .char-map-config {
    padding: 25px 20px;
    margin-bottom: 30px;
  }

  .config-title {
    font-size: 1.5rem;
  }

  .config-description {
    font-size: 1rem;
  }

  .char-inputs {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 25px;
  }

  .char-field {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .char-preview {
    padding: 15px;
    font-size: 1.1rem;
  }

  .message {
    padding: 15px 20px;
    margin-top: 20px;
    font-size: 0.95rem;
  }

  .disclaimer {
    padding: 25px 20px;
    margin: 30px auto;
    font-size: 0.95rem;
  }

  .disclaimer-title {
    font-size: 1.3rem;
  }

  .action-buttons {
    margin: 25px 0;
    gap: 12px;
  }

  .action-buttons .btn {
    width: 100%;
    max-width: 280px;
    padding: 12px 20px;
  }
}
</style>
