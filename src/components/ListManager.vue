<script setup lang="ts">
import { ref } from 'vue'
import { useListsStore } from '../stores/lists'

const listsStore = useListsStore()
const newListTitle = ref('')

const activeCls = 'bg-(--color-brand) text-white'
const inactiveCls = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
const btnBase = 'px-3 py-1 rounded-full text-sm font-medium transition-colors'

function listBtnClass(id: string | null) {
  return `${btnBase} ${listsStore.activeListId === id ? activeCls : inactiveCls}`
}

function createList() {
  const created = listsStore.createList(newListTitle.value)
  if (created) newListTitle.value = ''
}

function deleteList(id: string) {
  listsStore.deleteList(id)
}
</script>

<template>
  <div class="mb-4" data-testid="list-manager">
    <div class="flex flex-wrap gap-2 mb-3">
      <button
        type="button"
        :class="listBtnClass(null)"
        data-testid="list-btn-all"
        @click="listsStore.setActiveList(null)"
      >全部</button>

      <div v-for="list in listsStore.lists" :key="list.id" class="flex items-center gap-1">
        <button
          type="button"
          :class="listBtnClass(list.id)"
          :aria-label="'切换到列表：' + list.title"
          :aria-pressed="listsStore.activeListId === list.id"
          data-testid="list-btn"
          @click="listsStore.setActiveList(list.id)"
        >{{ list.title }}</button>

        <button
          type="button"
          class="w-4 h-4 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 text-xs transition-colors leading-none"
          :aria-label="'删除列表：' + list.title"
          data-testid="list-delete-btn"
          @click="deleteList(list.id)"
        >✕</button>
      </div>
    </div>

    <form class="flex gap-2" @submit.prevent="createList">
      <input
        v-model="newListTitle"
        type="text"
        placeholder="新列表名称…"
        aria-label="新列表名称"
        data-testid="list-name-input"
        class="flex-1 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-brand)"
      />
      <button
        type="submit"
        :disabled="!newListTitle.trim()"
        class="rounded bg-(--color-brand) px-3 py-1 text-white text-sm hover:bg-(--color-brand-hover) disabled:opacity-50"
        data-testid="list-create-btn"
      >新建</button>
    </form>
  </div>
</template>
