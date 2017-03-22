/**
 * Created by pofeng on 16/11/17.
 */

(function($) {

    var userAgent = navigator.userAgent;
    var Android = userAgent.indexOf("Android");
    var AppleWebKit=userAgent.indexOf('AppleWebKit');
    var androidVersion = parseFloat(userAgent.slice(Android+8));
    var $img=document.getElementsByTagName('img');
    window.onload= function () {
        if(Android >= 0 && AppleWebKit>=0&&androidVersion>=4){
            forImg('data-original');
        }else{
            forImg('data-url');
        }
    }
    function forImg(data){
        for(var i=0;i<$img.length;i++){
            $img[i].setAttribute('src',$img[i].getAttribute(data));
        }
    }

    //响应式布局字体大小变化
    $.fn.fontFlex = function(max, mid, min) {

        var $this = this;

        $(window).resize(function() {

            var size = window.innerWidth / mid;

            if (size < min) size = min;
            if (size > max) size = max;

            $this.css('font-size', size + 'px');

        }).trigger('resize');
    };

    //动态数字翻滚计数到指定数字
    $.fn.countTo = function (options) {
        options = options || {};

        return $(this).each(function () {
            // set options for current element
            var settings = $.extend({}, $.fn.countTo.defaults, {
                from:            $(this).data('from'),
                to:              $(this).data('to'),
                speed:           $(this).data('speed'),
                refreshInterval: $(this).data('refresh-interval'),
                decimals:        $(this).data('decimals')
            }, options);

            // how many times to update the value, and how much to increment the value on each update
            var loops = Math.ceil(settings.speed / settings.refreshInterval),
                increment = (settings.to - settings.from) / loops;

            // references & variables that will change with each update
            var self = this,
                $self = $(this),
                loopCount = 0,
                value = settings.from,
                data = $self.data('countTo') || {};

            $self.data('countTo', data);

            // if an existing interval can be found, clear it first
            if (data.interval) {
                clearInterval(data.interval);
            }
            data.interval = setInterval(updateTimer, settings.refreshInterval);

            // initialize the element with the starting value
            render(value);

            function updateTimer() {
                value += increment;
                loopCount++;

                render(value);

                if (typeof(settings.onUpdate) == 'function') {
                    settings.onUpdate.call(self, value);
                }

                if (loopCount >= loops) {
                    // remove the interval
                    $self.removeData('countTo');
                    clearInterval(data.interval);
                    value = settings.to;

                    if (typeof(settings.onComplete) == 'function') {
                        settings.onComplete.call(self, value);
                    }
                }
            }

            function render(value) {
                var formattedValue = settings.formatter.call(self, value, settings);
                $self.html(formattedValue);
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0,               // the number the element should start at
        to: 0,                 // the number the element should end at
        speed: 1000,           // how long it should take to count between the target numbers
        refreshInterval: 100,  // how often the element should be updated
        decimals: 0,           // the number of decimal places to show
        formatter: formatter,  // handler for formatting the value before rendering
        onUpdate: null,        // callback method for every time the element is updated
        onComplete: null       // callback method for when the element finishes updating
    };

    function formatter(value, settings) {
        return value.toFixed(settings.decimals);
    }



    // custom formatting example
    $('#count-number').data('countToOptions', {
        formatter: function (value, options) {
            return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
        }
    });

    // start all the timers
    $('.timer').each(count);

    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }




    //新闻内容延迟加载并渐现
    var lazyFade = {
        settings: {
            reverse: false,
            duration: 500,
            delay: 50,
            opacity: {
                start: 0.01,
                end: 1
            }
        },

        init: function (options) {
            var	settings	= $.extend(lazyFade.settings, options),
                index		= (settings.reverse === true) ? this.length : 0;

            return this.each(function () {
                var $this	= $(this);

                lazyFade.fade($this, settings, index);
                (settings.reverse === true) ? --index : ++index;
            });
        },

        fade: function ($object, settings, index) {
            $object.fadeTo(0, settings.opacity.start);
            $object.delay(settings.delay * index).fadeTo(settings.duration, settings.opacity.end);
        }

    };
    $.fn.lazyFade = function (method) {
        if (lazyFade[method]) {
            return lazyFade[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return lazyFade.init.apply(this, arguments);
        }
        else {
            return $.error('Method ' + method + ' does not exist on jQuery.lazyFade');
        }
    };

    //新闻滚动
    $.fn.extend({
        Scroll:function(opt,callback){
            //参数初始化
            if(!opt) var opt={};
            var _btnUp = $("#"+ opt.up);//Shawphy:向上按钮
            var _btnDown = $("#"+ opt.down);//Shawphy:向下按钮
            var timerID;
            var _this=this.eq(0).find("ul:first");
            var     lineH=_this.find("li:first").height(), //获取行高
                line=opt.line?parseInt(opt.line,10):parseInt(this.height()/lineH,10), //每次滚动的行数，默认为一屏，即父容器高度
                speed=opt.speed?parseInt(opt.speed,10):500; //卷动速度，数值越大，速度越慢（毫秒）
            timer=opt.timer //?parseInt(opt.timer,10):3000; //滚动的时间间隔（毫秒）
            if(line==0) line=1;
            var upHeight=0-line*lineH;
            //滚动函数
            var scrollUp=function(){
                _btnUp.unbind("click",scrollUp); //Shawphy:取消向上按钮的函数绑定
                _this.animate({
                    marginTop:upHeight
                },speed,function(){
                    for(i=1;i<=line;i++){
                        _this.find("li:first").appendTo(_this);
                    }
                    _this.css({marginTop:0});
                    _btnUp.bind("click",scrollUp); //Shawphy:绑定向上按钮的点击事件
                });

            }
            //Shawphy:向下翻页函数
            var scrollDown=function(){
                _btnDown.unbind("click",scrollDown);
                for(i=1;i<=line;i++){
                    _this.find("li:last").show().prependTo(_this);
                }
                _this.css({marginTop:upHeight});
                _this.animate({
                    marginTop:0
                },speed,function(){
                    _btnDown.bind("click",scrollDown);
                });
            }
            //Shawphy:自动播放
            var autoPlay = function(){
                if(timer)timerID = window.setInterval(scrollUp,timer);
            };
            var autoStop = function(){
                if(timer)window.clearInterval(timerID);
            };
            //鼠标事件绑定
            _this.hover(autoStop,autoPlay).mouseout();
            _btnUp.css("cursor","pointer").click( scrollUp ).hover(autoStop,autoPlay);//Shawphy:向上向下鼠标事件绑定
            _btnDown.css("cursor","pointer").click( scrollDown ).hover(autoStop,autoPlay);

        }
    })



})(jQuery);
jQuery(document).ready(function($){
    var mainHeader = $('.cd-auto-hide-header'),
        secondaryNavigation = $('.cd-secondary-nav'),
        //this applies only if secondary nav is below intro section
        belowNavHeroContent = $('.sub-nav-hero'),
        headerHeight = mainHeader.height();

    //set scrolling variables
    var scrolling = false,
        previousTop = 0,
        currentTop = 0,
        scrollDelta = 10,
        scrollOffset = 150;

    mainHeader.on('click', '.nav-trigger', function(event){
        // open primary navigation on mobile
        event.preventDefault();
        mainHeader.toggleClass('nav-open');
    });

    $(window).on('scroll', function(){
        if( !scrolling ) {
            scrolling = true;
            (!window.requestAnimationFrame)
                ? setTimeout(autoHideHeader, 250)
                : requestAnimationFrame(autoHideHeader);
        }
    });

    $(window).on('resize', function(){
        headerHeight = mainHeader.height();
    });

    function autoHideHeader() {
        var currentTop = $(window).scrollTop();

        ( belowNavHeroContent.length > 0 )
            ? checkStickyNavigation(currentTop) // secondary navigation below intro
            : checkSimpleNavigation(currentTop);

        previousTop = currentTop;
        scrolling = false;
    }

    function checkSimpleNavigation(currentTop) {
        //there's no secondary nav or secondary nav is below primary nav
        if (previousTop - currentTop > scrollDelta) {
            //if scrolling up...
            mainHeader.removeClass('is-hidden');
        } else if( currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            //if scrolling down...
            mainHeader.addClass('is-hidden');
        }
    }

    function checkStickyNavigation(currentTop) {
        //secondary nav below intro section - sticky secondary nav
        var secondaryNavOffsetTop = belowNavHeroContent.offset().top - secondaryNavigation.height() - mainHeader.height();

        if (previousTop >= currentTop ) {
            //if scrolling up...
            if( currentTop < secondaryNavOffsetTop ) {
                //secondary nav is not fixed
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.removeClass('fixed slide-up');
                belowNavHeroContent.removeClass('secondary-nav-fixed');
            } else if( previousTop - currentTop > scrollDelta ) {
                //secondary nav is fixed
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.removeClass('slide-up').addClass('fixed');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            }

        } else {
            //if scrolling down...
            if( currentTop > secondaryNavOffsetTop + scrollOffset ) {
                //hide primary nav
                mainHeader.addClass('is-hidden');
                secondaryNavigation.addClass('fixed slide-up');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            } else if( currentTop > secondaryNavOffsetTop ) {
                //once the secondary nav is fixed, do not hide primary nav if you haven't scrolled more than scrollOffset
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.addClass('fixed').removeClass('slide-up');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            }

        }
    }
});
