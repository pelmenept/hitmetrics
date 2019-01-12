let data = [
    {month: "Jan", value: 12},
    {month: "Feb", value: 22},
    {month: "Mar", value: 35},
    {month: "Apr", value: 22},
    {month: "May", value: 33},
    {month: "Jun", value: 48},
    {month: "Jul", value: 66},
    {month: "Aug", value: 50},
    {month: "Sep", value: 55},
    {month: "Oct", value: 65},
    {month: "Nov", value: 75},
    {month: "Dec", value: 80}
];

let margin = {top: 30, right: 30, bottom: 50, left: 30};
let w = 760 - margin.left - margin.right;
let h = 400 - margin.top - margin.bottom;
let barPadding = 3;
let fill = "#7fb800";
let xScaleHeight = 20;

var xScale = d3.scaleOrdinal()
    .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
    .range([3, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660]);


var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([h, 0]);

var svg = d3.select('#graph')
    .append('svg')
    .attr('viewBox', '0 0 ' + w + ' ' + h)
    .attr('shape-rendering', 'geometricPrecision');

var xAxis = d3.axisBottom()
    .scale(xScale)
    // .tickFormat(d3.timeFormat('%Y-%m-%d'))
    .tickSizeInner(0)
    .tickSizeOuter(0);

svg.append('g')
    .attr('transform', 'translate(0,'+ (h - xScaleHeight) + ')')
    .attr('class', 'x axis')
    .call(xAxis)
    .selectAll('text')
    .attr('font-size', '12px')
    .attr('fill', '#7a7a7a')
    .attr('x', 10)
    .attr('y', 3)
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + '0'+ ', 0)');

var line = d3.line()
    .x(function(d) {
        return xScale(d.month);
    })
    .y(0)
    .y(function(d) {
        return yScale(d.value?d.value:0);
    })
    .curve(d3.curveCardinal);

var pat = svg.append('svg:path')
    .attr('class','line')
    .attr('d', line(data));

var totalLength = pat.node().getTotalLength();

pat
    .attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(2000)
    .attr('stroke-dashoffset', 0);

var circles = svg.append('g')
    .selectAll('circle')
    .data(data, function(d) {return(Math.random())})
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', function(d, i){
        return xScale(d.month);
    })
    .attr('cy', function(d, i){
        return yScale(d.value?d.value:0);
    })
    .attr('opacity', 0.0)
    .attr('r', 3)
    .transition()
    .attr('opacity', 1)
    .delay(function(d,i) {
        return 720/data.length*(i);
    })
    .duration(function(d, i) {
        return (600/data.length) * i;
    });

// Here will be timed interactions

var lineFunction = d3.line()
    .x(function(d) {return d.x;})
    .y(function(d) {return d.y; });

function draw_one(item, text, direction) {
    let data_one, text_position, anchor;

    switch(direction) {
    case "top":
        data_one = [
            {x: xScale(data[item]['month']), y: yScale(data[item]['value']) - 50},
            {x: xScale(data[item]['month']), y: yScale(data[item]['value']) - 5}
        ];
        text_position = {x: xScale(data[item]['month']) + 3, y: yScale(data[item]['value']) - 55};
        anchor = "end";
        break;
    case "bottom":
        data_one = [
            {x: xScale(data[item]['month']), y: yScale(data[item]['value']) + 50},
            {x: xScale(data[item]['month']), y: yScale(data[item]['value']) + 5}
        ];
        text_position = {x: xScale(data[item]['month']) + 3, y: yScale(data[item]['value']) + 58};
        anchor = "end";
        break;
    case "right":
        data_one = [
            {x: xScale(data[item]['month']) + 5, y: yScale(data[item]['value'])},
            {x: xScale(data[item]['month']) + 50, y: yScale(data[item]['value'])}
        ];
        text_position = {x: xScale(data[item]['month']) + 55, y: yScale(data[item]['value']) + 3};
        anchor = "beginning";
        break;
    case "left":
        data_one = [
            {x: xScale(data[item]['month']) - 5, y: yScale(data[item]['value'])},
            {x: xScale(data[item]['month']) - 50, y: yScale(data[item]['value'])}
        ];
        text_position = {x: xScale(data[item]['month']) - 55, y: yScale(data[item]['value']) + 2};
        anchor = "end";
        break;
    }

    var one_l = svg.append('path')
        .attr('d', lineFunction(data_one));

    let one_length = one_l.node().getTotalLength();

    one_l
        .attr('stroke', '#909090')
        .attr('stroke-width', 0.5)
        .attr('fill', 'none')
        .attr('stroke-dasharray', one_length + ' ' + one_length)
        .attr('stroke-dashoffset', one_length)
        .transition()
        .duration(500)
        .attr('stroke-dashoffset', 0)
        .attr('stroke-dasharray', '5, 5');

    var one_text = svg.append('text')
        .attr('fill', '#000')
        .attr('x', text_position.x)
        .attr('y', text_position.y)
        .attr('font-size', '12px')
        .attr('fill', '#fff')
        .attr('text-anchor',anchor)
        .attr('transform', 'translate(' + '0'+ ', 0)')
        .text(text)
        .transition()
        .duration(500)
        .attr('fill', '#7a7a7a');

    return one_l;
}

let lines_to_draw = [
    {item: 2, text: "Seasonality Effect", position: "top"},
    {item: 6, text: "Checkout Cart bug", position: "top"},
    {item: 7, text: "Site Redesign", position: "bottom"},
    {item: 3, text: "New Sale Launch", position: "top"}
];

let c = 0;

let myInterval = setInterval(function() {
    if (c == lines_to_draw.length) {
        clearInterval(myInterval);
    } else {
        draw_one(lines_to_draw[c].item, lines_to_draw[c].text, lines_to_draw[c].position);
        c += 1;
    }
}, 3000);
