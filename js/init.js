define(['joint', 'joint.shapes.devs'], function (joint, Shapes) {
    function initControls(graph, paper, HtmlShapes) {
        var c1 = new Shapes.Coupled({
            position: {x: 45, y: 5},
            size: {width: 100, height: 50},
            inPorts: ['in1', 'in2'],
            outPorts: ['out1', 'out2'],
            attrs: {
                text: {text: 'Logic'}
            }
        });

        var a1 = new Shapes.Atomic({
            position: {x: 45, y: 65},
            size: {width: 100, height: 50},
            inPorts: ['a', 'b'],
            outPorts: ['x', 'y'],
            attrs: {
                text: {text: 'AND/NAND'}
            }
        });

        var can_rx = new Shapes.Atomic({
            position: {x: 45, y: 125},
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
            position: {x: 45, y: 185},
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
            position: {x: 45, y: 245},
            size: {width: 100, height: 50},
            inPorts: ['c', 'd'],
            outPorts: ['out'],
            attrs: {
                text: {text: 'block_divide'},
                custom_attrs: {
                    output_type:'int',
                    b:1000
                }
            }
        });

        var can_tx = new Shapes.Atomic({
            position: {x: 45, y: 305},
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
            position: {x: 75, y: 365},
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

        var h1 = new HtmlShapes.Element({
            position: {x: 15, y: 425},
            size: {width: 170, height: 100},
            label: 'I am HTML',
            select: 'one'
        });

        graph.addCells([c1, a1, can_rx, in2, block_divide, can_tx, block_pwm_gpio, h1]);
    }

    function initFields() {
        $('#client_metadata_name').val('ide_client');
        $('#server_metadata_name').val('ide_server');
        $('#get_url').val('http://localhost:8888/getMetaData?key=ide_client');
        $('#post_url').val('http://localhost:8888/setMetaData');
    }

    return {
        initControls: initControls,
        initFields: initFields
    };
});
