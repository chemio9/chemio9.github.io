---
title: Stop reinventing `make` in your scripts
description: "Don't revent the wheel"
pubDate: 2026-06-10
lastModDate: ''
draft: false
toc: true
share: true
giscus: true
ogImage: true
---

From time to time, I find myself writing scripts like this:

```bash
for file in *.mp3; do
  ffmpeg -i "$file" "${file%.mp3}.opus" & # run in parallel
done
```

Then I want more, controlling the number of processes or something.

However I realized I'm actually reinventing make at last.

So here is the makefile equal to the above script.

```make
SRCS = $(wildcard *.mp3)

OBJS = $(SRCS:.mp3=.opus)

%.opus: %.mp3
  ffmpeg -i $< $@

out: $(OBJS)
.PHONY: out
```
