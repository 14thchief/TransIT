import useGetWindowDimension from "src/hooks/useGetWindowDimension";
import styles from "./_styles.module.scss";
import { ArrowLeft, ArrowRight } from "src/assets/icons/icons";

type TableFooterProps = {
  getCanPreviousPage: () => boolean;
  getCanNextPage: () => boolean;
  previousPage: () => void;
  nextPage: () => void;
  setPageIndex: (page: number) => void;
  pageIndex: number;
  setPageSize: (page: number) => void;
  pageSize: number;
  getPageCount: () => number;
};

const TableFooter = ({
  getCanPreviousPage,
  getCanNextPage,
  previousPage,
  nextPage,
  setPageIndex,
  pageIndex,
  setPageSize,
  pageSize,
  getPageCount,
}: TableFooterProps) => {
  const { isMobile } = useGetWindowDimension();

  function generatePagination(page:number, countPages:number) {
    let outOfRange = false;
    const pagination = [];
    const condition = page+1 <= 3;
    const endCondition = page+1 >= countPages - 3;

    if (countPages <= 6) {
      for (let i=1; i<=countPages; i++) {
        pagination.push(i);
      }

      return pagination;
    }

    for (let i = 1; i <= countPages; i++) {
        if (i <= (condition? 4 : 1) || i >= countPages- (endCondition? 2 : 0) || i - page+1 == 1 || i=== page+1|| i - page == 2 ) {
            // Page number should be added to the pagination string as before
            outOfRange = false;
            pagination.push(i)
        } else {
            // We are out of range! If not already out of range, add ellipsis
            if (!outOfRange) {
                pagination.push(' ... ');
            }
            outOfRange = true;
        }
    }

    return pagination;
  }

  function handleSetPageIndex(index:number) {
    
    if (index && index <= getPageCount()) {
      setPageIndex(index-1);
    } else {
      setPageIndex(getPageCount()-1);
    }
  }

  function handleSetPageSize(number:number) {
    setPageIndex(0);
    setPageSize(number);
  }

  const pagination = generatePagination(pageIndex, getPageCount());

  return (
    <div className={styles.table_footer}>
      <section className={styles.left}>
        {/* <ul>
          <li>You are on page number: {pageIndex + 1}</li>
          <li>Total pages: {getPageCount()}</li>
        </ul> */}
        <label>
          Page
          <input
            type="number"
            min={1}
            value={pageIndex + 1}
            
            onChange={(e) => handleSetPageIndex(Number(e.target.value))}
            max={getPageCount()}
          />
          of {getPageCount()}
        </label>

        <label>
          Page Size: 
          <select
            value={pageSize}
            onChange={(e) => handleSetPageSize(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((pageSizeEl) => {
              return (
                <option key={pageSizeEl} value={pageSizeEl}>
                  {pageSizeEl}
                </option>
              );
            })}
          </select>
        </label>
      </section>
      <section className={styles.right}>
        <button onClick={() => previousPage()} className={styles.navButton} disabled={!getCanPreviousPage()}>
          {isMobile? <ArrowLeft size={24} /> : "Previous"}
        </button>
        <div className={styles.pageIndiceContainer}>
        {
          pagination?.map((item, i)=> {

            if (typeof item === 'string') {
              return <p key={i}>{item}</p>
            }

            return <button key={i} onClick={()=> setPageIndex(item-1)} className={item === pageIndex+1? styles.activeIndex : styles.pageIndex}>{item}</button>
          })
        }
        </div>
        <button onClick={() => nextPage()} className={styles.navButton} disabled={!getCanNextPage()}>
          {isMobile? <ArrowRight size={24} /> : "Next"}
        </button>
      </section>
    </div>
  );
};
export default TableFooter;
