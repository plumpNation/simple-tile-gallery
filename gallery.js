/*jslint browser:true */
/*global jQuery */
(function ($) {
    var galleryContainer    = 'gallery-container',
        panelId             = 'gallery-panel',
        limit               = 8,

        largeImage,
        description,

        // create the promise for loaded image data
        imagesData = [],

        getViewItems = function () {
            var container = $('#' + galleryContainer),
                viewId = container.data('viewid');

            limit = container.data('limit') || limit;
            return $('.' + viewId + '-item');
        },

        scrapeViewsData = function () {
            var items = getViewItems(),
                limiter = limit;

            items.each(function (key, item) {
                if (!limiter--) {
                    return false;
                }
                $item = $(item);
                imagesData.push({
                    'title'      : $item.find('.gallery-image-title').text(),
                    'srcLarge'   : $item.find('.gallery-image-large img').prop('src'),
                    'srcThumb'   : $item.find('.gallery-image-thumb img').prop('src'),
                    'description': $item.find('.gallery-image-description p').text()
                });
            });

            handleImageData(imagesData);
        },

        updatePanel = function (data) {
            largeImage.prop('src', data.srcLarge);
            description.text(data.description);
        },

        onClickThumb = function (e) {
            var data = $(e.target).data('imageData');
            updatePanel(data);
        },

        /**
         * Create image tab with attributes and class/id.
         * @param  {string} type    Will be used as the image class
         * @param  {object} options Will be used to set attributes including id.
         * @return {jQuery img tag} jQuery wrapped img tag
         */
        makeImage = function (type, options) {
            return $('<img>').prop(options).addClass(type);
        },

        /**
         * Build thumb from image data
         * @param {int} key  The key of the image data, in this case an array element id (0,1,2,3 etc)
         * @param {object} data The actual data, containing image name and description etc
         */
        addThumbnail = function (key, data) {
            var thumb = makeImage('thumb', {
                'src': data.srcThumb,
                'alt': data.description
            }).data('imageData', data);

            thumb.appendTo('#gallery-thumbs');
        },

        addThumbnails = function (imageData) {
            $(imageData).each(addThumbnail);
        },

        buildLargeImage = function () {
            var image = makeImage('largeImage', {
                'id': 'largeImage'
            });

            image.prependTo('#' + panelId);
            return image;
        },

        handleImageData = function (imagesData) {
            updatePanel(imagesData[0]);
            addThumbnails(imagesData);
        }

        /**
         * Convenience function to build a div and append to an element by id.
         * @param {string} id        Id of the newly created element.
         * @param {string} container Id of the container to append newly created element to.
         */
        addContainer = function (id ,container, type) {
            var elementType = type || 'div',
                newElement = $('<' + elementType + '>').prop('id', id);

            newElement.appendTo('#' + container);
            return newElement;
        },

        /**
         * Creates large image view.
         */
        buildPanel = function () {
            addContainer(panelId, galleryContainer);
            largeImage = buildLargeImage();
            title = addContainer('title', panelId, 'h3');
            description = addContainer('description', panelId, 'p');
        },

        /**
         * Build all markup for the gallery.
         * @return {void}
         */
        createMarkup = function () {
            buildPanel();
            addContainer('gallery-thumbs', galleryContainer);
        },

        /**
         * Attach events to the gallery and data.
         * @return {void}
         */
        bindUI = function () {
            // handles clicks on the thumbs
            $('body').on('click','.thumb', onClickThumb);
        };

    $(function () {
        createMarkup();
        bindUI();
        scrapeViewsData();
    });
}(jQuery));
