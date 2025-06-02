<template>
	<view class="container">
		<view class="card" :class="{ shuffle: isShuffling }">
			<view class="food-name">{{ currentFood }}</view>
		</view>
		<view @click="shuffleFood" class="shuffle-btn">吃啥呀</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const foods = ref([
		"麻婆豆腐", "鱼香肉丝", "地三鲜（土豆、茄子、青椒）", "宫保鸡丁", "干煸豆角", "青椒炒肉", "番茄炒蛋", "酸菜鱼", "牛肉煲", "蒜蓉油麦菜", "豆角炒鸡蛋", "葱烧芋艿", "蒜苔炒牛肉",
		"干煸花菜", "口蘑蚕豆米炒肉丁", "韭菜炒猪心", "春笋炒虾仁", "海带炒肉丝", "豆豉肉末烧魔芋", "蒜薹炒龙利鱼", "木耳莴苣", "香葱蒜炒海蟹", "香葱脆丸鱼片", "香煎海杂鱼",
		"韭菜虾仁水蒸蛋", "砂锅焖腐肉", "排煎酿豆腐", "花生焖猪手", "排骨焖腐竹", "香焖猪手", "炸香酥肉", "青椒焖猪扒肉", "香炒五花肉", "五花肉香菇焖鱿鱼干", "洋芋叉叉", "双菇鸡蛋汤",
		"子姜鸭", "番茄土豆牛腩汤", "四季豆烧鸭子", "西兰花木耳炒虾仁", "茄汁鱼片汤", "春笋炒咸肉", "家常砂锅金针菇焖鱼", "家常茄汁鱼", "家常小葱煎豆腐", "家常版可乐烧鸡翅", "番茄牛肉汤",
		"清蒸鲈鱼", "鱼香茄子", "虾仁炒蛋"
	])

	const currentFood = ref('点击开始')
	const isShuffling = ref(false)

	const shuffleFood = () => {
		isShuffling.value = true
		let count = 0
		const shuffleInterval = setInterval(() => {
			currentFood.value = foods.value[Math.floor(Math.random() * foods.value.length)]
			if (++count === 10) {
				clearInterval(shuffleInterval)
				isShuffling.value = false
			}
		}, 100)
	}
</script>

<style scoped>
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #f5f5f5;
	}

	.card {
		width: 300px;
		height: 300px;
		background: white;
		border-radius: 20px;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.3s ease;
		margin-bottom: 30px;
	}

	.food-name {
		font-size: 32px;
		font-weight: bold;
		color: #333;
		transition: opacity 0.2s;
	}

	.shuffle {
		animation: cardShake 0.1s ease infinite;
	}

	.shuffle .food-name {
		opacity: 0.5;
	}

	@keyframes cardShake {
		0% {
			transform: rotate(0deg);
		}

		25% {
			transform: rotate(2deg);
		}

		50% {
			transform: rotate(0deg);
		}

		75% {
			transform: rotate(-2deg);
		}

		100% {
			transform: rotate(0deg);
		}
	}

	.shuffle-btn {
		padding: 15px 40px;
		font-size: 20px;
		background: #ff4757;
		color: white;
		border: none;
		border-radius: 30px;
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(255, 71, 87, 0.2);
		transition: transform 0.2s;
	}

	.shuffle-btn:active {
		transform: scale(0.95);
	}
</style>