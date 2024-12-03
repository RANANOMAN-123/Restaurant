const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@layouts': path.resolve(__dirname, 'src/components/Layout')
    },
  },
};
