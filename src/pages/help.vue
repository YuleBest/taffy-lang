<template>
  <div class="help-container">
    <div class="container">
      <header class="header">
        <h1>使用说明</h1>
        <button @click="$router.push('/')" class="back-btn">
          <span class="icon">←</span>
          返回首页
        </button>
      </header>

      <div class="help-content">
        <div class="card">
          <h2>永雏塔菲加密器使用指南</h2>

          <div class="section">
            <h3>功能介绍</h3>
            <p>
              永雏塔菲加密器是一款基于现代加密技术的安全工具，提供文本和文件加密功能，使用独特的字符编码方式确保数据安全。
            </p>
          </div>

          <div class="section">
            <h3>文本加密使用步骤</h3>
            <ol>
              <li>在文本输入框中输入需要加密的文本内容</li>
              <li>确认私钥（默认：taffy，可自行修改）</li>
              <li>点击"加密"按钮进行加密</li>
              <li>加密完成后可选择复制到剪贴板或下载为 .yctf 文件</li>
              <li>解密时输入加密后的文本和相同私钥，点击"解密"即可</li>
            </ol>
          </div>

          <div class="section">
            <h3>文件加密使用步骤</h3>
            <ol>
              <li>点击"选择文件"按钮选择要加密的文件（最大50MB）</li>
              <li>确认文件加密私钥</li>
              <li>点击"加密文件"按钮开始加密</li>
              <li>加密完成后下载 .yctf 格式的加密文件</li>
              <li>解密时选择 .yctf 文件，输入相同私钥，点击"解密文件"即可</li>
            </ol>
          </div>

          <div class="section">
            <h3>关于私钥</h3>
            <ul>
              <li>私钥是加密和解密的关键，请务必记住</li>
              <li>加密和解密必须使用相同的私钥</li>
              <li>丢失私钥将无法解密已加密的数据</li>
            </ul>
          </div>

          <div class="section">
            <h3>自定义字符映射表</h3>
            <p>您可以自定义用于加密的字符映射表，默认使用「永、雏、塔、菲」四个字符。</p>
            <ol>
              <li>点击首页的「显示字符映射」按钮展开配置面板</li>
              <li>在四个输入框中分别输入您想要的字符（每个字符必须唯一）</li>
              <li>确认字符后，加密和解密将使用您自定义的映射表</li>
              <li>重要：使用自定义映射表加密的数据，解密时也必须使用相同的映射表</li>
            </ol>
          </div>

          <div class="section">
            <h3>技术特点</h3>
            <ul>
              <li>使用 GZIP 压缩优化存储空间</li>
              <li>XOR 加密算法确保数据安全</li>
              <li>支持自定义字符映射表（4 个唯一字符）</li>
            </ul>
          </div>

          <div class="section">
            <h3>注意事项</h3>
            <ul>
              <li>加密后的文件扩展名为 .yctf</li>
              <li>请妥善保管私钥，不要泄露给他人</li>
              <li>加密大文件时可能需要较长时间，请耐心等待</li>
              <li>建议在加密重要数据前先进行测试</li>
            </ul>
          </div>
        </div>
        
        <!-- 免责声明 -->
        <div class="disclaimer">
          <h3>免责声明</h3>
          <p>
            本工具仅供学习和技术交流使用，不得用于任何非法用途。用户需自行承担使用本工具的一切风险和责任。
            加密强度取决于私钥复杂度，请妥善保管您的私钥。对于因私钥泄露或不当使用造成的任何损失，本工具概不负责。
          </p>
          <p>
            建议在处理重要数据前进行充分测试，确保加密/解密功能正常。对于因软件故障或操作失误导致的数据丢失，本工具不承担任何责任。
          </p>
          <p>
            使用自定义字符映射表时，请确保妥善记录所使用的字符组合。因字符映射表不匹配导致的数据无法解密，本工具概不负责。
          </p>
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
  padding: 20px 15px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  letter-spacing: 0.5px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.help-content {
  margin-top: 20px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 30px 0;
  text-align: center;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 15px 0;
}

.section p {
  font-size: 1rem;
  line-height: 1.6;
  color: #4a5568;
  margin: 0 0 15px 0;
}

.section ol,
.section ul {
  margin: 0;
  padding-left: 25px;
}

.section li {
  font-size: 1rem;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 8px;
}

.section li:last-child {
  margin-bottom: 0;
}

/* 免责声明样式 */
  .disclaimer {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 12px;
    padding: 25px;
    margin: 30px 0 0 0;
    color: #856404;
  }

  .disclaimer h3 {
    color: #b8860b;
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0 0 15px 0;
  }

  .disclaimer p {
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0 0 10px 0;
    color: #856404;
  }

  .disclaimer p:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    .help-container {
      padding: 15px 10px;
    }

    .card {
      padding: 25px 20px;
    }

    .header h1 {
      font-size: 1.8rem;
    }

    .section h3 {
      font-size: 1.2rem;
    }

    .section p,
    .section li {
      font-size: 0.9rem;
    }

    .disclaimer {
      padding: 20px;
      margin: 20px 0 0 0;
    }

    .disclaimer h3 {
      font-size: 1.2rem;
    }

    .disclaimer p {
      font-size: 0.9rem;
    }
  }
</style>
