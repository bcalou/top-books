module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection('booksAscending', (collection) =>
    collection.getFilteredByGlob('books/*.md').sort((a, b) => {
      if (a.data.title > b.data.title) return 1;
      else if (a.data.title < b.data.title) return -1;
      else return 0;
    }),
  );

  eleventyConfig.addCollection('albumsAscending', (collection) =>
    collection.getFilteredByGlob('albums/*.md').sort((a, b) => {
      if (a.data.title > b.data.title) return 1;
      else if (a.data.title < b.data.title) return -1;
      else return 0;
    }),
  );

  eleventyConfig.addCollection('moviesAscending', (collection) =>
    collection.getFilteredByGlob('movies/*.md').sort((a, b) => {
      if (a.data.title > b.data.title) return 1;
      else if (a.data.title < b.data.title) return -1;
      else return 0;
    }),
  );
};
