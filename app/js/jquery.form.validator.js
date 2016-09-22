( function() {

    $( function() {
        'use strict';

        $.each( $('.user-table__form'), function () {

            new FormValidator( $(this) );

        } );


    } );

    // check all inputs before send data
    var FormValidator = function (obj) {

        //private properties
        var _self = this,
            _obj = obj,
            _fields = _obj.find( 'input:required'),
            _fieldsValid = _obj.find( 'input.validation'),
            _select = _obj.find( 'select:required'),
            _dom = $( 'html, body' ),
            _canType = false;

        //private methods
        var _constructor = function () {
                _onEvents();
                _obj[0].obj = _self;
            },
            _addNotTouchedClass = function () {

                _fields.each( function() {

                    if( $(this).val() === '' ){

                        $(this).addClass( 'not-touched' );
                        $(this).parents('.user-table__row').find('label').addClass('not-touched');

                    }

                } );

                _select.each( function() {

                    if( $(this).find('option:selected').attr('value') === 'default' ) {

                        $(this).parent('.websters-select').addClass('not-touched');
                        $(this).parents('.user-table__row').find('label').addClass('not-touched');

                    }

                } );


                _fields.each( function () {
                    _validateField( $( this ) );
                } );

            },
            _onEvents = function () {

                _obj.on( {
                    keydown: function( event ) {

                        if(event.keyCode == 13) {
                            event.preventDefault();
                            return false;
                        }

                    }

                } );

                _obj.on( {
                    submit: function( event ) {

                        _addNotTouchedClass();

                        if( _fields.hasClass('not-touched') ) {

                            _dom.stop( true, false );
                            _dom.animate( { scrollTop: _obj.offset().top }, 300 );

                            return false;
                        } else {
                            return true;
                        }

                    }

                } );
                _fields.on( {
                    focus: function() {
                        $( this ).removeClass( 'not-touched' );
                        $(this).parents('.user-table__row').find('label').removeClass('not-touched')
                    },
                    keypress: function() {

                        var fieldClass = $( this ).attr( 'class');

                        if( fieldClass.indexOf('site__field_numbers') + 1){

                            return _validateNumber( event );

                        }

                        if( fieldClass.indexOf('site__field_numbers-percent') + 1){

                            return _validateNumber( event );

                        }

                        if( fieldClass.indexOf('site__field_search') + 1){

                            return _validateSearch( event );

                        }

                    },
                    keyup: function( evt ) {

                        var charCode = (evt.which) ? evt.which : event.keyCode;

                        var fieldClass = $( this ).attr( 'class');

                        if( fieldClass.indexOf('site__field_numbers-percent') + 1) {

                            if(_canType) {

                                if ( charCode != 8 && charCode != 46 ) {

                                    $(this).val(function(index, old) { return old.replace(/[^0-9]/g, '') + '%'; });

                                }

                            }

                        }

                        _validateField( $( this ) );
                    }
                } );
                _fieldsValid.on( {
                    keypress: function() {

                        var fieldClass = $( this ).attr( 'class');

                        if( fieldClass.indexOf('site__field_numbers') + 1){

                            return _validateNumber( event );

                        }

                        if( fieldClass.indexOf('site__field_numbers-percent') + 1){

                            return _validateNumber( event );

                        }

                        if( fieldClass.indexOf('site__field_search') + 1){

                            return _validateSearch( event );

                        }

                    },
                    keyup: function( evt ) {

                        var charCode = (evt.which) ? evt.which : event.keyCode;

                        var fieldClass = $( this ).attr( 'class');

                        if( fieldClass.indexOf('site__field_numbers-percent') + 1) {

                            if(_canType) {

                                if ( charCode != 8 && charCode != 46 ) {

                                    $(this).val(function(index, old) { return old.replace(/[^0-9]/g, '') + '%'; });

                                }

                            }

                        }

                        _validateField( $( this ) );
                    }
                } );
                _select.on( {

                    change: function() {
                        $( this).parent('.websters-select').removeClass( 'not-touched' );
                        $(this).parents('.user-table__row').find('label').removeClass('not-touched')
                    }

                } );

            },
            _makeNotValid = function ( field ) {
                field.addClass( 'not-valid' );
                field.removeClass( 'valid' );
            },
            _makeValid = function ( field ) {
                field.removeClass( 'not-valid' );
                field.addClass( 'valid' );
            },
            _validateEmail = function ( email ) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            _validateNumber = function ( evt ) {
                var charCode = (evt.which) ? evt.which : event.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    _canType = false;
                    return false;

                } else {
                    _canType = true;
                    return true;
                }

            },
            _validateSearch = function ( evt ) {
                var regex = new RegExp("^[a-zA-Z0-9]+$");
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                if (!regex.test(key)) {
                    event.preventDefault();
                    return false;
                }

            },
            _validateField = function ( field, e ) {
                var type = field.attr( 'type'),
                    fieldClass = field.attr( 'class');


                if( type === 'email' || type === 'text' ){

                    if( field.val() === '' ){
                        _makeNotValid( field );
                        return false;
                    }

                }

                if( type === 'email' ){
                    if( !_validateEmail( field.val() ) ){
                        _makeNotValid( field );
                        return false;
                    }
                }

                _makeValid( field );
            };

        //public properties

        //public methods
        _self.checkValid = function () {
            var valid = true;

            _fields.each( function () {
                $( this ).removeClass( 'not-touched' );
                if( $( this ).hasClass( 'not-valid' ) ){
                    valid = false;

                }
            } );

            return valid;
        };

        _constructor();
    };

} )();


