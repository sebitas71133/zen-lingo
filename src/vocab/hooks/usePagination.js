import React, { useMemo, useState } from "react";

export const usePagination = (dataArray = [], pageSize = 2) => {
  const [page, setPage] = useState(1);

  pageSize = Number(pageSize);

  const totalPages = Math.ceil(dataArray.length / pageSize);

  const currentPageData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;

    const array = dataArray.slice(startIndex, startIndex + pageSize);

    return array;
  }, [dataArray, page, pageSize]);
  return {
    page,
    setPage,
    totalPages,
    currentPageData,
  };
};
