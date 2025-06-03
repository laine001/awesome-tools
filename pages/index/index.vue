<template>
	<view class="home-page">
		<view class="nav-grid">
			<view v-for="(tool, index) in tools" :key="index" class="nav-card" @click="navigateToTool(tool.path)">
				<view class="tool-icon">{{ tool.icon }}</view>
				<view class="tool-detail">
					<text class="card-title">{{ tool.name }}</text>
					<!-- <text class="card-desc">{{ tool.desc }}</text> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	
	const tools = [
		{
			name: 'BMI计算',
			icon:'🙎‍',
			path: '/pages/bmi/bmi'
		},
		{
			name: 'Emoji大全',
			path: '/pages/emoji/emoji',
			icon: '😀',
			desc: '超全emoji表情，可复制'
		},
		{
			name: '吃啥呀',
			path: '/pages/eat-what/eat-what',
			icon: '🍔',
		},
		{
			name: '九宫格图片',
			path: '/pages/img-split/img-split',
			icon: '🤳',
		},
		{
			name: '石头剪刀布',
			path: '/pages/guessing/guessing',
			icon: '✊',
			desc: '超全emoji表情，可复制'
		},
		{
			name: '随机数生成',
			path: '/pages/random-num/random-num',
			icon: '🔢',
			desc: '超全emoji表情，可复制'
		}
	]
	onLoad(() => {
		const res = uni.getSystemInfoSync()
		if (res.theme === 'dark') {
			uni.setNavigationBarColor({
				backgroundColor: '#1a202c',
				frontColor:'#ffffff',
			})
		}
	})
	const navigateToTool = (path) => {
		uni.navigateTo({
			url: path
		})
	}
</script>

<style lang="scss">
	.home-page {
		background-color: #f8f8f8;
		padding: 40rpx;
		box-sizing: border-box;
		min-height: 100vh;
	}

	.nav-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 40rpx;
		margin: 0 auto;
	}
	.tool-icon {
		font-size: 28px;
	}

	.nav-card {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		background: rgba(255, 255, 255, 0.95);
		border: 2rpx solid rgba(0, 0, 0, 0.05);
		border-radius: 16px;
		min-height: 42px;
		padding: 10px 32rpx;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		&:active {
			background-color: rgba(255, 255, 255, 0.8);
		}
	}
	.tool-detail {
		display: flex;
		flex-direction: column;
	}
	.card-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #1a1a1a;
		position: relative;
		z-index: 1;
		letter-spacing: -0.5rpx;
	}
	
	.card-desc {
		font-size: 24rpx;
	}

	/* 夜间模式适配 */
	@media (prefers-color-scheme: dark) {
		.home-page {
			background: linear-gradient(160deg, #1a202c 0%, #2d3748 100%);
		}

		.nav-card {
			background: rgba(45, 55, 72, 0.95);
			border-color: rgba(255, 255, 255, 0.08);
			box-shadow:
				0 4rpx 16rpx rgba(0, 0, 0, 0.2),
				0 8rpx 32rpx rgba(0, 0, 0, 0.15);
		}

		.card-title {
			color: #e2e8f0;
		}

		.nav-card::before {
			background: linear-gradient(120deg, rgba(74, 85, 104, 0.3) 0%, transparent 100%);
		}
	}
</style>