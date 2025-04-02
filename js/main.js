// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const compressionControls = document.getElementById('compressionControls');
const previewContainer = document.getElementById('previewContainer');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const originalDimensions = document.getElementById('originalDimensions');
const compressionRatio = document.getElementById('compressionRatio');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const compressBtn = document.getElementById('compressBtn');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片数据
let currentFile = null;
let originalImage = null;

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 更新质量显示
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
});

// 处理文件上传
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#0071e3';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#e5e5e5';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e5e5e5';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

// 处理文件
function handleFile(file) {
    currentFile = file;
    
    // 显示原始文件大小
    originalSize.textContent = formatFileSize(file.size);
    
    // 创建图片预览
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage = new Image();
        originalImage.onload = () => {
            // 显示原始图片
            originalPreview.src = e.target.result;
            
            // 显示图片尺寸
            originalDimensions.textContent = `${originalImage.width} x ${originalImage.height}`;
            
            // 显示控制区域和预览区域
            compressionControls.style.display = 'block';
            previewContainer.style.display = 'grid';
            
            // 压缩图片
            compressImage();
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    // 绘制图片
    ctx.drawImage(originalImage, 0, 0);
    
    // 压缩
    const quality = qualitySlider.value / 100;
    const compressedDataUrl = canvas.toDataURL(currentFile.type, quality);
    
    // 显示压缩后的图片
    compressedPreview.src = compressedDataUrl;
    
    // 计算压缩后的大小
    const base64String = compressedDataUrl.split(',')[1];
    const compressedBytes = atob(base64String).length;
    compressedSize.textContent = formatFileSize(compressedBytes);
    
    // 计算压缩比例
    const ratio = ((1 - compressedBytes / currentFile.size) * 100).toFixed(1);
    compressionRatio.textContent = `${ratio}%`;
    
    // 更新下载按钮
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = `compressed_${currentFile.name}`;
        link.href = compressedDataUrl;
        link.click();
    };
}

// 压缩按钮点击事件
compressBtn.addEventListener('click', compressImage); 