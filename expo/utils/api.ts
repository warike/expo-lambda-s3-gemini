import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
    const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

    // if (process.env.NODE_ENV === 'development') {
    //     const experienceUrl = Constants.experienceUrl;
    //     const hostUri = Constants.expoConfig?.hostUri;

    //     if (experienceUrl) {
    //         // Check if using tunnel mode (contains .ngrok or similar tunnel domains)
    //         const isTunnel = experienceUrl.includes('.ngrok') ||
    //             experienceUrl.includes('tunnel') ||
    //             experienceUrl.includes('.trycloudflare.com') ||
    //             experienceUrl.includes('.loca.lt') ||
    //             experienceUrl.includes('.exp.direct');

    //         // Use https for tunnel, http for local
    //         const protocol = isTunnel ? 'https://' : 'http://';
    //         const origin = experienceUrl.replace('exp://', protocol);
    //         return origin.concat(path);
    //     }

    //     if (hostUri) {
    //         // Check if hostUri is a tunnel URL
    //         const isTunnel = hostUri.includes('.ngrok') ||
    //             hostUri.includes('tunnel') ||
    //             hostUri.includes('.trycloudflare.com') ||
    //             hostUri.includes('.loca.lt') ||
    //             hostUri.includes('.exp.direct');

    //         const protocol = isTunnel ? 'https://' : 'http://';
    //         return `${protocol}${hostUri}`.concat(path);
    //     }

    //     // Fallback for local development if everything else fails
    //     if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    //         return `http://localhost:8081${path}`;
    //     }
    // }

    if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
        throw new Error(
            'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',
        );
    }
    const url = process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
    return url;
};