<template>
  <view class="bmi-page">
    <view>BMI 计算器</view>
    
    <!-- 新增渐变色条 -->
    <view class="bmi-scale">
      <view class="gradient-bar"></view>
      <view class="scale-labels">
        <view>过轻</view>
        <view>健康</view>
        <view>超重</view>
        <view>肥胖</view>
      </view>
      <view
				v-if="bmi !== null"
        class="indicator" 
        :style="{ left: indicatorPosition + '%' }"
        :class="resultClass"
      ></view>
    </view>

<view class="bmi-form">
	
<!--    <view class="input-group">
      <label>性别：</label>
     <select v-model="gender" class="input">
        <option value="male">男性</option>
        <option value="female">女性</option>
      </select>
    </view> -->

    <view class="input-group">
      <label>♎体重 (kg)：</label>
      <input 
        type="number" 
        v-model="weight" 
        class="input"
        min="30"
        max="200"
      >
    </view>

    <view class="input-group">
      <label>📏身高 (cm)：</label>
      <input
        type="number"
        v-model="height"
        class="input"
        min="100"
        max="250"
      >
    </view>

    <view @click="calculateBMI" class="calculate-btn">立即计算</view>
</view>
    <view v-if="bmi !== null" class="result">
      <view>您的BMI：{{ bmi.toFixed(1) }}</view>
      <view>正常范围：18.5 - 24.9</view>
      <view :class="resultClass">健康状态：{{ status }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const gender = ref('male')
const weight = ref(null)
const height = ref(null)
const bmi = ref(null)

const status = computed(() => {
	console.log(bmi.value, 'bmi.value')
  if (!bmi.value) return ''
  if (bmi.value < 18.5) return '体重过轻'
  if (bmi.value <= 24.9) return '健康体重'
  if (bmi.value <= 29.9) return '超重'
  return '肥胖'
})

const resultClass = computed(() => {
  const value = bmi.value;
  if (value < 18.5) return 'underweight';
  if (value <= 24.9) return 'healthy';
  if (value <= 29.9) return 'overweight';
  return 'obese';
});

const calculateBMI = () => {
  if (!weight.value || !height.value) return
  const heightInMeter = height.value / 100
  bmi.value = weight.value / (heightInMeter * heightInMeter)
}

// 新增计算属性
const indicatorPosition = computed(() => {
  if (!bmi.value) return 0;
  // 修正计算逻辑，基于WHO标准BMI范围
  const maxBMI = 35; // 最大显示范围设为35
  const clampedBMI = Math.min(Math.max(bmi.value, 15), maxBMI);
  return ((clampedBMI - 15) / (maxBMI - 15)) * 100;
});
</script>

<style lang="scss" scoped>
.bmi-page {
	margin: 15px;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.bmi-scale {
  margin: 20px 0 30px;
  position: relative;
}

.gradient-bar {
  height: 10px;
  background: linear-gradient(
    90deg,
    #FAAD14 0%,
    #52c41a 30%,
    #faad14 60%,
    #ff4d4f 100%
  );
  border-radius: 5px;
}
.underweight { color: #FAAD14; }
.healthy { color: #52c41a; }
.overweight { color: #faad14; }
.obese { color: #ff4d4f; }
.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: #666;
  font-size: 12px;
}

.indicator {
  position: absolute;
  top: -5px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 10px solid currentColor;
  transform: translateX(-50%);
  transition: left 0.3s ease;
}


.bmi-form {
	display: flex;
	flex-direction: column;
	gap: 18px;
	.input-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
		label {
			color: #444;
			font-size: 14px;
		}
	}
}
/* 优化输入框样式 */
.input {
  padding: 10px 14px;
  border: 2px solid #efefef;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #2d3748;
}

.input:focus {
  border-color: #00aa00;
  /* box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2); */
}

.calculate-btn {
	width: 100%;
	height: 46px;
	line-height: 46px;
	text-align: center;
	background: #efefef;
	border-radius: 12px;
	transition: all 0.26s;
	border: none;
	outline: none;
}

.calculate-btn:active {
  background: #efefef;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 10, 10, 0.1);
}

.result {
	display: flex;
	flex-direction: column;
	gap: 6px;
	color: #222;
	font-size: 14px;
	margin-top: 15px;
}
</style>