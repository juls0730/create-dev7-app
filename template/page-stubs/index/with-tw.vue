<template>
  <div
    className="w-screen min-h-screen flex flex-col justify-center items-center p-4 overflow-y-scroll"
  >
    <h2
      className="text-[3rem] lg:text-[5rem] md:text-[5rem] font-extrabold text-gray-700"
    >
      Create
      <span
        className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-600 to-rose-600"
        >Dev7</span
      >
      App
    </h2>
    <p className="text-2xl text-gray-700">This stack uses</p>
    <div
      className="grid grid-cols-1 grid-rows-3 lg:grid-rows-2 md:grid-rows-2 justify-center items-center lg:grid-cols-2 md:grid-cols-2 gap-3 mt-3 pt-3 w-full lg:w-2/3 md:w-full"
    >
      <Technology
        name="NuxtJS V3 RC"
        description="The Hybrid Vue Framework"
        documentation="https://v3.nuxtjs.org/"
      />
      <Technology
        name="TypeScript"
        description="Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale"
        documentation="https://www.typescriptlang.org/"
      />
      <Technology
        name="TailwindCSS"
        description="Rapidly build modern websites without ever leaving your HTML"
        documentation="https://tailwindcss.com/"
      />
    </div>
  </div>
</template>