<template>
  <div>
    <h1>Create <span>Dev7</span> App</h1>
    <div>
      <h3>This stack uses:</h3>
      <ul>
        <li>
          <a href="https://v3.nuxtjs.org/" target="_blank" rel="noreferrer">
            NuxtJS V3 RC
          </a>
        </li>
        <li>
          <a href="https://trpc.io/" target="_blank" rel="noreferrer"> tRPC </a>
        </li>
        <li>
          <a
            href="https://www.typescriptlang.org/"
            target="_blank"
            rel="noreferrer"
          >
            TypeScript
          </a>
        </li>
      </ul>
    </div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error?.data?.code">Error: {{ error.data.code }}</div>
    <div v-else-if="data">
      {{ data.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
// trpc injection
</script>
