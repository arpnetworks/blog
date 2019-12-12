Overview
--------

This repo holds the official blog of [ARP Networks, Inc.](https://arpnetworks.com) which can be seen [here](https://arpnetworks.com/blog).

Our blog is powered by [Jekyll](https://jekyllrb.com/).

You can fork this repo in order to make a guest post, submit corrections, etc...

How to Make a Guest Post
------------------------

If you're familiar with [Jekyll](https://jekyllrb.com/), you probably already know what to do.

* Fork this repo
* ``cp _drafts/TEMPLATE.markdown _drafts/this-is-my-title.markdown``

Flesh out ``_drafts/this-is-my-title.markdown``, commit, and send us a Pull Request.

We'll take care of putting in the proper timestamp, fix formatting to make it look great, etc...

Please fill out the "About the author" section to your heart's content.  We want to give credit where credit is due!

That's all there is to it!

How to Publish
--------------

```
  bundle exec jekyll build
  bundle exec octopress deploy
```

Notes on Compass
----------------

How I installed Compass:

```
  bundle exec compass init compass-assets

  # Do some stuff in compass-assets

  bundle exec compass compile compass-assets
  cp compass-assets/stylesheets/screen.css _sass/_compass.css
```

We can now @import ``compass`` in ``css/main.scss``

This is not ideal and I typed this up from memory, mostly just so I
wouldn't forget.


Copyright (c) 2016 - 2019 [ARP Networks, Inc.](https://arpnetworks.com)
