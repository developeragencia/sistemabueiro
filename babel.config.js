module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: [
          '> 0.5%',
          'last 2 versions',
          'not dead',
          'not IE 11'
        ]
      },
      useBuiltIns: 'usage',
      corejs: 3
    }]
  ],
  plugins: ['@babel/plugin-transform-runtime']
}; 