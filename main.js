// 主题切换
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}
themeToggle.onclick = () => {
  const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
};
setTheme(localStorage.getItem('theme') || 'light');

// 图片上传与预览
const imageInput = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
let originalImageUrl = '';
imageInput.onchange = function() {
  const file = this.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      originalImageUrl = e.target.result;
      imagePreview.innerHTML = `<img src="${originalImageUrl}" alt="预览">`;
      resultSection.style.display = 'none'; // 上传新图片时隐藏上次结果
      updateConvertBtnState();
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.innerHTML = '';
    originalImageUrl = '';
    updateConvertBtnState();
  }
};

// 拖拽上传
const uploadLabel = document.querySelector('.upload-label');
uploadLabel.addEventListener('dragover', e => {
  e.preventDefault();
  uploadLabel.style.background = 'var(--accent)';
});
uploadLabel.addEventListener('dragleave', e => {
  e.preventDefault();
  uploadLabel.style.background = '';
});
uploadLabel.addEventListener('drop', e => {
  e.preventDefault();
  uploadLabel.style.background = '';
  const file = e.dataTransfer.files[0];
  if (file) {
    imageInput.files = e.dataTransfer.files;
    imageInput.onchange();
  }
});

// 风格选择
const styleList = document.getElementById('style-list');
let selectedStyle = styleList.querySelector('.style-card.selected')?.querySelector('span').textContent || '';
styleList.addEventListener('click', e => {
  const card = e.target.closest('.style-card');
  if (card) {
    styleList.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedStyle = card.querySelector('span').textContent;
    updateConvertBtnState();
  }
});

// 转换按钮与结果
const convertBtn = document.getElementById('convert-btn');
const loading = document.getElementById('loading');
const resultSection = document.getElementById('result-section');
const resultImage = document.getElementById('result-image');
const downloadBtn = document.getElementById('download-btn');
const compareBtn = document.getElementById('compare-btn');
let resultImageUrl = '';
let isComparing = false;

function updateConvertBtnState() {
  convertBtn.disabled = !originalImageUrl || !selectedStyle;
}
updateConvertBtnState();

convertBtn.onclick = function() {
  if (!originalImageUrl) {
    alert('请先上传图片');
    return;
  }
  if (!selectedStyle) {
    alert('请选择风格');
    return;
  }
  loading.style.display = 'block';
  convertBtn.disabled = true;
  setTimeout(() => {
    //change
    resultImageUrl = "/images/lisa-school2.jpg";
    //change
    resultImage.innerHTML = `<img src="/images/lisa-school2.jpg" alt="转换结果">`;
    resultSection.style.display = 'block';
    loading.style.display = 'none';
    convertBtn.disabled = false;
    isComparing = false;
    compareBtn.textContent = '对比原图';
    saveHistory({
      image: resultImageUrl,
      style: selectedStyle,
      time: new Date().toLocaleString()
    });
    loadHistory();
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    updateConvertBtnState();
  }, 1200);
};

downloadBtn.onclick = function() {
  if (!resultImageUrl) return;
  const a = document.createElement('a');
  a.href = resultImageUrl;
  //change
  a.download = `/images/lisa-school2.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

compareBtn.onclick = function() {
  if (!resultImageUrl || !originalImageUrl) return;
  isComparing = !isComparing;
  resultImage.innerHTML = `<img src="${isComparing ? originalImageUrl : resultImageUrl}" alt="${isComparing ? '原图' : '转换结果'}">`;
  compareBtn.textContent = isComparing ? '查看转换后' : '对比原图';
};

// ====== 历史记录本地缓存与展示 ======
const historyBtn = document.getElementById('history-btn');
const historyModal = document.getElementById('history-modal');
const closeHistory = document.getElementById('close-history');
const historyList = document.getElementById('history-list');

// 清空全部历史按钮
const clearHistoryBtn = document.createElement('button');
clearHistoryBtn.textContent = '清空全部';
clearHistoryBtn.id = 'clear-history';
clearHistoryBtn.style = 'background:var(--border);color:var(--text);margin-bottom:1px;border:none;border-radius:6px;padding:8px 18px;cursor:pointer; position: flex;margin-left: 280px;';
const historyContent = document.querySelector('.history-content');
historyContent.insertBefore(clearHistoryBtn, historyList);

clearHistoryBtn.onclick = function() {
  if (confirm('确定要清空全部历史记录吗？')) {
    localStorage.removeItem('styleTransferHistory');
    loadHistory();
  }
};

function saveHistory(record) {
  let history = JSON.parse(localStorage.getItem('styleTransferHistory') || '[]');
  history.unshift(record);
  if (history.length > 20) history = history.slice(0, 20);
  localStorage.setItem('styleTransferHistory', JSON.stringify(history));
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem('styleTransferHistory') || '[]');
  clearHistoryBtn.disabled = history.length === 0;
  clearHistoryBtn.style.opacity = history.length === 0 ? 0.5 : 1;
  if (history.length === 0) {
    historyList.innerHTML = '<div style="text-align:center;color:var(--border);padding:32px 0;">暂无历史记录</div>';
    return;
  }
  historyList.innerHTML = history.map((item, idx) => `
    <div class="history-item" style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <img src="${item.image}" alt="历史图片" style="width:48px;height:48px;border-radius:8px;object-fit:cover;cursor:pointer;" data-idx="${idx}">
      <div style="flex:1;">
        <div style="font-size:0.98em;">${item.style}</div>
        <div style="font-size:0.85em;color:var(--border);">${item.time}</div>
      </div>
      <button class="history-download" data-idx="${idx}" style="margin-right:6px;">下载</button>
      <button class="history-delete" data-idx="${idx}">删除</button>
    </div>
  `).join('');
}

historyList.onclick = function(e) {
  const idx = e.target.getAttribute('data-idx');
  let history = JSON.parse(localStorage.getItem('styleTransferHistory') || '[]');
  if (e.target.classList.contains('history-download')) {
    const a = document.createElement('a');
    a.href = history[idx].image;
    a.download = `history_${history[idx].style}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else if (e.target.classList.contains('history-delete')) {
    history.splice(idx, 1);
    localStorage.setItem('styleTransferHistory', JSON.stringify(history));
    loadHistory();
  } else if (e.target.tagName === 'IMG') {
    const img = document.createElement('img');
    img.src = history[idx].image;
    img.style = 'max-width:90vw;max-height:80vh;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,0.2);display:block;margin:0 auto;';
    const overlay = document.createElement('div');
    overlay.style = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
    overlay.appendChild(img);
    overlay.onclick = () => document.body.removeChild(overlay);
    document.body.appendChild(overlay);
  }
};

historyBtn.onclick = () => {
  loadHistory();
  historyModal.style.display = 'flex';
};
closeHistory.onclick = () => historyModal.style.display = 'none';
historyModal.addEventListener('click', function(e) {
  if (e.target === historyModal) {
    historyModal.style.display = 'none';
  }
});
