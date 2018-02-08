//document.getElementsByTagName("body")[0].setAttribute("display", "none");
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
                $('#modal-preload').modal('close');
                let dataHost;
                for(data in response){
                    dataHost = response[data];
                }
                $('#mat-logo').html(dataHost.logo);
                $('#header-title').html(dataHost.title);
                $('#download-button').attr('href', dataHost.button_start);
            }
        });

    }); // end of document ready
})(jQuery); // end of jQuery name space