( function(){

    $( function() {
        'use strict';

        $.each( $('.user-table__file'), function () {

            new FileInput( $(this) );

        } );

        $.each( $( '.user-table__search' ), function() {

            new AutoComplete( $( this ) );

        } );

        $.each( $( '.lock-dropdown' ), function() {

            new LockDropDown( $( this ) );

        } );

        $.each( $( '.site__field_date' ), function() {

            $( this ).datepicker( {
                dayNamesMin: [ "S", "M", "T", "W", "T", "F", "S" ]
            } );

        } );

        $.each( $( '.user-table__form' ), function() {

            new ResetForm( $( this ) );

        } );

        $.each( $( '.popup__content' ), function() {

            new PopupData( $( this ) );

        } );

        $.each( $('.nice-checkbox'), function () {

            new NiceCheckbox( $(this) );

        } );


    } );

    var FileInput = function (obj) {

        //private properties
        var _self = this,
            _obj = obj,
            _inputFile = _obj.find('input[type=file]'),
            _inputText = _obj.find('input[type=text]');

        //private methods
        var _onEvents = function () {

                _inputFile.on( {
                    change: function() {

                        _inputText.val( $(this).val() )

                    }
                } );

            },
            _init = function () {

                _obj[0].obj = _self;
                _onEvents();

            };

        _init();
    };

    var AutoComplete = function( obj ) {

        //private properties
        var _obj = obj,
            _inputSearch = _obj.find( 'input[type="search"]' ),
            _chosenResult = $( '.user-table__result'),
            _deleteBtn = $('.user-table__result-delete'),
            _changeBtn = $('.user-table__result-change'),
            _chosenItem = _chosenResult.find( '.user-table__result-name'),
            _chosenGameId = _chosenResult.find( '.user-table__result-game-id'),
            _body = $( 'body' ),
            _request = new XMLHttpRequest(),
            _suggestSelected = 0,
            _valueInput,
            _countItems,
            _match = false,
            _selected = false;

        //private methods

        var _addEvents = function() {

                _inputSearch.on( {
                    'keyup': function( I ) {

                        switch( I.keyCode ) {
                            case 13:
                                _suggestSelected = 0;

                                var item = $( '.user-table__search-result').find( '.user-table__search-result-item'),
                                    actItem = $( '.user-table__search-result').find( '.active');

                                if( item.length ) {

                                    if ( _match ) {

                                        $('.user-table__search-warning').addClass('visible');

                                    } else {
                                        $('.user-table__search-warning').removeClass('visible');
                                    }

                                }

                                if( actItem.length ) {

                                    _addChosenItems( actItem.text(), actItem.attr('data-gameId') );
                                    $( '.user-table__search-result' ).remove();
                                    $('.user-table__search-warning').removeClass('visible');

                                } else {

                                    $('.user-table__search-result' ).remove();
                                }



                                return false;

                                break;
                            case 32:
                            case 27:
                            case 38:
                            case 40:
                                break;
                            default:
                                var count = 0;
                                _valueInput = $( this ).val();

                                _match = false;

                                if( _valueInput.length > 0 ) {

                                    _ajaxRequest( $( this ), _valueInput.length );

                                } else {

                                    if( $( this ).val() == '' ){

                                        $( '.user-table__search-result' ).remove();
                                        _suggestSelected = 0;

                                    }

                                }
                                break;
                        }

                    },
                    'keydown': function( I ) {


                        $('.user-table__search-warning').removeClass('visible');

                        switch( I.keyCode ) {
                            case 27:
                                $( '.user-table__search-result' ).remove();

                                _suggestSelected = 0;
                                return false;
                                break;
                            case 38:
                            case 40:
                                I.preventDefault();
                                if( _countItems > 0 ){
                                    _keyActivate( I.keyCode );
                                    if( _suggestSelected == _countItems ){
                                        _suggestSelected = 0
                                    }
                                }
                                break;
                        }
                    }
                } );

                _deleteBtn.click( function() {

                    $('.user-table__result').removeClass('visible');
                    $('.user-table__search-warning').removeClass('visible');
                    $('.user-table__search input').removeClass('hidden');
                    $('.user-table__search input').val('');

                    return false;

                } );
                _changeBtn.click( function() {

                    $('.user-table__result').removeClass('visible');
                    $('.user-table__search-warning').removeClass('visible');
                    $('.user-table__search input').removeClass('hidden');

                    return false;

                } );

                _body.click( function() {
                    $( '.user-table__search-result' ).remove();
                    _suggestSelected = 0;

                    if (_match ) {
                        $('.user-table__search-warning').addClass('visible');
                    } else {
                        $('.user-table__search-warning').removeClass('visible');
                    }

                    _match = false;
                });

                _body.on(
                    "click",
                    ".user-table__search-result",
                    function( event ){
                        event = event || window.event;

                        if ( event.stopPropagation ) {
                            event.stopPropagation();
                        } else {
                            event.cancelBubble = true;
                        }
                    }
                );
                _body.on(
                    "click",
                    ".user-table__search-result-item",
                    function() {
                        var curItem = $( this ),
                            curText = curItem.text(),
                            curItemGameId = curItem.attr('data-gameId');
                        _inputSearch.val( curText );
                        $( '.user-table__search-result' ).remove();
                        _suggestSelected = 0;
                        _addChosenItems( curText, curItemGameId );
                    }
                );
                _body.on(
                    "keydown",
                    ".user-table__search-result",
                    function( I ) {
                        if( I.keyCode == 13 ) {
                            var actItem = $( '.user-table__search-result').find( '.active'),
                                _suggestSelected = 0;
                            _addChosenItems( actItem.text(), actItem.attr('data-gameId') );
                        }
                    }
                );

            },
            _addChosenItems = function( text, gameId ) {

                _chosenResult.addClass('visible');
                _inputSearch.addClass('hidden');
                _chosenItem.html( text );
                _chosenGameId.text( '(Game ID: ['+gameId+'])' );
                _match = false;

            },
            _ajaxRequest = function( input, n ) {
                var path = _obj.attr( 'data-autocomplite' );
                _request.abort();
                _request = $.ajax( {
                    url: path,
                    data: 'value='+ input.val(),
                    dataType: 'json',
                    timeout: 20000,
                    type: "GET",
                    success: function ( msg ) {
                        var $new_arr = [],
                            count = 0;

                        for (var key in msg) {
                            var val = msg[key];
                            for (var key1 in val) {
                                var val1 = val[key1];
                                if( key1 == 'caption' ){

                                    var $pos = val1.toLowerCase().split(input[0].value.toLowerCase());

                                    if ($pos.length >= 2) {
                                        $new_arr.push(val) ;
                                    }

                                    if ( input[0].value.toLowerCase() === val1.toLowerCase() ) {
                                        _match = true;
                                    }
                                }
                            }
                        }

                        $('.user-table__search-result').remove();

                        if( $new_arr.length ) {

                            count = $new_arr.length;

                            $('.user-table__search-no-result').remove();

                            var resultStr='<div class="user-table__search-result">';
                            for( var i = 0; i <= count - 1; i++ ){

                                resultStr += '<div class="user-table__search-result-item" data-gameId="'+$new_arr[i].gameId+'">'+$new_arr[i].caption+'</div>';
                            }
                            resultStr+='</div>';
                            if( !_obj.find( '.user-table__search-result' ).length == 1 ) {
                                _obj.append( resultStr );
                            }
                            _countItems = $( '.user-table__search-result-item' ).length;

                        } else {

                            var resultStr = $('<div class="user-table__search-result user-table__search-no-result"><span class="user-table__search-result-no-matches">No matches</span></div>');

                            _obj.append( resultStr );


                        }
                    },
                    error: function (XMLHttpRequest) {
                        if (XMLHttpRequest.statusText != "abort") {
                            alert("При попытке отправить сообщение произошла неизвестная ошибка. \n Попробуй еще раз через несколько минут.");
                        }
                    }
                } );

                return false;
            },
            _keyActivate = function( n ){
                $( '.user-table__search-result-item' ).eq (_suggestSelected - 1 ).removeClass( 'active' );

                if( n == 40 && _suggestSelected < _countItems){
                    _suggestSelected++;

                } else if( n == 38 && _suggestSelected > 0 ){
                    _suggestSelected--;
                }

                if( _suggestSelected > 0 ){
                    $( '.user-table__search-result-item' ).eq( _suggestSelected - 1 ).addClass( 'active' );
                    _inputSearch.val( $( '.user-table__search-result-item' ).eq( _suggestSelected - 1 ).text() );
                } else {
                    _inputSearch.val( _valueInput );
                }
            },
            _init = function() {
                _addEvents();
            };

        //public properties

        //public methods

        _init();
    };

    var LockDropDown = function (obj) {

        //private properties
        var _self = this,
            _obj = obj,
            _list = _obj.find('.lock-dropdown__list');

        //private methods
        var _onEvents = function () {

                _obj.on( {
                    click: function() {

                        var curItem = $(this);

                        if( curItem.hasClass('opened') ) {

                            curItem.removeClass('opened');

                        } else {

                            curItem.addClass('opened');

                        }

                    }
                } );
                $(document).on(
                    "click",
                    ".lock-dropdown",
                    function( event ){
                        event = event || window.event;

                        if (event.stopPropagation) {

                            event.stopPropagation();

                        } else {

                            event.cancelBubble = true;

                        }
                    }
                );
                $(document).on(
                    "click",
                    "body",
                    function(){

                        if( _obj.hasClass('opened') ) {

                            _obj.removeClass('opened');

                        }

                    }
                );

            },
            _init = function () {

                _obj[0].obj = _self;
                _onEvents();

            };

        _init();
    };

    var ResetForm = function (obj) {

        //private properties
        var _self = this,
            _obj = obj,
            _btnReset = $('.btn_refresh');

        //private methods
        var _onEvents = function () {

                _btnReset.on( {
                    click: function() {

                        _obj.find('.user-table__result').removeClass('visible');
                        _obj.find('.user-table__search-warning').removeClass('visible');
                        _obj.find('.user-table__search input').removeClass('hidden');
                        _obj.find('input').removeClass('valid not-touched not-valid');
                        _obj.find('label').removeClass('not-touched');
                        $('.user-table__search-result' ).remove();
                        _obj.find('.websters-select').removeClass(' valid not-touched');
                        _obj.find('.field').val('');
                        _obj.find('select option').removeAttr('selected');
                        _obj.find('.websters-select ').each( function() {

                            var curElem = $(this),
                                curElemSpan = curElem.find('.websters-select__item'),
                                curElemSelect = curElem.find('select');

                            curElemSelect.find('option').eq(0).attr('selected','selected');
                            curElemSpan.text(''+ curElemSelect.find('option').eq(0).text() +'');

                        } );

                        return false;

                    }
                } );

            },
            _init = function () {

                _obj[0].obj = _self;
                _onEvents();

            };

        _init();
    };

    var PopupData = function (obj) {

        //private properties
        var _self = this,
            _obj = obj,
            _form = _obj.find('.popup-form__items'),
            _fields = _form.find('input, textarea'),
            _scrollConteiner = $( 'html' ),
            _btnSend = _obj.find('button[type=submit]'),
            _lockInput = $('#lock-class'),
            _flag = false,
            _timer = setTimeout( function(){}, 1),
            _popup = $('.popup');

        //private methods
        var _onEvents = function () {

                _btnSend.on( {
                    click: function() {


                        _form.find('input, textarea').each( function() {

                            var field = $(this),
                                fieldName = field.attr('name'),
                                fieldValue = field.val(),
                                type = field.attr('type');

                            if( !( fieldValue == '' ) ){

                                field.removeClass('empty');

                            }

                            if( type === 'email' ) {

                                if( !_validateEmail( field.val() ) ){

                                    field.addClass( 'empty' );

                                }

                            }

                        } );

                        if( !( _fields.filter('.empty').length ) ){

                            _form.find('input, textarea').each( function() {

                                var field = $(this),
                                    fieldName = field.attr('name'),
                                    fieldValue = field.val(),
                                    type = field.attr('type');

                                if( field.is('input[type="checkbox"]') ) {

                                    if( field.prop( "checked" ) ) {

                                        _flag = true;
                                        console.log(''+fieldName+'='+fieldValue);

                                    }

                                } else {

                                    _flag = true;
                                    console.log(''+fieldName+'='+fieldValue);

                                }

                            } );

                            if( _flag ) {

                                if( !(_form.find('#lock-class').val() == '') ) {

                                    var Class = _form.find('#lock-class').val();

                                    $('.user-table__fieldset_opened').removeClass('user-table__fieldset_opened locker-' + Class );

                                }

                                _hidePopup();

                            }




                        } else {

                            _form.find('input, textarea').each( function() {

                                var field = $(this),
                                    fieldName = field.attr('name'),
                                    fieldValue = field.val();

                                if( field.hasClass('empty') ){

                                    field.addClass('error');

                                }

                            } );

                        }

                        return false;

                    }
                } );
                _fields.on( {
                    focus: function() {

                        $(this).removeClass('error');

                    }
                } );
                _fields.on( {
                    keyup: function() {

                        var curItem = $(this),
                            type = curItem.attr('type');

                        if( !( curItem.val() == '' ) ){

                            curItem.removeClass( 'empty' );

                        } else {

                            curItem.addClass( 'empty' );

                        }


                        if( type === 'email' ) {

                            if( !_validateEmail( curItem.val() ) ){

                                curItem.addClass( 'empty' );

                            }

                        }

                    }
                } );

            },
            _hidePopup = function() {

                _popup.removeClass('popup_opened');

                _popup.css( {
                    overflowY: 'hidden'
                } );
                _scrollConteiner.css( {
                    overflowY: 'auto',
                    paddingRight: 0
                } );

                _popup.removeClass( 'popup_opened' );
                _popup.addClass( 'popup_hide' );

                _timer = setTimeout( function(){

                    _popup.css ({
                        overflowY: 'auto'
                    });

                    _popup.removeClass( 'popup_hide' );

                }, 300 );

                _clearFields();

            },
            _clearFields = function() {

                _form.find('input, textarea').each( function() {

                    var field = $(this);

                    field.val('').addClass('empty')

                } );
                _flag = false;

            },
            _addEmptyClass = function() {

                _fields.each( function() {

                    if( $(this).val() === '' ){

                        $(this).addClass( 'empty' );

                    }

                } );

            },
            _validateEmail = function ( email ) {
                var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
                return pattern.test( email );
            },
            _init = function () {

                _obj[0].obj = _self;
                _onEvents();
                _addEmptyClass();

            };

        _init();
    };

    var NiceCheckbox = function (obj) {

        //private properties
        var _self = this,
            _obj = obj,
            _label = _obj.find('label');

        //private methods
        var _onEvents = function () {

                _label.click( function( event ) {

                    if( $(this).hasClass('active') ) {

                        $(this).removeClass('active');
                        $(this).find("input").attr('checked', false);

                    } else {

                        $(this).addClass('active');
                        $(this).find("input").attr('checked', true);

                    }


                } );

            },
            _init = function () {

                _obj[0].obj = _self;
                _onEvents();

            };

        _init();
    };

} )();

