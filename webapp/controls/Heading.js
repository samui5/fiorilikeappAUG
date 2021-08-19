sap.ui.define([
    'sap/ui/core/Control'
], function(Control) {
    'use strict';
    return Control.extend("tcs.hr.hire.controls.Heading",{
        metadata: {
            properties: {
                "spiderman": "",
                "color": "",
                "bgcolor": "",
                "border": ""
            },
            methods: {},
            events: {},
            aggregation: {}
        },
        init: function(){
            this.setColor("red");
        },
        renderer: function(oRm, oControl){
            oRm.write("<h1");
            oRm.addStyle("color",oControl.getColor());
            oRm.addStyle("background-color",oControl.getBgcolor());
            oRm.addStyle("border",oControl.getBorder());
            oRm.writeStyles();
            oRm.write(">" + oControl.getSpiderman() + "</h1>");
        }
    });
});