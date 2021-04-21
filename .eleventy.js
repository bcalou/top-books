module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection('itemsAscending', (collection) =>
    collection.getFilteredByGlob('src/items/*.md').sort((a, b) => {
      if (a.data.title > b.data.title) return 1;
      else if (a.data.title < b.data.title) return -1;
      else return 0;
    })
  );
};
