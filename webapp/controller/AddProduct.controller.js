sap.ui.define([
    'tcs/hr/hire/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment'
], function(BaseController, JSONModel, MessageBox, MessageToast, Fragment) {
    'use strict';
    return BaseController.extend("tcs.hr.hire.controller.AddProduct",{
        onInit: function () {
            this.localModel = new JSONModel();
            this.localModel.setData({
                "productData": {
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "Notebooks",
                    "NAME" : "Notebook Basic 15",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000046",
                    "SUPPLIER_NAME" : "SAP",
                    "TAX_TARIF_CODE" : 1,
                    "PRICE" : "",
                    "CURRENCY_CODE" : "USD",
                    "DIM_UNIT" : "CM",
                    "PRODUCT_PIC_URL" : "/sap/public/bc/NWDEMO_MODEL/IMAGES/AG-1010.jpg"
                }
            });
            this.getView().setModel(this.localModel, "localModel");

        },
        mode: "Create",
        onSubmit: function(oEvent){
            var sValue = oEvent.getSource().getValue();
             //get the odata model object
             var oDataModel = this.getView().getModel();
             var that = this;
             //call single GET call
             oDataModel.read("/ProductSet('" + sValue + "')",{
                success: function(record){
                    that.localModel.setProperty("/productData", record);
                    that.mode = "Update";
                    that.getView().byId("idSave").setText("Update");
                    that.getView().byId("idDelete").setEnabled(true);
                }
             });
        },
        onExpensive: function(){
            //get the odata model object
            var oDataModel = this.getView().getModel();
            var that = this;
            //call our function import to pass url parameter
            oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters: {
                    "I_CATEGORY": 'Notebooks'
                },
                success: function(record){
                    //once success callback comes set data on local model
                    that.localModel.setProperty("/productData", record);
                }
            });
            
        },
        supplierPopup: null,
        onConfirm: function(oEvent){
            //Step 1: get the selected item based on confirm event
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if(oEvent.getSource().getId().indexOf("supplier") !== -1){
                var supplierName = oSelectedItem.getTitle();
                this.getView().getModel("localModel")
                    .setProperty("/productData/SUPPLIER_ID",supplierName);
                this.getView().getModel("localModel")
                    .setProperty("/productData/SUPPLIER_NAME",oSelectedItem.getDescription());
                this.getView().byId("suppName").setText(oSelectedItem.getDescription())
            }
            
        },
        onValueHelp: function() {
            if(!this.supplierPopup){
                Fragment.load({
                    id: "supplier",
                    name: "tcs.hr.hire.fragments.popup",
                    controller: this
                }).then(function(oSuperman){
                    this.supplierPopup = oSuperman;
                    this.supplierPopup.setTitle("Select Supplier to Filter");
                    this.supplierPopup.setMultiSelect(false);
                    this.supplierPopup.bindAggregation("items",{
                        path : "/BusinessPartnerSet",
                        template: new sap.m.StandardListItem({
                            icon: "sap-icon://supplier",
                            description : "{COMPANY_NAME}",
                            title : "{BP_ID}"
                        })
                    });
                    this.getView().addDependent(this.supplierPopup);
                    this.supplierPopup.open();
                }.bind(this));
            }else{
                this.supplierPopup.open();
            }
        },
        onDelete: function(){
            //get local data which product requires deletion by user
            var productId = this.localModel.getProperty("/productData/PRODUCT_ID");
            var that = this;
            //get oData model object
            var oDataModel = this.getView().getModel();
            //Fire Delete
            oDataModel.remove("/ProductSet('" + productId + "')",{
                success: function (params) {
                    //handle callback
                    MessageBox.show("The product has been removed successfully");
                    that.onClear();
                }
            });
            
        },
        onClear: function (params) {
            this.mode = "Create";
            this.getView().byId("idSave").setText("Create");
            this.getView().byId("idDelete").setEnabled(false);
            this.getView().getModel("localModel").setProperty("/",
            {
                "productData": {
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "Notebooks",
                    "NAME" : "Notebook Basic 15",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000046",
                    "SUPPLIER_NAME" : "SAP",
                    "TAX_TARIF_CODE" : 1,
                    "PRICE" : "",
                    "CURRENCY_CODE" : "",
                    "DIM_UNIT" : "CM",
                    "PRODUCT_PIC_URL" : "/sap/public/bc/NWDEMO_MODEL/IMAGES/AG-1010.jpg"
                }
            });
        },
        onSave: function(){
            //Step 1: Read data from model <-- screen
            var payload = this.localModel.getProperty("/productData");
            //Step 2: Get the odata model object - default model
            var oDataModel = this.getView().getModel();
            //Step 3: Fire Post Call
            //payload.PRICE = parseInt(payload.PRICE);
            //payload.CURRENCY_CODE = this.getView().byId("country").getSelectedKey("")
            if(this.mode === "Create"){
                oDataModel.create("/ProductSet", payload, {
                    //Step 4: Handle callback
                    success: function(data){
                        MessageToast.show("The Product was Created Successfully, Amigo!");
                    },
                    error: function(oErr){
                        MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                    }
                });
            }else{
                oDataModel.update("/ProductSet('" + payload.PRODUCT_ID + "')", payload,{
                    success: function(){
                        MessageToast.show("The Product was Updated Successfully, Amigo!");
                    }
                });
            }
            
        }
    });
});