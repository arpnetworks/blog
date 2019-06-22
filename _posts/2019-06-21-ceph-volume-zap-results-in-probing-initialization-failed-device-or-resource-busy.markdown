---
layout: post
title: "ceph-volume lvm zap results in wipfs error and probing initialization failed: Device or resource busy"
date: 2019-06-21T23:26:49-07:00
author: "Garry Dolley"
---

We were replacing a drive in our Ceph cluster and doing the usual
``ceph-volume zap`` needed to wipe the new device when we were hit with
the following:

```
$ sudo ceph-volume lvm zap /dev/sdg
Running command: /sbin/cryptsetup status /dev/mapper/
--> Zapping: /dev/sdg
Running command: /sbin/wipefs --all /dev/sdg
 stderr: wipefs: error: /dev/sdg: probing initialization failed: Device or resource busy
-->  RuntimeError: command returned non-zero exit status: 1
$
```

I haven't seen this error too often.  It wasn't a completely new drive,
but a used one.  After some investigation, turned out the MD subsystem
(Linux Software RAID) got a hold of it because it had an existing RAID
signature on it, and wouldn't let it go.

To find out which RAID device was holding onto our drive, I did:

```
$ cat /proc/mdstat
Personalities : [raid1] [raid10] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] 
md127 : inactive sdg[0](S)
      1101784 blocks super external:ddf

...[snip]...

unused devices: <none>
$
```

I know it was ``md127`` because it included ``inactive sdg``, which is
the name of our new device.

Now the fix was easy, we just had to stop and remove that superfluous
RAID volume, like so:

```
$ sudo mdadm --stop /dev/md127
mdadm: stopped /dev/md127
$ sudo mdadm --remove /dev/md127
$
```

After that, the ``ceph-volume lvm zap`` command completed without error.
