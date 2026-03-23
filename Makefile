.PHONY: local build

local:
	bundle exec jekyll serve --livereload

build:
	bundle exec jekyll build
