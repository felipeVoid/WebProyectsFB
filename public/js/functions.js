(function($){
    $(function(){
        $('#modal-preload').modal();

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
                for (post in posts){
                    print_post(posts[post]);
                }

                let posts_url = response['posts_url'];
                $('.posts-url').attr('href', posts_url);

                $('.parallax').parallax();
                $('.slider').slider();
            }
        });

        $('#image_url').change(function() {
            console.log($('#image_url').val());
            $('#image-preview').attr('src', $(this).val());
        });

        $("#send-post").click(function() {
            let data_post = $('#post-form').serialize();
            try {
                write_post_data(
                    data_post.author,
                    data_post.title,
                    data_post.detail,
                    data_post.image,
                    data_post.content,
                    data_post.author_color,
                    data_post.email);
                console.log('functions:93/listo...');
            }catch (e){
                console.log('functions:95/malo.../'+e);
            }
        });

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
        function print_post(postContent) {
            let item = '<div class="card s12 m4">'+
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
                '<div class="'+postContent.author_color+'">'+
                    '<div class="container">'+
                        'Made by <a class="white-text text-lighten-3" href="http://materializecss.com">'+postContent.author+'</a>'+
                    '</div>'+
                '</div>' +
                '</div>';
            $('#post-container').append(item);
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
        }
        function write_post_data(author, title, detail, image, content, author_color, email) {
            let database = firebase.database();
            let newPostKey = firebase.database().ref().child('Hosting').child('posts').push().key
            firebase.database().ref('Hosting/posts/' + newPostKey).set({
                author: author,
                title: title,
                detail : detail,
                image : image,
                content : content,
                author_color : author_color,
                email : email
            });
        }
    }); // end of document ready
})(jQuery); // end of jQuery name space

