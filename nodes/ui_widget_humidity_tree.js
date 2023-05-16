module.exports = function (RED) {
    function HTML(config) {
        const configAsJson = JSON.stringify(config);
        let displayName = "";
        if (config.title !== "") {
            displayName = "<div class='widgetTitle'>" + config.title + "</div>";
        }
        const html = String.raw`<style>
.widgetTreeContainer {
    background-color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 10px;
}
.tree {
    display: grid;
    grid-template-rows: 40px 50px 50px 2px 50px 15px;
    grid-template-columns: 20px 20px 20px 20px 10px 20px 20px 20px 20px;
}
.treebody {
    background-color: #391D00;
    grid-row: 1 / 4;
    grid-area: 2 / 5 / 7 / 6;
}
.leaf {
    width: 80px;
    height: 50px;
    background-color: ` + config.colorHumidMin + `;
    transition: all ease 1.5s;
}
.leafMiddle {
    width: 60px;
    height: 50px;
    background-color: ` + config.colorHumidMin + `;
    transition: all ease 1.5s;
}
.leafTop {
    width: 40px;
    height: 40px;
    background-color: ` + config.colorHumidMin + `;
    transition: all ease 1.5s;
}
.leafRight {
    border-bottom-right-radius: 50px;
    border-top-left-radius: 50px;
}
.leafLeft {
    border-bottom-left-radius: 50px;
    border-top-right-radius: 50px;
}
.item1 {
    grid-column: 3 / 5;
    grid-row: 1 / 2;
}
.item2 {
    grid-column: 6 / 7;
    grid-row: 1 / 2;
}
.item3 {
    grid-column: 2 / 5;
    grid-row: 2 / 3;
}
.item4 {
    grid-column: 6 / 9;
    grid-row: 2 / 3;
}
.item5 {
    grid-column: 1 / 5;
    grid-row: 3 / 4;
}
.item6 {
    grid-column: 6 / 10;
    grid-row: 3 / 4;
}
.item7 {
    grid-column: 1 / 5;
    grid-row: 5 / 6;
}
.item8 {
    grid-column: 6 / 10;
    grid-row: 5 / 6;
}
.bottomCircle {
    width: 50px;
    height: 50px;
    background-color: #391D00;
    border-radius: 50%;
    color: white;
    margin: auto;
    display: flex;
    align-items: center;
    position: relative;
    margin-top: -8px;
}
.percent-current {
    margin: auto;
    text-align: center;
    transition: all ease 1.5s;
    color: white;
}
.error {
    color: red;
    width: 100%;
    text-align: center;
    display: none;
}
.widgetTitle {
    font-size: 1.2em;
    font-weight:bold;
    text-align: center;
    margin-top: 10px;
    color: black;
}
</style>
<div class="widgetTreeContainer" id="tree_item_{{$id}}">
    <div style="width: 170px;">
        <div class="tree">
            <div class="treebody"></div>
            <div class="leafTop leafLeft item1"></div>
            <div class="leafTop leafRight item2"></div>
            <div class="leafMiddle leafLeft item3"></div>
            <div class="leafMiddle leafRight item4"></div>
            <div class="leaf leafLeft item5"></div>
            <div class="leaf leafRight item6"></div>
            <div class="leaf leafLeft item7"></div>
            <div class="leaf leafRight item8"></div>
        </div>
        <div style="width: 170px;">
            <div class="bottomCircle">
                <div class="percent-current">0%</div>
            </div>
        </div>
    </div>` + displayName + `<div class="error">error</div>
    <input type='hidden' ng-init='init(` + configAsJson + `)'>
</div>`;
        return html;
    }
    /**
     * REQUIRED
     * A ui-node must always contain the following function.
     * This function will verify that the configuration is valid
     * by making sure the node is part of a group. If it is not,
     * it will throw a "no-group" error.
     * You must enter your node name that you are registering here.
     */
    function checkConfig(node, conf) {
        if (!conf || !conf.hasOwnProperty("group")) {
            node.error(RED._("ui_widget_humidity_tree.errors.no-group"));
            return false;
        }
        return true;
    }

    let ui = undefined; // instantiate a ui variable to link to the dashboard

    // Function validate payload value
    function validatePayload(msg) {
        let result = {
            isError: false,
            message: ""
        };
        // validate payload section
        if (typeof msg.payload !== 'undefined') {
            if (typeof msg.payload !== 'number') {
                result.isError = true;
                result.message = RED._("ui_widget_humidity_tree.errors.payloadInvalid");
            } else if (!Number.isInteger(msg.payload)) {
                result.isError = true;
                result.message = RED._("ui_widget_humidity_tree.errors.payloadInvalid");
            }
        } else {
            result.isError = true;
            result.message = RED._("ui_widget_humidity_tree.errors.payloadRequired");
        }
        return result;
    }

    /**
     * REQUIRED
     * A ui-node must always contain the following function.
     * function YourNodeNameHere(config){}
     * This function will set the needed variables with the parameters from the flow editor.
     * It also will contain any Javascript needed for your node to function.
     *
     */
    function UiWidgetHumidityTree(config) {
        let node = this;
        let done = null;
        try {
            if (ui === undefined) {
                ui = RED.require("node-red-dashboard")(RED);
            }
            RED.nodes.createNode(this, config);

            // placing a "debugger;" in the code will cause the code to pause its execution in the web browser
            // this allows the user to inspect the variable values and see how the code is executing
            //debugger;

            if (checkConfig(node, config)) {
                const html = HTML(config);                    // *REQUIRED* get the HTML for this node using the function from above
                done = ui.addWidget({                       // *REQUIRED* add our widget to the ui dashboard using the following configuration
                    node: node,                             // *REQUIRED*
                    order: config.order,                    // *REQUIRED* placeholder for position in page
                    group: config.group,                    // *REQUIRED*
                    width: config.width,                    // *REQUIRED*
                    height: config.height,                  // *REQUIRED*
                    format: html,                           // *REQUIRED*
                    templateScope: "local",                 // *REQUIRED*
                    emitOnlyNewValues: false,               // *REQUIRED*
                    forwardInputMessages: false,            // *REQUIRED*
                    storeFrontEndInputAsState: false,       // *REQUIRED*
                    convertBack: function (value) {
                        return value;
                    },
                    beforeEmit: function (msg) {
                        // Validate payload
                        const result = validatePayload(msg);
                        if (result.isError) {
                            msg.isErr = true;
                            msg.errMessage = result.message;
                        } else {
                            msg.isErr = false;
                        }
                        msg.colorHumidMax = config.colorHumidMax;
                        msg.colorHumidMin = config.colorHumidMin;
                        return {
                            msg: msg
                        };
                    },
                    beforeSend: function (msg, orig) {
                        if (orig) {
                            return orig.msg;
                        }
                    },
                    initController: function ($scope) {
                        let divWidget;
                        $scope.flag = true;     // not sure if this is needed?
                        // Add scope variables for switching tab
                        $scope.inited = false;
                        $scope.percentHumid = 0;
                        $scope.colorHumidMax = "#000000";
                        $scope.colorHumidMin = "#000000";

                        const getGradient = function (ratio, colorHumidMax, colorHumidMin) {
                            const color1 = colorHumidMax.substring(1);
                            const color2 = colorHumidMin.substring(1);
                            const hex = function (x) {
                                x = x.toString(16);
                                return (x.length == 1) ? '0' + x : x;
                            };

                            const r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
                            const g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
                            const b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));
                            return '#' + hex(r) + hex(g) + hex(b);
                        }

                        const setHumid = function (humidWidget, percentHumid, colorHumidMax, colorHumidMin, isErr, errMessage) {
                            // Hide error section
                            const error = $(humidWidget).find(".error");
                            $(error).hide();

                            let setColor = "#000000";

                            // Validate error
                            if (isErr) {
                                // set display error section
                                $(error).show();
                                $(error).text("Error: " + errMessage);
                                // display percent
                                $(humidWidget).find(".percent-current").text("-%");
                            } else {
                                // get gradient color
                                setColor = getGradient(percentHumid / 100, colorHumidMax, colorHumidMin);
                                // display percent
                                $(humidWidget).find(".percent-current").text(percentHumid.toString() + "%");
                            }
                            // set display color
                            $(humidWidget).find(".leafTop").css("background-color", setColor);
                            $(humidWidget).find(".leafMiddle").css("background-color", setColor);
                            $(humidWidget).find(".leaf").css("background-color", setColor);
                        }

                        // init widget
                        $scope.init = function (config) {
                            $scope.config = config;
                            divWidget = '#tree_item_' + $scope.$eval('$id');
                            let stateCheck = setInterval(function () {
                                if (document.querySelector(divWidget) && $scope.percentHumid) {
                                    clearInterval(stateCheck);
                                    $scope.inited = true;
                                    setHumid(divWidget, $scope.percentHumid, $scope.colorHumidMax, $scope.colorHumidMin, false, "");
                                    // setMercury(divWidget, $scope.percentHumid, $scope.percent, $scope.unit, $scope.numberOfDecimals, false, "");
                                    $scope.percentHumid = 0;
                                    $scope.colorHumidMax = "#000000";
                                    $scope.colorHumidMin = "#000000";
                                }
                            }, 40);
                        };
                        $scope.$watch('msg', function (msg) {
                            if (!msg) {
                                // Ignore undefined msg
                                return;
                            }
                            if (msg && msg.hasOwnProperty("payload") && typeof msg.payload === 'number') {
                                if ($scope.inited === false) {
                                    // Gathering payload
                                    $scope.percentHumid = parseInt(msg.payload);
                                    $scope.colorHumidMax = msg.colorHumidMax;
                                    $scope.colorHumidMin = msg.colorHumidMin;
                                    return;
                                }
                                setHumid(divWidget, msg.payload, msg.colorHumidMax, msg.colorHumidMin, msg.isErr, msg.errMessage);
                            }
                        });
                    }
                });
            }
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.warn(e);		// catch any errors that may occur and display them in the web browsers console
        }

        /**
         * REQUIRED
         * I'm not sure what this does, but it is needed.
         */
        node.on("close", function () {
            if (done) {
                done();
            }
        });
    }

    RED.nodes.registerType("ui_widget_humidity_tree", UiWidgetHumidityTree);
};