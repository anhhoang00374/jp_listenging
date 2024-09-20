const folderSelect = document.getElementById('folderSelect');
const fileSelect = document.getElementById('fileSelect');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const volumeControl = document.getElementById('volumeControl');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const audioPlayer = document.getElementById('audioPlayer');
var currentFile = "";

let isPlaying = false; // Trạng thái đang phát nhạc hay không
let currentFileIndex = 0; // Vị trí của tệp đang phát

// Ví dụ cấu trúc thư mục với các tệp MP3
const folders = {
    'internet': ['DNS1.mp3', 'git.mp3'],
    'html': ['kaiwa.mp3','hosting1.mp3']
};

// Hàm để tạo đường dẫn tương đối
function getRelativePath(folder, file) {
  return `./listening/${folder}/${file}`;
}

// Populate folder select options
for (const folder in folders) {
  const option = document.createElement('option');
  option.value = folder;
  option.textContent = folder;
  folderSelect.appendChild(option);
}

// Populate file select options when folder is selected
folderSelect.addEventListener('change', function() {
  const selectedFolder = folderSelect.value;
  fileSelect.innerHTML = ''; // Clear previous options
  currentFileIndex = 0; // Reset file index
  
  folders[selectedFolder].forEach(file => {
    const option = document.createElement('option');
    option.value = file;
    option.textContent = file;
    fileSelect.appendChild(option);
  });

  // Stop audio if new folder is selected
  audioPlayer.pause();
  isPlaying = false;
  currentFileIndex = 0;
});

// Hàm phát nhạc
function playAudio() {
  const selectedFolder = folderSelect.value;
  const selectedFiles = folders[selectedFolder];
  
  if (selectedFolder && selectedFiles && selectedFiles.length > 0) {
    //const selectedFile = selectedFiles[currentFileIndex];
    const filePath = getRelativePath(selectedFolder, currentFile);
    
    // Reset nguồn audio và thời gian phát lại từ đầu
    audioPlayer.src = filePath;
    console.log(filePath);
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    audioPlayer.hidden = false;
    isPlaying = true;
  }
}

// Sự kiện khi nhấn nút "Play"
playBtn.addEventListener('click', function() {
  if (!isPlaying || audioPlayer.paused) {
    playAudio();
  }
});

// Sự kiện khi chọn tệp mới trong fileSelect
fileSelect.addEventListener('change', function() {
  const selectedFolder = folderSelect.value;
  const selectedFile = fileSelect.value;
  currentFile = selectedFile;
  if (selectedFolder && selectedFile) {
    currentFileIndex = Array.from(fileSelect.options).findIndex(option => option.value === selectedFile);
    
    // Nếu người dùng chọn file khác thì phát file đó ngay lập tức
    playAudio();
  }
});

// Sự kiện khi nhấn nút "Pause"
pauseBtn.addEventListener('click', function() {
  audioPlayer.pause();
  isPlaying = false;
});

// Update volume
volumeControl.addEventListener('input', function() {
  audioPlayer.volume = volumeControl.value;
});

// Update current time and duration display
audioPlayer.addEventListener('timeupdate', function() {
  currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
  durationDisplay.textContent = formatTime(audioPlayer.duration);
});

// Phát tệp tiếp theo khi kết thúc tệp hiện tại
audioPlayer.addEventListener('ended', function() {
  const selectedFolder = folderSelect.value;
  const selectedFiles = folders[selectedFolder];

  if (isPlaying) {
    // Chuyển đến tệp tiếp theo trong danh sách
    currentFileIndex++;
    if (currentFileIndex >= selectedFiles.length) {
      currentFileIndex = 0; // Quay lại tệp đầu tiên nếu hết danh sách
    }
    playAudio(); // Phát tệp tiếp theo
  }
});

// Format time in mm:ss
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}