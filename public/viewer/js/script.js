/* Author: Vekz, biatches

*/

$(document).ready( function () {
    var buildGallery = function (data) {
        var secondsPerUrl = 5;
        var batches = [];
        var batchSizes = {};
        var urls = [];
        var counter = 0;

        $.each(data, function (index, item) { if (-1 == $.inArray(item.url, urls)) { urls.push(item.url); };
                                              if (-1 == $.inArray(item.batch_id, batches)) { batches.push(item.batch_id); };
                                              if (undefined != batchSizes[item.batch_id]) { batchSizes[item.batch_id] += 1; }
                                              else { batchSizes[item.batch_id] = 1; };
                                            });

        $.each(batchSizes, function (index, count) {
            console.log(index + ": " + count);
        });
        
        $.each(batches, function (b_index, batch_id) {
            html_output = '<div id="batch_' + batch_id + '" class="batch">';
            console.log("Checking for batch: " + batch_id);

            var columns = 2; //Math.min(batchSizes[batch_id], 1);
            $.each(urls, function (u_index, url) {

                var columnCounter = 1;
                html_output += '<div id="batch_url_wrapper_' + counter + '" style="display:none;">';
                html_output += '<div class="info_bar">' + 'Batch: ' + batch_id + ' - ' + url + '</div>';

                console.log("Checking for url: " + url);
                var matching = data.filter(function(ss) {console.log(ss.batch_id + " == " + batch_id + " && " + ss.url + " == " + url + " ?");
                                                         return ss.batch_id == batch_id && ss.url == url; });

                if (matching.length > 0) {
                    counter += 1;
                    var count = columns;
                    var desired_width = $(window).width() * 0.95;
                    var width = desired_width / count ;
                    
                    html_output += '<div class="batch_images">';
                    $.each(matching, function (u_index, match) {
                        columnCounter += 1;
                        if (0 == columnCounter % columns) {
                            html_output += "<br />";
                        }
                        console.log(match);
                        html_output += '<img src="' + match.absolute_url + '" width=' + width + ' data-x-url="' + url + '"/>';
                    });
                    html_output += '</div></div>'
                    
                    $("div#gallery").append(html_output + '</div>');
                }
            });
            $("div#gallery").append('</div>');
        });

        console.log(urls);
        console.log(batches);

        var batchCount = counter;
        var batchIndex = 0;
        var rotateImages = function() {
            if (0 == batchIndex) {
                previousIndex = batchCount - 1;
            } else {
                previousIndex = batchIndex - 1;
            }

            //console.log("fadeOut: [" + previousIndex + "] fadeIn: [" + batchIndex + "]!");
            
            $("div#batch_url_wrapper_" + previousIndex).fadeOut()
            $("div#batch_url_wrapper_" + batchIndex).fadeIn()

            batchIndex += 1;
            if (batchCount <= batchIndex) {
                batchIndex = 0;
                location.reload();
            }
        }

        rotateImages();
        window.setInterval(rotateImages, secondsPerUrl * 1000);
    };

    api_key = getUrlVars()["api_key"];
    
    $.ajax({
        url: "/users/1/screenshots.json?api_key=" + api_key,
        dataType: 'json',
        success: buildGallery
    });

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }
});
