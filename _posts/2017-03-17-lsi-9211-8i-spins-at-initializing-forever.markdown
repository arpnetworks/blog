---
layout: single
title: "LSI 9211-8i SAS Controller Spins at 'Initializing...' Forever"
date: 2017-03-17T17:41:56-07:00
excerpt: How we solved the spinning "Initializing..." problem of one of our LSI controllers
author: "Garry Dolley"
---

We had this issue when popping an LSI 9211-8i SAS controller into an HP
Proliant DL180se G6.  After the little LSI [splash
screen](https://www.instagram.com/p/BRPCnHBhodG/) [^1] appeared after
POST, it goes into:

```
Initializing..\
```

With the last character spinning... and spinning... forever.

I tried everything to get the thing going:

  * Updated LSI firmware to latest P20 (IT mode, was previously in IR mode)
  * Flashed LSI firmware without BIOS ROM (so this screen is bypassed altogether) [^2]
  * Updated HP Proliant DL180se G6 [backplane firmware](https://www.instagram.com/p/BRZVWRlBvM1/)
  * Attempted to disable option ROM for the card in the BIOS (non-existent)
  * Tried putting the card into every slot and PCI riser combination
    possible
  * Replaced HP mini-SAS to mini-SAS cable with an aftermarket more "generic" one

At the end of the day, the fix was simply to disconnect the I2C cable
going from the backplane to the motherboard.  So simple, yet... so...
ggaahh!!

Footnotes:

[^1]: The adapter malfunctioning error in this screenshot is non-related to this post; I just wanted to show the splash screen.
[^2]: This *does* get the machine to at least boot correctly, without any delays, but no drives are detected in Linux.
