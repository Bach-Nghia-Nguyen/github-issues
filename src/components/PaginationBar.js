import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationBar = ({ pageNum, setPageNum, totalPageNum }) => {
  const handleClickOnFirst = () => {
    setPageNum(1);
  };

  const handleClickOnPrev = () => {
    if (pageNum > 1) setPageNum((num) => num - 1);
  };

  const handleClickOnPage = (page) => {
    setPageNum(page);
  };

  const handleClickOnLast = () => {
    setPageNum(totalPageNum);
  };

  const handleClickOnNext = () => {
    if (pageNum < totalPageNum) setPageNum((num) => num + 1);
  };

  return (
    <div className="d-flex flex-row justify-content-center align-items-center">
      <Pagination className="mt-4 mb-4">
        <Pagination.First
          disabled={pageNum === 1}
          onClick={handleClickOnFirst}
        />

        <Pagination.Prev disabled={pageNum === 1} onClick={handleClickOnPrev} />

        <Pagination.Item
          active={pageNum === 1}
          onClick={() => handleClickOnPage(1)}
        >
          {1}
        </Pagination.Item>

        {pageNum > 2 && <Pagination.Ellipsis />}

        {pageNum > 1 && pageNum < totalPageNum && (
          <Pagination.Item active>{pageNum}</Pagination.Item>
        )}

        {pageNum < totalPageNum - 1 && <Pagination.Ellipsis />}

        {totalPageNum > 1 && (
          <Pagination.Item
            active={pageNum === totalPageNum}
            onClick={() => handleClickOnPage(totalPageNum)}
          >
            {totalPageNum}
          </Pagination.Item>
        )}

        <Pagination.Next
          disabled={pageNum === totalPageNum}
          onClick={handleClickOnNext}
        />

        <Pagination.Last
          disabled={pageNum === totalPageNum}
          onClick={handleClickOnLast}
        />
      </Pagination>
    </div>
  );
};

export default PaginationBar;
