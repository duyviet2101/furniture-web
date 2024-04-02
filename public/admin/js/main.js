(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav : false
    });


    // Worldwide Sales Chart
    var ctx1 = $("#worldwide-sales").get(0)?.getContext("2d");
    if (ctx1) {
        var myChart1 = new Chart(ctx1, {
            type: "bar",
            data: {
                labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
                datasets: [{
                        label: "USA",
                        data: [15, 30, 55, 65, 60, 80, 95],
                        backgroundColor: "rgba(0, 156, 255, .7)"
                    },
                    {
                        label: "UK",
                        data: [8, 35, 40, 60, 70, 55, 75],
                        backgroundColor: "rgba(0, 156, 255, .5)"
                    },
                    {
                        label: "AU",
                        data: [12, 25, 45, 55, 65, 70, 60],
                        backgroundColor: "rgba(0, 156, 255, .3)"
                    }
                ]
            },
            options: {
                responsive: true
            }
        });
    }


    // Salse & Revenue Chart
    var ctx2 = $("#salse-revenue").get(0)?.getContext("2d");
    if (ctx2) {
        var myChart2 = new Chart(ctx2, {
            type: "line",
            data: {
                labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
                datasets: [{
                        label: "Salse",
                        data: [15, 30, 55, 45, 70, 65, 85],
                        backgroundColor: "rgba(0, 156, 255, .5)",
                        fill: true
                    },
                    {
                        label: "Revenue",
                        data: [99, 135, 170, 130, 190, 180, 270],
                        backgroundColor: "rgba(0, 156, 255, .3)",
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true
            }
        });
    }
    


    // Single Line Chart
    // var ctx3 = $("#line-chart").get(0).getContext("2d");
    // var myChart3 = new Chart(ctx3, {
    //     type: "line",
    //     data: {
    //         labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
    //         datasets: [{
    //             label: "Salse",
    //             fill: false,
    //             backgroundColor: "rgba(0, 156, 255, .3)",
    //             data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // Single Bar Chart
    // var ctx4 = $("#bar-chart").get(0).getContext("2d");
    // var myChart4 = new Chart(ctx4, {
    //     type: "bar",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(0, 156, 255, .7)",
    //                 "rgba(0, 156, 255, .6)",
    //                 "rgba(0, 156, 255, .5)",
    //                 "rgba(0, 156, 255, .4)",
    //                 "rgba(0, 156, 255, .3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // Pie Chart
    // var ctx5 = $("#pie-chart").get(0).getContext("2d");
    // var myChart5 = new Chart(ctx5, {
    //     type: "pie",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(0, 156, 255, .7)",
    //                 "rgba(0, 156, 255, .6)",
    //                 "rgba(0, 156, 255, .5)",
    //                 "rgba(0, 156, 255, .4)",
    //                 "rgba(0, 156, 255, .3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // Doughnut Chart
    // var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    // var myChart6 = new Chart(ctx6, {
    //     type: "doughnut",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(0, 156, 255, .7)",
    //                 "rgba(0, 156, 255, .6)",
    //                 "rgba(0, 156, 255, .5)",
    //                 "rgba(0, 156, 255, .4)",
    //                 "rgba(0, 156, 255, .3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });

    
})(jQuery);

//! signin
const signInForm = document.querySelector('.signInForm');
if (signInForm) {
    const alert = document.querySelector('.alert');

    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert.innerHTML = '';
        if (!email.value.trim() || !password.value.trim()) {
            alert.innerHTML = 'Vui lòng nhập đầy đủ thông tin';
            alert.style.display = 'block';
            setTimeout(() => {
                alert.style.display = 'none';
            }, 3000);
            return;
        }
        signInForm.action = '/admin/auth/login';
        signInForm.submit();
    });
}
//! end signin

//! preview single image
const uploadSingleImage = document.querySelector('.upload-single-image');
if (uploadSingleImage) {
    const input = document.querySelector('.upload-single-image input[type="file"]');
    const preview = document.querySelector('.upload-single-image .preview');
    input.addEventListener('change', async (e) => {
        preview.innerHTML = '';
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result;
            img.classList.add('img-fluid', 'm-2');
            preview.appendChild(img);
        }
        reader.readAsDataURL(file);
    });
}
//! end preview single image

//! preview multiple images
const uploadMultipleImages = document.querySelector('.upload-multiple-images');
if (uploadMultipleImages) {
    const input = document.querySelector('.upload-multiple-images input[type="file"]');
    const preview = document.querySelector('.upload-multiple-images .preview');
    const label = document.querySelector('.upload-multiple-images label');

    input.addEventListener('change', async (e) => {
        preview.innerHTML = '';
        const files = e.target.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = document.createElement('img');
                img.src = reader.result;
                img.classList.add('img-fluid', 'm-2');
                preview.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
        if (files.length > 0) {
            label.innerHTML = `${files.length} files selected`;
        } else {
            label.innerHTML = 'Thêm ảnh mới';
        }
    });
}
//! end preview multiple images

//! edit current images
const currentImages = document.querySelectorAll('.current-image');
if (currentImages && currentImages.length > 0) {
    currentImages.forEach(image => {
        const btnDelete = image.querySelector('.btnDeleteImage');
        
        btnDelete.addEventListener('click', () => {
            image.remove();
        });
    });
}
//! end edit current images

//! currency converter
var currencyInput = document.querySelectorAll( 'input[type="currency"]' );

for ( var i = 0; i < currencyInput.length; i++ ) {

    var currency = 'VND'
    onBlur( {
        target: currencyInput[ i ]
    } )

    currencyInput[ i ].addEventListener( 'focus', onFocus )
    currencyInput[ i ].addEventListener( 'blur', onBlur )

    function localStringToNumber( s ) {
        return Number( String( s ).replace( /[^0-9.-]+/g, "" ) )
    }

    function onFocus( e ) {
        var value = e.target.value;
        e.target.value = value ? localStringToNumber( value ) : ''
    }

    function onBlur( e ) {
        var value = e.target.value

        var options = {
            maximumFractionDigits: 2,
            currency: currency,
            style: "currency",
            currencyDisplay: "symbol"
        }

        e.target.value = ( value || value === 0 ) ?
            localStringToNumber( value ).toLocaleString( undefined, options ) : ''
    }
}
//! end currency converter

//! show alert
const showAlert = () => {
    const alert = document.querySelector("[show-alert]");
    if (alert) {
        const time = parseInt(alert.getAttribute("data-time")) || 3000;
        const closeAlert = alert.querySelector("[close-alert]");
    
        setTimeout(() => {
            alert.classList.add("alert-hidden")
        }, time);
    
        closeAlert.addEventListener("click", () => {
            alert.classList.add("alert-hidden")
        })
    }
}
showAlert();

//! end show alert

//! pagination
const btnsPagination = document.querySelectorAll('[button-page]');
if (btnsPagination && btnsPagination.length > 0) {

    const url = new URL(window.location.href);
    
    btnsPagination.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const page = btn.getAttribute('button-page');
            
            url.searchParams.set('page', page);
            window.location.href = url.href;
        });
    });
}
//! end pagination

//! sort
const sort = document.querySelector('[sort]');
if (sort) {
    const url = new URL(window.location.href);
    const sortSubmit = sort.querySelector('[sort-submit]');
    const sortBy = sort.querySelector('#sortBy');
    const sortValue = sort.querySelector('#sortValue');

    sortSubmit.addEventListener('click', async (e) => {
        if (!sortBy.value.trim() || !sortValue.value.trim()) {
            return;
        }
        url.searchParams.set('sortBy', sortBy.value);
        url.searchParams.set('sortValue', sortValue.value);
        window.location.href = url.href;
    })

    const sortReset = sort.querySelector('[sort-reset]');
    sortReset.addEventListener('click', async (e) => {
        url.searchParams.delete('sortBy');
        url.searchParams.delete('sortValue');
        window.location.href = url.href;

        sortBy.value = '';
        sortValue.value = '';
    });
}
//! end sort

//! search
const search = document.querySelector('[search]');
if (search) {
    const url = new URL(window.location.href);
    const searchSubmit = search.querySelector('[search-submit]');
    const searchInput = search.querySelector('#searchInput');

    search.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!searchInput.value.trim()) {
            url.searchParams.delete('search');
            window.location.href = url.href;
            return;
        }
        url.searchParams.set('search', searchInput.value);
        window.location.href = url.href;
    });
}
//! end search

//! filter
const filter = document.querySelector('[filter]');
if (filter) {
    const categoryFilter = filter.querySelector('#category');
    const statusFilter = filter.querySelector('#status');
    
    const filterSubmit = filter.querySelector('[filter-submit]');
    const filterReset = filter.querySelector('[filter-reset]');

    const url = new URL(window.location.href);

    filterSubmit.addEventListener('click', (e) => {
        if (categoryFilter?.value.trim()) {
            url.searchParams.set('categoryId', categoryFilter.value);
        } else {
            url.searchParams.delete('categoryId');
        }
        if (statusFilter?.value.trim()) {
            url.searchParams.set('status', statusFilter.value);
        } else {
            url.searchParams.delete('status');
        }
        window.location.href = url.href;
    });

    filterReset.addEventListener('click', (e) => {
        url.searchParams.delete('categoryId');
        url.searchParams.delete('status');
        window.location.href = url.href;
    });
}
//! end filter

//! change status
const changeStatus = document.querySelectorAll('[change-status]');
if (changeStatus && changeStatus.length > 0)
{
    changeStatus.forEach(btn => {
        btn.addEventListener('click', async (e) =>{
            btn.innerHTML = 'Loading...';
            btn.disabled = true;
            
            const [id, status] = btn.getAttribute('change-status').split('-');
            const url = btn.getAttribute('path') + id + '/' + status;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const dataResponse = await response.json();
            
            if (response.status === 200) {
                btn.innerHTML = status === 'active' ? 'Active' : 'Inactive';
                btn.classList.remove(status === 'active' ? 'btn-warning' : 'btn-primary');
                btn.classList.add(status === 'active' ? 'btn-primary' : 'btn-warning');
                btn.setAttribute('change-status', id + '-' + (status === 'active' ? 'inactive' : 'active'));
                
                // ! alert
                const alert = document.createElement("div");
                alert.classList.add("alert", "alert-success");
                alert.setAttribute("role", "alert");
                alert.setAttribute("show-alert", "");
                alert.innerHTML = `${dataResponse.message} <span close-alert>X</span>`;
                const closeAlert = alert.querySelector("[close-alert]");
                document.body.appendChild(alert);
                setTimeout(() => {
                    alert.classList.add("alert-hidden")
                }, 5000);
                closeAlert.addEventListener("click", () => {
                    alert.classList.add("alert-hidden")
                })
                // ! end alert

                //! updatedBy
                const updatedBy = btn.parentElement.parentElement.querySelector('[updatedBy]');
                if (updatedBy) {
                    updatedBy.innerHTML = `
                        ${dataResponse.updatedBy.accountInfo.fullName}
                        <br>
                        ${new Date(dataResponse.updatedBy.updatedAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    `;
                }
                //! end updatedBy
            } else {
                btn.innerHTML = 'Error';
                btn.classList.remove(status === 'active' ? 'btn-primary' : 'btn-warning');
                btn.classList.add('btn-dander');
                setTimeout(() => {
                    btn.innerHTML = status === 'active' ? 'Inactive' : 'Active';
                    btn.classList.remove('btn-danger');
                    btn.classList.add(status === 'active' ? 'btn-warning' : 'btn-primary');
                    btn.disabled = false;
                }, 3000);

                // ! alert
                const alert = document.createElement("div");
                alert.classList.add("alert", "alert-danger");
                alert.setAttribute("show-alert", "");
                alert.setAttribute("role", "alert");
                alert.innerHTML = `${dataResponse.message} <span close-alert>X</span>`;
                const closeAlert = alert.querySelector("[close-alert]");
                document.body.appendChild(alert);
                setTimeout(() => {
                    alert.classList.add("alert-hidden")
                }, 5000);
                closeAlert.addEventListener("click", () => {
                    alert.classList.add("alert-hidden")
                })
                // ! end alert
            }

            btn.disabled = false;

        });
    });
}
//! end change status

//! delete item
const deleteItem = document.querySelectorAll('[delete-item]');
if (deleteItem && deleteItem.length > 0) {
    const deleteForm = document.querySelector('#delete-item-form');
    const path = deleteForm.getAttribute('data-path');

    deleteItem.forEach(btn => {
        
        btn.addEventListener("click", () => {
            const ok = confirm('Bạn có chắc chắn muốn xóa bản ghi này không?');
            if (ok) {
                const id = btn.getAttribute('delete-item');
                const url = path + "/" + id +"?_method=DELETE";
                deleteForm.action = url;
                deleteForm.submit();
            }
            else {
                return;
            }
        })
    });
}
//! end delete item

//! edit position
const editPosition = document.querySelectorAll('.positionEdit');
if (editPosition && editPosition.length > 0) {
    editPosition.forEach(input => {
        input.addEventListener('change', async (e) => {
            const path = input.getAttribute('data-path');

            const response = await fetch(path, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    position: input.value
                })
            });

            const dataResponse = await response.json();
            if (response.status === 200) {
                // ! alert
                const alert = document.createElement("div");
                alert.classList.add("alert", "alert-success");
                alert.setAttribute("role", "alert");
                alert.setAttribute("show-alert", "");
                alert.innerHTML = `${dataResponse.message} <span close-alert>X</span>`;
                const closeAlert = alert.querySelector("[close-alert]");
                document.body.appendChild(alert);
                setTimeout(() => {
                    alert.classList.add("alert-hidden")
                }, 5000);
                closeAlert.addEventListener("click", () => {
                    alert.classList.add("alert-hidden")
                })
                // ! end alert

                //! updatedBy
                const updatedBy = input.parentElement.parentElement.querySelector('[updatedBy]');
                if (updatedBy) {
                    updatedBy.innerHTML = `
                        ${dataResponse.updatedBy.accountInfo.fullName}
                        <br>
                        ${new Date(dataResponse.updatedBy.updatedAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    `;
                }
                //! end updatedBy
            } else {
                // ! alert
                const alert = document.createElement("div");
                alert.classList.add("alert", "alert-danger");
                alert.setAttribute("role", "alert");
                alert.setAttribute("show-alert", "");
                alert.innerHTML = `${dataResponse.message} <span close-alert>X</span>`;
                const closeAlert = alert.querySelector("[close-alert]");
                document.body.appendChild(alert);
                setTimeout(() => {
                    alert.classList.add("alert-hidden")
                }, 5000);
                closeAlert.addEventListener("click", () => {
                    alert.classList.add("alert-hidden")
                })
                // ! end alert
            }
        });
    })
}
//! end edit position

//! checkbox multi
const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkAll']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        inputsId.forEach(input => {
            input.checked = inputCheckAll.checked;
        });
    });

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

            if (countChecked === inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });

        input.closest("tr").querySelector(".item-thumb").addEventListener("click", () => {
            input.click();
        });
    });
}
//! end checkbox multi

//! change multi
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        const typeChange = formChangeMulti.querySelector("select[name='type']").value;

        if (typeChange === "delete-all") {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa những bản ghi đã chọn không?");
            if (!isConfirm) {
                return;
            }
        }

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputsId = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                ids.push(input.value);
            });

            inputsId.value = ids.join(',');

            formChangeMulti.submit();
        }
    });
}
//! end change multi

//! slider
const productThumbnailsSlider = document.querySelector('.product-thumbnails-slider');
if (productThumbnailsSlider) {
    var splide = new Splide('#main-thumbnails', {
        pagination: false,
    });

    var subThumbnails = document.getElementsByClassName('sub-thumbnail');
    var current;

    for (var i = 0; i < subThumbnails.length; i++) {
        initThumbnail(subThumbnails[i], i);
    }

    function initThumbnail(subThumbnail, index) {
        subThumbnail.addEventListener('click', function () {
            splide.go(index);
        });
    }

    splide.on('mounted move', function () {
        var thumbnail = subThumbnails[splide.index];

        if (thumbnail) {
            if (current) {
                current.classList.remove('is-active');
            }

            thumbnail.classList.add('is-active');
            current = thumbnail;
        }
    });

    splide.mount();
}
//! end slider