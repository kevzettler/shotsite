/* Author: Vekz, biatches

*/

$(document).ready( function () {
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    var buildGallery = function (data) {
        var secondsPerUrl = 5;
        var urls = [];
        var counter = 0;
        var total = 0;

        function showData(raw) {
            var data = buildData(raw);
            buildHtml(data);
            startShow();
        };

        function buildData(jobs) {
            var displayData = {};

            $.each(jobs, function(job_index, job) {
                displayData[job_index] = {};
                displayData[job_index].urls = JSON.parse(job["urls"]);
                displayData[job_index].browser_count = JSON.parse(job["browsers"]).length;
                displayData[job_index].id = job.id;
                displayData[job_index].batches = {};

                $.each(job["batches"], function(batch_index, batch) {
                    displayData[job_index].batches[batch_index] = {};
                    displayData[job_index].batches[batch_index].id = batch.id;

                    displayData[job_index].batches[batch_index].urls = {};

                    $.each(batch["screenshots"], function(index, screenshot) {
                        if (displayData[job_index].batches[batch_index].urls[screenshot.url]) {
                            displayData[job_index].batches[batch_index].urls[screenshot.url].push(screenshot.absolute_url);
                        }else{
                            displayData[job_index].batches[batch_index].urls[screenshot.url] = [screenshot.absolute_url];
                        }
                    });
                });
            });

            return displayData;
        };

        function buildHtml(jobs) {
            var counter = 0;
            var html_output = "";
            var screenSize = $(window).width() * 0.95;
            var columns = 0;
            var width = 0;



            for (job_index in jobs) {
                var job = jobs[job_index];
                html_output += '<div id="job_' + job.id + '" class="job">';

                switch(job.browser_count)
                {
                case 1:
                    columns = 1;
                    break;
                case 2:
                    columns = 2;
                    break;
                case 3:
                    columns = 3;
                    break;
                case 4:
                    columns = 3;
                    break;
                case 5:
                    columns = 3;
                    break;
                case 6:
                    columns = 3;
                    break;
                }

                for (batch_index in job.batches) {
                    var batch = job.batches[batch_index];
                    html_output += '<div id="batch_' + batch.id + '" class="batch">';

                    for (url_index in batch.urls) {
                        var url = batch.urls[url_index];
                        
                        html_output += '<div id="batch_url_wrapper_' + counter + '" style="display:none;">';
                        html_output += '<div class="info_bar">' + 'Job: ' + job.id + ' Batch: ' + batch.id + ' - ' + url_index + '</div>';
                        html_output += '<div class="batch_images">';

                        for (image in url) {
                            width = screenSize / columns;
                            html_output += '<img src="' + url[image] + '" width=' + width + ' data-x-url="' + batch[url] + '"/>';
                        }

                        html_output += '</div>';
                        html_output += '</div>';
                        
                        counter += 1;
                        total += 1;
                    }

                    html_output += '</div>';
                }

                html_output += '</div>';
            }

            $("div#gallery").append(html_output);
        };
                              

        var batchCount = counter;
        var batchIndex = 0;
        function rotateImages() {
            if (0 == batchIndex) {
                previousIndex = batchCount - 1;
            } else {
                previousIndex = batchIndex - 1;
            }

            $("div#batch_url_wrapper_" + previousIndex).fadeOut()
            $("div#batch_url_wrapper_" + batchIndex).fadeIn()

            batchIndex += 1;
            if (total <= batchIndex) {
                batchIndex = 0;
                location.reload();
            }
        }

        function startShow() {
            rotateImages();
            window.setInterval(rotateImages, secondsPerUrl * 1000);
        };


        api_key = getUrlVars()["api_key"];
        
        $.ajax({
            url: "/users/single/jobs.json?api_key=" + api_key,
            dataType: 'json',
            success: showData,
            error: function () { alert("couldn't get data") }
        });
    }

    buildGallery();
});
