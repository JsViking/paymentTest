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
ableToNextStep = true,
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
        if ( typeof params.autoFade == 'undefined' || params.autoFade ) {
            $('body').bind(clickEvent, function(e){
                if ( !$(e.target).parent().hasClass('cvvHint') ) {
                    hide();
                }
                $('body').unbind(clickEvent);
            });
        } else {
            params.fadeBack();
        }
    });

    if ( typeof params.autoFade == 'undefined' || params.autoFade ) {
        clearTimeout(hintTmt);
        hintTmt = setTimeout(function(){
            hide();
        },1500);
    }
},
hideErrorHint = function($parent){
    var $p = $('#stuffPopup');

    $p.hide();
    $parent.removeClass('bigZindex');
    $('.blackLayer').hide();
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

function validCardNum(num){
    var result = 0;
    num = num.split('').reverse().join('');
    for ( var i = 0; i < num.length; i++ ) {
        var tmp = num[i] * ( 1 + i % 2);
        result += tmp - (tmp > 9 ? 9 : 0);
    }

    return result % 10 == 0;
};

/*function paymentFormIsValid(){
    var result = true,
        month = parseInt($('#month').val()),
        year = parseInt($('#yearMask').val()),
        date = cardDate = new Date(),
        cardNum = $('#iPAN').val().replace(/[^0-9\s]/g, '');

        cardDate.setMonth( month - 1 );
        cardDate.setFullYear( year );

    if ( isNaN(month) || isNaN(year) || cardDate.getMilliseconds() < date.getMilliseconds() )
        result = false;

    if ( $('#iCVC').val().replace(/[^0-9\s]/g, '').length < 3 )
        result = false;

    if ( cardNum.length < 16 || !validCardNum( cardNum ) )
        result = false;

    if ( result ) {
        $('#buttonPayment').removeAttr('disabled');
    } else {
        $('#buttonPayment').attr({ disabled: 'disabled' });
    }
};*/

function cursorPos(obj){
    if( obj.selectionStart ) return obj.selectionStart;
    else if ( document.selection ) {
        var sel = document.selection.createRange(),
            clone = sel.duplicate();
        
        sel.collapse(true);
        clone.moveToElementText(obj);
        clone.setEndPoint('EndToEnd', sel);
        return clone.text.length;
    }

    return 0;
};
function setCursorPos(obj,n){
    if (! document.all ) {
        var end = obj.value.length;  
            obj.setSelectionRange(n,n);  
            obj.focus();  
    } else {      
        var r = obj.createTextRange();      
            r.collapse(true);
            r.moveStart("character", n);
            r.moveEnd("character", 0);
            r.select();
    }
};


$(function(){
    $('#iPANmask').focus().addClass('active');
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

        if ( $this.attr('data-value') && val.toLowerCase().replace(/\s/g, '') == $this.attr('data-value').toLowerCase().replace(/\s/g, '') )
            $this.val('');
    }).bind('blur', function(){
        var $this = $(this),
            val = $this.val();

        if ( $this.attr('data-value') && val.replace(/\s/g,'').length == 0 ) {
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
            additionalClass = id == 'iCVC' ? 'arrow_right' : (( id == 'monthMask' || id == 'yearMask' || id == 'iPANmask' ) ? 'arrow_left' : ''),
            goToNextInput = function(){
                if ( ableToNextStep && $this.attr('id') != 'iCVC' ){
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
                }
            }, maskTmt = 0;

            if (e == null) { var keycode = e.keyCode * 1; } 
            else { var keycode = e.which * 1; }            

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

        if ( keycode == 8 )
            hideErrorHint( $parent );

        if ( id == 'iPANmask' ) {
            clearTimeout(maskTmt);
            var newVal = '', 
                keys = [37,38,39,40],
                DOMobj = $this[0],
                lastCursorPos = cursorPos( DOMobj );

                //$('#iPANmask')[0]

            //maskTmt = setTimeout(function(){
            val = $this.val().replace(/\s/g, '').substring(0,19);

            if ( keys.indexOf( keycode ) < 0 ) {
                for ( var i = 0; i < val.length; i++ ) {
                    newVal += val[i];
                    if ( i % 4 == 3 && i <= 12 && i < val.length - 1 ) {
                        newVal += ' ';
                    }
                }
                $this.val( newVal );
            }

            if ( lastCursorPos < val.length )
                setCursorPos(DOMobj, lastCursorPos);

            $('#iPAN').val( newVal.replace(/\s/g, '') );
            $('#iPAN').trigger('keyup');

            showCardLogo( val.substring(0,1) );

            if ( val.length >= 16 && !validCardNum( val ) ) {
                ableToNextStep = false;
                showHint({
                    type: 'error',
                    text: 'Номер карты введен неверно',
                    additionalClass: 'arrow_left',
                    autoFade: false,
                    coords: { x: coords.x, y: coords.y },
                    offset: { top: true, left: false },
                    fadeBack: function(){
                        if ( val.length >= 16 && validCardNum( val ) ) {
                            $('#stuffPopup').fadeOut(150);
                            $parent.removeClass('bigZindex');
                            $('.blackLayer').fadeOut(150);

                            ableToNextStep = true;
                            goToNextInput();
                        }
                    }
                }, $parent);
            } else if ( val.length >= 16 && validCardNum( val ) ) {
                $('#stuffPopup').fadeOut(150);
                $parent.removeClass('bigZindex');
                $('.blackLayer').fadeOut(150);

                ableToNextStep = true;
                goToNextInput();
            }

            //console.log(  );
            //},1000);



            /*var keys = [37,38,39,40],
                newVal = '';

            val = $this.val().replace(/\s/g, '').substring(0,19);

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

            if ( val.length >= 16 && !validCardNum( val ) ) {
                ableToNextStep = false;
                showHint({
                    type: 'error',
                    text: 'Номер карты введен неверно',
                    additionalClass: 'arrow_left',
                    autoFade: false,
                    coords: { x: coords.x, y: coords.y },
                    offset: { top: true, left: false },
                    fadeBack: function(){
                        if ( val.length >= 16 && validCardNum( val ) ) {
                            $('#stuffPopup').fadeOut(150);
                            $parent.removeClass('bigZindex');
                            $('.blackLayer').fadeOut(150);

                            ableToNextStep = true;
                            goToNextInput();
                        }
                    }
                }, $parent);
            } else if ( val.length >= 16 && validCardNum( val ) ) {
                $('#stuffPopup').fadeOut(150);
                $parent.removeClass('bigZindex');
                $('.blackLayer').fadeOut(150);

                ableToNextStep = true;
                goToNextInput();
            }*/
        }

        if ( id == 'monthMask' ) {
            if ( keycode != 9 )
                clearTimeout(monthTmt);

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

            $('#month').val(val);
        }

        if ( id == 'yearMask' ) {
            var currentYear = (new Date()).getUTCFullYear();

            if ( val.length == 2 && val * 1 + 2000 < currentYear ) {
                showHint({
                    type: 'error',
                    text: 'Значение данного поля не может быть меньше ' + (currentYear - 2000),
                    additionalClass: 'arrow_left',
                    coords: { x: coords.x, y: coords.y },
                    offset: { top: true, left: false }
                }, $parent);

                $this.val('');
                $this.focus();
                val = $this.val();
            }

            $('#year').val('20' + val);
        }

        goToNextInput();
    });
});