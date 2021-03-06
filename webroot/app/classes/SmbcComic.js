Ext.define('XV.classes.SmbcComic', {
    extend: 'XV.classes.AbstractComic',
    actComic: null,
    newestComic: null,

    items: null,

    getActComicInfo: function(callback, scope) {
        var url = 'http://feeds.feedburner.com/smbc-comics/PvLb?format=xml';
        Ext.Ajax.request({
            url: url,
            success: function(ret) {
                try {
                    if(typeof ret.responseXML == 'object') {
                        var xml = ret.responseXML;
                        var channels = xml.documentElement.getElementsByTagName('channel');
                        if(channels.length > 0) {
                            var channel = channels[0];
                            var items = channel.getElementsByTagName('item');
                            if(items.length > 0) {
                                this.items = items;
                                this.newestComic = items[0];
                                if(!this.actComic) {
                                    this.actComic = this.newestComic;
                                }
                            }
                        }
                    }
                    if(this.actComic) {

                        callback.call(scope, this, this.getComicInfo());
                    }
                    return;
                } catch(e) {
                    console.log(e);
                }
            },
            failure: function() {},
            scope: this
        });
    },

    getComicInfo: function() {
        var desc = this.actComic.getElementsByTagName('description')[0].firstChild.data;
        var re = /src="([^"])+"/;
        var imgUrl = desc.match(re)[0];
        imgUrl = imgUrl.substr(5, imgUrl.length);
        imgUrl = imgUrl.substr(0, imgUrl.length - 1);
        var data = {
            img: imgUrl,
            orig_link: this.actComic.getElementsByTagName('link')[0].firstChild.data,
            num: this.actComic.getElementsByTagName('pubDate')[0].firstChild.data,
            safe_title: Ext.String.htmlEncode(this.actComic.getElementsByTagName('title')[0].firstChild.data),
            safe_text: ''
        };
        return data;
    },
    prepareNewerComic: function() {
        if(this.getComicIndex(this.actComic) > 0) {
            this.actComic = this.items[this.getComicIndex(this.actComic) - 1];
        } else {
            this.actComic = this.items[0];
        }
    },
    prepareOlderComic: function() {
        var ind = this.getComicIndex(this.actComic);
        if(ind >= 0 && ind < this.items.length - 1) {
            this.actComic = this.items[this.getComicIndex(this.actComic) + 1];
        } else {
            this.actComic = this.items[0];
        }
    },

    hasNewerComic: function() {
        return(this.getComicIndex(this.actComic) > 0);
    },

    hasOlderComic: function() {
        return(this.getComicIndex(this.actComic) < this.items.length - 1);
    },

    getComicIndex: function(comicObj) {
        var link = comicObj.getElementsByTagName('link')[0].firstChild.data;
        for(var i = 0; i < this.items.length; i++) {

            if(this.items[i].getElementsByTagName('link')[0].firstChild.data === link) {
                return i;
            }
        }
        return -1;
    }


});