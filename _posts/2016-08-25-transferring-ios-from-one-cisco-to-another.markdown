---
title: "How to Transfer Cisco IOS from One Device to Another"
date: 2016-08-25T01:18:54-07:00
author: "Garry Dolley"
excerpt: How I upgraded the IOS image on a Cisco device, using a different Cisco device
tags: cisco
header:
  teaser: /assets/images/teasers/markus-spiske-iar-afB0QQw-unsplash-600x400.jpg
  og_image: /assets/images/teasers/markus-spiske-iar-afB0QQw-unsplash-600x400.jpg
---

Earlier this week, I needed to upgrade the IOS image on a device that had been
reset to factory defaults.  I set it up with minimal networking and decided the
easiest way, in my current situation, to upgrade the IOS image was to simply
copy it directly from a neighboring device (they were similar hardware).

Below are my notes on how this was done.  Change IP number and interface names,
should you ever need to do this, and you can follow along:

Source Cisco:

```
conf t
ip tftp source-interface Vlan50
tftp-server slot0:cat4500-entservices-mz.122-46.SG.bin
```

Destination Cisco:

```
copy tftp://10.1.1.5/cat4500-entservices-mz.122-46.SG.bin bootflash:
Destination filename [cat4500-entservices-mz.122-46.SG.bin]?
Accessing tftp://10.1.1.5/cat4500-entservices-mz.122-46.SG.bin...
Loading cat4500-entservices-mz.122-46.SG.bin from 10.1.1.5 (via Vlan50): !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
[OK - 16173580 bytes]

16173580 bytes copied in 454.136 secs (35614 bytes/sec)
```

Not too bad.
