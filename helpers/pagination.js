module.exports = ({query, limitItems, totalItems}) => {
  const currentPage = parseInt(query.page) || 1;
  const totalPages = Math.ceil(totalItems / limitItems);
  const startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
  const endPage = startPage + 4 < totalPages ? startPage + 4 : totalPages;
  const prevPage = currentPage - 1 > 0 ? currentPage - 1 : 1;
  const nextPage = currentPage + 1 < totalPages ? currentPage + 1 : totalPages;

  const skipItems = (currentPage - 1) * limitItems;

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push({
      value: i,
      isActive: i === currentPage
    });
  }

  return {
    currentPage,
    totalPages,
    prevPage,
    nextPage,
    startPage,
    endPage,
    pages,
    skipItems,
    limitItems
  };
}