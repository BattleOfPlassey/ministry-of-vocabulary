import React, { Component } from 'react'
import {
    
    Pagination,
    PaginationItem,
    PaginationLink,
  } from "reactstrap";

export class CustomPagination extends Component {
    render() {
        const { postsPerPage, totalPosts, paginate, nextPage, prevPage, currentPage } = this.props;

        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
            pageNumbers.push(i);
        }
       

        return (
            

            <Pagination
                className="pagination pagination-info justify-content-center"
                listClassName="pagination-info"
              >
                <PaginationItem  disabled={currentPage===1 ? true : false} >
                  <PaginationLink
                    aria-label="Previous"
                    href="#"
                    onClick={() => {prevPage();window.scrollTo(0, 0);}}
                  >
                    <span aria-hidden={true}>
                      <i
                        aria-hidden={true}
                        className="tim-icons icon-double-left"
                      />
                    </span>
                  </PaginationLink>
                </PaginationItem>
                {pageNumbers.map(num => (<PaginationItem className={currentPage==num   ? "active" : ""} key={num}>
                  <PaginationLink
                    href="#"
                    onClick={() => {paginate(num);window.scrollTo(0, 0);}}
                  >
                    {num}
                  </PaginationLink>
                </PaginationItem>))}
                
                <PaginationItem disabled={currentPage===pageNumbers.length ? true : false }>
                  <PaginationLink
                    aria-label="Next"
                    href="#"
                    onClick={() => {nextPage();window.scrollTo(0, 0);}}
                  >
                    <span aria-hidden={true}>
                      <i
                        aria-hidden={true}
                        className="tim-icons icon-double-right"
                      />
                    </span>
                  </PaginationLink>
                </PaginationItem>
              </Pagination>

        )
    }
}

export default CustomPagination