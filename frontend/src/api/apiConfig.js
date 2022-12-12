const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3/',
    apiKey: '9f2a3988c718c8c5d0b1ff4058098104',
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
}

export default apiConfig;