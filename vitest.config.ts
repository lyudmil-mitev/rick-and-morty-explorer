// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        /*
        // if the types are not picked up, add `vitest-browser-react` to
        // "compilerOptions.types" in your tsconfig or
        // import `vitest-browser-react` manually so TypeScript can pick it up
        setupFiles: ['vitest-browser-react'],
        browser: {
            name: 'chromium',
            enabled: true,
        },
        */
    },
})