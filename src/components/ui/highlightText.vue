<script lang="ts" setup>
  interface Props {
    text: string;
    highlight: string;
  }

  const props = defineProps<Props>();

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim() || highlight.trim().length < 3) {
      return [{ text, highlighted: false }];
    }
    
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts
      .filter(part => part !== '')
      .map(part => ({
        text: part,
        highlighted: new RegExp(`^${escapedHighlight}$`, 'i').test(part)
      }));
  };
</script>

<template>
  <span>
    <template v-for="(part, index) in getHighlightedText(text, highlight)" :key="index">
      <span 
        v-if="part.highlighted" 
        class="bg-orange text-white px-1"
      >
        {{ part.text }}
      </span>
      <span v-else>{{ part.text }}</span>
    </template>
  </span>
</template>
