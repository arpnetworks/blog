---
layout: post
title: "Outage Report for host kct09"
date: 2019-03-01T01:01:56-07:00
author: "Garry Dolley"
---

Overview
--------

We send outage reports like these to customers whenever an unplanned
outage occurs that affects their service.  I've decided to also publish
one here, in case the experience can help someone else facing a similar
battle in the future.

Outage Report for host kct09
----------------------------

This notice is to inform you that your VPS service was affected by an unplanned
outage at approximately 02/28/2019 11:30 PST.

The VM host machine ``kct09`` ceased to be responsive and after several
unsuccessful power cycles we dispatched an engineer to the data center to
physically look at the machine.  The error codes at the BIOS bootup screen
indicated that there was a fault with the RAM.  Since diagnosing exactly which
RAM stick is bad can sometimes be a time consuming process, coupled with the
fact that it might not be the RAM at all, but also a CPU in the same bank as
the reported bad RAM, we decided that it would be faster to simply take the
drives out of the machine and put them into a known-good spare machine with the
same specifications.

This went pretty smoothly, except the new machine had a different SAS
controller in it and our existing initramfs image on the drives didn't have the
driver for this controller.  This delayed us getting the box up as fast as we
would have liked.  We then worked to rebuild initramfs with the new driver, by
booting Arch Linux over serial and then making a new image.  Sidenote: Arch
Linux is a great rescue tool, we use it all the time for everything from
out-of-band installs to rescue situations just like this.  All tools you need
are included and it seems to detect almost all hardware.

So, with the new initramfs image built, we rebooted the machine and it
successfully came up and we could login normally.  However, certain small, yet
very important, parts of our config needed changes on the new server (like MAC
addresses).  We incorporated these changes into our Puppet config and
redeployed everything.  This worked and we gave the box a final reboot.

When it came back up, VMs were starting and everything looked good, except load
avg was quite high, and we figured this was just because all the VMs are doing
their fsck's all at the same time.  We figured we'd just keep an eye on it and
give it time.

Several of our own VMs on this machine finished their fsck's and we were able
to login to them and they were functioning normally.  We thought this was the
end of the road for this repair.

But, as luck would have it, we noticed the load avg on the box was not going
down, even after 30 minutes, and we kept getting reports from customers that
they still couldn't ping their VMs.  This seemed odd and caused us to poke
around further.

Turns out, there was a specific authorization required on our Ceph cluster (new
as of Luminous), that had not been set, that caused some customers' VM volumes
to not be writable.  We had not noticed this before because no VM hosts had
been rebooted since our Ceph upgrade to Mimic a few weeks ago.  However, VMs
created _after_ the Ceph upgrade were not affected by this issue.  This
explains the disparity between our experience and that of some other tenants.

Figuring the above out, and then having to apply the new permission, in such a
way as to be absolutely safe and not lock out any other customers, took a
non-trivial amount of time.  Measure twice, cut once!

Anyway, once the new permission was applied, load immediately started to drop
on the new machine and we saw VMs unblock from their eternal fsck prompts and
complete their bootup sequence.

We then started to run ping tests on the majority of the VMs on the box and
they ended up being reachable.

We declared this issue resolved at 20:30 PST and haven't seen any further
issues since.

We apologize for this inconvenience and thank you for your patience as we
resolved the matter.

We'd like to remind you that we post real-time updates when any outage occurs
on our Twitter status page:

[https://twitter.com/arpnetworks](https://twitter.com/arpnetworks)

Please follow or at least check this feed before reporting an issue, because it
could very well be that we are already working on it.



