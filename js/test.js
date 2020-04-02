$(function() {

    var k = test = {

        pan: $('#iPAN_sub'),
        pan_real: $('#iPAN'),
        month: $('#month'),
        year: $('#year'),
        holder: $('#iTEXT'),
        cvc: $('#iCVC'),

        isMobile: function() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Windows Phone|Opera Mini/i.test(navigator.userAgent);
        },

        validate: function(el) {
            el = $(el);
            var is_valid = true;
            var id = el.get(0).id;
            var value = el.val();
            var error = $('#'+id+'_error');
            var field = $('#'+id+'_field');
            var error_msg;

            switch (id) {
                case 'iPAN':
                    // check card number
                    if ($.trim(value) == '') {
                        k.show_error(error, 'Поле не может<br/> быть пустым');
                        is_valid = false;
                    } else if (!/^\d{12,19}$/.test(value) || !k.luhn(value)) {
                        k.show_error(error, 'Неверно заполнено<br/> поле номера');
                        is_valid = false;
                    }
                    break;

                case 'month':
                case 'year':
                    field = $('#year_field');
                    error = $('#date_error');

                    // check if card expiration date
                    var dateNow = new Date();
                    var cardDate = new Date();
                    cardDate.setYear(k.year.val());
                    cardDate.setMonth(k.month.val() - 1);
                    if (dateNow.getTime() > cardDate.getTime()) {
                        k.show_error(error, 'Неверно указана<br/> дата');
                        is_valid = false;
                    }
                    break;

                case 'iTEXT':
                    // check card holder
                    if (!/(\s*\w+\s*((\.|'|-)|\s+|$)){1,}/.test(value)) {
                        k.show_error(error, 'Поле не может<br/> быть пустым');
                        is_valid = false;
                    }
                    break;

                case 'iCVC':
                    // check card cvc/cvv code
                    if (!(value == "" || /^\d{3,4}$/.test(value))) {
                        error_msg = 'Если код CVC2/CVV2/CID отсутствует,<br/> оставьте данное поле пустым';
                        is_valid = false;
                    }
                    break;
            }

            if (is_valid) {
                field.removeClass('field-invalid');
                k.hide_error(error);
            } else {
                field.addClass('field-invalid');
                k.show_error(error, error_msg);
            }

            if (id == 'iPAN' && is_valid) {
                window.setTimeout(function() {
                    k.validate(k.year);
                });
            }

            return is_valid;
        },

        luhn: function(num) {
            num = (num + '').replace(/\D+/g, '').split('').reverse();
            if (!num.length)
                return false;
            var total = 0, i;
            for (i = 0; i < num.length; i++) {
                num[i] = parseInt(num[i]);
                total += i % 2 ? 2 * num[i] - (num[i] > 4 ? 9 : 0) : num[i];
            }
            return (total % 10) == 0;
        },

        correctNumberInput: function() {
            var maxlength = parseInt(k.pan_real.attr('maxlength')) || 19;
            var number = k.pan.val().replace(/\D/g, "").substr(0, maxlength);
            var number_sub = number.replace(/(\d{4}(?!$))/g,'$1 ');

            k.pan.val(number_sub);
            k.pan_real.val(number);
        },

        show_error: function(el, msg) {
            var uid = +new Date;

            if (msg) {
                el.html('<div>'+msg+'</div>');
            }

            el.css({
                opacity: 0,
                display: 'block'
            }).attr({
                uid: uid
            }).animate({
                opacity: 1
            }, 'slow', 'swing', function(uid) {
                return function() {
                    setTimeout(function() {
                        if (parseInt(el.attr('uid')) == uid) {
                            k.hide_error(el);
                        }
                    }, 4000);
                }
            }(uid));
        },

        hide_error: function(el) {
            var uid = +new Date;
            el.attr({
                uid: uid
            }).animate({
                opacity: 0
            }, 'slow', 'swing', function() {
                el.css({display: 'none'});
            });
        }

    };

    k.pan.bind('blur', function() {
        k.validate(k.pan_real);
    }).bind('keypress keyup paste', function(evt) {
        setTimeout(function() {
            k.correctNumberInput();
            if (evt.type == 'keyup') {
                k.pan_real.keyup();
            }
        }, 0);
    });

    k.holder.add(k.cvc).bind('blur', function() {
        k.validate(this);
    });

    k.month.add(k.year).bind('change', function() {
        k.validate(this);
    });

    setTimeout(function() { /* fix initial values */
        // Substitute native select
        if (k.isMobile()) {
            var select_str = '<label class="chzn-label chzn-title chzn-container chzn-container-single chzn-container-single-nosearch" title=""><span class="chzn-single chzn-control"><span class="chzn-title">--</span><div><b></b></div></span></label>';
            $('select').each(function() {
                var el = $(this);
                var el_sub = $(select_str).insertBefore(el).width(el.width() + parseInt(el.css('padding-left')) + parseInt(el.css('padding-right')) + parseInt(el.css('border-left-width')) + parseInt(el.css('border-right-width')));
                var title = el_sub.find('.chzn-title');
                title.text(el.find(':selected').text());

                el.change(function() {
                    title.text(el.find(':selected').text());
                });
            });
        } else {
            $('.chzn-select').chosen({
                'disable_search': true
            });
        }

        // equalize card heights
        $('.payment_card_wrapper').css('min-height', $('.payment_card_front').css('height'));
    }, 0);
});
