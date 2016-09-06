---
layout: post
title: "An Experience on Fixing Stale PGs in Ceph"
date: 2016-09-06T03:03:12-07:00
author: "Garry Dolley"
---

*Warning*: This is **not** a HOWTO, tutorial, or anything you should try
at home.  It's just a write-up of my notes when I was trying to fix a
problem of stale placement groups in our Ceph cluster.  There are
mistakes and things I could have done better.  By publishing my notes, I
figure they will be more useful than keeping them tucked away in some
local text file that nobody else can see.

Notes on fixing stale Placement Groups
--------------------------------------

Our cluster was reporting a couple stale PGs for a while; found out how
to dump them out exactly:

```
  $ sudo ceph pg dump_stuck stale
  ok
  pg_stat state   up      up_primary      acting  acting_primary
  2.51    stale+active+clean      [5]     5       [5]     5
  2.62    stale+active+clean      [4]     4       [4]     4
  $
```

According to Ceph docs, "For stuck stale placement groups, it is
normally a matter of getting the right ceph-osd daemons running again."

So, I tried:

```
  $ sudo /etc/init.d/ceph start osd.4
```

But this didn't seem to do much, so I tried it manually (picking up on
what I saw in ``ps auxwww|grep osd`` output) and found:

```
  $ sudo /usr/bin/ceph-osd -f --cluster ceph --id 4 --setuser ceph --setgroup ceph
  2016-09-02 07:55:32.228492 7f165e2678c0 -1  ** ERROR: unable to open OSD superblock on /var/lib/ceph/osd/ceph-4: (2) No such file or directory
```

Indeed, ``/var/lib/ceph/osd/ceph-4`` is empty.

Oh, maybe I need to mount the drive to that dir?

Can't find the drive.

Letter / number sequences would suggest ``/dev/sde`` but that doesn't
exist under ``/dev``

Now I simply want to remove this OSD altogether:

```
  sudo ceph osd crush remove osd.4
  sudo ceph auth del osd.4
  sudo ceph osd rm 4
```

WTH, this made no difference.  OK, it's gone from ``ceph osd tree``, but
``ceph pg dump_stuck stale`` still reports a problem with a placement
group on "[4]".  Can't I just get it to go somewhere else?

Not sure yet...


OK, so after talking with Ben, looks like the drives for OSDs 4 and 5
were removed and replaced with SSDs.  Given the fact that we're pretty
confident we're never going to get the PGs back that are stale, I
decided that we declare "lost" on those OSDs:

```
  $ ceph osd lost 4
```

Damnit:

```
  $ ceph osd lost 4 --yes-i-really-mean-it
  osd.4 is not down or doesn't exist
  $
```

Ugh. :(

Removing the OSD from before makes it so I can't declare "lost" now,
or something like that.

OK, this is nuts, but:

```
  $ ceph osd getcrushmap -o foo.map
  got crush map from osdmap epoch 2779
  $ crushtool -d foo.map -o foo.map.txt
```

I edited `foo.map.txt` to put osd.4 back in, then:

```
  $ crushtool -c foo.map.txt -o foo.map
  $ ceph osd setcrushmap -i foo.map
```

And it's rebalancing now...  However, never completes (gave it like 10 minutes)

Meanwhile...

Let's take out OSD 5:

```
  $ ceph osd lost 5 --yes-i-really-mean-it
  marked osd lost in epoch 2339
  $
```

So that worked.

Removing OSD 4 again:

```
  $ sudo ceph osd crush remove osd.4
```

*Now* the rebalance works.

However, stale PGs are still there, so Ben and I decided that the "bench" pool wasn't needed, so:

```
  $ rados rmpool bench bench --yes-i-really-really-mean-it
```

...and viola!

This finally got rid of the stale PGs.

It turns out our one pool named "bench" had a replication factor of only
1, and was created in the very beginning of our Ceph cluster days, when
we were still learning how to do things.  When those two PGs went
missing, there was really no way to get them back, because they didn't
exist anywhere else.  Only removing the affected pool got rid of them.
