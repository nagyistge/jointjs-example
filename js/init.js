define(['joint', 'joint.shapes.devs', 'const'], function (joint, Shapes, lugConst) {
    function initControls(graph, paper, HtmlShapes) {
        //var c1 = new Shapes.Coupled({
        //    position: {x: 45, y: 5},
        //    size: {width: 100, height: 50},
        //    inPorts: ['in1', 'in2'],
        //    outPorts: ['out1', 'out2'],
        //    attrs: {
        //        text: {text: 'Logic'}
        //    }
        //});
        //
        //var a1 = new Shapes.Atomic({
        //    position: {x: 45, y: 65},
        //    size: {width: 100, height: 50},
        //    inPorts: ['a', 'b'],
        //    outPorts: ['x', 'y'],
        //    attrs: {
        //        text: {text: 'AND/NAND'}
        //    }
        //});

        var can_rx = new Shapes.Atomic({
            position: {x: 45, y: 5},
            size: {width: 100, height: 50},
            outPorts: ['out'],
            attrs: {
                text: {text: 'can_rx'},
                custom_attrs: {
                    can_id:100
                }
            }
        });

        var in2 = new Shapes.Atomic({
            position: {x: 45, y: 65},
            size: {width: 100, height: 50},
            inPorts: ['in'],
            attrs: {
                text: {text: 'block_logger'}
            }
        });

        //var block_divide = new Shapes.Atomic({
        //    position: {x: 45, y: 245},
        //    size: {width: 100, height: 50},
        //    inPorts: ['a', 'b'],
        //    outPorts: ['out'],
        //    attrs: {
        //        text: {text: 'block_divide'},
        //        custom_attrs: {
        //            output_type:'int',
        //            b:1000
        //        }
        //    }
        //});

        var block_divide = new Shapes.Atomic({
            position: {x: 45, y: 125},
            size: {width: 100, height: 50},
            inPorts: ['c', 'd'],
            outPorts: ['out'],
            attrs: {
                text: {text: 'block_divide'},
                custom_attrs: {
                    output_type:'int',
                    d:1000
                }
            }
        });

        var can_tx = new Shapes.Atomic({
            position: {x: 45, y: 185},
            size: {width: 100, height: 50},
            inPorts: ['in'],
            attrs: {
                text: {text: 'can_tx'},
                custom_attrs: {
                    can_id: 101
                }
            }
        });

        var block_pwm_gpio = new Shapes.Atomic({
            position: {x: 75, y: 245},
            size: {width: 130, height: 50},
            inPorts: ['period', 'up_time'],
            attrs: {
                text: {text: 'block_pwm_gpio'},
                custom_attrs: {
                    period: 27,
                    up_time: 15,
                    pin: 191
                }
            }
        });

        var block_http_post = new Shapes.Atomic({
            position: {x: 85, y: 305},
            size: {width: 125, height: 50},
            inPorts: ["led_pwm", "adc_value"],
            attrs: {
                text: {text: 'block_http_post'},
                custom_attrs: {
                    "url": "http://lug.pp.ciklum.com",
                    "period": 500
                }
            }
        });

        var block_adc = new Shapes.Atomic({
            position: {x: 45, y: 365},
            size: {width: 120, height: 50},
            outPorts: ["out"],
            attrs: {
                text: {text: 'block_adc'},
            }
        });

        var html = new HtmlShapes.Element({
            position: {x: 15, y: 425},
            size: {width: 170, height: 100},
            label: 'I am HTML',
            select: 'one'
        });

        graph.addCells([can_rx, in2, block_divide, can_tx, block_pwm_gpio, html, block_http_post, block_adc]);
    }

    function loadUrlParams() {
        var hash = location.hash;
        var items = hash.split('&');
        if (!items || items.length === 0) return;

        var values = {};
        items.forEach(function (item) {
            var kv = item.split('=');
            values[kv[0].replace('#', '')] = kv[1];
        });

        window.lug_ide = window.lug_ide || {};
        window.lug_ide.mode = values[lugConst.MODE];
        window.lug_ide.data = values[lugConst.DATA];

        console.log(window.lug_ide);

        if (window.lug_ide.mode === lugConst.MODE_DEVELOPMENT) {
            $('#get_url').val(lugConst.URL_GET_DEV);
            $('#post_url').val(lugConst.URL_POST_DEV);
        }
        else {
            $('#get_url').val(lugConst.URL_GET_DEMO);
            $('#post_url').val(lugConst.URL_POST_DEMO);
        }

        redrawLayout();
    }

    function redrawLayout() {
        var demo = ['btn_deploy', 'btn_load'];
        var dev = ['btn_to_json', 'btn_from_json',
            'btn_from_json_server', 'btn_to_json_server_send',
            'btn_to_json_server', 'btn_save_to_json_file', 'btn_clear_log'];

        demo.forEach(function (item) {
            if (window.lug_ide.mode === lugConst.MODE_DEVELOPMENT)
                $('#' + item).hide();
            else
                $('#' + item).show();
        })
        dev.forEach(function (item) {
            if (window.lug_ide.mode === lugConst.MODE_DEVELOPMENT)
                $('#' + item).show();
            else
                $('#' + item).hide();
        })
    }

    function initFields() {
        var $server_key = $(lugConst.$APP_METADATA_KEY);
        var $ide_key = $(lugConst.$IDE_METADATA_KEY);

        $ide_key.on('change keyup paste', function () {
            $server_key.val($(this).val().replace('ide_', ''));
        });

        $ide_key.val(lugConst.IDE_METADATA_KEY);
        $server_key.val(lugConst.APP_METADATA_KEY);

        loadUrlParams();
        $(window).on('hashchange', loadUrlParams);
    }

    return {
        initControls: initControls,
        initFields: initFields
    };
});
