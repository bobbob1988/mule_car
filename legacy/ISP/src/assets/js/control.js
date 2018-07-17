

    // CREATE/POST
    $('#firmware_update').on('click', function(event) {
        event.preventDefault();
        $(".progress").css('visibility', 'visible');

        var interval = setInterval(function(){

         $.ajax({
            url: '/download/percentage',
            method: 'GET',
            contentType: 'application/json',
            data: JSON.stringify({ }),
            success: function(response) {
                console.log(response.percentage);
                $("#update_progress").css('width',response.percentage +'%');
                var opacity = response.percentage/100;
                $("#console").css('opacity',0.1+opacity);

                var progress_status  = $("#update_progress")[0].style.width.split('%');
                var status = progress_status[0];



                if(status == 10){

                  $("#update_start").html("<i class='fa fa-2x fa-car text-primary mb-2 sr-icons'></i><h5 class='mb-2 text-primary'>Version 1-0-0</h5><i class='fa fa-lg fa-check-square-o text-primary mb-4 sr-icons'></i>");
                  
              }

              if(status == 30){
                  $("#download_finish").html("<i class='fa fa-2x fa-cloud-download text-primary mb-2 sr-icons'></i><h5 class='mb-2 text-primary'>Cloud Download</h5><i class='fa fa-lg fa-check-square-o text-primary mb-4 sr-icons'></i>");

              }

              if(status == 55){
                  $("#firmware_fresh").html("<i class='fa fa-2x fa-wrench text-primary mb-2 sr-icons'></i><h5 class='mb-2 text-primary'>Firmware Flash</h5><i class='fa fa-lg fa-check-square-o text-primary mb-4 sr-icons'></i>");

              }

              if(status == 100){
                  $("#complete").html("<i class='fa fa-2x fa-handshake-o text-primary mb-2 sr-icons'></i><h5 class='mb-2 text-primary'>Complete</h5><i class='fa fa-lg fa-check-square-o text-primary mb-4 sr-icons'></i>");
              }
          }
      });


  }, 0.1); // every 100 milliseconds


        $.ajax({
            url: '/download',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({firmware: 'powertrain-release', version: '1-0-0', percentage:0}),
            success: function(response) {

                response.forEach(function(data) {
                    console.log(data.filename);
                })
                clearInterval(interval);
            }
        });

    });

    // UPDATE/PUT
