function handleAjax(url, param, callback, isErrShow, getmMode){
    var mode = getmMode || 'GET';
    return $.ajax({
        url: url,
        type: mode,
        dataType: 'JSON',
        data: JSON.stringify(param),
        contentType: 'application/json; charset=utf-8', // 默认值
        success: function(res) {
            callback(res);
        },
        error: function(req, textStatus, errorThrown) {
            console.log('textStatus, errorThrown',textStatus, errorThrown);
        }
    });
}