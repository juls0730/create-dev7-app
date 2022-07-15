import type { inferAsyncReturnType } from '@trpc/server'
import * as trpc from '@trpc/server'
import { z } from 'zod' //  yup/superstruct/zod/myzod/custom

export const router = trpc.router()
  .query('example.hello', {
    async resolve(req) {
      return {
        text: 'Hello World!'
      }
    },
  })