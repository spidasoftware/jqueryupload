/*
 * jQuery.upload v1.0.2
 *
 * Copyright (c) 2010 lagos
 * Dual licensed under the MIT and GPL licenses.
 *
 * http://lagoscript.org
 */
 // THIS HAS BEEN MODIFIED BY SPIDA, we set X-Frame-Options: DENY for every response so using iframes wasn't working.
 // https://github.com/spidasoftware/jqueryupload
(function($) {

        var uuid = 0;

        $.fn.upload = function(url, data, callback, type) {
                if ($.isFunction(data)) {
                        type = callback;
                        callback = data;
                        data = {};
                }

                var formData = new FormData();
                $.each($(this).find('input'), function(index, input) {
                        var inputJq = $(input);
                        var type = inputJq.attr('type');
                        var name = inputJq.attr('name');
                        if (name) {
                                if(type === 'file' && inputJq[0].files.length > 0) {
                                        formData.append(name,  inputJq[0].files[0]);
                                } else if(type === 'checkbox' || type === 'radio') {
                                        if(inputJq.is(':checked')) {
                                                formData.append(name, 'on');
                                        }
                                } else {
                                        formData.append(name, inputJq.val() ? inputJq.val().toString() : "");
                                }
                        }
                });

                $.each(param(data), function(param) {
                        formData.append(param.name, param.value);
                });

                $.ajax({
                        url: url,
                        data: formData,
                        type: 'POST',
                        contentType: false,
                        processData: false,
                        success: function(data) {
                                var parsedData = handleData(data, type);
                                if (type === 'script') {
                                        $.globalEval(parsedData);
                                }
                                if (callback) {
                                        callback.call(self, parsedData);
                                }
                        }
                });
               
                return this;
        };

        function param(data) {
                if ($.isArray(data)) {
                        return data;
                }
                var params = [];

                function add(name, value) {
                        params.push({name:name, value:value});
                }

                if (typeof data === 'object') {
                        $.each(data, function(name) {
                                if ($.isArray(this)) {
                                        $.each(this, function() {
                                                add(name, this);
                                        });
                                } else {
                                        add(name, $.isFunction(this) ? this() : this);
                                }
                        });
                } else if (typeof data === 'string') {
                        $.each(data.split('&'), function() {
                                var param = $.map(this.split('='), function(v) {
                                        return decodeURIComponent(v.replace(/\+/g, ' '));
                                });

                                add(param[0], param[1]);
                        });
                }

                return params;
        }

        function handleData(data, type) {
                if ($.isXMLDoc(data) || data.XMLDocument) {
                        return data.XMLDocument || data;
                }

                switch (type) {
                        case 'xml':
                                data = parseXml(data);
                                break;
                        case 'json':
                                data = window.eval('(' + data + ')');
                                break;
                }
                return data;
        }

        function parseXml(text) {
                if (window.DOMParser) {
                        return new DOMParser().parseFromString(text, 'application/xml');
                } else {
                        var xml = new ActiveXObject('Microsoft.XMLDOM');
                        xml.async = false;
                        xml.loadXML(text);
                        return xml;
                }
        }

})(jQuery);