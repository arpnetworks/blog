---
layout: single
title: 'systemd: The name org.freedesktop.PolicyKit1 was not provided by any .service files, or you just forgot sudo'
date: 2019-06-20T17:30:53-07:00
author: Garry Dolley
tags: ceph
excerpt: 'The most misleading error in the world'
header:
  teaser: /assets/images/teasers/carlos-quintero-LdMR0eNEEi8-unsplash.jpg
  og_image: /assets/images/teasers/carlos-quintero-LdMR0eNEEi8-unsplash.jpg
---

This is yet another good example of why I hate
[systemd](https://en.wikipedia.org/wiki/Systemd).  It has good intentions and
there are things it can do really well, but for the most part, it is an
extremely frustrating piece of software to use.  And for no good reason,
really.

Say you just issued the below command (like I was doing):

```
systemctl start ceph-osd@205
```

and were met with the following rebuttal:

```
The name org.freedesktop.PolicyKit1 was not provided by any .service files
```

You're probably really scratching your head at this point...

The problem actually has *nothing* to do with *anything* the above error
states.  I simply forgot to use ``sudo``

```
sudo systemctl start ceph-osd@205
```

and now everything is right with the world.

See what I mean?  Simply frustrating that one would be led so far off
the correct path right from the start.
