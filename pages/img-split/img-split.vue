<template>
  <view class="container">
    <!-- 主内容区 -->
    <scroll-view class="content" scroll-y>
      <!-- 上传区域 -->
      <view class="upload-section">
        <view class="section-title">选择图片</view>
        <view
          class="upload-container"
          :class="{ 'border-primary': isDragging }"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          @click="selectImage"
        >
          <view class="upload-icon">
            <text class="fa fa-cloud-upload"></text>
          </view>
          <text class="upload-text">点击或拖拽图片到此处</text>
          <text class="upload-hint">支持JPG、PNG</text>
        </view>

        <view v-if="selectedImage" class="selected-image-container">
          <image
            :src="selectedImage"
            mode="aspectFit"
            class="selected-image"
          ></image>
          <button
            type="primary"
            size="mini"
            @click="selectImage"
            class="change-image-btn"
          >
            <text class="fa fa-refresh mr-1"></text>更换图片
          </button>
        </view>
      </view>

      <!-- 分割选项 -->
      <view class="option-section">
        <view class="section-title">分割选项</view>
        <view class="option-grid">
          <view
            class="option-card"
            :class="{ active: selectedOption === 4 }"
            @click="selectOption(4)"
          >
            <view class="option-header">
              <text class="option-title">四宫格</text>
              <view class="option-icon">
                <text class="fa fa-th-large"></text>
              </view>
            </view>
            <text class="option-desc">将图片分割为2×2的四宫格</text>
            <view class="option-preview grid-2x2">
              <view class="grid-item"></view>
              <view class="grid-item"></view>
              <view class="grid-item"></view>
              <view class="grid-item"></view>
            </view>
          </view>

          <view
            class="option-card"
            :class="{ active: selectedOption === 9 }"
            @click="selectOption(9)"
          >
            <view class="option-header">
              <text class="option-title">九宫格</text>
              <view class="option-icon">
                <text class="fa fa-th"></text>
              </view>
            </view>
            <text class="option-desc">将图片分割为3×3的九宫格</text>
            <view class="option-preview grid-3x3">
              <view class="grid-item"></view>
              <view class="grid-item"></view>
              <view class="grid-item"></view>
              <view class="grid-item"></view>
              <view class="grid-item"></view>
              <view class="grid-item"></view>
              <view class="grid-item"></view>
              <view class="grid-item"></view>
              <view class="grid-item"></view>
            </view>
          </view>
        </view>

        <button
          type="primary"
          class="split-btn"
          :disabled="!canSplit"
          @click="splitImage"
        >
          <text class="fa fa-scissors mr-1"></text>开始分割
        </button>
      </view>

      <!-- 分割结果 -->
      <view v-if="splitImages.length > 0" class="result-section">
        <view class="section-title">分割结果</view>
        <view class="result-grid">
          <view
            class="result-item"
            v-for="(image, index) in splitImages"
            :key="index"
          >
            <view class="result-image-container">
              <image
                :src="image"
                mode="aspectFill"
                class="result-image"
              ></image>
              <button
                type="primary"
                size="mini"
                class="download-btn"
                @click="downloadImage(image, index + 1)"
              >
                <text class="fa fa-download"></text>
              </button>
            </view>
            <text class="result-text">分割图片 {{ index + 1 }}</text>
          </view>
        </view>

        <button
          type="primary"
          class="download-all-btn"
          @click="downloadAllImages"
        >
          <text class="fa fa-download mr-1"></text>下载全部
        </button>
      </view>
    </scroll-view>
    <!-- 在页面底部添加一个隐藏的Canvas -->
    <canvas
      style="width: 300px; height: 200px"
      canvas-id="imageCanvas"
      id="imageCanvas"
    ></canvas>
  </view>
</template>

<script setup>
import { getCurrentInstance } from "vue";
import { ref, onMounted, onUnmounted } from "vue";
// import JSZip from 'jszip'
// import { saveImageToPhotosAlbum, getSetting, requestSetting } from '@dcloudio/uni-app'
const instance = getCurrentInstance();
// 状态管理
const selectedImage = ref("");
const selectedOption = ref(null);
const splitImages = ref([]);
const isDragging = ref(false);
const isProcessing = ref(false);

// 计算属性：是否可以分割
const canSplit = ref(false);

const canvasWidth = ref(0); // Canvas宽度
const canvasHeight = ref(0); // Canvas高度
const tileSize = ref(0); // 每个小图的尺寸
const gridImages = ref([]); // 存储分割后的图片数据
// const originalImage = ref(null); // 原始图片对象
// 生命周期钩子
// onMounted(() => {
//   // 监听窗口大小变化，用于响应式布局
//   // window.addEventListener("resize", handleResize);
//   // handleResize();
// });

// onUnmounted(() => {
//   window.removeEventListener("resize", handleResize);
// });

// 处理窗口大小变化
// const handleResize = () => {
//   // 可以在这里调整布局参数
// };

// 选择图片
const selectImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["original", "compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      console.log(res, "resresresres");
      selectedImage.value = res.tempFilePaths[0];
      checkCanSplit();
    },
    fail: (err) => {
      uni.showToast({
        title: "选择图片失败",
        icon: "none",
      });
    },
  });
};

// 拖放相关处理
const handleDragOver = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e) => {
  e.preventDefault();
  isDragging.value = false;

  // H5平台支持拖放文件
  if (e.dataTransfer && e.dataTransfer.files.length) {
    const file = e.dataTransfer.files[0];
    if (file.type.indexOf("image/") !== 0) {
      uni.showToast({
        title: "请选择图片文件",
        icon: "none",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      selectedImage.value = event.target.result;
      checkCanSplit();
    };
    reader.readAsDataURL(file);
  }
};
// onMounted(() => {
//   // 添加canvas可用性检查
//   const query = uni.createSelectorQuery().in(instance);
//   query
//     .select("#imageCanvas")
//     .node()
//     .exec((res) => {
//       console.log("Canvas初始化状态:", res[0]?.node ? "成功" : "失败");
//     });
// });
// 选择分割选项
const selectOption = (option) => {
  selectedOption.value = option;
  checkCanSplit();
};

// 检查是否可以分割
const checkCanSplit = () => {
  canSplit.value = !!selectedImage.value && selectedOption.value !== null;
};

const splitImage = () => {
  if (!canSplit.value) return;

  isProcessing.value = true;
  const mainCtx = uni.createCanvasContext("imageCanvas", instance.proxy);
  uni.getImageInfo({
    src: selectedImage.value,
    success: (imageInfo) => {
			console.log(imageInfo, 'imageInfo');
      // 绘制图片到主Canvas
      mainCtx.drawImage(
        imageInfo.path,
        0,
        0,
        imageInfo.width,
        imageInfo.height
      );
			mainCtx.draw(true, () => {
        console.log('Canvas绘制完成');
        // ... 后续处理逻辑 ...
      });

      // 延迟执行，确保图片已绘制完成
      setTimeout(() => {
        // 计算分割数量
        const rows = selectedOption.value === 4 ? 2 : 3;
        const cols = selectedOption.value === 4 ? 2 : 3;

        // 计算每个小格子的宽度和高度
        const cellWidth = imageInfo.width / cols;
        const cellHeight = imageInfo.height / rows;

        // 清空结果
        splitImages.value = [];

        // 处理每个分割的小图片
        const processCell = (row, col) => {
          if (row >= rows) {
            isProcessing.value = false;
            // 显示结果
            uni.showToast({
              title: "分割成功",
              icon: "success",
            });
            return;
          }

          // 计算当前格子的位置和大小
          const x = col * cellWidth;
          const y = row * cellHeight;

          // 将主Canvas的指定区域保存为临时文件
          uni.canvasToTempFilePath({
            x: x,
            y: y,
            width: cellWidth,
            height: cellHeight,
            destWidth: cellWidth,
            destHeight: cellHeight,
            canvasId: "imageCanvas",
            success: (res) => {
              splitImages.value.push(res.tempFilePath);

              // 处理下一个格子
              const nextCol = col + 1;
              const nextRow = nextCol >= cols ? row + 1 : row;
              processCell(nextRow, nextCol % cols);
            },
            fail: (err) => {
              console.error("画布转图片失败:", err);
              isProcessing.value = false;
              uni.showToast({
                title: "处理图片失败",
                icon: "none",
              });
            },
          });
        };

        // 开始处理第一个格子
        processCell(0, 0);
      }, 300); // 延迟300ms确保Canvas绘制完成
    },
    fail: (err) => {
      console.error("获取图片信息失败:", err);
      isProcessing.value = false;
      uni.showToast({
        title: "获取图片信息失败",
        icon: "none",
      });
    },
  });
};

// 下载单个图片
const downloadImage = async (imagePath, index) => {
  try {
    // 检查权限
    const setting = await getSetting();
    if (!setting.authSetting["scope.writePhotosAlbum"]) {
      await requestSetting({
        scope: "scope.writePhotosAlbum",
      });
    }

    // 保存图片到相册
    await saveImageToPhotosAlbum({
      filePath: imagePath,
    });

    uni.showToast({
      title: `图片${index}保存成功`,
      icon: "success",
    });
  } catch (err) {
    uni.showToast({
      title: "保存失败，请重试",
      icon: "none",
    });
  }
};

// 下载所有图片
const downloadAllImages = async () => {
  if (splitImages.value.length === 0) return;

  try {
    // 检查权限
    const setting = await getSetting();
    if (!setting.authSetting["scope.writePhotosAlbum"]) {
      await requestSetting({
        scope: "scope.writePhotosAlbum",
      });
    }

    // 逐个保存图片
    for (let i = 0; i < splitImages.value.length; i++) {
      await saveImageToPhotosAlbum({
        filePath: splitImages.value[i],
      });
    }

    uni.showToast({
      title: `全部${splitImages.value.length}张图片保存成功`,
      icon: "success",
    });
  } catch (err) {
    uni.showToast({
      title: "保存失败，请重试",
      icon: "none",
    });
  }
};
</script>

<style>
/* 全局样式 */
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 内容区 */
.content {
  padding: 30rpx;
  box-sizing: border-box;
}

/* 通用样式 */
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

/* 上传区域 */
.upload-section {
  background-color: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.upload-container {
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  padding: 60rpx 20rpx;
  text-align: center;
  transition: all 0.3s;
}

.border-primary {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.upload-icon {
  font-size: 80rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.upload-text {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.upload-hint {
  font-size: 24rpx;
  color: #999;
}

.selected-image-container {
  margin-top: 30rpx;
  position: relative;
}

.selected-image {
  width: 100%;
  border-radius: 12rpx;
  margin-top: 20rpx;
  border-radius: 4rpx;
}

.change-image-btn {
  position: absolute;
  top: 0;
  right: 15rpx;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  border: none;
  backdrop-filter: blur(5rpx);
}

/* 选项区域 */
.option-section {
  background-color: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.option-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20rpx;
}

@media (min-width: 500rpx) {
  .option-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.option-card {
  border: 2rpx solid #ddd;
  border-radius: 12rpx;
  padding: 25rpx;
  transition: all 0.3s;
}

.option-card.active {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.option-title {
  font-size: 28rpx;
  font-weight: bold;
}

.option-icon {
  width: 50rpx;
  height: 50rpx;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #3b82f6;
}

.option-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 15rpx;
}

.option-preview {
  display: grid;
  gap: 5rpx;
}

.grid-2x2 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.grid-3x3 {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.grid-item {
  background-color: #f5f5f5;
  border-radius: 5rpx;
  height: 25rpx;
}

.split-btn {
  color: #333;
  margin-top: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  background: linear-gradient(90deg, #3b82f6, #00ff7f);
  border: none;
  box-shadow: 0 4rpx 15rpx rgba(59, 130, 246, 0.2);
}

/* 结果区域 */
.result-section {
  background-color: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.result-item {
  text-align: center;
}

.result-image-container {
  position: relative;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.result-image {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 12rpx;
}

.download-btn {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  border: none;
  width: 45rpx;
  height: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  backdrop-filter: blur(5rpx);
}

.result-text {
  font-size: 24rpx;
  color: #666;
}

.download-all-btn {
  margin-top: 30rpx;
  height: 90rpx;
  font-size: 32rpx;
  background-color: #3b82f6;
  border: none;
}

/* 按钮样式 */
button {
  border-radius: 50rpx;
  font-weight: normal;
}

button::after {
  border: none;
}
</style>
