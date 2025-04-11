document.addEventListener("DOMContentLoaded", function () {
    const bookDetailContainer = document.getElementById("book-detail-container");
    
    const pathSegments = window.location.pathname.split("/");
    const bookId = pathSegments[pathSegments.length - 1] || 7; 
    
    function fetchBookDetail() {
        fetch(`/api/book/${bookId}`)
            .then(response => response.json())
            .then(book => {
                renderBookDetail(book);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu sách:", error);
                bookDetailContainer.innerHTML = "<p class='text-danger text-center'>Không thể tải thông tin sách.</p>";
            });
    }

    function renderBookDetail(book) {
        let categories = book.Categories.map(cat => `<span class='badge badge-info me-1'>${cat.CategoryName}</span>`).join(" ");
        document.title = book.Title;

        let bookHtml = `<div class="row">
                            </div>
                            <div class="booksmedia-detail-box">
                                <div class="detailed-box">
                                    <div class="col-xs-12 col-sm-5 col-md-3">
                                        <div class="post-thumbnail">
                                            <img src="/${book.Image}"
                                                alt="Book Image">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-7 col-md-6">
                                        <div class="post-center-content">
                                            <h2>${book.Title}</h2>
                                            <p><strong>Author:</strong> ${book.Author}</p>
                                            <p><strong>Publisher:</strong> ${book.Publisher}</p>
                                            <p><strong>Categories: ${categories}</p>
                                            <div class="actions">
                                                <ul>
                                                    <li>
                                                        <a href="#" target="_blank" data-toggle="blog-tags"
                                                            data-placement="top" title=""
                                                            data-original-title="Add To Cart">
                                                            <i class="fa fa-shopping-cart"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" target="_blank" data-toggle="blog-tags"
                                                            data-placement="top" title="" data-original-title="Like">
                                                            <i class="fa fa-heart"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" target="_blank" data-toggle="blog-tags"
                                                            data-placement="top" title="" data-original-title="Mail">
                                                            <i class="fa fa-envelope"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" target="_blank" data-toggle="blog-tags"
                                                            data-placement="top" title="" data-original-title="Search">
                                                            <i class="fa fa-search"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" target="_blank" data-toggle="blog-tags"
                                                            data-placement="top" title="" data-original-title="Print">
                                                            <i class="fa fa-print"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" target="_blank" data-toggle="blog-tags"
                                                            data-placement="top" title="" data-original-title="Print">
                                                            <i class="fa fa-share-alt"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-3 ">
                                        <div class="post-right-content">
                                            <h4>Available now</h4>
                                            <p><strong>Stock:</strong> ${book.Stock}</p>
                                            ${book.Stock > 0 ? `
                                            <a href="#." class="btn btn-dark-gray">Borrow</a>` : `<a class="btn btn-dark-gray">Out of Stock</a> `}
                                            ${book.Status == 'true' ? 
                                                `<a href="/${book.File}" target="__blank" class="btn btn-dark-gray">View PDF</a>` : ''}
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                                <div class="clearfix"></div>
                            </div>`;
        
        bookDetailContainer.innerHTML = bookHtml;
    }

    fetchBookDetail();
});
