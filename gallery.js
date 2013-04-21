/*jslint browser:true */
/*global jQuery */
(function ($) {
    var galleryContainer    = 'gallery-container',
        panelId             = 'gallery-panel',
        imageFolder         = 'images/',
        imageFormat         = '.jpg',

        // create the promise for loaded image data
        imagesLoading = $.getJSON('data.json'),

        buildSrc = function (imgName) {
            return imageFolder + imgName + imageFormat;
        },

        updatePanel = function (src, description) {
            $('#largeImage').prop('src', src);
            $('#description').text(description);
        },

        onClickThumb = function (e) {
            var data = $(e.target).data('imageData'),
                src = buildSrc(data.image);

            updatePanel(src, data.description);
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
                'id': data.image,
                'src': buildSrc(data.image + '_thumb'),
                'alt': data.description
            }).data('imageData', data);

            thumb.appendTo('#gallery-thumbs');
        },

        addThumbnails = function (imageData) {
            $(imageData).each(addThumbnail);
        },

        buildLargeImage = function (imageData) {
            makeImage('largeImage', {
                'id': 'largeImage'
            }).prependTo('#' + panelId);

            updatePanel(buildSrc(imageData.image), imageData.description);
        },

        handleImageData = function (imagesData) {
            buildLargeImage(imagesData[0]);
            addThumbnails(imagesData);
        }

        /**
         * Convenience function to build a div and append to an element by id.
         * @param {string} id        Id of the newly created element.
         * @param {string} container Id of the container to append newly created element to.
         */
        addContainer = function (id ,container) {
            $('<div>').prop('id', id).appendTo('#' + container);
        },

        /**
         * Creates large image view.
         */
        buildPanel = function () {
            addContainer(panelId, galleryContainer);
            addContainer('description', panelId)
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
            // handles the loading of the image data
            imagesLoading.success(handleImageData);
        };

    $(function () {
        bindUI();
        createMarkup();
    });
}(jQuery));
