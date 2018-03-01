function get_filemd5sum2(ofile, callback) {
           	var str = {
           		a: 0
           	}
            var file = ofile;
            var tmp_md5;

            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                // file = this.files[0],
                chunkSize = 8097152, // Read in chunks of 2MB
                chunks = Math.ceil(file.size / chunkSize),
                currentChunk = 0,
                spark = new SparkMD5.ArrayBuffer(),
                fileReader = new FileReader();
                 // console.log('sss',chunks);
            fileReader.onload = function(e) {
                
                spark.append(e.target.result); // Append array buffer

                // console.log(file.name + "  正在处理，请稍等," + "已完成" + md5_progress + "%");
                // var handler_info = document.getElementById("handler_info");
                // var progressbar = document.getElementsByClassName("progressbar")[0];
                // handler_info.innerHTML=file.name + "  正在处理，请稍等," + "已完成" + md5_progress + "%"
                // progressbar.value =md5_progress;
               	tmp_md5 = spark.end();
               	str.a = tmp_md5
               	callback(tmp_md5)
            };

            fileReader.onerror = function() {

            };

            function loadNext() {
                var start = currentChunk * chunkSize,
                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                // fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                fileReader.readAsArrayBuffer(blobSlice.call(file.getNative(), start, end));
            }
            loadNext();
           
        }
