//document.getElementsByTagName("body")[0].setAttribute("display", "none");
(function($){
    $(function(){
        const url_firebase = 'https://fir-test-52ab4.firebaseio.com/Hosting/.json';
        $.ajax({
            url:   url_firebase,
            type:  'get',
            dataType: "json",
            beforeSend: function () {
                $("body").css("display", "none");
                $(".preloader-wrapper").css("display", "block");
            },
            success:  function (response) {
                $("body").css("display", "block");
                $(".preloader-wrapper").css("display", "none");
                console.log(response);
                let dataHost;
                for(data in response){
                    dataHost = response[data];
                }
                $('#mat-logo').html(dataHost.logo);
                $('#header-title').html(dataHost.title);
            }
        });

    }); // end of document ready
})(jQuery); // end of jQuery name space