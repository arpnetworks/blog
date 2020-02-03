---
layout: single
title: "Using HP iLO2 Remote Console on Linux in 2020"
date: 2020-01-29T14:18:41-07:00
author: Garry Dolley
tags: ilo2 archlinux linux
excerpt: "How to use an old Firefox and Java to run the iLO2 Remote Video Console"
toc: true
#classes: " "
header:
  overlay_image: /assets/images/white-hp-laptop-844733.jpg
  overlay_filter: 0.5
  caption: Photo by [Samer Daboul](https://www.pexels.com/photo/black-wireless-headphone-near-white-hp-laptop-844733/)
  teaser: /assets/images/teasers/white-hp-laptop-844733.jpg
  og_image: /assets/images/teasers/white-hp-laptop-844733.jpg
  alt: "HP laptop"
---

Overview
--------

This one really frustrated me, but I knew I had to find a solution, and
it wasn't going to be "Run Windows in a VM on your laptop."  That just
sounded stupid.  But nevertheless, as our technology advances and
support for old Java applets wanes, getting esoteric things like an iLO2
video console working on Linux in 2020 seems next to impossible.

This wasn't so much of an issue with my old laptop, a ThinkPad T520
running an old version of Ubuntu, namely Trusty (14.04).  Before you
judge me, let me just say, I use laptops like old Toyotas; I don't
replace them until they are damn near falling apart.  Really, that tried
and true T520 had an "A" key that would sometimes pop off...

And while I could have just gone to my closet and pulled out this old
laptop, just to access the console of one of our old HP servers, just
_this one time_, I really wanted to have a modern solution.  So, I went
down this rabbit hole, burned a few hours, but ultimately was successful
and I am proud to share what I discovered.

First things first, I can't even login to an iLO2 remote management
service at all in today's Chrome, it'll complain about SSL and quit with
`ERR_SSL_BAD_RECORD_MAC_ALERT`, so using Chrome is out of the picture.

It works fine in Firefox though; I can login and use most of the tools,
except for the Java-based remote console.  As of September, 2018,
Firefox [dropped
support](https://java.com/en/download/faq/firefox_java.xml) for the
technology to run Java applets.

So if you're running a modern Firefox, you're shit-out-of-luck.
However, there is good news.  You can install and run an older version
of Firefox, from the ESR line (Extended Support Release), and support
for Java applets will be there, and the iLO2 console will work.  You'll
need an ESR version up to or below 52ESR, and then an old version of
Java 7, and I'll show you below how to get all those things working on
Arch Linux (my preferred desktop OS on my ThinkPad X1 Carbon).

Install Firefox ESR
-------------------

This part is not so bad, but you'll have to edit your `PKGBUILD` a bit
because the latest ESR version at the time of this writing is too new.
You need 52 or below.  I use `trizen` for my AUR packages.  If you're
using something else, you'll have to adapt my method below to your
prefered tool.

* Install Firefox ESR (binary)

    ```sh
    $ trizen -S firefox-esr-bin
    ```

* Edit ``PKGBUILD``

  You will want to edit the `PKGBUILD` file according to the diff below.

  ```diff
  --- PKGBUILD    2019-12-23 04:57:07.070017439 -0800
  +++ PKGBUILD-new        2019-12-23 04:58:52.850018080 -0800
  @@ -7,7 +7,7 @@

   pkgname=firefox-esr-bin
   _pkgname=${pkgname/-bin/}
  -pkgver=68.3.0
  +pkgver=52.6.0
   pkgrel=1
   pkgdesc='Standalone web browser from mozilla.org - Extended Support Release'
   url='http://www.mozilla.org/en-US/firefox/organizations/'
  @@ -18,22 +18,23 @@
   license=('MPL' 'GPL' 'LGPL')
   install=$_pkgname.install

  -sha512sums=('aadfdd64f10d5f9b97dda227793a6db3b73913f986c2f826ddcc3568f9a9e63ad3fe73d04dcb2cfe27ab854ef048faef3546621b3de731f5a5478c7c551df33a'
  +sha512sums=('b521611ace3731aea3e1cc7abb74f01a4885f5325da359a25a6a295316541c4e1e4cb7cf1be104cbb199acc15d57eeb8a37e2e8adf4e53f7ddf284f9d81a047f'
               'c585f6e8ac7abfc96ad4571940b6f0dcc3f7331a18a518b4fe5d19b45e4c2d96c394524ea5c115c8fdd256c9229ea2fabeb1fc04ca7102f1626fd20728aef47d'
               'ab2fa2e08c7a65ac0bfe169a4b579e54b038bddabf838cd3df5ab341bd77be7c101092d0123598944d2174ab3a8fbc70dfbd692b2944016efdb7a69216a74428')
   [[ "$CARCH" == "i686" ]] && sha512sums[0]='cb72fa6f7a6106fefa124dfdc2f8dc6df26a27defeb93d5683f744eb47343cdfb5e39727b16678f479c57a05d09d9358a811950d42635f57bba2cf0e94ed8412'

       ln -s /opt/$_pkgname/firefox $pkgdir/usr/bin/$_pkgname
       install -m644 $srcdir/{$_pkgname.desktop,$_pkgname-safe.desktop} $pkgdir/usr/share/applications/
  -       install -m644 $srcdir/firefox/browser/chrome/icons/default/default128.png $pkgdir/usr/share/pixmaps/$_pkgname.png
  +       install -m644 $srcdir/firefox/browser/chrome/icons/default/default48.png $pkgdir/usr/share/pixmaps/$_pkgname.png
   }
  ```

  With the above changes, we accomplish the following:

  1. Downgrade the Firefox version
  2. Insert the correct SHA512 checksum for the downgraded binary
     package

     For reference, I found the SHA512SUM for the binary file by
     painstakingly looking for the correct version, architecture and
     language in the
     [SHA512SUMS](https://ftp.mozilla.org/pub/firefox/releases/52.6.0esr/SHA512SUMS)
     file for the release we're trying to install.
  3. Don't ask me why that icon isn't there.

* Build the package

  If everything goes smooth with your changes above, the Firefox ESR
  binary package will be built and when you're prompted to install it,
  just proceed to do so.

  If things *don't* go smoothly and you need to try again, see the next
  section.

* **OPTIONAL**: How to retry the build if things go wrong

  If something goes wrong, you can save time by going into the build
  directory, tweaking anything you need, and building again manually as
  follows:

  ```sh
  $ cd /tmp/trizen-$USER/firefox-esr-bin

  # Make tweaks, etc...

  $ makepkg
  ```

  Once `makepkg` completes successfully, you'll have a package file that
  Arch Linux can install using regular ol' pacman:

  ```sh
  $ sudo pacman -U firefox-esr-bin-52.6.0-1-x86_64.pkg.tar.xz
  ```

Install the Java 7 Runtime Environment (JRE7)
---------------------------------------------

To install an old version of the Oracle Java 7 Runtime Environment,
which is EOL (end of life / support), perform the steps below.  Note
though, that the first part will fail, and that is normal.  It's because
Oracle doesn't let you *just download* the Java runtimes, you have to
agree to their license, or terms, or something legal that nobody cares
about but the lawyers.

But not only that, you have to login to Oracle's site.  This is annoying
but not necessarily an obstacle, because you can sign up for a free
account right on the spot.

* Install JRE7 package

    ```sh
    $ trizen -S jre7
    ```

  This will fail, as noted above, but you'll get the directory structure
  in place that you need for the remaining steps in this section.

* Download JRE7 runtime from Oracle's site

  The trizen command above will tell you which URL to go to (I would
  have pasted it here, but I honestly forgot it).  Once there, you'll
  want to get the file: `jre-7u80-linux-x64.tar.gz`

  When you try to download this file, it'll make you go through a dance
  of accepting something legal, signing up for a free Oracle account,
  etc...

  It sucks, but just accept the pain.

  Once you finally have the file, proceed to the next step.

* Install JRE7 package (again)

  Now you can perform the following:

  ```sh
  $ cp ~/Downloads/jre-7u80-linux-x64.tar.gz ~/trizen-$USER/jre7/
  $ trizen -S jre7
  ```

  This should complete successfully now and you'll have a working
  version of the old Java 7 runtime.

Add iLO2 to the Security Exceptions
-----------------------------------

This will help with you not getting blasted with a million popups about
security problems.

* Start the Java Control Panel

    ```sh
    $ /usr/lib/jvm/java-7-jre/jre/bin/ControlPanel
    ```

* Confirm exceptions

  Navigate to: `Security` -> `Edit Site List`

  Add your iLO2 server URLs to the list.  For example,
  *https://192.168.1.2*

Configure JRE7 for Firefox
--------------------------

Note: I didn't actually have to do this step, the symlink was already
present.  But for completeness, I'm including this part because the
[reference](#references) I used as a guide for this whole madness also included it,
so...

* Manual symlink (optional)

  You only need to perform this step if the symlink isn't already present.

    ```sh
    $ cd /usr/lib/mozilla/plugins
    $ sudo rm libnpjp*
    $ sudo ln -s /usr/lib/jvm/java-7-jre/jre/lib/amd64/libnpjp2.so
    ```

Run Firefox ESR
---------------

* Execute the correct binary

  This part may seem obvious, but I would like to point out one caveat I
  found.  First of all, to run Firefox ESR, just execute the following:

  ```sh
  $ firefox-esr
  ```

  *But*, if you have the regular version of Firefox already installed,
  this might actually end up simply running *that* version, by default,
  and I don't really know why.  This happened to me a couple times and I
  didn't even notice at first.  Eventually, I ran the following instead:

  ```sh
  $ /opt/firefox-esr/firefox
  ```

  and *that* opened the right version.  Don't ask me why.  The file
  `/usr/bin/firefox-esr` simply symlinks to this one in `/opt` so it
  _should_ be the same, but whatever...

* Verify the Java plugin is installed

  Navigate to `about:addons`

  You should see "Java(TM) Plug-in 10.80.2" in the list.

Open iLO2
---------

Open your iLO page as you normally would and start the remote console.
You may need to confirm further security exceptions.

If you get a `ClassNotFoundException`, don't panic, just click once on
the applet where the remote console should be and it'll download what it
needs.  I only had to do this once, then never again.

And that's it!

You should see your server's video console in your browser and you can
interact with it as you normally would, like in the old days, or on an
old laptop/desktop.

A Better Way
------------

If you're still with me, I thank you for your patience.  This process is
rather long and I wish accessing out-of-band consoles on physical
hardware wasn't always such a pain in the ass.  Why can't someone make a
decent remote console?!

One of the biggest reasons we developed our [ARP Thunder™ Cloud
Dedicated Server](https://www.arpnetworks.com/dedicated) product several
years ago over at [ARP Networks](https://arpnetworks.com) was to
provided a solution to this problem.  Get the resources of a dedicated
server, but be able to manage it with the ease of a virtual machine,
especially with regards to out-of-band (OOB) management.

With ARP Thunder™, you can get a video-based OOB management console by
simply clicking "View Console" in our
[Portal](https://portal.arpnetworks.com), which works in any modern web
browser without any plugins required.  You can also get a serial-based
OOB [management console over
SSH](https://arpnetworks.com/vps/management-console).

How cool is that?! :)

References
----------

I owe much of my success in getting the iLO2 console working in Linux to
the following post: [Use HP iLO2 Remote Console with Linux in 2018](https://blog.wefixit.at/use-hp-ilo2-remote-console-with-linux-in-2018/)
