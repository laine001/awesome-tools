<template>
	<view class="emoji-container">
		<input type="text" class="emoji-search" v-model="searchQuery" />

		<!-- 分组展示 -->
		<view v-for="(group, index) in filteredGroups" :key="index" class="group">
			<view class="group-title">{{ group.groupTitle }}</view>
			<view class="emoji-grid">
				<view v-for="(item, idx) in group.items" :key="idx" class="emoji-item" :class="{ 'highlight-border': item.isMatch }" @click="copyEmoji(item.emoji)">
					{{ item.emoji }}
					<view class="tooltip" v-show="showTooltip === idx">
						{{ item.desc }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	// import { useMessage } from 'naive-ui'
	import emojiData from "./data.json";
	// const message = useMessage()
	const searchQuery = ref('')
	const showTooltip = ref(false)
	// Emoji分类数据
	const emojiGroups = ref(emojiData);
	// 搜索功能
	const filteredGroups = computed(() => {
	  const query = searchQuery.value.toLowerCase();
	  if (!query) return emojiGroups.value;
	
	  return emojiGroups.value
	    .map((group) => {
	      // 直接过滤出匹配项
	      const items = group.items
	        .filter(item => 
	          item.desc.toLowerCase().includes(query) || 
	          item.emoji.includes(query)
	        )
	        .map(item => ({...item, isMatch: true}));
	
	      return {
	        ...group,
	        items: items,
	        hasMatch: items.length > 0
	      };
	    })
	    .filter(group => group.hasMatch);
	});
	const copyEmoji = (emoji) => {
		uni.setClipboardData({
			data: emoji,
			success: function() {
				uni.showToast({
					title: '复制成功',
					duration: 2000
				});
			}
		});
		// navigator.clipboard.writeText(emoji);
		// .then(() => message.success(`已复制 ${emoji}`))
		// .catch(() => message.error('复制失败，请手动选择'))
	};
</script>

<style scoped>
	.emoji-search {
		position: fixed;
		top: 0;
		left: 11px;
		right: 12px;
		border: 1rpx solid #999;
		padding: 8px;
		border-radius: 6px;
		margin-bottom: 14px;
		margin-top: 14px;
		z-index: 1;
		background-color: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(6px);
	}

	.emoji-container {
		/* max-width: 800px; */
		/* margin: 2rem auto; */
		padding: 1rem;
		padding-top: 70px;
	}

	.group {
		margin-bottom: 2rem;
	}

	.group-title {
		color: #333;
		font-size: 1.1rem;
		margin-bottom: 1rem;
		padding-left: 0.5rem;
		border-left: 4px solid green;
	}

	.emoji-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
		gap: 1rem;
	}

	.emoji-item {
		font-size: 2rem;
		cursor: pointer;
		text-align: center;
		padding: 0.5rem;
		border-radius: 8px;
		transition: all 0.2s;
		background: #dedede;
	}

	/* .emoji-item:hover {
  transform: scale(1.2);
  background: green;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
} */

	@media (max-width: 640px) {
		.emoji-grid {
			grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
		}

		.emoji-item {
			font-size: 1.5rem;
		}
	}

	.search-box {
		margin-bottom: 2rem;
		max-width: 400px;
	}

	.tooltip {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 6px 12px;
		border-radius: 4px;
		font-size: 12px;
		white-space: nowrap;
		pointer-events: none;
		transition: opacity 0.2s;
	}

	.emoji-item {
		position: relative;
	}
	
	.highlight-border {
	  border: 2px solid #06aa06;
	  box-shadow: 0 2px 6px rgba(255, 68, 68, 0.2);
	}

</style>