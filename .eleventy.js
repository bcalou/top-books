const Image = require('@11ty/eleventy-img');

async function bookImage(book) {
  if (!book) return;

  let metadata = await Image(`src/img/${book.fileSlug}.jpg`, {
    widths: [350, 700, null],
    formats: ['avif', 'webp', 'jpeg'],
    outputDir: '_site/img',
  });

  let lowsrc = metadata.jpeg[0];

  return `<picture>
    ${Object.values(metadata)
      .map((imageFormat) => {
        return `<source type="${
          imageFormat[0].sourceType
        }" srcset="${imageFormat
          .filter((format) => format.width <= 700)
          .map((entry) => entry.srcset)
          .join(', ')}" sizes="(min-width: 32em) 21.875rem, 15.625rem">`;
      })
      .join('\n')}
      <img
        class="book__cover"
        src="${lowsrc.url}"
        alt="Couverture de ${book.data.title}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addLiquidShortcode('bookImage', bookImage);

  eleventyConfig.addCollection('itemsAscending', (collection) =>
    collection.getFilteredByGlob('src/items/*.md').sort((a, b) => {
      if (a.data.title > b.data.title) return 1;
      else if (a.data.title < b.data.title) return -1;
      else return 0;
    })
  );
};
