---
layout: single
title: "Fixing Ceph 'rbd: map failed: (6) No such device or address'"
date: 2016-08-26T19:46:31-07:00
author: "Garry Dolley"
tags: ceph
---

Tried to follow along here: [http://docs.ceph.com/docs/hammer/start/quick-rbd/](http://docs.ceph.com/docs/hammer/start/quick-rbd/)

But on my Ubuntu 16.04 client, when it got to the ``rbd map`` command, I
got:

```
$ sudo rbd map foo --pool rbd --name client.admin
rbd: sysfs write failed
rbd: map failed: (6) No such device or address
$
```

Found the reason here: [https://bugs.launchpad.net/ubuntu/+source/ceph/+bug/1578484](https://bugs.launchpad.net/ubuntu/+source/ceph/+bug/1578484)

Got it working with:

```
$ rbd feature disable foo exclusive-lock object-map fast-diff deep-flatten
```

Now the map works:

```
$ sudo rbd map foo --pool rbd --name client.admin
/dev/rbd0
$
```

Has to do with these new Ceph features not being supported by the kernel
client, which is why they must be disabled.
