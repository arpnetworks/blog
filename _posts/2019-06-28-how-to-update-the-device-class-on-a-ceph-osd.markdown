---
layout: single
title: "How To Update the Device Class on a Ceph OSD"
date: 2019-06-28T15:28:38-07:00
author: Garry Dolley
tags: ceph
excerpt: "As of Luminous, the option to re-use an OSD ID accelerates rebalancing"
header:
  overlay_image: /assets/images/lorenze-cropped-1.png
  overlay_filter: 0.4
  caption: Photo by [Lorenzo Herrera](https://unsplash.com/@lorenzoherrera?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
---

Several SAS OSDs in our Ceph cluster were replaced with faster SSDs
while re-using the old OSD IDs.  As of Luminous, the option to re-use an
OSD ID is available and it really speeds up the rebalancing.
{: .text-justify}

The slight problem with re-using OSD IDs is that the old device class is
still in the CRUSH map and won't automatically get updated because you
inserted different media.  Most of time this isn't a problem, like if
you replace a spinning HDD with another spinning disk.  The device class
is the same and doesn't need to change.
{: .text-justify}

But, if you replace it with an SSD, for example, then you need to update
the device class manually.  The following is an example using a
ficticious OSD ID of 101:
{: .text-justify}

{% highlight shell %}
$ OSD=101

# Set new device class to "ssd"
$ ceph osd crush rm-device-class osd.$OSD
$ ceph osd crush set-device-class ssd osd.$OSD
{% endhighlight %}

It's as simple as that!
