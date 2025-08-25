<template>
  <div class="help-container">
    <div class="container">
      <header class="header">
        <div class="header-content">
          <h1 class="title">使用说明</h1>
        </div>
        <div class="header-actions">
          <button @click="$router.push('/')" class="action-btn back-btn">
            <span class="icon">←</span>
            <span class="btn-text">返回首页</span>
          </button>
        </div>
      </header>

      <div class="help-content">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">永雏塔菲加密器使用指南</h2>
          </div>
          <div class="card-body">
            <div class="section">
              <h3 class="section-title">功能介绍</h3>
              <p class="section-text">
                永雏塔菲加密器是一款基于现代加密技术的安全工具，提供文本和文件加密功能，使用独特的字符编码方式确保数据安全。
              </p>
            </div>

            <div class="section">
              <h3 class="section-title">文本加密使用步骤</h3>
              <ol class="steps-list">
                <li class="step-item">在文本输入框中输入需要加密的文本内容</li>
                <li class="step-item">确认私钥（默认：taffy，可自行修改）</li>
                <li class="step-item">点击"加密"按钮进行加密</li>
                <li class="step-item">加密完成后可选择复制到剪贴板或下载为 .yctf 文件</li>
                <li class="step-item">解密时输入加密后的文本和相同私钥，点击"解密"即可</li>
              </ol>
            </div>

            <div class="section">
              <h3 class="section-title">文件加密使用步骤</h3>
              <ol class="steps-list">
                <li class="step-item">点击"选择文件"按钮选择要加密的文件（最大50MB）</li>
                <li class="step-item">确认文件加密私钥</li>
                <li class="step-item">点击"加密文件"按钮开始加密</li>
                <li class="step-item">加密完成后下载 .yctf 格式的加密文件</li>
                <li class="step-item">解密时选择 .yctf 文件，输入相同私钥，点击"解密文件"即可</li>
              </ol>
            </div>

            <div class="section">
              <h3 class="section-title">关于私钥</h3>
              <ul class="info-list">
                <li class="info-item">私钥是加密和解密的关键，请务必记住</li>
                <li class="info-item">加密和解密必须使用相同的私钥</li>
                <li class="info-item">丢失私钥将无法解密已加密的数据</li>
              </ul>
            </div>

            <div class="section">
              <h3 class="section-title">自定义字符映射表</h3>
              <p class="section-text">
                您可以自定义用于加密的字符映射表，默认使用「永、雏、塔、菲」四个字符。
              </p>
              <ol class="steps-list">
                <li class="step-item">点击首页的「显示字符映射」按钮展开配置面板</li>
                <li class="step-item">在四个输入框中分别输入您想要的字符（每个字符必须唯一）</li>
                <li class="step-item">确认字符后，加密和解密将使用您自定义的映射表</li>
                <li class="step-item">
                  重要：使用自定义映射表加密的数据，解密时也必须使用相同的映射表
                </li>
              </ol>
            </div>

            <div class="section">
              <h3 class="section-title">技术特点</h3>
              <ul class="info-list">
                <li class="info-item">使用 GZIP 压缩优化存储空间</li>
                <li class="info-item">XOR 加密算法确保数据安全</li>
                <li class="info-item">支持自定义字符映射表（4 个唯一字符）</li>
              </ul>
            </div>

            <div class="section">
              <h3 class="section-title">注意事项</h3>
              <ul class="info-list">
                <li class="info-item">加密后的文件扩展名为 .yctf</li>
                <li class="info-item">加密大文件时可能需要较长时间，请耐心等待</li>
                <li class="info-item">建议在加密重要数据前先进行测试</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 使用说明页面逻辑
</script>

<style scoped>
.help-container {
  min-height: 100vh;
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
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

.back-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-text {
  font-weight: 600;
}

/* Help Content */
.help-content {
  margin-top: 20px;
}

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
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  text-align: center;
}

.card-body {
  padding: 30px;
}

/* Section Styles */
.section {
  margin-bottom: 35px;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #4a5568;
  margin: 0 0 20px 0;
}

/* Lists */
.steps-list,
.info-list {
  margin: 0 0 20px 0;
  padding-left: 25px;
}

.step-item,
.info-item {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 12px;
  position: relative;
}

.step-item:last-child,
.info-item:last-child {
  margin-bottom: 0;
}

.step-item::marker,
.info-item::marker {
  color: #ff6b9d;
  font-weight: bold;
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

.disclaimer-content {
  margin-top: 15px;
}

.disclaimer-text {
  margin: 12px 0;
  font-size: 1.1rem;
  line-height: 1.7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .help-container {
    padding: 15px 10px;
  }

  .header {
    margin-bottom: 30px;
    gap: 15px;
  }

  .header-actions {
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

  .card {
    margin-bottom: 20px;
  }

  .card-header {
    padding: 20px 15px 15px;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .card-body {
    padding: 20px 15px;
  }

  .section {
    margin-bottom: 25px;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .section-text,
  .step-item,
  .info-item {
    font-size: 1rem;
  }

  .disclaimer {
    padding: 25px 20px;
    margin: 30px auto;
    font-size: 0.95rem;
  }

  .disclaimer-title {
    font-size: 1.3rem;
  }

  .disclaimer-text {
    font-size: 1rem;
  }
}
</style>
