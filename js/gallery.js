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

        // create the promise for loaded image data
        imagesData = [],

        getLimit = function () {
            limit = container.data('limit') || limit;
            return parseInt(limit, 10);
        },

        getViewItems = function () {
            var viewId = container.data('viewid');
            return $('.' + viewId + '-item');
        },

        updatePanel = function (data) {
            if (!data) {
                console.info('No data for gallery');
                return;
            }

            data.large.prop('id', 'largeImage');

            if (!largeImage) {
                panel.prepend(data.large);

            } else {
                largeImage.replaceWith(data.large);
            }


            title.text(data.title);
            description.text(data.description);
        },

        /**
         * Build thumb from image data
         * @param {int} key  The key of the image data, in this case an array element id (0,1,2,3 etc)
         * @param {object} data The actual data, containing image name and description etc
         */
        addThumbnail = function (key, data) {
            var thumb = data.thumb
                .addClass('thumb')
                .attr('alt', data.description)
                .data('imageData', data);

            thumb.appendTo(thumbs);
        },


        addThumbnails = function (imageData) {
            $(imageData).each(addThumbnail);
        },

        handleImageData = function (imagesData) {
            updatePanel(imagesData[0]);
            addThumbnails(imagesData);
        },

        scrapeViewsData = function () {
            var items = getViewItems(),
                limiter = getLimit();

            if (!items.length) {
                console.info('No views items for gallery');
                return;
            }

            items.each(function (key, item) {
                var $item,
                    largeImage,
                    largeImageContainer;

                if (!limiter) {
                    return false;
                }

                limiter -= 1;
                $item = $(item);

                largeImage = $item.find('.gallery-image-large img');
                largeImageContainer = largeImage.parent();

                if (largeImageContainer.is('a')) {
                    largeImage = largeImageContainer;
                }

                imagesData.push({
                    'title'      : $item.find('.gallery-image-title').text(),
                    'thumb'      : $item.find('.gallery-image-thumb img').clone(),
                    'large'      : largeImage.clone(),
                    'description': $item.find('.gallery-image-description p').text()
                });


            });

            handleImageData(imagesData);
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
        createMarkup();
        bindUI();
        scrapeViewsData();
    });
}(jQuery));
