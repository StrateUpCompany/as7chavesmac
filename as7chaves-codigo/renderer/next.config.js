/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  },
  // Desabilitar rotas dinâmicas para exportação estática
  trailingSlash: true,
};

module.exports = nextConfig;
