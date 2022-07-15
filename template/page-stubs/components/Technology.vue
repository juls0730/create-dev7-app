<template>
    <div className="hover:scale-105 cursor-pointer duration-500 flex flex-col justify-center items-center text-center rounded shadow-xl border-2 border-gray-500 h-full w-full p-6">
        <h2 className="text-lg text-gray-700">{{name}}</h2>
        <p className="text-sm text-gray-600">{{description}}</p>
        <a
          className="text-sm text-violet-500 underline decoration-dotted underline-offset-2 cursor-pointer mt-3"
          href={{documentation}}
          target="_blank"
          rel="noreferrer"
        >
          Documentation
        </a>
      </div>
</template>

<script lang="ts">
export default {
  props: ['name', 'description', 'documentation']
}
</script>
