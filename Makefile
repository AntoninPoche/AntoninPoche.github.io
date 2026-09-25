.PHONY: local build

BUNDLE ?= bundle

# In WSL, the Windows `bundle` launcher may point to `ruby` instead of `ruby.exe`.
ifneq (,$(findstring microsoft,$(shell uname -r 2>/dev/null | tr A-Z a-z)))
ifneq (,$(shell command -v ruby.exe 2>/dev/null))
BUNDLE = ruby.exe -S bundle
endif
endif

local:
	$(BUNDLE) exec jekyll serve --livereload

build:
	$(BUNDLE) exec jekyll build
