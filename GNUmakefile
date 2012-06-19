BJSON := $(wildcard pages-desktop/*/*.bemjson.js)
HTML := $(patsubst %.bemjson.js,%.html,$(BJSON))
PREFIXES := $(patsubst %.bemjson.js,%,$(BJSON))

all:: bem-bl
all:: $(HTML)

BEM=bem

BEM_BUILD=$(BEM) build \
	-l bem-bl/blocks-common/ \
	-l bem-bl/blocks-desktop/ \
	-l blocks-desktop/ \
	-l $(@D)/blocks/ \
	-d $< \
	-t $1 \
	-o $(@D) \
	-n $(*F)

BEM_CREATE=$(BEM) create block \
		-l pages-desktop \
		-T $1 \
		--force \
		$(*F)

%.html: %.bemhtml.js %.css %.js %.ie.css %.bemhtml.js
	$(call BEM_CREATE,bem-bl/blocks-common/i-bem/bem/techs/html.js)

.PRECIOUS: %.bemhtml.js
%.bemhtml.js: %.deps.js
	$(call BEM_BUILD,bem-bl/blocks-common/i-bem/bem/techs/bemhtml.js)

%.deps.js: %.bemdecl.js
	$(call BEM_BUILD,deps.js)

%.bemdecl.js: %.bemjson.js
	$(call BEM_CREATE,bemdecl.js)

.PRECIOUS: %.ie.css
%.ie.css: %.deps.js
	$(call BEM_BUILD,ie.css)

.PRECIOUS: %.css
%.css: %.deps.js
	$(call BEM_BUILD,css)

.PRECIOUS: %.js
%.js: %.deps.js
	$(call BEM_BUILD,js)

DO_GIT=@echo -- git $1 $2; \
	if [ -d $2 ]; \
		then \
			cd $2 && git pull origin master; \
		else \
			git clone $1 $2 -b 0.2; \
	fi

bem-bl:
	$(call DO_GIT,git://github.com/bem/bem-bl.git,$@)

.PHONY: all