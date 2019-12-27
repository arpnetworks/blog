---
layout: single
title: "Ceph Is Always Scrubbing, Is That Normal?"
date: 2016-10-26T23:21:08-07:00
author: "Garry Dolley"
tags: ceph
excerpt: "No, it's probably not normal.  This was the case with our cluster."
header:
  teaser: /assets/images/teasers/adrian-dascal-Ce_gQ7Z0eAc-unsplash.jpg
  og_image: /assets/images/teasers/adrian-dascal-Ce_gQ7Z0eAc-unsplash.jpg
  alt: "Wheel washing"
---

No, it's probably not normal.

This was the case with our cluster.  We would always see stuff like the
following when we'd watch ``ceph -w``:

```
2016-10-26 14:30:46.646110 osd.72 [INF] 5.3d7 scrub starts
2016-10-26 14:30:46.650324 osd.72 [INF] 5.3d7 scrub ok
2016-10-26 14:30:47.646236 osd.72 [INF] 5.3d7 scrub starts
2016-10-26 14:30:47.649672 osd.72 [INF] 5.3d7 scrub ok
2016-10-26 14:30:50.646450 osd.72 [INF] 5.3d7 scrub starts
2016-10-26 14:30:50.649940 osd.72 [INF] 5.3d7 scrub ok
2016-10-26 14:30:51.646326 osd.72 [INF] 5.3d7 scrub starts
2016-10-26 14:30:51.649113 osd.72 [INF] 5.3d7 scrub ok
```

In between all the normal ``pgmap``, ``pgs`` and other statistics data.
And it would seem to be going on constantly, no matter what time of day
we check.

Turns out that the output above is a bit misleading, at least to me.  It
looks to me as if it actually scrubbed placement group ``5.3d7``.  But,
in fact, it hadn't.  That's why we'd see it over and over again (and this
would happen to many, many PGs, not just that one).

So what is going on?

Turns out our ``osd scrub load threshold`` was too low.  It was the
default of ``0.5``.  We run hosts with a pretty large number of OSDs, so
it's quite normal for the load average to be above that even when things
are operating perfectly fine (and doesn't seem to go below very much).

Therefore, we added the following to ``ceph.conf``:

```
[osd]
osd scrub load threshold = 2.0
```

And restarted our OSDs (alternatively, one can also ``injectargs``).

This fixed the problem of the constant flood of scrub messages and scrubbing
worked normally again.
