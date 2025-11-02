import { defineMiddleware } from "astro:middleware";


export const onRequest = defineMiddleware(
    async(context, next) => {
        const { url } = context
        const pathname = url.pathname
      
        return next()
    }
)