$( document ).ready(function() {

  $(".fancybox").fancybox({
    topRatio: .1,
    maxWidth: 1200,
    maxHeight: 700,
    fitToView: true,
    width: '90%',
    height: '100%',
    autoSize: false,
    closeClick: true,
    openEffect: 'elastic',
    closeEffect: 'elastic'
  });

  $("ul.press").bxSlider({
    pager:false});

  $("ul.players").bxSlider({
    pager:true, controls: false});


  $(".primary-nav .menu-item a").on("click", function(e){
    e.preventDefault();
    var target = $($(this).attr("href"));
    $(target).animatescroll({scrollSpeed:1000,easing:'easeInSine'});
  });

  if ( window.location.pathname != '/' ) {
    var scroll = window.location.pathname.replace(/\//g, '');
    if ( $('.content-section[data-index="' +  scroll + '"]').length ) {
      $('.content-section[data-index="' +  scroll + '"]').animatescroll({scrollSpeed:1000,easing:'easeInSine'});
      }
  }

  $('section').waypoint(function(direction) {
    if (direction === 'down') {
      var target = this.id;
        $("li.menu-item").removeClass('selected');
      $('*[data-scroll="'+target+'"]').parent().addClass('selected');
    }
  }, {
    offset: '100'
  }).waypoint(function(direction) {
      if (direction === 'up') {
        var target = this.id;
        $("li.menu-item").removeClass('selected');
        $('*[data-scroll="'+target+'"]').parent().addClass('selected');
      }
  }, {
    offset: function(){
      return -$(this).height();
    }
  });

  photoRequest('https://picasaweb.google.com/data/feed/api/user/116692373416889365279/albumid/6080100899314119633?imgmax=800', photoContent);

  parseRSS('http://www.boscology.com/wp/category/zubatto-syndicate/feed/', feedContent);

  parseRSS('https://www.google.com/calendar/feeds/fkk8p4afo6csfvu78iqa7g2t58%40group.calendar.google.com/public/basic/?futureevents=true', eventContent);

  videoRequest('https://api.vimeo.com/me/videos?fields=uri', videoContent);


$('.news li a').on('click', function(evt){
  evt.preventDefault();
  });

});

$.fn.scrollLink = function(){
  $(this).click(function(evt){
    var target = evt.target || evt.srcElement;
    var scroll = $(target).attr('data-scroll');

    $.fancybox.close();
    if ( $('.content-section[data-index="' +  scroll + '"]').length ) {
      evt.preventDefault();

      $('.content-section[data-index="' + scroll + '"]').animatescroll({scrollSpeed:1000,easing:'easeInSine'});
      }
  });


  $('.scroll-top a').click(function(evt){
    evt.preventDefault();
    if ( $('.content-section[data-index="' +  scroll + '"]').length ) {
      $('.content-section[data-index="top"]').animatescroll({scrollSpeed:1000,easing:'easeInSine'});
    }
  })
}

$.fn.updatePos = function(){
  console.log(this);
  var section = $(this).closest("section");

  var sectionHeight = section.height();
  var sectionPos = section.position().top;

  var topPos = $(window).height() + $(window).scrollTop();
  //$(document).height();
  var magicNum = Math.ceil( topPos - sectionPos  );
  magicNum -= $(this).height();
  //console.log(magicNum);
  var offset = Math.ceil( $(this).height() / 2.69 );

  if ( $(this).hasClass("up") ) {
    curPos = ( 0 - magicNum ) + offset;
  } else {
    curPos =  magicNum + offset;
  }
  $(this).css("background-position", '100%' + curPos + 'px')

}

function convertMedia(html){
  var pattern1 = /(?:<a href=\")?(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
  var pattern2 = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;

  if(pattern1.test(html)){
    var replacement = '<iframe width="420" height="345" src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

    var html = html.replace(pattern1, replacement);
  }


  if(pattern2.test(html)){
    var replacement = '<iframe width="420" height="345" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>';
    var html = html.replace(pattern2, replacement);
  }
  return html;
}

function parseRSS(url, callback) {
  $.ajax({
    type: "GET",
    url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
    dataType: 'json',
    success: function(data) {
      callback(data.responseData.feed);
    }
  });
}

function videoRequest(url, callback) {
  $.ajax({
    url: document.location.protocol + '//vimeo.com/api/v2/album/2974595/videos.json',

    beforeSend: function (req) {
            req.setRequestHeader('Accept', 'application/vnd.vimeo.*+json;version=3.0');
        },
    success: function(data) {
      callback(data);
    }
  });
}

function photoRequest(url, callback) {
  $.ajax({
    dataType: 'jsonp',
    url: url,
    data: {
      alt: 'json-in-script',
    },
    jsonpCallback: 'picasaCallback',
    success: function(data){
      var photos = [];
      callback(data.feed);
    },
    error: function(){
      alert('failed ;(');
    }
  });
}

function feedContent(data){
  if ( ! data )
    return;

  var length = data.entries.length;
  var feedHTML = "";

  if ( length > 0 ) {
    for (var i = 0; i < 5; i++) {
      var content = data.entries[i].content;

      feedHTML += '<li><a class="fancybox" href="#news'+i+'">' + data.entries[i].title;
      feedHTML += '</a><span>' + data.entries[i].contentSnippet + '</span>';
      feedHTML += '<div id="news' + i + '" style="display:none;"><h1>' + data.entries[i].title + '</h1><h2>'+ data.entries[i].author +'</h2><h3>' +data.entries[i].publishedDate+  '</h3><div>' + content + '</div></li>';

    }
  }

  $('.news ul').append(feedHTML);

  $(".fancybox", '.news').fancybox();
  return;
}

function eventContent(data){
  if ( ! data )
    return;

  var length = data.entries.length;
  var feedHTML = "";

  if ( length > 0 ) {
    for (var i = 0; i < length; i++) {
      var content = data.entries[i].content;


      feedHTML += '<li><a class="fancybox" href="#events'+i+'">' + data.entries[i].title;
      feedHTML += '</a><span>' + data.entries[i].content + '</span>';
      feedHTML += '<div id="events' + i + '" style="display:none;"><h1>' + data.entries[i].title + '<div>' + content + '</div></li>';


    }
  } else {
    feedHTML += '<li>Upcoming shows to be announced soon!</li>';
  }

  $('.shows ul').append(feedHTML);

  $(".fancybox", '.shows').fancybox();

}

function photoContent(data){
  if ( ! data )
    return;


  var length = data.entry.length;
  var feedHTML = "";

  if ( length > 0 ) {
    for (var i = 0; i < length; i++) {
      var item = data.entry[i];

      feedHTML += '<li><a class="fancybox" rel="gallery" href="'+item.content.src+'"><img src="' + item.content.src +'"></a></li>';
    }
  }

  $('.photos ul').append(feedHTML);

  $(".fancybox", '.photos').fancybox();

  $("ul#photos").bxSlider({
    pager:false});
}

function videoContent(data){
  if ( ! data )
    return;

  var length = data.length;
  var feedHTML = "";

  if ( length > 0 ) {
    for (var i = 0; i < length; i++) {
      var content = data[i];

      feedHTML += '<li><div class="wrapper"><div class="thumb"><img src="'+content.thumbnail_large+'"></div><div class="embed"><iframe id="video'+i+'" src="//player.vimeo.com/video/' + content.id + '?&amp;player_id="video'+i+'" width="960" height="540" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div></li>';
    }
  } else {
    return;
  }

  $('.video ul').append(feedHTML);

  $('.embed iframe').each(function(){
      var froogaloop = $f($(this)[0].id);
      $(this).click(function(){
        froogaloop.api('play');
      }).click(function(){
        froogaloop.api('pause');
      });
});

  $('.video ul li').each(function(){
      $(this).mouseover(function(){
        $(this).addClass('active');
      }).mouseout(function(){
        $(this).removeClass('active');
      });
  });
    $("ul#videos").bxSlider({
      pager: false});
}
