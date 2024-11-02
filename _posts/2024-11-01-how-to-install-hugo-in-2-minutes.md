---
layout: single
title: "How to Install Hugo in 2 Minutes"
date: 2024-11-01T10:00:00-07:00
author: Garry Dolley
tags: hugo archlinux linux blog
excerpt: "A quick guide to installing the Hugo static site generator on Arch Linux"
header:
  overlay_image: /assets/images/sergey-zolkin-_UeY8aTI6d0-unsplash.jpg
  teaser: /assets/images/teasers/sergey-zolkin-_UeY8aTI6d0-unsplash.jpg
  og_image: /assets/images/teasers/sergey-zolkin-_UeY8aTI6d0-unsplash.jpg
  caption: Photo by [Sergey Zolkin](https://unsplash.com/photos/_UeY8aTI6d0)
---

This evening I was experimenting with static site generators.  I've been using [Jekyll](https://jekyllrb.com) for a while, but I wanted to see what other options were available.  I decided to give [Hugo](https://gohugo.io) a try, since I heard it's very fast and some of the themes are really nice.  Hugo is written in Go, so it's a single binary that you download and run, which generally makes it easier to install than something like Jekyll, which requires Ruby and quite a few other dependencies.

As I run Arch Linux on my desktop, I'll show you how to get it up and running on Arch Linux in just a couple of minutes.

Installation
-----------

Installing Hugo on Arch Linux is straightforward using pacman:

{% highlight shell %}
$ sudo pacman -S hugo
{% endhighlight %}

That's it! To verify the installation:

{% highlight shell %}
$ hugo version
{% endhighlight %}

At the time of this writing, the version that was installed on my Arch Linux system was as follows:

{% highlight shell %}
hugo v0.136.3+extended linux/amd64 BuildDate=unknown
{% endhighlight %}

Quick Start
----------

Let's create a new site:

{% highlight shell %}
$ hugo new site myblog
$ cd myblog
{% endhighlight %}

Add a theme (using PaperMod as an example):

{% highlight shell %}
$ git init
$ git submodule add https://github.com/adityatelange/hugo-PaperMod themes/PaperMod
{% endhighlight %}

Enable the theme by adding the following line to the end of `hugo.toml`:

{% highlight toml %}
theme = "PaperMod"
{% endhighlight %}

By this point, your `hugo.toml` file should look like this:

{% highlight toml %}
baseURL = "http://example.org/"
languageCode = "en-us"
title = "My New Hugo Site"
theme = "PaperMod"
{% endhighlight %}

Create your first post:

{% highlight shell %}
$ hugo new posts/my-first-post.md
{% endhighlight %}

Start the Hugo development server:

{% highlight shell %}
$ hugo server -D
{% endhighlight %}

Visit http://localhost:1313 to see your new site!

Here's a screenshot of what the site looks like for me:

![Hugo Site Preview](/blog/assets/images/hugo-blank-slate.jpg)

My system is set to dark mode, so the theme is styled accordingly.  There's a theme toggle next to the logo in the top left.

That's all there is to it. Hugo is now installed and ready for you to start creating content. The `-D` flag tells Hugo to include draft posts in the preview.

For more information about Hugo's features and capabilities, check out the [official documentation](https://gohugo.io/documentation/).
