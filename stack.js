// Stack is a little JS library that creates a stack of photos from flickr.

var Stack = Class.create();
Stack.prototype = {
  photos:[],
  depth:2,
  container:null,
  options: {},
  defaults: $H({ keep:2, min_rotate:-5, max_rotate:5, speed:1, api_key:'', photos:25, user_id:'', tags:'', text:'', sort:'', randomize:false }),
  initialize:function(container, options) {
    this.container = $(container);
    this.options = this.defaults.merge(options);
    var tag = "%3Cscript src='http://www.flickr.com/services/rest/?method=flickr.photos.search&user_id="+this.options.get('user_id')+"&extras=date_upload,date_taken&tags="+this.options.get('tags')+"&text="+this.options.get('text')+"&sort="+this.options.get('sort')+"&per_page="+this.options.get('photos')+"&format=json&api_key="+this.options.get('api_key')+"' type='text/javascript'%3E%3C/script%3E";
    document.write(unescape(tag));
  },
  add:function(photos) {
    if this.options.get('randomize') {
      photos = photos.reverse().sort(function() {return 0.5 - Math.random()});
    }
    this.photos.push(photos); 
    this.photos = this.photos.flatten();
  },
  drop:function() {
    if (this.photos.length > 0) {
      var new_photo = this.photos.pop();
      var image_url = "http://farm"+new_photo.farm+".static.flickr.com/"+new_photo.server+"/"+new_photo.id+"_"+new_photo.secret+".jpg";
      var photo = this.develop(image_url, new_photo.title);
      this.insert(photo);
          if (this.container.childElements().length > this.options.get('keep')) {
        this.cleanup();
      }
    }
  },
  develop:function(image_url,title) {
    var rotate_range = this.options.get('max_rotate') - this.options.get('min_rotate');
    var rotate = Math.floor(Math.random() * (rotate_range + 1)) - (rotate_range / 2);
    var photo = new Element('div',{'class':'photo','onclick':'stack.drop()','style':'z-index:'+this.depth+';display:none;-moz-transform:rotate('+rotate+'deg);-webkit-transform:rotate('+rotate+'deg)'});
    photo.insert(new Element('img',{'src':image_url,'alt':title}));
    photo.insert(new Element('span').update(title));
    return photo;
  },
  insert:function(photo) {
    this.container.insert({'top':photo}).firstDescendant().appear({'duration':this.options.get('speed')});
    this.depth++;
  },
  cleanup:function() {
    var victims = this.container.childElements().reverse();
    for (var i=0;i<this.options.get('keep');i++) {
      victims.pop();
    }
    victims.each(function(victim) { 
      victim.fade({'delay':this.options.get('speed'),'duration':(this.options.get('speed'))});
      setTimeout(function() { victim.remove() }, (this.options.get('speed') * 2000));
    }.bind(this));
  },
  random:function() {
    return (Math.round(Math.random())-0.5);
  }
}
