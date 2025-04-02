// Get DOM elements
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

// Current image data
let currentFile = null;
let originalImage = null;

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Update quality display
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
});

// Handle file upload
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

// Handle file
function handleFile(file) {
    currentFile = file;
    
    // Display original file size
    originalSize.textContent = formatFileSize(file.size);
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage = new Image();
        originalImage.onload = () => {
            // Display original image
            originalPreview.src = e.target.result;
            
            // Display image dimensions
            originalDimensions.textContent = `${originalImage.width} x ${originalImage.height}`;
            
            // Show control area and preview area
            compressionControls.style.display = 'block';
            previewContainer.style.display = 'grid';
            
            // Compress image
            compressImage();
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Compress image
function compressImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    // Draw image
    ctx.drawImage(originalImage, 0, 0);
    
    // Compress
    const quality = qualitySlider.value / 100;
    const compressedDataUrl = canvas.toDataURL(currentFile.type, quality);
    
    // Display compressed image
    compressedPreview.src = compressedDataUrl;
    
    // Calculate compressed size
    const base64String = compressedDataUrl.split(',')[1];
    const compressedBytes = atob(base64String).length;
    compressedSize.textContent = formatFileSize(compressedBytes);
    
    // Calculate compression ratio
    const ratio = ((1 - compressedBytes / currentFile.size) * 100).toFixed(1);
    compressionRatio.textContent = `${ratio}%`;
    
    // Update download button
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = `compressed_${currentFile.name}`;
        link.href = compressedDataUrl;
        link.click();
    };
}

// Compression button click event
compressBtn.addEventListener('click', compressImage); 