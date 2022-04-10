const Image = require('@11ty/eleventy-img');
const babel = require('eleventy-plugin-babel');
const criticalCss = require('eleventy-critical-css');
const prod = process.env.ELEVENTY_ENV === 'prod';
const eleventySass = require("eleventy-sass");
const path = require("path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addLiquidShortcode('bookImage', bookImage);
  eleventyConfig.addLiquidFilter("addNbsp", addNbsp);

  eleventyConfig.addPlugin(babel, {
    watch: 'src/js/script.js',
    outputDir: '_site/js',
    uglify: prod,
  });

  eleventyConfig.addPlugin(eleventySass, {
    compileOptions: {
      permalink: function(contents, inputPath) {
        return path.format({
          dir: "css",
          name: path.basename(inputPath, path.extname(inputPath)),
          ext: ".css"
        });
      }
    }
  });

  if (prod) {
    eleventyConfig.addPlugin(criticalCss, {
      assetPaths: ['_site/index.html']
    });
  }

  // {
  //   2020: [item1, item2...],
  //   2021: [item1, item2...]
  // }
  eleventyConfig.addCollection('itemsAscendingByYear', (collection) => {
    const items = {};
    for (year = 2020; year < new Date().getFullYear(); year++) {
      const yearItems = collection.getFilteredByGlob(`src/items/${year}/*.md`);
      items[year] = yearItems.sort(sortItems)
    }
    return items;
  });

  // [2020, 2021...]
  eleventyConfig.addCollection('years', (collection) => {
    const years = [];
    collection.getFilteredByGlob(`src/items/**/*.md`).forEach(item => {
      const year = parseInt(item.inputPath.match(/[0-9]{4}/)[0]);
      if (!years.includes(year)) {
        years.push(year);
      }
    });
    return years.sort().reverse();
  })
};

// Alphabetically sort items
function sortItems(a, b) {
  aTitle = getSortingKey(a.data.title);
  bTitle = getSortingKey(b.data.title);
  if (aTitle > bTitle) return 1;
  else if (aTitle < bTitle) return -1;
  else return 0;
}

// Remove prefixes (les, la...) from title to get a better sorting key
function getSortingKey(title) {
  return title
    .replace(/^(Les?|La|L')\s?/, '') // Remove Le, Les, La, L'
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
}

// Generate a book image with <picture> tag
async function bookImage(book) {
  if (!book) return;

  const images = await Image(`src/img/${book.fileSlug}.jpg`, {
    widths: prod ? [350, 700, null] : [null],
    formats: prod ? ['avif', 'webp', 'jpeg'] : ['jpeg'],
    outputDir: '_site/img',
  });

  const url = images.jpeg[0].url;
  const sources = Object.values(images)
    .map((imageFormat) => getSourceTag(imageFormat))
    .join('\n');
  const alt = `Couverture de ${book.data.title}`;

  return `<picture class="book__cover">
    ${sources}
    <img src="${url}" alt="${alt}" loading="lazy" decoding="async" />
  </picture>`;
}

// Generate a <source> tag for the given image format
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

// Add non breakable spaces where necessary
function addNbsp(text) {
  if (!text) {
    return undefined;
  }

  return text
    .replace(new RegExp(/\s\!/, 'g'), '&nbsp;!')
    .replace(new RegExp(/\s\?/, 'g'), '&nbsp;?')
    .replace(new RegExp(/\s\:/, 'g'), '&nbsp;:')
}
