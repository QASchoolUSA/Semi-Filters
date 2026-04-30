import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    api: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4jrvr61',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    },
})
