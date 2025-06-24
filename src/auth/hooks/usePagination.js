import React, { useMemo, useState } from "react";

export const usePagination = (dataArray = [], pageSize = 10) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(dataArray.length / pageSize);

  const currentPageData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return dataArray.slice(startIndex, startIndex + pageSize);
  }, [dataArray, page, pageSize]);
  return {
    page,
    setPage,
    totalPages,
    currentPageData,
  };
};
