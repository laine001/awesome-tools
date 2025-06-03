<template>
  <view class="container">
    <!-- 左侧玩家区域 -->
    <view class="player left">
      <img
        class="hand"
        :class="[leftAnimation]"
        :src="`/static/${leftChoice}.png`"
        v-show="leftChoice"
      />
      <button class="play-btn" @click="handlePlay('left')">玩家出拳</button>
    </view>

    <!-- 右侧玩家区域 -->
    <view class="player right">
      <img
        class="hand"
        :class="[rightAnimation]"
        :src="`/static/${rightChoice}.png`"
        v-show="rightChoice"
      />
      <button class="play-btn" @click="handlePlay('right')">对手出拳</button>
    </view>
    <view class="result-overlay" v-if="result">
      <view :class="['result-box', result]">
        <text class="result-icon">{{
          result === "draw" ? "🤝" : result === "win" ? "🎉" : "😭"
        }}</text>
        <text class="result-text">{{
          result === "draw"
            ? "平局！"
            : result === "win"
            ? "玩家胜利！"
            : "对手胜利！"
        }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const hands = ["rock", "paper", "scissors"];
const leftChoice = ref("rock");
const rightChoice = ref("rock");
const leftAnimation = ref("");
const rightAnimation = ref("");
const result = ref(""); // 结果状态：win/lose/draw
const leftFinished = ref(false);
const rightFinished = ref(false);
let intervalId = null;

const getRandomHand = () => hands[Math.floor(Math.random() * 3)];

const leftIntervalId = ref(null);
const rightIntervalId = ref(null);
const checkResult = () => {
  if (leftFinished.value && rightFinished.value) {
    const left = leftChoice.value;
    const right = rightChoice.value;

    if (left === right) {
      result.value = "draw";
    } else if (
      (left === "rock" && right === "scissors") ||
      (left === "scissors" && right === "paper") ||
      (left === "paper" && right === "rock")
    ) {
      result.value = "win";
    } else {
      result.value = "lose";
    }

    setTimeout(() => {
      result.value = "";
      leftFinished.value = false;
      rightFinished.value = false;
    }, 3000);
  }
};
const handlePlay = (player) => {
  // 独立控制左右侧动画
  if (player === "left") {
    if (leftIntervalId.value) {
      clearInterval(leftIntervalId.value);
      leftIntervalId.value = null;
    }
    leftAnimation.value = "animate";
  } else {
    if (rightIntervalId.value) {
      clearInterval(rightIntervalId.value);
      rightIntervalId.value = null;
    }
    rightAnimation.value = "animate";
  }

  let count = 0;
  let speed = 100;

  const interval = setInterval(() => {
    if (player === "left") {
      leftChoice.value = hands[count % 3];
    } else {
      rightChoice.value = hands[count % 3];
    }

    if (count++ > 5) {
      speed += 50;
      clearInterval(interval);
      const finalInterval = setInterval(() => {
        if (player === "left") {
          leftChoice.value = hands[Math.floor(Math.random() * 3)];
        } else {
          rightChoice.value = hands[Math.floor(Math.random() * 3)];
        }

        if (speed > 300) {
          clearInterval(finalInterval);

          // 添加胜负判断逻辑
          const left = leftChoice.value;
          const right = rightChoice.value;
          if (left === right) {
            result.value = "draw";
          } else if (
            (left === "rock" && right === "scissors") ||
            (left === "scissors" && right === "paper") ||
            (left === "paper" && right === "rock")
          ) {
            result.value = "win";
          } else {
            result.value = "lose";
          }
          // 3秒后隐藏结果
          setTimeout(() => {
            result.value = "";
          }, 3000);
          if (player === "left") {
            leftAnimation.value = "final";
            leftIntervalId.value = null;
            leftFinished.value = true;
            checkResult();
          } else {
            rightAnimation.value = "final";
            rightIntervalId.value = null;
            rightFinished.value = true;
            checkResult();
          }
        }
        speed += 50;
      }, speed);

      if (player === "left") {
        leftIntervalId.value = finalInterval;
      } else {
        rightIntervalId.value = finalInterval;
      }
    }
  }, speed);

  if (player === "left") {
    leftIntervalId.value = interval;
  } else {
    rightIntervalId.value = interval;
  }
};
</script>

<style>
.container {
  display: flex;
  height: 100vh;
}

.player {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.left {
  background-color: #e3f2fd; /* 淡蓝色背景 */
}

.right {
  background-color: #fce4ec; /* 淡粉色背景 */
}

.hand {
  width: 100px;
  height: 100px;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s;
}

/* 删除原有的.rock, .paper, .scissors样式 */
.hand.animate {
  opacity: 1;
  animation: shake 0.3s infinite;
}

.hand.final {
  animation: none !important;
  opacity: 1 !important;
}

/* .rock { background-image: url('/static/shitou.png'); }
.paper { background-image: url('/static/bu.png'); }
.scissors { background-image: url('/static/jiandao.png'); } */

.play-btn {
  position: absolute;
  bottom: 40px;
  height: 100rpx;
  line-height: 100rpx;
  padding: 0 24px;
  background-color: #fff;
  border-radius: 36rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.play-btn::after {
  border: none;
}
@keyframes shake {
  0% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(15deg);
  }
  100% {
    transform: rotate(-15deg);
  }
}

.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: rgba(0, 0, 0, 0.5); */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.5s;
}

.result-box {
  background: white;
  padding: 40rpx 60rpx;
  border-radius: 24rpx;
  text-align: center;
}

.result-box.win {
  background: #d4edda;
  border: 4rpx solid #28a745;
}

.result-box.lose {
  background: #f8d7da;
  border: 4rpx solid #dc3545;
}

.result-box.draw {
  background: #fff3cd;
  border: 4rpx solid #ffc107;
}

.result-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.result-text {
  font-size: 40rpx;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
