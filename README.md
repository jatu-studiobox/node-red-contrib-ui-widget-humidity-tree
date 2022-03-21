# node-red-contrib-ui-widget-humidity-tree
Node-RED UI Widget Humidity-Tree node for Node-RED Dashboard

## Installation
```
npm install @studiobox/node-red-contrib-ui-widget-humidity-tree
```

## Help

### Node Settings



### Widget Display



#### Description

1. Title - Humidity-Tree widget title
2. Humidity Color at 100% - The color displayed when the humidity value is 100%
3. Humidity Color at 0% - The color displayed when the humidity value is 0%

### Input API
Using *msg* object.

| Property     | Mandatory   | Type    | Description |
| ------------ |:-----------:|:-------:| ----------- |
| payload      | Yes         | Integer | Value for display on Humidity-Tree widget |

*Remark*

*The color displayed depends on the percentage of humidity between 0% and 100%. Therefore, if the current value is close to the previous value, the color will not seem to change much. Moreover, the duration of the color change is 1.5 seconds.*

## Examples
After install, see usage examples at Node-RED Import menu. Examples at '@studiobox/node-red-contrib-ui-widget-humidity-tree'.