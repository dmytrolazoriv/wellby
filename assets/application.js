$(document).ready(function() {

    let
        onQuantityButtonClick = function(event) {
        let
            $button = $(this),
            $form = $button.closest("form"),
            $quantity = $form.find(".js-quantity-field"),
            quantityValue = parseInt($quantity.val()),
            max = $quantity.attr("max") ? parseInt($quantity.attr("max")) : null;

        if ($button.hasClass("plus") && (max === null || quantityValue + 1 <= max)) {
            $quantity.val(quantityValue + 1).change();
        } else if ($button.has("minus")) {
            $quantity.val(quantityValue - 1).change();
        }
    },
    onQuantityFieldChange = function(event) {
        let
            $field = $(this),
            $form= $field.closest("form"),
            $quantityText = $form.find(".js-quantity-text"),
            shouldDisableMinus = parseInt(this.value) === 1,
            shouldDisablePlus = parseInt(this.value) === parseInt($field.attr("max")),
            $minusButton = $form.find(".js-quantity-button.minus"),
            $plusButton = $form.find(".js-quantity-button.plus");

        $quantityText.text(this.value);

        if (shouldDisableMinus) {
            $minusButton.prop("disabled", true);
        } else if ($minusButton.prop("disabled") === true) {
            $minusButton.prop("disabled", false);
        }

        if (shouldDisablePlus) {
            $plusButton.prop("disabled", true);
        } else if ($plusButton.prop("disabled") === true) {
            $plusButton.prop("disabled", false);
        }
    },
    onVariantRadioChange = function(event) {
        let
            $radio = $(this),
            $form= $radio.closest("form"),
            max = $radio.attr("data-inventory-quantity"),
            $quantity = $form.find(".js-quantity-field");
        $addToCartButton = $form.find("#add-to-cart-button");

        if ($addToCartButton.prop("disabled") === true) {
            $addToCartButton.prop("disabled", false);
        }

        $quantity.attr("max", max);

        if (parseInt($quantity.val()) > max) {
            $quantity.val(max).change();
        }
    },
    onAddToCart = function(event) {
        event.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/cart/add.js',
            data: $(this).serialize(),
            dataType: 'json',
            success: onCartUpdated,
            error: onError
        });
    },
    onLineRemoved = function(event) {
        event.preventDefault();
        let
            $removeLink = $(this),
            removeQuery = $removeLink.attr('href').split('change?')[1];
        $.post('/cart/change.js', removeQuery, onCartUpdated, 'json');
    },
    onCartUpdated = function() {
        $.ajax({
            type: 'GET',
            url: '/cart',
            context: document.body,
            success: function(context) {
                let
                    $dataCartContents = $(context).find('.js-cart-page-contents'),
                    dataCartHtml = $dataCartContents.html(),
                    dataCartItemCount = $dataCartContents.attr('data-cart-item-count'),
                    $miniCartContents = $('.js-mini-cart-contents'),
                    $cartItemCount = $('.js-cart-item-count');

                $cartItemCount.text(dataCartItemCount);
                $miniCartContents.html(dataCartHtml);

                if (parseInt(dataCartItemCount) > 0) {
                    openCart();
                } else {
                    closeCart();
                }
            }
        });
    },
    onError = function(XMLHttpRequest, textStatus) {
        if (XMLHttpRequest.responseJSON) {
            let data = XMLHttpRequest.responseJSON;
            alert(data.status + ' - ' + data.message + ': ' + data.description);
        } else {
            // Handle the case where responseJSON is undefined or not in the expected format
            alert('An error occurred: ' + textStatus);
        }
    },
    openCart = function() {
        $('html').addClass('mini-cart-open');
    },
    closeCart = function() {
        $('html').removeClass('mini-cart-open');
    },
    onCartButtonClick = function(event) {
        event.preventDefault();

        let isCartOpen = $('html').hasClass('mini-cart-open');

        if (!isCartOpen) {
            openCart();
        } else {
            closeCart();
        }
    },
    closeMiniCart = function(event) {
        const $miniCart = $('#mini-cart');
        const $cartLink = $('.js-cart-link');

        if (!$(event.target).closest($miniCart).length != 0 && !$cartLink.has(event.target).length != 0) {
            closeCart();
        }
    };

    $(document).on("click", ".js-quantity-button", onQuantityButtonClick);
    $(document).on("change", ".js-quantity-field", onQuantityFieldChange);
    $(document).on("change", ".js-variant-radio", onVariantRadioChange);
    $(document).on("submit", "#add-to-cart-form", onAddToCart);
    $(document).on("click", "#mini-cart .js-remove-line", onLineRemoved);
    $(document).on("click", ".js-cart-link, #mini-cart .js-keep-shopping", onCartButtonClick);
    $(document).on("click", closeMiniCart);



    const swiper = new Swiper(".products-slider", {
        loop: true,
        slidesPerView: 1.5,
        spaceBetween: 20,
        breakpoints: {
            // when window width is >= 320px
            325: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            // when window width is >= 480px
            768: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            // when window width is >= 640px
            992: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            1024: {
                slidesPerView: 1.5,
                spaceBetween: 20,
            }
        },
        pagination: {
            el: ".slider-pagination__pagination",
            type: "fraction",
        },
        navigation: {
            nextEl: ".products-slider__button_next",
            prevEl: ".products-slider__button_prev",
        },
    });


    // Product slider
    tippy('.slider-buttons__button-info', {
        content: "Fill the form to create request on custom art order",
        maxWidth: 150,
        theme: "custom",
        placement: "top-end"
    });

    // Hotspot
    // Find all .hotspot elements
    const hotspots = document.querySelectorAll('.hotspot');

    // Iterate through each .hotspot element
    hotspots.forEach((hotspot, index) => {
        // Find the corresponding .product-link__content element
        const productLinkContent = hotspot.nextElementSibling;

        // Get the content from the .product-link__content element
        const content = productLinkContent.innerHTML;

        // Initialize Tippy with unique content for each hotspot
        tippy(hotspot, {
            theme: "hotspot",
            placement: "bottom",
            content: content,
            allowHTML: true,
        });
    });


    // products-thumbs-gallery
    const productsGalleryMain = new Swiper(".products-gallery-main", {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            767: {
                slidesPerView: 3,
                spaceBetween: 10,
            },
            992: {
                slidesPerView: 4,
                spaceBetween: 10
            }
        }
    });
    const productsGalleryThumbs = new Swiper(".products-gallery-thumbs", {
        spaceBetween: 10,
        navigation: {
            nextEl: ".products-gallery-thumbs__button-next",
            prevEl: ".products-gallery-thumbs__button-prev",
        },
        pagination: {
            el: ".products-gallery__pagination",
            clickable: true,
        },
        scrollbar: {
            el: ".swiper-scrollbar",
            hide: false,
            draggable: true,
        },
        thumbs: {
            swiper: productsGalleryMain,
        },
    });

    const shopifyChallengeButton = document.querySelector(".shopify-challenge__button");
    if (shopifyChallengeButton) {
        shopifyChallengeButton.classList.add("button");
    }

    // Accordion
    if (document.querySelector(".accordion-container")) {
        new Accordion(".accordion-container", {
            duration: 400,
            showMultiple: true,
            openOnInit: [0],
            onOpen: function(currentElement) {
                console.log(currentElement);
            }
        });
    }

    // Spollers
    const spollersArray = document.querySelectorAll("[data-spollers]");

    if (spollersArray.length > 0) {
        // Получение обычных спойлеров
        const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
            return !item.dataset.spollers.split(",")[0];
        });
        // Инициализация обычных спойлеров
        if (spollersRegular.length > 0) {
            initSpollers(spollersRegular);
        }

        // Получение слайдеров с медиа запросами
        const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
            return item.dataset.spollers.split(",")[0];
        });

        // Инициализация слайдеров с медиа запросами
        if (spollersMedia.length > 0) {
            const  breakpointsArray = [];
            spollersMedia.forEach(item => {
                const params = item.dataset.spollers;
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });

            // Получаем уникальные брейкпоинты
            let mediaQueries = breakpointsArray.map(function (item) {
                return '(' + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            });
            mediaQueries = mediaQueries.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });

            // Работаем с каждым брейкпоинтом
            mediaQueries.forEach(breakpoint => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);

                // Обьекты с нужными условиями
                const spollersArray = breakpointsArray.filter(function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) {
                        return true;
                    }
                });
                // Событие
                matchMedia.addListener(function () {
                    initSpollers(spollersArray, matchMedia);
                });
                initSpollers(spollersArray, matchMedia);
            });
        }
        // Инициализация
        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach(spollersBlock => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add("_init");
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener("click", setSpollerAction);
                } else {
                    spollersBlock.classList.remove("_init");
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener("click", setSpollerAction);
                }
            });
        }
        // Работа с контентом
        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            const spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
            if (spollerTitles.length > 0) {
                spollerTitles.forEach(spollerTitle => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerTitle.classList.contains("_active")) {
                            spollerTitle.nextElementSibling.hidden = true;
                        }
                    }  else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                });
            }
        }
        // 1
        function setSpollerAction(event) {
            const element = event.target;
            if (element.hasAttribute("data-spoller") || element.closest("[data-spoller]")) {
                const spollerTitle = element.hasAttribute("data-spoller") ? element : element.closest("[data-spoller]");
                const spollersBlock = spollerTitle.closest("[data-spollers]");
                const oneSpoller = spollersBlock.hasAttribute("data-one-spoller") ? true : false;
                if (!spollersBlock.querySelectorAll("._slide").length) {
                    if (oneSpoller && !spollerTitle.classList.contains("_active")) {
                        hideSpollersBody(spollersBlock);
                    }
                    spollerTitle.classList.toggle("_active");
                    _slideToggle(spollerTitle.nextElementSibling, 500);
                }
                event.preventDefault();
            }
        }
        // 2
        function hideSpollersBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._active");
            if (spollerActiveTitle) {
                spollerActiveTitle.classList.remove("_active");
                _slideUp(spollerActiveTitle.nextElementSibling, 500);
            }
        }
    }

// SlideToggle
// 1
    let _slideUp = (target, duration = 500) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = target.offsetHeight + "px";
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = true;
                target.style.removeProperty("height");
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
            }, duration);
        }
    }
// 2
    let _slideDown = (target, duration = 500) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            if  (target.hidden) {
                target.hidden = false;
            }
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout(() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
            }, duration);
        }
    }
// 3
    let _slideToggle = (target, duration = 500) => {
        if  (target.hidden) {
            return _slideDown(target, duration);
        } else {
            return _slideUp(target, duration);
        }
    }

    // Read more/less
    document.querySelectorAll(".readmore").forEach(function (element) {
        element.addEventListener("click", function (event) {
            event.preventDefault();
            let descriptionFull = document.querySelector(".article__content-full");
            let descriptionShort = document.querySelector(".article__content-short");
            descriptionFull.style.display = "block";
            descriptionShort.style.display = "none";
        });
    });

    document.querySelectorAll(".readless").forEach(function (element) {
        element.addEventListener("click", function (event) {
            event.preventDefault();
            let descriptionFull = document.querySelector(".article__content-full");
            let descriptionShort = document.querySelector(".article__content-short");
            descriptionFull.style.display = "none";
            descriptionShort.style.display = "block";
        });
    });

});