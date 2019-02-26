import browsersync from 'rollup-plugin-browsersync';
 
export default {
  input: './src/components.js',
  output: {
    file: './dist/bundle.js',
    format: 'esm',
  },
  plugins: [
    browsersync({
      server: 'dist',
      files: ['./dist'],
    }),
  ],
};
