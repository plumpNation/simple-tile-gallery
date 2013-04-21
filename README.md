simple-tile-gallery
===================

Super simple jquery gallery with thumbnails.

## Branch for drupal views.

You should have at least a basic understanding of using Drupal or you should just grab a module. To be honest I would recommend a module over this anyway, as it was a quick job to try and get something working for a friend.

This branch is project specific so I doubt it's of much use to anyone. Made for drupal 7, it requires fiddling but the fundamental principle is this.

### Drupal integration

* Add the repo in your sites/{sitename}/files folder.
* In your theme info file add the following code (yes it's hacky).

```
stylesheets[all][] = ../../sites/{sitename}/files/path/to/css/gallery.css
scripts[] = ../../sites/{sitename}/files/path/to/js/gallery.js
```

* Create a content type with fields including, title, image, thumb and description.
* Create a page or a block with the default markup.
```html
<!-- set data attr viewId to the class you assigned to the view -->
<!-- set data attr limit to the max number of thumbs you wish to display -->
<div id="gallery-container" data-viewid="work-gallery" data-limit="8"></div>
```

* Create a block view for this content type, and allocate classes to each of the fields you are exporting.
* Hide the views output and let the script parse the views outputted html.
* Adjust your theme css to trim.
