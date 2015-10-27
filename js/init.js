define(['joint', 'joint.shapes.devs'], function (joint, Shapes) {
    function initMainControls(graph) {
        var c1 = new joint.shapes.devs.Coupled({
            position: {x: 260, y: 50},
            size: {width: 300, height: 300},
            inPorts: ['in1', 'in2'],
            outPorts: ['out1', 'out2'],
            attrs: {
                text: {text: 'Logic'}
            }
        });

        var a1 = new joint.shapes.devs.Atomic({
            position: {x: 360, y: 160},
            size: {width: 150, height: 100},
            inPorts: ['a', 'b'],
            outPorts: ['x', 'y'],
            attrs: {
                text: {text: 'AND/NAND'}
            }
        });

        var in1 = new joint.shapes.devs.Atomic({
            position: {x: 10, y: 70},
            size: {width: 150, height: 100},
            outPorts: ['out'],
            attrs: {
                text: {text: 'Joystic'}
            }
        });

        var in2 = new joint.shapes.devs.Atomic({
            position: {x: 10, y: 200},
            size: {width: 150, height: 100},
            outPorts: ['out'],
            attrs: {
                text: {text: 'Stop Button'}
            }
        });

        var out1 = new joint.shapes.devs.Atomic({
            position: {x: 650, y: 50},
            size: {width: 140, height: 200},
            inPorts: ['a', 'b'],
            attrs: {
                text: {text: 'Actuator'}
            }
        });

        var out2 = new joint.shapes.devs.Atomic({
            position: {x: 650, y: 300},
            size: {width: 140, height: 50},
            inPorts: ['in'],
            attrs: {
                text: {text: 'Led'}
            }
        });

        graph.addCells([c1, a1, in1, in2, out1, out2]);

        c1.embed(a1);

        var connect = function (source, sourcePort, target, targetPort) {

            //console.log('port selector >', source.getPortSelector(sourcePort));

            var link = new joint.shapes.devs.Link({
                source: {
                    id: source.id,
                    selector: source.getPortSelector(sourcePort)
                },
                target: {
                    id: target.id,
                    selector: target.getPortSelector(targetPort)
                }
            });
            link.addTo(graph).reparent();
        };

        connect(in1, 'out', c1, 'in1');
        connect(in2, 'out', c1, 'in2');
        connect(c1, 'in1', a1, 'a');
        connect(c1, 'in2', a1, 'b');
        connect(a1, 'x', c1, 'out1');
        connect(a1, 'y', c1, 'out2');
        connect(c1, 'out1', out1, 'a');
        connect(c1, 'out2', out1, 'b');
        connect(c1, 'out2', out2, 'in');
    };

    function initControls_vertical(graph, paper, HtmlShapes) {
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

        var block_divide = new Shapes.Atomic({
            position: {x: 45, y: 245},
            size: {width: 100, height: 50},
            inPorts: ['a', 'b'],
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
                text: {text: 'can_tx'}
            }
        });

        var block_pwm_gpio = new Shapes.Atomic({
            position: {x: 45, y: 365},
            size: {width: 130, height: 50},
            inPorts: ['a', 'b'],
            attrs: {
                text: {text: 'block_pwm_gpio'}
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

    function initControls(graph, paper, HtmlShapes) {
        var c1 = new Shapes.Coupled({
            position: {x: 55, y: 5},
            size: {width: 100, height: 50},
            inPorts: ['in1', 'in2'],
            outPorts: ['out1', 'out2'],
            attrs: {
                text: {text: 'Logic'}
            }
        });

        var c11 = new Shapes.Coupled({
            position: {x: 55, y: 125},
            size: {width: 100, height: 50},
            inPorts: ['in1', 'in2'],
            outPorts: ['out1'],
            attrs: {
                text: {text: 'Logic'},
            }
        });

        var a1 = new Shapes.Atomic({
            position: {x: 55, y: 65},
            size: {width: 100, height: 50},
            inPorts: ['a', 'b'],
            outPorts: ['x', 'y'],
            attrs: {
                text: {text: 'AND/NAND'}
            }
        });

        var in1 = new Shapes.Atomic({
            position: {x: 215, y: 5},
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
            position: {x: 215, y: 65},
            size: {width: 100, height: 50},
            outPorts: ['out'],
            attrs: {
                text: {text: 'Stop Button'}
            }
        });

        var out1 = new Shapes.Atomic({
            position: {x: 390, y: 5},
            size: {width: 100, height: 50},
            inPorts: ['a', 'b'],
            attrs: {
                text: {text: 'Actuator'}
            }
        });

        var out2 = new Shapes.Atomic({
            position: {x: 390, y: 65},
            size: {width: 100, height: 50},
            inPorts: ['in'],
            attrs: {
                text: {text: 'Led'}
            }
        });

        var h1 = new HtmlShapes.Element({
            position: {x: 520, y: 5},
            size: {width: 170, height: 100},
            label: 'I am HTML',
            select: 'one'
        });

        graph.addCells([c1, c11, a1, in1, in2, out1, out2, h1]);
    }



    return {
        initMainControls: initMainControls,
        initControls: initControls_vertical  //initControls(graphControls);
    };
});
