import { defineConfig } from "@langwatch/scenario";
import { google } from "@ai-sdk/google";

export default defineConfig({
    defaultModel: {
        model: google("gemini-2.5-flash"),
    },
});