---
layout: single
title: "I moved my drives to a new server, now it won't boot!"
date: 2019-06-12T13:47:23-07:00
author: "Garry Dolley"
tags: server raid intel grub
excerpt: "We moved drives from one server to another, but new one wouldn't boot"
header:
  teaser: /assets/images/teasers/florian-krumm-yLDabpoCL3s-unsplash.jpg
  og_image: /assets/images/teasers/florian-krumm-yLDabpoCL3s-unsplash.jpg
  alt: "Motherboard"
---

The Problem
-----------

Recently, we had to move the drives of one server to another, seemingly
identical one, because the original one failed.  Once we had done so,
Linux would boot, but not find a root filesystem.  We were like, "wtf?!
...  It's an identical server"

Well, it turned out, not exactly.  It was almost the same type, but this
newer one had a built-in Intel RAID controller and the SAS cables were
already routed to it.  Our drives were detected fine, and GRUB would
boot, but once Linux took over, it couldn't see the disks at all.

It turned out our initramfs image did not have the drivers for this
particular controller (and why would it, the drives came from a server
where this controller was not present)

To fix this, we basically had to rebuild the initramfs image with the
correct driver.  The following is a description of the process.

The Solution
------------

First of all, we booted the new server with an [Arch
Linux](https://archlinux.org) ISO.  In our experience, Arch Linux has
the best tools out-of-the-box and it is easy to get a shell right away
by just booting the regular ISO.

Once booted, we executed:

```
mount /dev/md1 /mnt            # Our root was on md1
arch-chroot /mnt
mount -a                       # Mount everything else

# Change modules=dep to modules=all
vim /etc/initramfs-tools/initramfs.conf

update-initramfs -u -k all     # Or use -k <version> if your boot partition is small

sync
exit

reboot
```

After this, the new server booted perfectly!
