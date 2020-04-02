var pnIsMobile = { 
    Android: function() { return navigator.userAgent.match(/Android/i); }, 
    BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, 
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
    Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, 
    Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, 
    any: function() { return (pnIsMobile.Android() || pnIsMobile.BlackBerry() || pnIsMobile.iOS() || pnIsMobile.Opera() || pnIsMobile.Windows()); } 
}, 
clickEvent = ( pnIsMobile.any() != null && typeof pnIsMobile.any() != 'undefined' ? 'touchstart' : 'click' ),
hintTmt, 
checkbox = {
    init: function(checkboxes){
        $(checkboxes).each(function(q){
            var $l = $(this),
                $i = $l.find('input');

            if ( $i.is(':checked') )
                $l.addClass('checked');

            $i.bind('change', checkbox.check);
        });
    },
    check: function(){
        var $i = $(this),
            $l = $i.parent();

        if ( $i.is(':checked') )
            $l.addClass('checked');
        else
            $l.removeClass('checked');
    }
},
showHint = function(params, $parent){
    var $p = $('#stuffPopup');
    
    $p.removeAttr('class');
    $p.attr({ style: 'display: none;' });

    if ( !params.type || !params.text )
        return;

    $p.addClass(params.type);
    $p.html(params.text);

    if ( params.additionalClass )
        $p.addClass(params.additionalClass);

    if ( $parent )
        $parent.addClass('bigZindex');

    if ( params.type == 'hint' )
        $('.cvvNum .linesWrap span').addClass('hover');


    $p.css({ opacity: 0, display: 'block' });

    var s = {
        _x: $p.outerWidth(),
        _y: $p.outerHeight()
    };
    if ( params.additionalClass && params.additionalClass === 'arrow_left' )
        $p.css({
            top: ( typeof params.offset != 'undefined' && params.offset.top ? params.coords.y - s._y - 15 : params.coords.y) + 'px',
            left: (typeof params.offset != 'undefined' && params.offset.left ? params.coords.x - s._x * .5 : params.coords.x) + 'px'
        });
    else if ( params.additionalClass && params.additionalClass === 'arrow_right' )
        $p.css({
            top: ( typeof params.offset != 'undefined' && params.offset.top ? params.coords.y - s._y - 15 : params.coords.y) + 'px',
            right: '50px'
        });
    else
        $p.css({
            top: ( typeof params.offset != 'undefined' && params.offset.top ? params.coords.y - s._y - 15 : params.coords.y) + 'px',
            left: (typeof params.offset != 'undefined' && params.offset.left ? params.coords.x - s._x * .5 : params.coords.x) + 'px'
        });

    var hide = function(){
        $p.fadeOut(150);
        if ( $parent )
            $parent.removeClass('bigZindex');
        if ( params.type == 'error' )
            $('.blackLayer').fadeOut(150);
    if ( params.type = 'hint' )
        $('.cvvNum .linesWrap span').removeClass('hover');
    };
    if ( params.type == 'error' )
        $('.blackLayer').fadeIn(150);

    $p.animate({ opacity: 1 }, 150, function(){
        $('body').bind(clickEvent, function(e){
            if ( !$(e.target).parent().hasClass('cvvHint') ) {
                hide();
            }
            $('body').unbind(clickEvent);
        });
    });

    clearTimeout(hintTmt);
    hintTmt = setTimeout(function(){
        hide();
    },1500);
},
monthTmt,
logoShowned = false,
showCardLogo = function(char){
    if ( !char ) {
        $('.cardNumWrap img').animate({
            right: '-120px'
        }, 150);

        $('.logos img:eq(1)').animate({
            left: '62px'
        }, 200, function(){
            $('.logos img:eq(0)').animate({
                left: '0px'
            }, 100);
        });       
    } else {
        $('.logos img:eq(0)').animate({
            left: '-' + $('.logos img:eq(0)').width() + 'px'
        }, 100, function(){
            $('.logos img:eq(1)').animate({
                left: '-' + $('.logos img:eq(1)').width() + 'px'
            }, 200);
        });

        $('.cardNumWrap .i' + char).animate({
            right: '10px'
        }, 150);
    }
};

$(function(){
    //Show hint for CVV code
    $('#cvvHintPointer').bind(clickEvent, function(){
        var _c = $('#cvvHintMarker').offset(),
            _p = $('#formPayment').offset(),
            coords = {
                y: (_c.top - _p.top),
                x: (_c.left - _p.left + $('#cvvHintMarker').width() * .5)
            };

        showHint({
            type: 'hint', 
            text: 'Три цифры с оборотной<br />стороны карты.', 
            coords: { x: coords.x, y: coords.y },
            offset: { top: true, left: true }
        });
    });
    //Resize cards
    var p = 400 / 243;
    var resize = function(){
        var $form = $('#formPayment');
        if ( $form.width() <= 400 ) {
            $form.find('fieldset').css({
                height: ($form.width() / p) + 'px'
            });
        } else {
            $form.find('fieldset').css({
                height: '243px',
                width: '100%'
            });
        }
    };
    resize();
    $(window).bind('resize', function(){
        var tmt;
        clearTimeout(tmt);
        tmt = setTimeout(resize, 10);
    });
    //Custom checkboxes
    checkbox.init('.customCheckBox');

    //Only numberic values for inputs, validation and callbacks for each input
    $('.numericInput').bind('focus', function(){
        var $this = $(this),
            val = $this.val();

        $this.addClass('active');

        if ( val == $this.attr('data-value') )
            $this.val('');
    }).bind('blur', function(){
        var $this = $(this),
            val = $this.val();

        if ( val.replace(/\s/g,'').length == 0 ) {
            $this.val( $this.attr('data-value') );
            $this.removeClass('active');
        }
    }).bind('keyup', function(e){
        var $this = $(this),
            $parent = $this.parent(),
            val = $this.val(),
            id = $this.attr('id'),
            _c = $this.offset(),
            _p = $('#formPayment').offset(),
            maxLength = $this.attr('maxlength')
            coords = {
                y: (_c.top - _p.top),
                x: (_c.left - _p.left)
            },
            additionalClass = id == 'iCVC' ? 'arrow_right' : (( id == 'month' || id == 'year' || id == 'iPANmask' ) ? 'arrow_left' : ''),
            goToNextInput = function(){
                if ( $this.val().length == maxLength * 1 ) {
                    var $inputs = $('.numericInput');

                    $inputs.each(function(q){
                        if ( $(this).attr('id') && $(this).attr('id') == id ) {
                            var $newInp = $inputs.eq( (q+1) % $inputs.length );

                            if ( $newInp.val().replace(/[^0-9\s]/g, '').length != $newInp.attr('maxlength') * 1 )
                                $newInp.focus();
                        }
                    });
                } 
            };

        clearTimeout(monthTmt);

        if ( val.replace(/\s/g, '').match(/[^0-9]/g, '') != null ) {
                showHint({
                    type: 'error',
                    text: 'Вы вводите недопустимые символы',
                    additionalClass: additionalClass,
                    coords: { x: coords.x, y: coords.y },
                    offset: { top: true, left: false }
                }, $parent);

            $this.val( val.replace(/[^0-9]/g, '') );
            val = $this.val();
        }

        if ( id == 'iPANmask' ) {
            var keys = [8,37,38,39,40],
                newVal = '';

            val = $this.val().replace(/\s/g, '').substring(0,19);

            if (e == null) { var keycode = e.keyCode * 1; } 
            else { var keycode = e.which * 1; }

            if ( keys.indexOf( keycode ) < 0 ) {
                for ( var i = 0; i < val.length; i++ ) {
                    newVal += val[i];

                    if ( i % 4 == 3 && i <= 12 ) {
                        newVal += ' ';
                    }
                }

                $this.val( newVal );
            }

            $('#iPAN').val( newVal.replace(/\s/g, '') );
            $('#iPAN').trigger('keyup');

            showCardLogo( val.substring(0,1) );
        }

        if ( id == 'month' ) {
            if ( val * 1 > 12 ) {
                showHint({
                    type: 'error',
                    text: 'В году всего 12 месяцев',
                    additionalClass: 'arrow_left',
                    coords: { x: coords.x, y: coords.y },
                    offset: { top: true, left: false }
                }, $parent);

                $this.val('');
                $this.focus();
                val = $this.val();
            }

            if ( val.length == 1 ) {
                monthTmt = setTimeout(function(){
                    $this.val( '0' + val );
                    goToNextInput();
                },1000);
            }
            if ( val.length == 2 )
                clearTimeout(monthTmt);
        }

        if ( id == 'year' ) {
            var currentYear = (new Date()).getUTCFullYear();

            if ( val.length == 2 && val * 1 + 2000 < currentYear ) {
                showHint({
                    type: 'error',
                    text: 'Значение данного поля не может быть меньше ' + currentYear,
                    additionalClass: 'arrow_left',
                    coords: { x: coords.x, y: coords.y },
                    offset: { top: true, left: false }
                }, $parent);

                $this.val('');
                $this.focus();
                val = $this.val();
            }
        }

        goToNextInput();       
    });
});