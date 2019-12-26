---
title: "How to Get MD5 (Old) Hash When You SSH to a Host"
date: 2016-08-29T16:09:59-07:00
author: "Garry Dolley"
excerpt: Newer systems will present a SHA256 hash, but sometimes you need to see the MD5 one
tags: ssh md5
header:
  teaser: /assets/images/teasers/lewis-ngugi-f5pTwLHCsAg-unsplash.jpg
  og_image: /assets/images/teasers/lewis-ngugi-f5pTwLHCsAg-unsplash.jpg
  alt: "Label on computer"
---

When I'm on a Ubuntu 16.04 host and I SSH somewhere for the first time, I
get presented with the SHA256 fingerprint of the destination host key.
For example:

```
$ ssh foo.arpnetworks.com
The authenticity of host 'foo.arpnetworks.com (10.1.1.1)' can't be established.
RSA key fingerprint is SHA256:4Hlf6eNKMRo7YjbswW7Ia9GE8kfN4cml6/5xiXxv+d1.
Are you sure you want to continue connecting (yes/no)?
```

But if this host has an older SSH, and I do the `ssh-key -l -f <key-file>` dance, I get only the MD5 fingerprint, without an option to go SHA256 (e.g. `-E sha256` doesn't exist on older versions).

That's annoying.

Here's a simple solution:

```
$ ssh -o 'FingerprintHash md5' foo.arpnetworks.com
The authenticity of host 'foo.arpnetworks.com (10.1.1.1)' can't be established.
RSA key fingerprint is MD5:ef:d2:d1:98:63:bc:b7:76:0e:90:bd:97:b7:1f:72:f1.
Are you sure you want to continue connecting (yes/no)? 

```

Where have you been all my life `FingerprintHash` ?!

(Note: Hosts, IPs and hashes have been made up to protect the innocent.
;)
