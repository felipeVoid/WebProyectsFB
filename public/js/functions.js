(function($){
    $(function(){
        $('#modal-preload').modal();
        const url_firebase = 'https://fir-test-52ab4.firebaseio.com/Hosting/.json';
        $.ajax({
            url:   url_firebase,
            type:  'get',
            dataType: "json",
            beforeSend: function () {
                $('#modal-preload').modal('open');
            },
            success:  function (response) {
                $('#body-body').css({display: "block"});
                $('#modal-preload').modal('close');

                let header = response['header'];
                set_header(header);

                let content = response['content'];
                for (box in content){
                    print_content(content[box]);
                }

                let images = response['images'];
                for (bgImage in images){
                    $('#'+bgImage).attr('src', images[bgImage]);
                }

                let theme_color = response['theme_color'];
                theme_colored(theme_color);

                $('.parallax').parallax();
            }
        });

        function print_content(contentItem) {
            let item = '<div class="col s12 m4">' +
                '<div class="icon-block">'+
                '<h2 class="center '+contentItem.icon_color+'-text"><i class="material-icons">'+contentItem.icon+'</i></h2>'+
                '<h5 class="center">'+contentItem.title+'</h5>'+
                '<p class="light">' +
                contentItem.text+
                '</p>' +
                '</div>' +
                '</div>';
            $('#inner-content').append(item);
        }

        function set_header(headerObj) {
            $('#logo-container').html(headerObj.logo);
            $('#header-title').html(headerObj.title);
            $('#header-text').html(headerObj.text);
            $('#download-button').attr('href', headerObj.button_start);
            $('#img-header').attr('src', headerObj.bg_img);
        }

        function theme_colored(color) {
            let theme_base_color = $('.teal');
            theme_base_color.removeClass('teal');
            theme_base_color.addClass(color);

            let theme_text_color = $('.teal-text');
            theme_text_color.removeClass('teal-text');
            theme_text_color.addClass(color + '-text');
        }
    }); // end of document ready
})(jQuery); // end of jQuery name space

