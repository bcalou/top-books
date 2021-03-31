module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection('booksAscending', (collection) =>
    collection.getFilteredByGlob('src/books/*.md').sort((a, b) => {
      if (a.data.title > b.data.title) return 1;
      else if (a.data.title < b.data.title) return -1;
      else return 0;
    })
  );
};
