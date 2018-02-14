(function($){
    $(function(){
        let ip_user = '';
        try{
            $.getJSON('https://freegeoip.net/json/?callback=?', function(data) {
                ip_user = data.ip;
            });
        }catch (e){

        }

        $('.modal').modal();

        let palette_colors = [
            'materialize-red',
            'red',
            'pink',
            'purple',
            'deep-purple',
            'indigo',
            'blue',
            'light-blue',
            'cyan',
            'teal',
            'green',
            'light-green',
            'lime',
            'yellow',
            'amber',
            'orange',
            'deep-orange',
            'brown',
            'blue-grey',
            'grey',
            'black',
            'white',
            'transparent',
        ];

        let cont_colors = 0;
        $.each(palette_colors, function(i, p) {
            if (cont_colors !== palette_colors.length-1 &&
                cont_colors !== palette_colors.length-2 &&
                cont_colors !== palette_colors.length-3){
                $('#author_color').append($('<option></option>').val(p).html(p));
            }
            cont_colors++;
        });

        const url_firebase = 'https://fir-test-52ab4.firebaseio.com/Hosting/.json';
        $.ajax({
            url:   url_firebase,
            type:  'get',
            dataType: "json",
            beforeSend: function () {
                let modal_preload = '#modal-preload';
                $(modal_preload).addClass('modal-transparent');
                $(modal_preload).modal('open');
                $('.modal-overlay').addClass('modal-overlay-load');
            },
            success:  function (response) {
                $('.modal-overlay').removeClass('modal-overlay-load');
                $('#body-body').css({display: "block"});
                $('#modal-preload').modal('close');

                let header = response['header'];
                set_header(header);

                let images = response['images'];
                for (bgImage in images){
                    $('#'+bgImage).attr('src', images[bgImage]);
                }

                let theme_color = response['theme_color'];
                theme_colored(theme_color);

                let content = response['content'];
                for (box in content){
                    print_content(content[box],theme_color);
                }

                let slider = response['slider'];
                for (slide in slider){
                    print_slide(slider[slide]);
                }

                let posts = response['posts'];
                let post_index = 0;
                let post_child = 0;
                for (post in posts){
                    if(multiple(post_index)){
                        post_child++;
                    }
                    print_post(posts[post], post_index, post_child);
                    post_index++;
                }

                init();
            },
            error: function (response) {
                console.log(response);
            }
        });

        $('#btn-filter-module').click(function() {
            let update_col = '#post-section > .row > .col';
            $(update_col).removeClass('s12 m4');
            $(update_col).addClass('s12 m4');
            Materialize.fadeInImage(update_col);
        });

        $('#btn-filter-list').click(function() {
            let update_col = '#post-section > .row > .col';
            $(update_col).removeClass('s12 m4');
            $(update_col).addClass('col s12');
            Materialize.fadeInImage(update_col);
        });

        let image_change = function() {
            let image_previw = '#image-preview';
            $(image_previw).attr('src', $(this).val());
            $(image_previw).on('error', function() {
                $(image_previw).attr('src', 'img/no-preview-available.png');
            });
        };
        let image_url = '#image_url';
        $(image_url).keyup(image_change);
        $(image_url).change(image_change);

        $("#send-post").click(function() {
            let post_form = '#post-form';
            let BreakException = {};
            try {
                let data_post = $(post_form).serializeArray();
                for(post in data_post){
                    if(data_post[post].value === '') throw BreakException;
                }

                write_post_data(
                    clear_content_html(data_post[0].value, 1),
                    clear_content_html(data_post[1].value, 1),
                    clear_content_html(data_post[2].value, 1),
                    clear_content_html(data_post[3].value, 1),
                    clear_content_html(data_post[4].value, 1),
                    clear_content_html(data_post[5].value, 1),
                    clear_content_html(data_post[6].value, 0));

                $(post_form).trigger("reset");
                $('#modal-post-title').html('ANONFACT añadido!');
                $('#modal-post-text').html('<div class="def-color-text">Continuar agregando?</div>');
            }catch (e){
                $('#modal-post-title').html('ERROR!');
                $('#modal-post-text').html('<div class="def-color-text">Error: Todos los campos son obligatorios!</div>');
            }
            $('#modal-post').modal('open');
            $("#modal-ver-posts").click(function() {
                window.location.replace('/posts');
            });

        });

        function clear_content_html(rawString,case_html) {
            let clean_html = rawString;
            switch (case_html){
                case 0:
                    clean_html = clean_html.replace('<script type="text/javascript">', '');
                    clean_html = clean_html.replace('<script>', '');
                    clean_html = clean_html.replace('<script', '');
                    clean_html = clean_html.replace('</script>', '');
                    break;
                case 1:
                    clean_html = clean_html.replace(/<[^>]*>/g,'');
                    break;
            }
            return clean_html;
        }
        function get_date_now() {
            let d = new Date();
            let day = d.getDate();
            let month = d.getMonth()+1;
            let year = d.getFullYear();

            let day_length = day.toString().length;
            let month_length = month.toString().length;
            if(day_length < 2){
                day = '0'+day;
            }
            if(month_length < 2){
                month = '0'+month;
            }

            let hour = d.getHours();
            let minute = d.getMinutes();

            return day + '-' + month + '-' + year + ', ' + hour + ':' + minute;
        }
        function init(){
            $('.parallax').parallax();
            $('.slider').slider();
            $('select').material_select();
        }
        function multiple(value){
            return ( value % 3 === 0 );
        }
        function print_content(contentItem, defColor) {
            let defColorContent = contentItem.icon_color;
            if(defColorContent === 0)defColorContent = defColor;
            let item = '<div class="col s12 m4">' +
                '<div class="icon-block">'+
                '<h2 class="center '+defColorContent+'-text"><i class="material-icons">'+contentItem.icon+'</i></h2>'+
                '<h5 class="center">'+contentItem.title+'</h5>'+
                '<p class="light">' +
                contentItem.text+
                '</p>' +
                '</div>' +
                '</div>';
            $('#inner-content').append(item);
        }
        function print_post(postContent, index, child) {
            let item = '<div class="col s12 m4 anim-post">'+
                '<div class="card">'+
                '<div class="card-image waves-effect waves-block waves-light">'+
                '<img class="activator" src="'+postContent.image+'">'+
                '</div>'+
                '<div class="card-content left-align">'+
                '<span class="card-title activator grey-text text-darken-4">'+postContent.title+'<i class="material-icons right">more_vert</i></span>'+
                '<p><b>'+postContent.detail+'</b></p>'+
                '</div>'+
                '<div class="card-reveal">'+
                '<span class="card-title grey-text text-darken-4"><b>'+postContent.title+'</b><i class="material-icons right">close</i></span>'+
                '<div>'+postContent.content+'</div>'+
                '</div>'+
                '<div class="center '+postContent.author_color+'">'+
                '<div class="container">'+
                'Made by <a class="white-text text-lighten-3" href="http://materializecss.com">'+postContent.author+'</a>'+
                '</div>'+
                '</div>' +
                '</div>' +
                '</div>';
            let post_container = '<div id="post-container'+child+'" class="row"></div>';
            if(multiple(index)){
                $('#post-section').append(post_container)
            }
            $('#post-container'+child).append(item);
        }
        function print_slide(contentItem) {
            let item = '<li>'+
                '<img src="'+contentItem.image+'">'+
                '<div class="caption '+contentItem.text_align+'-align">'+
                '<h3 class="'+contentItem.title_color+'-text">'+contentItem.title+'</h3>'+
                '<h5 class="light '+contentItem.text_color+'-text text-lighten-3">'+contentItem.text+'</h5>'+
                '</div>'+
                '</li>';
            $('#home-slider').append(item);
        }
        function set_header(headerObj) {
            $('#logo-container').html(headerObj.logo);
            $('#header-title').html(headerObj.title);
            $('#header-text').html(headerObj.text);
            $('#download-button').attr('href', headerObj.button_start);
            $('#img-header').attr('src', headerObj.bg_img);
            $('.posts-url').attr('href', headerObj.button_start);
            $('.posts-url i').html(headerObj.post_icon);
        }
        function set_slide_color(themeColor) {
            let slide_active_color = '#673ab7';
            switch (themeColor){
                case palette_colors[0]:
                    slide_active_color = '#e51c23';
                    break;
                case palette_colors[1]:
                    slide_active_color = '#F44336';
                    break;
                case palette_colors[2]:
                    slide_active_color = '#e91e63';
                    break;
                case palette_colors[3]:
                    slide_active_color = '#9c27b0';
                    break;
                case palette_colors[4]:
                    slide_active_color = '#673ab7';
                    break;
                case palette_colors[5]:
                    slide_active_color = '#3f51b5';
                    break;
                case palette_colors[6]:
                    slide_active_color = '#2196F3';
                    break;
                case palette_colors[7]:
                    slide_active_color = '#03a9f4';
                    break;
                case palette_colors[8]:
                    slide_active_color = '#00bcd4';
                    break;
                case palette_colors[9]:
                    slide_active_color = '#009688';
                    break;
                case palette_colors[10]:
                    slide_active_color = '#4CAF50';
                    break;
                case palette_colors[11]:
                    slide_active_color = '#8bc34a';
                    break;
                case palette_colors[12]:
                    slide_active_color = '#cddc39';
                    break;
                case palette_colors[13]:
                    slide_active_color = '#ffeb3b';
                    break;
                case palette_colors[14]:
                    slide_active_color = '#ffc107';
                    break;
                case palette_colors[15]:
                    slide_active_color = '#ff9800';
                    break;
                case palette_colors[16]:
                    slide_active_color = '#ff5722';
                    break;
                case palette_colors[17]:
                    slide_active_color = '#795548';
                    break;
                case palette_colors[18]:
                    slide_active_color = '#607d8b';
                    break;
                case palette_colors[19]:
                    slide_active_color = '#9e9e9e';
                    break;
                case palette_colors[20]:
                    slide_active_color = '#000000';
                    break;
                case palette_colors[21]:
                    slide_active_color = '#FFFFFF';
                    break;
                case palette_colors[22]:
                    slide_active_color = 'transparent';
                    break;
            }
            return slide_active_color;
        }
        function theme_colored(color) {
            let def_color = 'def-color';

            let BreakException = {};
            let isColor = true;
            try {
                palette_colors.forEach(function (element) {
                    if (color === element) {
                        isColor = false;
                        throw BreakException;
                    }
                });
            } catch (e) {
                if (e !== BreakException) throw e;
            }

            if(isColor)color = 'deep-purple';

            let theme_base_color = $('.' + def_color);
            theme_base_color.removeClass(def_color);
            theme_base_color.addClass(color);

            let theme_text_color = $('.' + def_color + '-text');
            theme_text_color.removeClass(def_color + '-text');
            theme_text_color.addClass(color + '-text');

            $('.input-field input[type=text]:focus').addClass(color + '-text');
            $('.input-field label').addClass('grey-text');
            let input_bottom_line = 'input:not([type]):focus:not([readonly]),'+
                'input[type=text]:not(.browser-default):focus:not([readonly]),'+
                'input[type=password]:not(.browser-default):focus:not([readonly]),'+
                'input[type=email]:not(.browser-default):focus:not([readonly]),'+
                'input[type=url]:not(.browser-default):focus:not([readonly]),'+
                'input[type=time]:not(.browser-default):focus:not([readonly]),'+
                'input[type=date]:not(.browser-default):focus:not([readonly]),'+
                'input[type=datetime]:not(.browser-default):focus:not([readonly]),'+
                'input[type=datetime-local]:not(.browser-default):focus:not([readonly]),'+
                'input[type=tel]:not(.browser-default):focus:not([readonly]),'+
                'input[type=number]:not(.browser-default):focus:not([readonly]),'+
                'input[type=search]:not(.browser-default):focus:not([readonly]),'+
                'textarea.materialize-textarea:focus:not([readonly]){'+
                'border-bottom:1px solid '+set_slide_color(color)+';' +
                'box-shadow:0 1px 0 0 '+set_slide_color(color)+';}';

            let icon_prefix = '.input-field .prefix.active{color:'+set_slide_color(color)+';}';

            let select_text_color = '.dropdown-content li > a, .dropdown-content li > span{color:'+set_slide_color(color)+';}';
            $('body').append("<style>" +
                input_bottom_line +
                icon_prefix +
                select_text_color +
                "</style>");
        }
        function write_post_data(author, author_color, image_url, email, title, detail, content_html) {
            let date_now = get_date_now();
            let postData = {
                author: author,
                title: title,
                detail : detail,
                image : image_url,
                content : content_html,
                author_color : author_color,
                email : email,
                ip: ip_user,
                post_date:date_now
            };
            // Get a key for a new Post.
            let newPostKey = firebase.database().ref().child('Hosting').child('posts').push().key;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            let updates = {};
            updates['/Hosting/posts/' + newPostKey] = postData;
            return firebase.database().ref().update(updates);
        }

        //VMS API GrupoZ
        function vms_grupoz(pageValue){
            let data_videos;
            $.ajax({
                type: "GET",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", 'bearer 59026a6cd7dd4cc7a5517090659b9bf6');
                },
                url: "https://rinnolab.vms.grupoz.cl/api/v1/video",
                data: "page="+pageValue,
                processData: false,
                success: function(data) {
                    data_videos = data;
                    return data_videos;
                }
            });
        }

    }); // end of document ready
})(jQuery); // end of jQuery name space

