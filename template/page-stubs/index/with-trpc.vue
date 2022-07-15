<template>
  <div>
    <h1>Create <span>Dev7</span> App</h1>

    <div>
      <h3>This stack uses:</h3>
      <ul>
        <li>
          <a href="https://nextjs.org" target="_blank" rel="noreferrer">
            Next.js
          </a>
        </li>
        <li>
          <a href="https://trpc.io" target="_blank" rel="noreferrer"> tRPC </a>
        </li>
        <li>
          <a href="https://typescriptlang.org" target="_blank" rel="noreferrer">
            TypeScript
          </a>
        </li>
      </ul>

      <div>
        <div v-if="pending">Loading...</div>
        <div v-else-if="error?.data?.code">Error: {{ error.data.code }}</div>
        <div v-else-if="data">
          {{ data.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const client = useClient();

const {
  data: data,
  pending,
  error,
  refresh,
} = await useAsyncQuery(["example.hello"]);
</script>
