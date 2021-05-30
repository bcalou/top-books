const Image = require('@11ty/eleventy-img');
const babel = require('eleventy-plugin-babel');
const sass = require('eleventy-plugin-sass');
const criticalCss = require('eleventy-critical-css');
const prod = process.env.ELEVENTY_ENV === 'prod';

module.exports = function (eleventyConfig) {
  eleventyConfig.addLiquidShortcode('bookImage', bookImage);

  eleventyConfig.addPlugin(babel, {
    watch: 'src/js/script.js',
    outputDir: '_site/js',
    uglify: prod,
  });

  eleventyConfig.addPlugin(sass, {
    watch: 'src/styles/**/*.scss',
    outputDir: '_site/css',
    cleanCSS: prod,
    sourcemaps: !prod,
  });

  if (prod) {
    eleventyConfig.addPlugin(criticalCss, {
      assetPaths: ['_site/index.html'],
      minify: true,
    });
  }

  eleventyConfig.addCollection('itemsAscending', (collection) =>
    collection.getFilteredByGlob('src/items/*.md').sort((a, b) => {
      if (a.data.title > b.data.title) return 1;
      else if (a.data.title < b.data.title) return -1;
      else return 0;
    })
  );
};

async function bookImage(book) {
  if (!book) return;

  const metadata = await Image(`src/img/${book.fileSlug}.jpg`, {
    widths: prod ? [350, 700, null] : [null],
    formats: prod ? ['avif', 'webp', 'jpeg'] : ['jpeg'],
    outputDir: '_site/img',
  });

  const url = metadata.jpeg[0].url;
  const sources = Object.values(metadata)
    .map((imageFormat) => getSourceTag(imageFormat))
    .join('\n');
  const alt = `Couverture de ${book.data.title}`;

  return `<picture class="book__cover">
    ${sources}
    <img src="${url}" alt="${alt}" loading="lazy" decoding="async" />
  </picture>`;
}

function getSourceTag(imageFormat) {
  const srcset = imageFormat
    .filter((format) => format.width <= 700)
    .map((entry) => entry.srcset)
    .join(', ');

  return `<source
    type="${imageFormat[0].sourceType}"
    srcset="${srcset}"
    sizes="(min-width: 32em) 21.875rem, 15.625rem">`;
}
