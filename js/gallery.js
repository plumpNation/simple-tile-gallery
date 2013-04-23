/*jslint browser:true */
/*global jQuery */
(function ($) {
    'use strict';

    var galleryContainer    = 'gallery-container',
        panelId             = 'gallery-panel',
        limit               = 8,

        panel,
        title,
        largeImage,
        description,

        thumbs,
        container,

        viewId,

        // create the promise for loaded image data
        imagesData = [],

        getLimit = function () {
            limit = container.data('limit') || limit;
            return parseInt(limit, 10);
        },

        getViewItems = function () {
            var viewDataId = container.data('viewid');

            // Follows the convention 'view-id-your_id';
            viewId = 'view-id-' + viewDataId.replace('-', '_');

            return $('.' + viewDataId + '-item');
        },

        updatePanel = function (data) {
            if (!data) {
                console.info('No data for gallery');
                return;
            }

            data.large.prop('id', 'largeImage');

            if (!largeImage) {
                largeImage = data.large.prependTo(panel);

            } else {
                largeImage.replaceWith(data.large);
                largeImage = data.large;
            }

            if (data.title) {
                title.text(data.title);
            }

            if (data.description) {
                description.text(data.description);
            }
        },

        /**
         * Build thumb from image data
         * @param {int} key  The key of the image data, in this case an array element id (0,1,2,3 etc)
         * @param {object} data The actual data, containing image name and description etc
         */
        addThumbnail = function (key, data) {
            var thumb = data.thumb
                .addClass('thumb')
                .data('imageData', data);

            if (data.description) {
                thumb.attr('alt', data.description)
            }

            thumb.appendTo(thumbs);
        },


        addThumbnails = function (imageData) {
            $(imageData).each(addThumbnail);
        },

        handleImageData = function (imagesData) {
            updatePanel(imagesData[0]);
            addThumbnails(imagesData);
        },

        onClickLargeImage = function (originalImage) {
            return function (e) {
                e.stopPropagation();
                e.preventDefault();
                originalImage.trigger('click');
                return false;
            };
        },

        scrapeViewsData = function () {
            var items = getViewItems(),
                limiter = getLimit();

            if (!items.length) {
                console.info('No views items for gallery');
                return false;
            }

            items.each(function (key, item) {
                var $item,
                    largeImage,
                    largeImageClone,
                    largeImageContainer,
                    descriptionContainer;

                if (!limiter) {
                    return false;
                }

                limiter -= 1;
                $item = $(item);

                largeImage = $item.find('.gallery-image-large img');
                largeImageContainer = largeImage.parent();

                if (largeImageContainer.is('a')) {
                    largeImage = largeImageContainer;

                    // Remove the href and hook up to transfer the click event
                    // to the original image.
                    largeImageClone = largeImage.clone()
                        .attr('href', '#')
                        .on('click', onClickLargeImage(largeImage));
                }

                imagesData[key] = {
                    'title'      : $item.find('.gallery-image-title').text(),
                    'thumb'      : $item.find('.gallery-image-thumb img').clone(),
                    'large'      : largeImageClone,
                    'original'   : largeImage
                };

                descriptionContainer = $item.find('.gallery-image-description p');

                if (descriptionContainer.length) {
                    imagesData[key].description = descriptionContainer.text();
                }
            });

            return imagesData;
        },

        onClickThumb = function (e) {
            var data = $(e.target).data('imageData');
            updatePanel(data);
        },

        /**
         * Convenience function to build a div and append to an element by id.
         * @param {string} id        Id of the newly created element.
         * @param {string} container Id of the container to append newly created element to.
         */
        addContainer = function (id, container, type) {
            var elementType = type || 'div',
                newElement = $('<' + elementType + '>').prop('id', id);

            newElement.appendTo('#' + container);
            return newElement;
        },

        /**
         * Creates large image view.
         */
        buildPanel = function () {
            var descriptionContainer;

            panel = addContainer(panelId, galleryContainer);

            descriptionContainer = addContainer('description-container', panelId);

            title = addContainer('title', descriptionContainer[0].id, 'h3');
            description = addContainer('description', descriptionContainer[0].id, 'p');
        },

        /**
         * Build all markup for the gallery.
         * @return {void}
         */
        createMarkup = function () {
            buildPanel();
            container = $('#' + galleryContainer);
            thumbs = addContainer('gallery-thumbs', galleryContainer);
        },

        /**
         * Attach events to the gallery and data.
         * @return {void}
         */
        bindUI = function () {
            // handles clicks on the thumbs
            $('body').on('click', '.thumb', onClickThumb);
        };

    $(function () {
        var imagesData;

        createMarkup();
        bindUI();

        imagesData = scrapeViewsData();

        if (imagesData) {
            handleImageData(imagesData);
        }
    });
}(jQuery));
