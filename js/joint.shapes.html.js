define(['joint', 'jquery', 'lodash', 'style!layout/html'], function(joint, $, _){

// Create a custom element.
// ------------------------
    joint.shapes.html = {};
    joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
        defaults: joint.util.deepSupplement({
            type: 'html.Element',
            attrs: {
                rect: {
                    stroke: 'none',
                    'fill-opacity': 0
                }
            }
        }, joint.shapes.basic.Rect.prototype.defaults)
    });

// Create a custom view for that element that displays an HTML div above it.
// -------------------------------------------------------------------------
    joint.shapes.html.ElementView = joint.dia.ElementView.extend({

        template: [
            '<div class="html-element">',
            '<label></label>',
            '<span></span>',
            '<br/>',
            '<select>' +
            '<option>--</option>' +
            '<option>one</option>' +
            '<option>two</option>' +
            '</select>',
            '<input type="text" value="I\'m HTML input" />',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, 'updateBox');
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$htmlBox = $(_.template(this.template)());

            // Prevent paper from handling pointerdown.
            this.$htmlBox.find('input,select').on('mousedown click',
                function(evt) {
                    evt.stopPropagation();
                });

            // This is an example of reacting on the input change and storing the input data in the cell model.
            this.$htmlBox.find('input').on('change',
                _.bind(function(evt) {
                    this.model.set('input', $(evt.target).val());
                }, this));

            var select = this.$htmlBox.find('select');
            select.on('change',
                _.bind(function(evt) {
                    this.model.set('select', $(evt.target).val());
                }, this));

            select.val(this.model.get('select'));

            // Update the box position whenever the underlying model changes.
            this.model.on('change', this.updateBox, this);
            this.updateBox();
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments);
            this.paper.$el.prepend(this.$htmlBox);
            //this.paperOffset = this.paper.$el.offset();
            console.log(this.paper.$el.offset())
            this.updateBox();
            this.paperOffset = null;

            return this;
        },
        fixedPosition: function (paper) {
            this.paperOffset = paper.$el.offset();
            var bbox = this.model.getBBox();
            this.$htmlBox.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x + (this.paperOffset ? this.paperOffset.left : 0),
                top: bbox.y + (this.paperOffset ? this.paperOffset.top : 0),
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
            });
        },
        updateBox: function() {

            // Set the position and dimension of the box so that it covers the JointJS element.
            var bbox = this.model.getBBox();
            // Example of updating the HTML with a data stored in the cell model.
            this.$htmlBox.find('label').text(this.model.get('label'));
            this.$htmlBox.find('span').text(this.model.get('select'));
            console.log(this.paperOffset);
            this.$htmlBox.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x + (this.paperOffset ? this.paperOffset.left : 0),
                top: bbox.y + (this.paperOffset ? this.paperOffset.top : 0),
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
            });

            this.update();
        }
    });

    return joint.shapes.html;
});
