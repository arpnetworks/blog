---
title: "How to Speed Test Your New Infiniband Card"
date: 2016-11-07T19:21:09-08:00
author: "Garry Dolley"
tags: infiniband
header:
  image2: /assets/images/speed-cropped-2.jpg
---

So, you grabbed a few Infiniband cards for cheap off eBay and are
wondering if they're any good?

Here's a quick way to throw some data through them and see.  You need
two cards and two Linux boxes.  In the examples below, I'm using Ubuntu
Linux and the interface name of the IB card is simply ``ib0``.
``iperf`` is already installed (``apt-get install iperf``).

On both boxes, we'll use IPoIB (IP over Infiniband) to assign a couple
temporary IPs and ``iperf`` to run a performance test.  It's important
to put the cards into ``connected`` mode and set a large MTU:

{% highlight shell %}
$ sudo modprobe ib_ipoib
$ sudo sh -c "echo connected > /sys/class/net/ib0/mode"
$ sudo ifconfig ib0 10.0.0.1   # Use .2 for the other box
$ sudo ifconfig ib0 mtu 65520
{% endhighlight %}

On the first box, put ``iperf`` into server mode:

{% highlight shell %}
$ sudo iperf -s -i 1
------------------------------------------------------------
Server listening on TCP port 5001
TCP window size:  128 KByte (default)
------------------------------------------------------------
{% endhighlight %}

On the second box, throw data at your first one (``-P 2`` means to use 2
threads):

{% highlight shell %}
$ iperf -c 10.0.0.1 -P 2
------------------------------------------------------------
Client connecting to 10.0.0.1, TCP port 5001
TCP window size: 1.20 MByte (default)
------------------------------------------------------------
[  4] local 10.0.0.2 port 46048 connected with 10.0.0.1 port 5001
[  3] local 10.0.0.2 port 46046 connected with 10.0.0.1 port 5001
[ ID] Interval       Transfer     Bandwidth
[  4]  0.0-10.0 sec  14.6 GBytes  12.5 Gbits/sec
[  3]  0.0-10.0 sec  14.6 GBytes  12.5 Gbits/sec
[SUM]  0.0-10.0 sec  29.2 GBytes  25.0 Gbits/sec
$
{% endhighlight %}

So, there you have it.  The cards in the above example are pushing a healthy 25
Gbps.  It'll be even faster if using pure Infiniband applications (rather than
IPoIB, since more processing is done in the Infiniband hardware, rather than
CPUs having to shuffle the TCP/IP stack, among other factors).
